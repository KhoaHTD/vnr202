/* ============================================================
   engine.js: LUẬT CHƠI thuần, không đụng DOM. game.js gọi, ui.js chỉ vẽ.
   Mỗi chặng có 2 ô (điểm nóng A, B) và 4 thẻ (2 đúng, 2 nhiễu).
   Điểm mỗi ô: đúng ngay lần đầu 10 · đúng sau 1 lần gợi ý (nấc 1) 5 · đúng sau khi thẻ bị làm mờ (nấc 2), xem đáp án hoặc bỏ qua 0.
   Tối đa 20 điểm/chặng, 180 điểm/9 chặng. Gợi ý tăng dần 3 nấc: thời điểm → làm mờ 1 thẻ nhiễu + nội dung → hiện đáp án.
   Kiểu chơi theo chặng (scene.kind): 'match' ghép thẻ vào 2 ô (như trên) · 'order' xếp cả 4 thẻ theo thứ tự thời gian (5/3/0 điểm mỗi vị trí, 4 vị trí) ·
   'tf' 5 câu đúng/sai (4 điểm mỗi câu; câu viết tay ở scene.tf, nếu không có thì tự sinh từ thẻ; giới hạn giờ scene.tfSeconds). Mọi kiểu đều tối đa 20 điểm/chặng.
   Chế độ 'class' (lớp học): cùng luật, nhưng gợi ý chỉ tăng khi MC bấm hint(); chơi một mình thì hint() tự gọi sau mỗi lần sai.
   ============================================================ */
