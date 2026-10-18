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
{const r=E.newRun('solo');D.scenes.forEach((s,i)=>{r.index=i;const t=E.orderOf(r).map(id=>s.cards.find(c=>c.id===id).t);const srt=JSON.stringify([...t].sort((a,b)=>a-b));if(s.kind==='order')assert.notEqual(JSON.stringify(t),srt,`chặng ${i+1}: kiểu xếp thứ tự phải xáo thẻ`);else assert.equal(JSON.stringify(t),srt,`chặng ${i+1}: thẻ phải xếp theo thời gian`);assert.ok(s.motif,`chặng ${i+1} thiếu motif`);});}

const correctFor=(run,id)=>E.slotOf(E.sceneOf(run),id).correct;
const wrongCards=run=>E.sceneOf(run).cards.filter(c=>!c.slot).map(c=>c.id);
const at=(run,i)=>{E.fastForward(run,D,i);return run;};

// 2) Kiểu ghép, đúng ngay lần đầu: 10 + 10, khóa ô, thẻ vào album
let run=E.newRun('solo');
assert.equal(E.sceneOf(run).kind,'match');
let r=E.drop(run,'A',correctFor(run,'A'));
assert.equal(r.correct,true);assert.equal(r.pts,10);assert.equal(r.how,'first');
assert.equal(E.stageDone(run),false);
r=E.drop(run,'B',correctFor(run,'B'));assert.equal(r.pts,10);
assert.equal(E.stageDone(run),true);assert.equal(E.score(run),20);assert.equal(run.album.length,2);
assert.equal(E.drop(run,'A','c3'),null,'ô đã khóa không thả lại được');
assert.ok(E.advance(run));assert.equal(run.index,1);

// 3) Thả sai: thẻ về rổ, có gợi ý ngắn, ô chưa khóa; hint() nấc 1 riêng cho thẻ vừa chọn; đúng ở lần hai → 5 điểm
run=E.newRun('solo');
const [d1,d2]=wrongCards(run);
r=E.drop(run,'A',d1);
assert.equal(r.correct,false);assert.ok(r.short&&r.short.length>3);
assert.equal(E.stageOf(run).A.cardId,null,'thẻ nhiễu về rổ');assert.ok(E.tray(run).includes(d1));
let h=E.hint(run,'A');assert.equal(h.tier,1);assert.equal(h.text,E.cardOf(E.sceneOf(run),d1).hint1);
r=E.drop(run,'A',correctFor(run,'A'));assert.equal(r.pts,5);assert.equal(r.how,'retry');

// 4) Hai thẻ nhiễu khác nhau cho hai gợi ý khác nhau
run=E.newRun('solo');
E.drop(run,'A',d1);E.drop(run,'B',d2);
assert.notEqual(E.hint(run,'A').text,E.hint(run,'B').text);

// 5) Nấc 2: làm mờ thẻ nhiễu (không đặt được) + gợi ý nội dung; đúng sau đó 0 điểm. Nấc 3: hiện đáp án, 0 điểm
run=E.newRun('solo');
E.drop(run,'A',d1);E.hint(run,'A');
h=E.hint(run,'A');assert.equal(h.tier,2);assert.equal(h.text,E.slotOf(E.sceneOf(run),'A').hint2);
assert.ok(h.faded);assert.equal(E.isFaded(run,h.faded),true);assert.equal(E.drop(run,'A',h.faded),null,'thẻ đã bị làm mờ không thả được');
r=E.drop(run,'A',correctFor(run,'A'));assert.equal(r.pts,0);assert.equal(r.how,'faded');
E.hint(run,'B');E.hint(run,'B');h=E.hint(run,'B');assert.equal(h.tier,3);assert.equal(h.text,E.slotOf(E.sceneOf(run),'B').why);
assert.equal(E.stageOf(run).B.how,'revealed');assert.equal(E.stageOf(run).B.pts,0);assert.equal(E.stageDone(run),true);
assert.equal(E.stagePoints(run,0),0);

// 6) Bỏ qua: 0 điểm, vào danh sách ôn; thẻ đúng thả nhầm ô báo "nhầm tình huống" và dùng gợi ý swap
run=E.newRun('solo');
r=E.drop(run,'A',correctFor(run,'B'));
assert.equal(r.correct,false);assert.equal(r.short,'Đúng sự kiện, nhầm tình huống!');
assert.equal(E.hint(run,'A').text,E.slotOf(E.sceneOf(run),'A').swap);
E.skip(run,'A');E.skip(run,'B');
assert.equal(E.stageDone(run),true);assert.equal(E.score(run),0);
assert.equal(E.review(run).length,2);assert.ok(E.review(run).every(x=>x.how==='skipped'));
assert.equal(E.timeline(run).length,2);

