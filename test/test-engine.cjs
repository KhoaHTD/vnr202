// Kiểm tra luật chơi (src/js/engine.js) và dữ liệu (src/js/content.js). Không cần trình duyệt. Chạy: node test/test-engine.cjs
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const deq=(a,b,m)=>assert.equal(JSON.stringify(a),JSON.stringify(b),m); // mảng từ vm khác realm
const ROOT=path.join(__dirname,'..');
const ctx={window:{},console};vm.createContext(ctx);
for(const f of ['content','engine'])vm.runInContext(fs.readFileSync(`${ROOT}/src/js/${f}.js`,'utf8'),ctx);
const D=ctx.window.GAME_DATA,E=ctx.window.GameEngine;

// 1) Dữ liệu: 9 chặng, mỗi chặng 2 ô + 4 thẻ (2 đúng, 2 nhiễu), mọi thẻ có năm, mọi thẻ nhiễu có gợi ý riêng
assert.equal(D.scenes.length,9);
D.scenes.forEach((s,i)=>{
  const tag=`chặng ${i+1}`;
  assert.equal(s.slots.length,2,tag);assert.equal(s.cards.length,4,tag);
  const good=s.cards.filter(c=>c.slot),bad=s.cards.filter(c=>!c.slot);
  assert.equal(good.length,2,tag);assert.equal(bad.length,2,tag);
  deq(s.slots.map(x=>x.correct).sort(),good.map(c=>c.id).sort(),tag);
  s.slots.forEach(x=>{assert.equal(s.cards.find(c=>c.id===x.correct).slot,x.id,tag);['situation','hint2','why','swap','caption'].forEach(k=>assert.ok(x[k],`${tag} ${x.id}.${k}`));});
  s.cards.forEach(c=>{assert.ok(c.year&&c.name&&Number.isFinite(c.t),`${tag} ${c.id}`);});
  bad.forEach(c=>assert.ok(c.hint1&&c.hint1.length>30,`${tag} ${c.id} thiếu gợi ý riêng`));
  assert.equal(new Set(bad.map(c=>c.hint1)).size,2,`${tag}: hai thẻ nhiễu phải có hai gợi ý khác nhau`);
});
assert.equal(E.MAX(D),180);
// Dây thời gian: thẻ xếp theo năm tăng dần; mọi chặng có motif minh họa
{const r=E.newRun('solo');D.scenes.forEach((s,i)=>{r.index=i;const t=E.orderOf(r).map(id=>s.cards.find(c=>c.id===id).t);assert.equal(JSON.stringify(t),JSON.stringify([...t].sort((a,b)=>a-b)),`chặng ${i+1}: thẻ phải xếp theo thời gian`);assert.ok(s.motif,`chặng ${i+1} thiếu motif`);});}

const correctFor=(run,id)=>E.slotOf(E.sceneOf(run),id).correct;
const wrongCards=run=>E.sceneOf(run).cards.filter(c=>!c.slot).map(c=>c.id);
const fill=(run,a,b)=>{E.place(run,'A',a);E.place(run,'B',b);};
const right=run=>{fill(run,correctFor(run,'A'),correctFor(run,'B'));return E.evaluate(run);};

// 2) Đúng ngay lần đầu: 10 + 10, khóa cả hai ô, thẻ vào album
let run=E.newRun('solo');
assert.equal(E.canDeploy(run),false);
let r=right(run);
deq(r.map(x=>x.pts),[10,10]);assert.equal(E.stageDone(run),true);
assert.equal(E.score(run),20);assert.equal(run.album.length,2);
assert.equal(E.place(run,'A','c3'),false,'ô đã khóa không đặt lại được');
deq(E.tray(run).sort(),wrongCards(run).sort(),'rổ chỉ còn thẻ nhiễu');
assert.ok(E.advance(run));assert.equal(run.index,1);

// 3) Sai 1 ô ở lần đầu: ô đúng khóa, thẻ nhiễu về rổ, gợi ý nấc 1 riêng cho thẻ vừa chọn; đúng ở lần 2 → 5 điểm
const [d1,d2]=wrongCards(run);
fill(run,correctFor(run,'A'),d1);
r=E.evaluate(run);
assert.equal(r[0].correct,true);assert.equal(r[0].pts,10);assert.equal(r[1].correct,false);
assert.equal(E.stageOf(run).B.cardId,null,'thẻ nhiễu về rổ');assert.ok(E.tray(run).includes(d1));
let h=E.hint(run,'B');assert.equal(h.tier,1);assert.equal(h.text,E.cardOf(E.sceneOf(run),d1).hint1);
E.place(run,'B',correctFor(run,'B'));r=E.evaluate(run);
assert.equal(r.length,1,'chỉ chấm ô chưa khóa');assert.equal(r[0].pts,5);assert.equal(r[0].how,'retry');