window.GameEngine=(()=>{
const SLOT_IDS=['A','B'];
const POINTS=[10,5,0];

const POINTS_ORDER=[5,3,0],ORDER_TIE=.25;
const TF_COUNT=5,TF_POINTS=4;
const newSlot=()=>({cardId:null,locked:false,tier:0,attempts:0,pts:null,how:null,lastWrong:null});
const kindOf=scene=>(scene&&scene.kind)||'match';
/* ids = các ô của chặng: match A,B · order P1..P4 (vị trí 1–4 trên dây thời gian) · tf không có ô (trạng thái nằm ở st.tf). */
function newStage(scene){
  const k=kindOf(scene);
  if(k==='order')return {ids:['P1','P2','P3','P4'],P1:newSlot(),P2:newSlot(),P3:newSlot(),P4:newSlot(),faded:[],order:null};
  if(k==='tf')return {ids:[],faded:[],order:null,tf:{items:null,i:0,done:false,pts:0}};
  if(k==='boss')return {ids:[],faded:[],order:null,boss:{pool:null,picked:[],done:false,pts:0}};
  return {ids:SLOT_IDS.slice(),A:newSlot(),B:newSlot(),faded:[],order:null};
}
function newRun(mode='solo',D=window.GAME_DATA){
  return {mode,index:0,stages:D.scenes.map(sc=>newStage(sc)),album:[],finished:false,streak:0,resume:null,snap:null};
}

const sceneOf=(run,D=window.GAME_DATA)=>D.scenes[run.index];
const stageOf=run=>run.stages[run.index];
const cardOf=(scene,id)=>scene.cards.find(c=>c.id===id);
const slotOf=(scene,id)=>scene.slots.find(s=>s.id===id);
const byTime=scene=>scene.cards.map((c,i)=>[c,i]).sort((a,b)=>a[0].t-b[0].t||a[1]-b[1]).map(x=>x[0]);
// Thẻ đúng của một ô: match = slot.correct; order = thẻ đứng thứ n theo thời gian
const correctCard=(scene,slotId)=>/^P\d$/.test(slotId)?byTime(scene)[Number(slotId[1])-1].id:slotOf(scene,slotId).correct;

// Thẻ còn trong rổ: chưa đặt vào ô nào và chưa bay vào album
function tray(run,D){
  const scene=sceneOf(run,D),st=stageOf(run);
  const used=new Set(st.ids.map(id=>st[id].cardId).filter(Boolean));
  return scene.cards.map(c=>c.id).filter(id=>!used.has(id));
}
const isFaded=(run,cardId)=>stageOf(run).faded.includes(cardId);

// Thứ tự 4 thẻ trên dây thời gian: xếp theo thời gian (cũ → mới), ổn định, nên số thẻ 1–4 cố định cho lớp học
function orderOf(run,D){
  const st=stageOf(run);
  if(!st.order){
    const sorted=byTime(sceneOf(run,D)).map(c=>c.id);
    // Kiểu xếp thứ tự: số thẻ 1–4 không được trùng thứ tự thời gian (không để lộ đáp án)
    st.order=kindOf(sceneOf(run,D))==='order'&&sorted.length===4?[sorted[2],sorted[0],sorted[3],sorted[1]]:sorted;
  }
  return st.order;
}

// Đặt thẻ vào ô chưa khóa. Thẻ đang ở ô khác thì rời ô đó; thẻ cũ trong ô quay về rổ. Thẻ bị làm mờ không đặt được.
function place(run,slotId,cardId,D){
  const st=stageOf(run),scene=sceneOf(run,D);
  if(!st.ids.includes(slotId)||!cardOf(scene,cardId)||st[slotId].locked||st.faded.includes(cardId))return false;
  for(const id of st.ids)if(!st[id].locked&&st[id].cardId===cardId)st[id].cardId=null;
  if(st.ids.some(id=>st[id].locked&&st[id].cardId===cardId))return false; // thẻ đã khóa ở ô khác
  st[slotId].cardId=cardId;
  return true;
}
function unplace(run,slotId){const s=stageOf(run)[slotId];if(s.locked)return false;s.cardId=null;return true;}
function lock(run,slotId,scene,how,pts,D,cardId){
  const st=stageOf(run),s=st[slotId],want=cardId||correctCard(scene,slotId);
  // Thẻ đúng có thể đang nằm nhầm ở ô còn lại: gỡ ra trước khi khóa vào ô này
  for(const id of st.ids)if(id!==slotId&&!st[id].locked&&st[id].cardId===want)st[id].cardId=null;
  s.cardId=want;s.locked=true;s.how=how;s.pts=pts;
  // Album chỉ nhận thẻ đúng của tình huống (2 thẻ/chặng); thẻ nhiễu trong kiểu xếp thứ tự không sưu tầm
  const c=cardOf(scene,want);
  if(c.slot)run.album.push({scene:run.index,slot:c.slot,card:want,how});
}

/* Gợi ý ngắn theo thời điểm khi thẻ sai: "Sớm 2 năm!", "Muộn 5 tháng!". Thẻ đúng nhưng đặt nhầm ô thì báo nhầm tình huống.
   So `t` của thẻ vừa thả với `t` của thẻ đúng của ô (không cần nội dung viết riêng). */
function quick(run,slotId,cardId,D){
  const scene=sceneOf(run,D),c=cardOf(scene,cardId),want=cardOf(scene,correctCard(scene,slotId));
  if(c.slot)return 'Đúng sự kiện, nhầm tình huống!';
  const d=c.t-want.t,months=Math.round(Math.abs(d)*12),years=Math.round(Math.abs(d));
  if(!months)return 'Cùng thời điểm, khác nội dung!';
  return `${d<0?'Sớm':'Muộn'} ${months>=18?years+' năm':months+' tháng'}!`;
}

/* Thả thẻ vào ô và chấm ngay ô đó. Đúng: khóa, điểm theo nấc hiện tại ({correct:true,pts,how}).
   Sai: thẻ về rổ, ghi lastWrong, trả gợi ý ngắn ({correct:false,short}); hint() tăng nấc do game.js gọi.
   Trả null nếu không đặt được (ô đã khóa, thẻ bị làm mờ...). */
function drop(run,slotId,cardId,D){
  if(kindOf(sceneOf(run,D))==='order')return dropOrder(run,slotId,cardId,D);
  if(!place(run,slotId,cardId,D))return null;
  const scene=sceneOf(run,D),s=stageOf(run)[slotId];
  s.attempts++;
  if(cardOf(scene,cardId).slot===slotId){
    const pts=POINTS[Math.min(s.tier,2)],how=s.tier===0?'first':s.tier===1?'retry':'faded';
    lock(run,slotId,scene,how,pts,D);run.streak++;
    return {slot:slotId,cardId,correct:true,pts,how};
  }
  run.streak=0;s.lastWrong=cardId;s.cardId=null;
  return {slot:slotId,cardId,correct:false,short:quick(run,slotId,cardId,D)};
}

/* Kiểu xếp thứ tự: thả thẻ vào vị trí n trên dây thời gian và chấm ngay. Đúng 5 điểm (lần đầu), 3 điểm (lần hai), 0 điểm (xem đáp án sau 3 lần sai).
   Sai: thẻ về rổ + gợi ý "Sớm hơn / Muộn hơn vị trí này". */
function dropOrder(run,slotId,cardId,D){
  if(!place(run,slotId,cardId,D))return null;
  const scene=sceneOf(run,D),st=stageOf(run),s=st[slotId];
  s.attempts++;
  // Hai sự kiện cách nhau < 0,25 năm (ví dụ "26/7/1936" và "1936") không phân biệt được bằng nhãn nên chấp nhận cả hai thứ tự
  const want=cardOf(scene,correctCard(scene,slotId)),dropped=cardOf(scene,cardId);
  if(dropped.id===want.id||Math.abs(dropped.t-want.t)<ORDER_TIE){
    const pts=POINTS_ORDER[Math.min(s.tier,2)],how=s.tier===0?'first':'retry';
    lock(run,slotId,scene,how,pts,D,cardId);run.streak++;
    return {slot:slotId,cardId,correct:true,pts,how};
  }
  run.streak=0;s.lastWrong=cardId;s.cardId=null;s.tier++;
  const rank=byTime(scene).findIndex(c=>c.id===cardId)+1,pos=Number(slotId[1]);
  const short=rank<pos?'Sớm hơn vị trí này!':'Muộn hơn vị trí này!';
  if(s.tier>=3){lock(run,slotId,scene,'revealed',0,D);return {slot:slotId,cardId,correct:false,short,revealed:true};}
  return {slot:slotId,cardId,correct:false,short};
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
  s.tier=3;run.streak=0;lock(run,slotId,scene,how,0,D);return true;
}
const skip=(run,slotId,D)=>reveal(run,slotId,D,'skipped');

const stageIsDone=st=>st.tf?st.tf.done:st.boss?st.boss.done:st.ids.every(id=>st[id].locked);
const stageDone=run=>stageIsDone(stageOf(run));
function advance(run,D=window.GAME_DATA){
  if(!stageDone(run))return false;
  run.index++;if(run.index>=D.scenes.length){run.index=D.scenes.length;run.finished=true;}
  return true;
}
const stagePoints=(run,i)=>{const st=run.stages[i];return st.tf?st.tf.pts:st.boss?st.boss.pts:st.ids.reduce((a,id)=>a+(st[id].pts||0),0);};
const score=run=>run.stages.reduce((a,_,i)=>a+stagePoints(run,i),0);
/* Sao mỗi chặng: 20 điểm = 3 sao, từ 15 = 2 sao, còn lại 1 sao (xong chặng là có ít nhất 1 sao). */
const stars=pts=>pts>=20?3:pts>=15?2:1;

/* Chơi lại một chặng từ màn tổng kết chương: chặng được đặt lại, ghi nhớ bản cũ và chặng sẽ quay về (resume).
   Xong chặng thì finishReplay giữ bản nào nhiều điểm hơn, nên tổng điểm vẫn tối đa 180. */
function retryStage(run,i,D=window.GAME_DATA){
  if(run.resume!=null||!stageIsDone(run.stages[i]))return false;
  run.snap={i,stage:run.stages[i],album:run.album.filter(a=>a.scene===i)};
  run.album=run.album.filter(a=>a.scene!==i);
  run.stages[i]=newStage(D.scenes[i]);
  run.resume=run.index;run.index=i;run.streak=0;
  return true;
}
function finishReplay(run){
  if(run.resume==null)return false;
  const sn=run.snap,i=sn.i,pts=st=>st.tf?st.tf.pts:st.boss?st.boss.pts:st.ids.reduce((a,id)=>a+(st[id].pts||0),0);
  if(pts(run.stages[i])<pts(sn.stage)){run.stages[i]=sn.stage;run.album=run.album.filter(a=>a.scene!==i).concat(sn.album);}
  run.index=run.resume;run.resume=null;run.snap=null;
  return true;
}
const MAX=(D=window.GAME_DATA)=>D.scenes.length*20;

// Mục cần ôn: ô ghép/xếp không đúng ngay lần đầu, câu đúng-sai trả lời sai; kèm tình huống, thẻ đúng, điểm, lời giải
function review(run,D=window.GAME_DATA){
  const out=[];
  run.stages.forEach((st,i)=>{
    const scene=D.scenes[i];
    if(st.tf){
      (st.tf.items||[]).forEach(it=>{if(it.ok===false)out.push({scene:i,slot:'-',situation:it.text,card:cardOf(scene,it.cardId)||{name:scene.title,year:scene.date},how:'missed',pts:0,why:it.explain});});
      return;
    }
    if(st.boss){
      (st.boss.pool||[]).filter(it=>st.boss.picked.includes(it.key)&&!it.prep).forEach(it=>out.push({scene:i,slot:'-',situation:`Bạn chọn “${it.card.name}” làm bằng chứng chuẩn bị lâu dài`,card:it.card,how:'missed',pts:0,why:`${it.card.name} (${it.card.year}) thuộc giai đoạn thời cơ tháng 8–9/1945, không phải chuẩn bị lâu dài.`}));
      return;
    }
    st.ids.forEach(id=>{
      const s=st[id];if(!s.locked||s.how==='first')return;
      const card=cardOf(scene,correctCard(scene,id));
      const match=!/^P\d$/.test(id),slot=match?slotOf(scene,id):null;
      out.push({scene:i,slot:id,situation:match?slot.situation:`Xếp vào vị trí ${id[1]} theo thời gian`,card,how:s.how,pts:s.pts,why:match?slot.why:(card.slot?slotOf(scene,card.slot).why:`${card.name} diễn ra ${card.year}.`)});
    });
  });
  return out;
}
// Album xếp theo thời gian
function timeline(run,D=window.GAME_DATA,upTo=null){
  return run.album.filter(a=>upTo===null||D.scenes[a.scene].chapter<=upTo)
    .map(a=>({...a,card:cardOf(D.scenes[a.scene],a.card)})).sort((x,y)=>x.card.t-y.card.t);
}

/* Kiểu đúng/sai: 5 câu sinh từ dữ liệu thẻ có sẵn (không cần nội dung viết thêm), mỗi câu 4 điểm.
   Thứ tự cố định: ngày đúng · ngày sai · so sánh đúng · ngày sai · so sánh sai. Nhãn thời gian sai lấy từ thẻ cùng chặng cách ≥ 1,5 năm nên chắc chắn sai. */
function tfItems(scene){
  if(scene.tf&&scene.tf.length)return scene.tf.map(q=>({cardId:q.card||null,text:q.text,answer:q.answer,explain:q.explain})); // câu viết tay trong content.js
  const cs=scene.cards,A=cs.find(c=>c.slot==='A'),B=cs.find(c=>c.slot==='B'),dec=cs.filter(c=>!c.slot);
  const far=c=>cs.filter(x=>x.id!==c.id&&Math.abs(x.t-c.t)>=1.5).sort((p,q)=>Math.abs(p.t-c.t)-Math.abs(q.t-c.t))[0]; // nhãn sai gần nhất (nhưng cách ≥ 1,5 năm) cho câu khó vừa phải
  const why=c=>c.slot?slotOf(scene,c.slot).why:`${c.name} diễn ra ${c.year}.`;
  const date=(c,wrong)=>{
    const w=wrong&&far(c);
    return w?{cardId:c.id,text:`<b>${c.name}</b> diễn ra vào ${w.year}.`,answer:false,explain:`${c.name} diễn ra ${c.year}, không phải ${w.year}.`}
            :{cardId:c.id,text:`<b>${c.name}</b> diễn ra vào ${c.year}.`,answer:true,explain:why(c)};
  };
  // so sánh: x trước y đúng khi x.t < y.t; chọn cặp cách nhau ≥ 1 năm để không mơ hồ
  const cmp=(x,y)=>({cardId:x.id,text:`<b>${x.name}</b> diễn ra trước <b>${y.name}</b>.`,answer:x.t<y.t,explain:`${x.name}: ${x.year}; ${y.name}: ${y.year}.`});
  const apart=(x,y)=>Math.abs(x.t-y.t)>=1;
  const pairs=[];for(const x of cs)for(const y of cs)if(x.id!==y.id&&apart(x,y))pairs.push([x,y].sort((p,q)=>p.t-q.t));
  const early=pairs[0]||[A,B],late=pairs[pairs.length-1]||[A,B];
  return [date(A,false),date(B,true),cmp(early[0],early[1]),date(dec[0]||A,true),cmp(late[1],late[0])];
}
const tfItemsOf=(run,D)=>{const t=stageOf(run).tf;if(!t.items)t.items=tfItems(sceneOf(run,D)).map(it=>({...it,ans:null,ok:null}));return t.items;};
function tfFinish(run,D){
  const scene=sceneOf(run,D),t=stageOf(run).tf;t.done=true;
  const how=t.pts>=16?'first':'retry';
  scene.cards.filter(c=>c.slot).forEach(c=>run.album.push({scene:run.index,slot:c.slot,card:c.id,how}));
}
// Trả lời câu hiện tại (ans = true/false). Trả {ok,item,done}.
function tfAnswer(run,D,ans){
  const t=stageOf(run).tf,items=tfItemsOf(run,D),it=items[t.i];
  if(!it||t.done)return null;
  it.ans=ans;it.ok=ans===it.answer;
  if(it.ok){t.pts+=TF_POINTS;run.streak++;}else run.streak=0;
  t.i++;if(t.i>=items.length)tfFinish(run,D);
  return {ok:it.ok,item:it,done:t.done};
}
// Hết giờ: các câu chưa trả lời tính là sai
function tfExpire(run,D){
  const t=stageOf(run).tf,items=tfItemsOf(run,D);
  if(t.done)return;
  for(;t.i<items.length;t.i++){items[t.i].ans=null;items[t.i].ok=false;}
  run.streak=0;tfFinish(run,D);
}

/* Màn trùm (chặng 9): "Cách mạng Tháng Tám có phải ăn may?". Bể 8 thẻ đã sưu tầm: 4 thẻ chuẩn bị (t < 1945,6; lấy rải đều từ album)
   + 4 thẻ thời cơ (Quân lệnh số 1, Đại hội Quốc dân Tân Trào, 19/8 Hà Nội, Tuyên ngôn). Chọn đúng 4 thẻ chuẩn bị: 5 điểm mỗi thẻ. */
const BOSS_T=1945.6,BOSS_PICK=4,BOSS_POINTS=5;
function bossPoolOf(run,D){
  const b=stageOf(run).boss;
  if(b.pool)return b.pool;
  const prep=run.album.map(a=>({key:a.scene+':'+a.card,scene:a.scene,card:cardOf(D.scenes[a.scene],a.card)})).filter(x=>x.card.t<BOSS_T&&x.scene<run.index).sort((x,y)=>x.card.t-y.card.t);
  const n=prep.length,idx=[...new Set([Math.floor(n/3),Math.floor(n/2),n-2,n-1])].filter(k=>k>=0); // nghiêng về các mốc gần tháng 8/1945 để khó phân biệt với thẻ thời cơ
  for(let k=n-3;idx.length<4&&k>=0;k--)if(!idx.includes(k))idx.push(k);
  const chance=[];
  [run.index-1,run.index].forEach(si=>D.scenes[si].cards.filter(c=>c.slot&&c.t>=BOSS_T).forEach(c=>chance.push({key:si+':'+c.id,scene:si,card:c})));
  const h=str=>[...str].reduce((a,ch)=>(a*31+ch.charCodeAt(0))%1000003,7);
  b.pool=[...idx.slice(0,4).map(k=>({...prep[k],prep:true})),...chance.slice(0,4).map(x=>({...x,prep:false}))].sort((x,y)=>h(x.key)-h(y.key));
  return b.pool;
}
// Chọn / bỏ chọn một thẻ (tối đa 4). Trả true nếu đổi được.
function bossToggle(run,D,key){
  const b=stageOf(run).boss;bossPoolOf(run,D);
  if(b.done)return false;
  const i=b.picked.indexOf(key);
  if(i>=0){b.picked.splice(i,1);return true;}
  if(b.picked.length>=BOSS_PICK)return false;
  b.picked.push(key);return true;
}
function bossSubmit(run,D){
  const b=stageOf(run).boss,pool=bossPoolOf(run,D);
  if(b.done||b.picked.length!==BOSS_PICK)return null;
  const ok=pool.filter(it=>it.prep&&b.picked.includes(it.key)).length;
  b.pts=ok*BOSS_POINTS;b.done=true;
  run.streak=ok===BOSS_PICK?run.streak+1:0;
  const scene=sceneOf(run,D),how=b.pts>=16?'first':'retry';
  scene.cards.filter(c=>c.slot).forEach(c=>run.album.push({scene:run.index,slot:c.slot,card:c.id,how}));
  return {ok,pts:b.pts};
}

/* Công cụ thử nghiệm (nút "Tua" ở game.js): chơi hoàn hảo các chặng trước `target`, đặt lại từ `target` trở đi, rồi đứng ở chặng `target`.
   target = số chặng (0–8) hoặc D.scenes.length để tới màn kết. Không dùng trong luật chơi thường. */
function fastForward(run,D,target){
  const n=D.scenes.length;
  run.resume=null;run.snap=null;run.finished=false;
  for(let j=0;j<n;j++){
    const sc=D.scenes[j];
    if(j>=target){run.stages[j]=newStage(sc);run.album=run.album.filter(a=>a.scene!==j);continue;}
    if(stageIsDone(run.stages[j]))continue;
    run.index=j;const st=run.stages[j],k=kindOf(sc);
    if(k==='tf'){tfItemsOf(run,D).forEach(it=>{if(!st.tf.done)tfAnswer(run,D,it.answer);});}
    else if(k==='boss'){bossPoolOf(run,D).filter(it=>it.prep).forEach(it=>bossToggle(run,D,it.key));bossSubmit(run,D);}
    else if(k==='order'){byTime(sc).forEach((c,i)=>{if(!st['P'+(i+1)].locked)dropOrder(run,'P'+(i+1),c.id,D);});}
    else sc.slots.forEach(sl=>{if(!st[sl.id].locked)drop(run,sl.id,sl.correct,D);});
  }
  run.index=Math.min(target,n);run.streak=0;
  if(target>=n)run.finished=true;
}

// Hai chấm dưới mốc hành trình: ghép = hai ô A/B; kiểu khác = hai chấm cùng phản ánh cả chặng (đủ 20 điểm = đúng ngay)
function dots(run,i){
  const st=run.stages[i];
  if(!st.tf&&!st.boss&&st.ids[0]==='A')return [st.A,st.B].map(x=>({locked:x.locked,how:x.how}));
  const done=stageIsDone(st),how=stagePoints(run,i)>=20?'first':'retry';
  return [{locked:done,how},{locked:done,how}];
}

/* Số lần ô bị chấm sai trong chặng hiện tại (mỗi lần thả thẻ tăng attempts; ô đúng ngay lần chấm đó thì không tính). Dùng để quyết định khi nào hiện link "Bỏ qua". */
function wrongs(run){const st=stageOf(run);return st.ids.reduce((n,id)=>n+st[id].attempts-(st[id].how==='first'||st[id].how==='retry'||st[id].how==='faded'?1:0),0);}
const isDone=(run,i)=>stageIsDone(run.stages[i]);
return {fastForward,bossPoolOf,bossToggle,bossSubmit,BOSS_PICK,kindOf,tfItemsOf,tfAnswer,tfExpire,dots,TF_COUNT,isDone,stars,retryStage,finishReplay,wrongs,SLOT_IDS,POINTS,newRun,sceneOf,stageOf,cardOf,slotOf,orderOf,tray,isFaded,place,unplace,drop,quick,hint,reveal,skip,stageDone,advance,stagePoints,score,MAX,review,timeline};})();
