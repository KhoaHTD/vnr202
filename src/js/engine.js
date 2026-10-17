/* ============================================================
   engine.js: LUẬT CHƠI thuần, không đụng DOM. game.js gọi, ui.js chỉ vẽ.
   Mỗi chặng có 2 ô (điểm nóng A, B) và 4 thẻ (2 đúng, 2 nhiễu).
   Điểm mỗi ô: đúng ngay lần đầu 10 · đúng sau 1 lần gợi ý (nấc 1) 5 · đúng sau khi thẻ bị làm mờ (nấc 2), xem đáp án hoặc bỏ qua 0.
   Tối đa 20 điểm/chặng, 180 điểm/9 chặng. Gợi ý tăng dần 3 nấc: thời điểm → làm mờ 1 thẻ nhiễu + nội dung → hiện đáp án.
   Chế độ 'class' (lớp học): cùng luật, nhưng gợi ý chỉ tăng khi MC bấm hint(); chơi một mình thì hint() tự gọi sau mỗi lần sai.
   ============================================================ */
window.GameEngine=(()=>{
const SLOT_IDS=['A','B'];
const POINTS=[10,5,0];

const newSlot=()=>({cardId:null,locked:false,tier:0,attempts:0,pts:null,how:null,lastWrong:null});
const newStage=()=>({A:newSlot(),B:newSlot(),faded:[],order:null});
function newRun(mode='solo',D=window.GAME_DATA){
  return {mode,index:0,stages:D.scenes.map(newStage),album:[],finished:false};
}

const sceneOf=(run,D=window.GAME_DATA)=>D.scenes[run.index];
const stageOf=run=>run.stages[run.index];
const cardOf=(scene,id)=>scene.cards.find(c=>c.id===id);
const slotOf=(scene,id)=>scene.slots.find(s=>s.id===id);
const correctCard=(scene,slotId)=>slotOf(scene,slotId).correct;

// Thẻ còn trong rổ: chưa đặt vào ô nào và chưa bay vào album
function tray(run,D){
  const scene=sceneOf(run,D),st=stageOf(run);
  const used=new Set(SLOT_IDS.map(id=>st[id].cardId).filter(Boolean));
  return scene.cards.map(c=>c.id).filter(id=>!used.has(id));
}
const isFaded=(run,cardId)=>stageOf(run).faded.includes(cardId);

// Thứ tự 4 thẻ trên dây thời gian: xếp theo thời gian (cũ → mới), ổn định, nên số thẻ 1–4 cố định cho lớp học
function orderOf(run,D){
  const st=stageOf(run);
  if(!st.order)st.order=sceneOf(run,D).cards.map((c,i)=>[c,i]).sort((a,b)=>a[0].t-b[0].t||a[1]-b[1]).map(x=>x[0].id);
  return st.order;
}

// Đặt thẻ vào ô chưa khóa. Thẻ đang ở ô khác thì rời ô đó; thẻ cũ trong ô quay về rổ. Thẻ bị làm mờ không đặt được.
function place(run,slotId,cardId,D){
  const st=stageOf(run),scene=sceneOf(run,D);
  if(!SLOT_IDS.includes(slotId)||!cardOf(scene,cardId)||st[slotId].locked||st.faded.includes(cardId))return false;
  for(const id of SLOT_IDS)if(!st[id].locked&&st[id].cardId===cardId)st[id].cardId=null;
  if(SLOT_IDS.some(id=>st[id].locked&&st[id].cardId===cardId))return false; // thẻ đã khóa ở ô khác
  st[slotId].cardId=cardId;
  return true;
}
function unplace(run,slotId){const s=stageOf(run)[slotId];if(s.locked)return false;s.cardId=null;return true;}
// Bấm "Triển khai" khi mọi ô chưa khóa đều có thẻ
const canDeploy=run=>{const st=stageOf(run),open=SLOT_IDS.filter(id=>!st[id].locked);return open.length>0&&open.every(id=>st[id].cardId);};

function lock(run,slotId,scene,how,pts,D){
  const st=stageOf(run),s=st[slotId],want=correctCard(scene,slotId);
  // Thẻ đúng có thể đang nằm nhầm ở ô còn lại: gỡ ra trước khi khóa vào ô này
  for(const id of SLOT_IDS)if(id!==slotId&&!st[id].locked&&st[id].cardId===want)st[id].cardId=null;
  s.cardId=want;s.locked=true;s.how=how;s.pts=pts;
  run.album.push({scene:run.index,slot:slotId,card:want,how});
}

/* Chấm các ô chưa khóa. Trả về mảng kết quả {slot, cardId, correct, pts?, how?}.
   Ô đúng: khóa, cộng điểm theo nấc hiện tại. Ô sai: thẻ về rổ, ghi lastWrong (chưa tăng nấc: hint() làm việc đó). */
function evaluate(run,D){
  if(!canDeploy(run))return [];
  const scene=sceneOf(run,D),st=stageOf(run),out=[];
  for(const id of SLOT_IDS){
    const s=st[id];if(s.locked)continue;
    const cardId=s.cardId;s.attempts++;
    if(cardOf(scene,cardId).slot===id){
      const pts=POINTS[Math.min(s.tier,2)],how=s.tier===0?'first':s.tier===1?'retry':'faded';
      lock(run,id,scene,how,pts,D);
      out.push({slot:id,cardId,correct:true,pts,how});
    }else{
      s.lastWrong=cardId;s.cardId=null;
      out.push({slot:id,cardId,correct:false});
    }
  }
  return out;
}

/* Gợi ý tiếp theo cho ô chưa khóa (tăng nấc).
   Nấc 1: gợi ý thời điểm viết riêng cho thẻ nhiễu vừa chọn (thẻ đúng đặt nhầm ô thì dùng slot.swap).
   Nấc 2: làm mờ 1 thẻ nhiễu (ưu tiên thẻ vừa chọn) + gợi ý nội dung.
   Nấc 3: hiện đáp án (khóa, 0 điểm) + lời giải. */
function hint(run,slotId,D){
  const scene=sceneOf(run,D),st=stageOf(run),s=st[slotId],slot=slotOf(scene,slotId);
  if(s.locked)return null;
  s.tier=Math.min(s.tier+1,3);
  if(s.tier===1){
    const c=s.lastWrong?cardOf(scene,s.lastWrong):null;
    return {tier:1,text:!c?slot.hint2:c.slot?slot.swap:c.hint1,cardId:s.lastWrong};
  }
  if(s.tier===2){
    const decoys=scene.cards.filter(c=>!c.slot&&!st.faded.includes(c.id));
    const pick=decoys.find(c=>c.id===s.lastWrong)||decoys[0]||null;
    if(pick){st.faded.push(pick.id);for(const id of SLOT_IDS)if(st[id].cardId===pick.id)st[id].cardId=null;}
    return {tier:2,text:slot.hint2,faded:pick?pick.id:null};
  }
  reveal(run,slotId,D,'revealed');
  return {tier:3,text:slot.why,revealed:correctCard(scene,slotId)};
}

// Xem đáp án (MC hoặc nấc 3) và Bỏ qua: ô khóa với 0 điểm, vào danh sách ôn
function reveal(run,slotId,D,how='revealed'){
  const scene=sceneOf(run,D),s=stageOf(run)[slotId];
  if(s.locked)return false;
  s.tier=3;lock(run,slotId,scene,how,0,D);return true;
}
const skip=(run,slotId,D)=>reveal(run,slotId,D,'skipped');

const stageDone=run=>SLOT_IDS.every(id=>stageOf(run)[id].locked);
function advance(run,D=window.GAME_DATA){
  if(!stageDone(run))return false;
  run.index++;if(run.index>=D.scenes.length){run.index=D.scenes.length;run.finished=true;}
  return true;
}
const stagePoints=(run,i)=>SLOT_IDS.reduce((a,id)=>a+(run.stages[i][id].pts||0),0);
const score=run=>run.stages.reduce((a,_,i)=>a+stagePoints(run,i),0);
const MAX=(D=window.GAME_DATA)=>D.scenes.length*SLOT_IDS.length*POINTS[0];

// Các ô cần ôn: mọi ô không đúng ngay lần đầu, kèm tình huống, thẻ đúng, điểm, lời giải
function review(run,D=window.GAME_DATA){
  const out=[];
  run.stages.forEach((st,i)=>SLOT_IDS.forEach(id=>{
    const s=st[id];if(!s.locked||s.how==='first')return;
    const scene=D.scenes[i],slot=slotOf(scene,id);
    out.push({scene:i,slot:id,situation:slot.situation,card:cardOf(scene,slot.correct),how:s.how,pts:s.pts,why:slot.why});
  }));
  return out;
}
// Album xếp theo thời gian
function timeline(run,D=window.GAME_DATA,upTo=null){
  return run.album.filter(a=>upTo===null||D.scenes[a.scene].chapter<=upTo)
    .map(a=>({...a,card:cardOf(D.scenes[a.scene],a.card)})).sort((x,y)=>x.card.t-y.card.t);
}

return {SLOT_IDS,POINTS,newRun,sceneOf,stageOf,cardOf,slotOf,orderOf,tray,isFaded,place,unplace,canDeploy,evaluate,hint,reveal,skip,stageDone,advance,stagePoints,score,MAX,review,timeline};})();
