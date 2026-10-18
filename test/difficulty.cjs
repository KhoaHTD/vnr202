/* Kiểm tra độ khó tăng dần + câu đúng/sai viết tay: node test/difficulty.cjs */
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ROOT=require('path').resolve(__dirname,'..'),ctx=vm.createContext({window:{},performance:{now:()=>0}});
for(const f of ['content','engine'])vm.runInContext(fs.readFileSync(`${ROOT}/src/js/${f}.js`,'utf8'),ctx);
const D=ctx.window.GAME_DATA,E=ctx.window.GameEngine;
// Chặng order: không cặp thẻ nào ngoài cặp đúng gần nhau hơn ngưỡng hòa 0,25 năm (để chấm rõ ràng)
D.scenes.filter(s=>s.kind==='order').forEach((s,i)=>{const t=s.cards.map(c=>c.t).sort((a,b)=>a-b);t.slice(1).forEach((x,k)=>{if(k!==1&&k!==0&&k!==2)return;});assert.ok(t[1]-t[0]>=.25&&t[2]-t[1]>=.25,`order ${s.title}: 3 mốc đầu phải cách ≥ 0,25 năm`);});
// Chặng tf: 5 câu viết tay, 3 Đ/2 S hoặc 2 Đ/3 S, có lời giải, có giới hạn giờ tăng dần
let prev=0;
D.scenes.filter(s=>s.kind==='tf').forEach(s=>{
  assert.equal(s.tf.length,5,s.title);
  const d=s.tf.filter(q=>q.answer).length;assert.ok(d===2||d===3,`${s.title}: tỉ lệ Đ/S`);
  s.tf.forEach(q=>assert.ok(q.text&&q.explain&&typeof q.answer==='boolean',s.title));
  assert.ok(s.tfSeconds>=prev,`${s.title}: giờ không giảm`);prev=s.tfSeconds;
});
// Chơi hết với câu sai: review không lỗi, thẻ rơi về tên/mốc của chặng
const run=E.newRun('solo');
D.scenes.forEach((s,i)=>{run.index=i;if(s.kind==='tf'){E.tfItemsOf(run,D);E.tfAnswer(run,D,!E.tfItemsOf(run,D)[0].answer);E.tfExpire(run,D);}});
const rv=E.review(run,D);assert.ok(rv.length>=4);rv.forEach(r=>assert.ok(r.card&&r.card.name&&r.card.year&&r.why));
// Màn trùm: sau khi tua tới chặng 9, bể thẻ có 4 chuẩn bị + 4 thời cơ
const r2=E.newRun('solo');E.fastForward(r2,D,8);const pool=E.bossPoolOf(r2,D);
assert.equal(pool.filter(x=>x.prep).length,4);assert.equal(pool.filter(x=>!x.prep).length,4);
// Rổ bằng chứng: đặt vào ô cụ thể, dời ô, thay thẻ đang chiếm ô, lấy ra, rổ đầy, chốt khi đủ 4
{const r=E.newRun('solo');E.fastForward(r,D,8);const P=E.bossPoolOf(r,D),bk=E.stageOf(r).boss,k=P.map(x=>x.key);
assert.ok(E.bossPlace(r,D,k[0],2));assert.deepStrictEqual([...bk.picked],[null,null,k[0],null]);
assert.ok(E.bossPlace(r,D,k[0],0));assert.deepStrictEqual([...bk.picked],[k[0],null,null,null]);
assert.ok(E.bossPlace(r,D,k[1],0));assert.deepStrictEqual([...bk.picked],[k[1],null,null,null]);
assert.ok(E.bossToggle(r,D,k[1]));assert.equal(E.bossCount(r),0);
k.slice(0,4).forEach(x=>assert.ok(E.bossToggle(r,D,x)));assert.equal(E.bossToggle(r,D,k[4]),false);
const res=E.bossSubmit(r,D);assert.equal(res.pts,P.slice(0,4).filter(x=>x.prep).length*5);}
console.log('difficulty OK; prep:',pool.filter(x=>x.prep).map(x=>x.card.year).join(' | '));