// 4) Hai thẻ nhiễu khác nhau cho hai gợi ý khác nhau
run=E.newRun('solo');
fill(run,d1,d2);E.evaluate(run);
assert.notEqual(E.hint(run,'A').text,E.hint(run,'B').text);

// 5) Nấc 2: làm mờ 1 thẻ nhiễu (không đặt được) + gợi ý nội dung; đúng sau đó 0 điểm. Nấc 3: hiện đáp án, 0 điểm
run=E.newRun('solo');
const [x1,x2]=wrongCards(run);
fill(run,x1,x2);E.evaluate(run);E.hint(run,'A');E.hint(run,'B');
fill(run,x1,x2);E.evaluate(run);
h=E.hint(run,'A');assert.equal(h.tier,2);assert.equal(h.text,E.slotOf(E.sceneOf(run),'A').hint2);
assert.ok(h.faded);assert.equal(E.isFaded(run,h.faded),true);assert.equal(E.place(run,'A',h.faded),false,'thẻ đã bị làm mờ không đặt được');
E.place(run,'A',correctFor(run,'A'));E.place(run,'B',x2);
const rr=E.evaluate(run);assert.equal(rr.find(x=>x.slot==='A').pts,0);assert.equal(rr.find(x=>x.slot==='A').how,'faded');
h=E.hint(run,'B');h=E.hint(run,'B');assert.equal(h.tier,3);assert.equal(h.text,E.slotOf(E.sceneOf(run),'B').why);
assert.equal(E.stageOf(run).B.how,'revealed');assert.equal(E.stageOf(run).B.pts,0);assert.equal(E.stageDone(run),true);
assert.equal(E.stagePoints(run,0),0);

// 6) Bỏ qua: 0 điểm, ghi vào danh sách ôn; đặt thẻ đúng nhầm ô dùng gợi ý "swap"
run=E.newRun('solo');
const cA=correctFor(run,'A'),cB=correctFor(run,'B');
fill(run,cB,cA);E.evaluate(run);
assert.equal(E.hint(run,'A').text,E.slotOf(E.sceneOf(run),'A').swap);
E.skip(run,'A');E.skip(run,'B');
assert.equal(E.stageDone(run),true);assert.equal(E.score(run),0);
assert.equal(E.review(run).length,2);assert.ok(E.review(run).every(x=>x.how==='skipped'));
assert.equal(E.timeline(run).length,2);

// 7) Điểm tối đa: chơi đúng cả 9 chặng ngay lần đầu = 180; không còn mục cần ôn; album xếp theo thời gian
run=E.newRun('solo');
for(let i=0;i<9;i++){right(run);E.advance(run);}
assert.equal(run.finished,true);assert.equal(E.score(run),180);
assert.equal(E.review(run).length,0);
const tl=E.timeline(run).map(a=>a.card.t);deq(tl,[...tl].sort((a,b)=>a-b));assert.equal(tl.length,18);

// 8) Lớp học: sai không tự tăng nấc (MC quyết định); hint() của MC vẫn tính 5 điểm cho đội giành quyền
run=E.newRun('class');
fill(run,x1,correctFor(run,'B'));r=E.evaluate(run);
assert.equal(E.stageOf(run).A.tier,0,'lớp học: chưa có gợi ý nếu MC chưa bấm');
E.place(run,'A',correctFor(run,'A'));assert.equal(E.evaluate(run)[0].pts,10);
run=E.newRun('class');fill(run,x1,x2);E.evaluate(run);E.hint(run,'A');E.place(run,'A',correctFor(run,'A'));E.place(run,'B',correctFor(run,'B'));
assert.equal(E.evaluate(run).find(x=>x.slot==='A').pts,5);

console.log('PASS: dữ liệu 9×(2 ô+4 thẻ) · điểm 10/5/0 · tối đa 180 · khóa ô · thẻ nhiễu về rổ · gợi ý 3 nấc riêng từng thẻ · làm mờ · xem đáp án · bỏ qua · album · lớp học.');