// 7) Kiểu xếp thứ tự (chặng 3): đúng ngay 5 điểm × 4 vị trí; sai thì tăng nấc, sai 3 lần thì hiện đáp án 0 điểm
run=at(E.newRun('solo'),2);
assert.equal(E.sceneOf(run).kind,'order');
const byT=[...E.sceneOf(run).cards].sort((a,b)=>a.t-b.t);
r=E.drop(run,'P1',byT[0].id);assert.equal(r.correct,true);assert.equal(r.pts,5);
r=E.drop(run,'P2',byT[3].id);assert.equal(r.correct,false);assert.ok(/hơn vị trí này/.test(r.short));
r=E.drop(run,'P2',byT[3].id);r=E.drop(run,'P2',byT[3].id);
assert.equal(r.revealed,true);assert.equal(E.stageOf(run).P2.pts,0);

// 8) Kiểu đúng/sai (chặng 5): 5 câu, mỗi câu đúng 4 điểm; trả lời sai hết = 0; hết giờ tính sai
run=at(E.newRun('solo'),4);
assert.equal(E.sceneOf(run).kind,'tf');
let items=E.tfItemsOf(run,D);assert.equal(items.length,E.TF_COUNT);
items.forEach(it=>E.tfAnswer(run,D,it.answer));
assert.equal(E.stageDone(run),true);assert.equal(E.stagePoints(run,4),20);assert.equal(E.stars(20),3);
run=at(E.newRun('solo'),4);E.tfItemsOf(run,D).forEach(it=>E.tfAnswer(run,D,!it.answer));
assert.equal(E.stagePoints(run,4),0);assert.equal(E.review(run).length,E.TF_COUNT);assert.equal(E.stars(0),1);
run=at(E.newRun('solo'),4);E.tfAnswer(run,D,E.tfItemsOf(run,D)[0].answer);E.tfExpire(run,D);
assert.equal(E.stageDone(run),true);assert.equal(E.stagePoints(run,4),4);

// 9) Màn trùm (chặng 9): chọn đúng 4 thẻ chuẩn bị = 20 điểm; chọn thẻ thời cơ bị trừ 5 mỗi thẻ
run=at(E.newRun('solo'),8);
assert.equal(E.sceneOf(run).kind,'boss');
let pool=E.bossPoolOf(run,D);assert.equal(pool.length,8);assert.equal(pool.filter(x=>x.prep).length,4);
pool.filter(x=>x.prep).forEach(x=>assert.ok(E.bossToggle(run,D,x.key)));
assert.equal(E.bossCount(run),E.BOSS_PICK);assert.equal(E.bossToggle(run,D,pool.find(x=>!x.prep).key),false,'rổ đầy');
assert.equal(E.bossSubmit(run,D).pts,20);
run=at(E.newRun('solo'),8);pool=E.bossPoolOf(run,D);
pool.filter(x=>!x.prep).forEach(x=>E.bossToggle(run,D,x.key));
assert.equal(E.bossSubmit(run,D).pts,0);

// 10) Chơi hoàn hảo cả 9 chặng = 180; không còn mục cần ôn; album xếp theo thời gian, 18 thẻ
run=E.newRun('solo');E.fastForward(run,D,9);
assert.equal(run.finished,true);assert.equal(E.score(run),180);assert.equal(E.MAX(D),180);
assert.equal(E.review(run).length,0);
const tl=E.timeline(run).map(a=>a.card.t);deq(tl,[...tl].sort((a,b)=>a-b));assert.equal(tl.length,18);

// 11) Chơi lại một chặng: bản mới ít điểm hơn thì giữ bản cũ (tổng vẫn tối đa 180)
run=E.newRun('solo');E.fastForward(run,D,9);run.finished=false;run.index=8;
assert.ok(E.retryStage(run,0,D));assert.equal(run.index,0);
E.skip(run,'A');E.skip(run,'B');
assert.ok(E.finishReplay(run));assert.equal(E.stagePoints(run,0),20);assert.equal(run.index,8);

console.log('PASS: dữ liệu 9 chặng · ghép 10/5/0 · làm mờ · xem đáp án · bỏ qua · xếp thứ tự · đúng/sai · màn trùm · tối đa 180 · album · chơi lại chặng.');
