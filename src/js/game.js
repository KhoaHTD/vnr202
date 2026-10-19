/* ============================================================
   game.js (trang hanh-trinh.html): nối engine.js (luật chơi) với giao diện (ui.js): bấm, kéo thẻ, gợi ý, chuyển màn.
   HTML của từng màn nằm trong ui.js; dữ liệu lịch sử nằm trong content.js.
   Trang chủ là index.html (landing riêng). Game KHÔNG lưu/đọc tiến độ: mỗi lần mở là một lượt mới từ chương 1.
   Chế độ: 'solo' (một mình, gợi ý tự động) | 'class' (lớp học: MC chiếu màn hình, tự bấm gợi ý). Bật bằng công tắc ở chương 1 hoặc ?mode=class.
   ============================================================ */
(()=>{'use strict';
const D=window.GAME_DATA,UI=window.GameUI,E=window.GameEngine,app=document.getElementById('app');
let run=E.newRun(/[?&]mode=class\b/.test(location.search)?'class':'solo');
// Trạng thái giao diện của chặng đang chơi: thẻ đang chọn (chạm), thông báo gợi ý từng ô, ô đang mở "Vì sao?"
let ui={sel:null,msg:{},why:{}},sound=BGM.isEnabled(),audio; // nhớ lựa chọn loa từ landing trong cùng phiên
const storyEnding=window.StoryEnding.create({onFinish:()=>endingResults()});
// Chỉ để test (check.cjs) đọc trạng thái lượt chơi; game không lưu ở đâu cả
window.GameDebug={state:()=>run,ui:()=>ui,ending:()=>storyEnding.state(),skipVoyage:false}; // skipVoyage = true: bỏ chuyển cảnh bản đồ (test)

// Tiện ích nhỏ
const $=id=>document.getElementById(id);
const reducedMotion=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
// Âm thanh: chỉ phát khi người chơi bật nút loa. sfx = tiếng "tích" ngắn, bgm.js = nhạc nền, paperSound = tiếng lật giấy
/* Âm ngắn (chỉ khi người chơi bật Âm thanh): snap = thẻ khớp, ok = đúng, bad = sai, pick = nhấc thẻ, click = nút bấm, hint = gợi ý, tick = 5 giây cuối, win = xong chương / màn kết. Dao động đơn, 40–180ms, nhỏ tiếng. */
function sfx(kind){
  if(!sound)return;
  const notes={snap:[[220,.04,'square',.02]],ok:[[523,.07,'sine',.05],[784,.12,'sine',.05]],bad:[[190,.14,'sawtooth',.03]],
    pick:[[330,.05,'triangle',.035]],click:[[420,.04,'sine',.03],[310,.06,'sine',.025]],hint:[[660,.08,'sine',.04],[880,.12,'sine',.035]],
    tick:[[1000,.03,'square',.018]],win:[[523,.1,'sine',.05],[659,.1,'sine',.05],[784,.1,'sine',.05],[1047,.26,'sine',.055]]}[kind];
  if(!notes)return;
  try{
    audio=audio||new(window.AudioContext||window.webkitAudioContext)();
    let t=audio.currentTime;
    notes.forEach(([f,d,type,v])=>{
      const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.value=f;o.connect(g);g.connect(audio.destination);
      g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.start(t);o.stop(t+d);t+=d*.9;
    });
  }catch{}
}
// Đặt hồi hiện tại lên <body data-act> để acts.css đổi màu giấy
function setAct(a){if(a)document.body.dataset.act=a;else delete document.body.dataset.act;}
function scroll(){window.scrollTo({top:0,behavior:'instant'});}
function paperSound(){
if(!sound)return;
try{
audio=audio||new(window.AudioContext||window.webkitAudioContext)();
audio.resume().then(()=>{
const start=audio.currentTime, duration=.62;
const buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*duration),audio.sampleRate);
const samples=buffer.getChannelData(0);let previous=0;
for(let i=0;i<samples.length;i++){
previous=previous*.68+(Math.random()*2-1)*.32;
const t=i/audio.sampleRate;
samples[i]=previous*(.65+.2*Math.sin(t*93)+.15*Math.sin(t*213));
}
const source=audio.createBufferSource(), filter=audio.createBiquadFilter(), gain=audio.createGain();
source.buffer=buffer;filter.type='bandpass';filter.Q.value=.65;
filter.frequency.setValueAtTime(1200,start);filter.frequency.exponentialRampToValueAtTime(3500,start+.22);filter.frequency.exponentialRampToValueAtTime(800,start+duration);
gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.24,start+.05);gain.gain.linearRampToValueAtTime(.07,start+.2);gain.gain.linearRampToValueAtTime(.19,start+.32);gain.gain.exponentialRampToValueAtTime(.001,start+duration);
source.connect(filter);filter.connect(gain);gain.connect(audio.destination);
source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
source.start(start);source.stop(start+duration);
}).catch(()=>{});
}catch{}
}

/* ---------- Ánh sáng, chuyển màn, rửa ảnh, hiện khi cuộn ---------- */
// View Transitions API: màn cũ mờ đi, màn mới trượt vào (CSS trong base.css). Không có API thì dùng hiệu ứng CSS cũ.
const useVT=!!document.startViewTransition&&!reducedMotion();
if(useVT)document.documentElement?.classList.add('has-vt');
let noVT=false; // true khi voyage tự dựng màn dưới lớp phủ: bỏ View Transition
let cleanups=[]; // việc cần gỡ khi rời màn (ví dụ listener bàn phím của màn mở chương)
function show(build,kind){
  cleanups.forEach(f=>f());cleanups=[];
  const run=()=>{build();enhance();};
  if(!useVT||noVT||!app.childElementCount){run();return;}
  const root=document.documentElement;
  if(kind)root.dataset.vt=kind; // "leg": chặng → chặng, tờ cũ bị gạt đi, tờ mới đáp xuống (CSS trong play.css)
  const t=document.startViewTransition(run);
  t.ready.catch(()=>{});t.finished.catch(()=>{}).then(()=>{delete root.dataset.vt;}); // chuyển màn bị hủy (ví dụ đổi kích thước cửa sổ) thì bỏ qua, màn mới vẫn hiện
}
// Gọi cb một lần khi phần tử vào khung nhìn (không có IntersectionObserver thì gọi ngay)
function whenVisible(el,cb){
  if(!window.IntersectionObserver){cb();return;}
  const io=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){io.disconnect();cb();}},{rootMargin:'0px 0px -8% 0px'});
  io.observe(el);
}
/* Bản đồ nhỏ "bay" từ điểm của chặng trước sang điểm chặng này: nội suy viewBox trong 900ms (viewBox không animate được bằng CSS) */
let lastMapVB=null;
function flyMap(){
  const svg=app.querySelector('.ctx-map svg');if(!svg)return;
  const to=svg.getAttribute('viewBox').split(' ').map(Number),from=lastMapVB;lastMapVB=to;
  if(!from||reducedMotion()||from.every((v,i)=>Math.abs(v-to[i])<1))return;
  const t0=performance.now(),D=900,ease=t=>1-Math.pow(1-t,3);
  svg.setAttribute('viewBox',from.join(' '));
  const step=now=>{
    const k=Math.min(1,(now-t0)/D),e=ease(k),z=Math.sin(Math.PI*k)*.5; // kéo ra giữa chừng rồi áp sát điểm đến, như camera bay
    const cx=from[0]+from[2]/2+(to[0]+to[2]/2-from[0]-from[2]/2)*e,cy=from[1]+from[3]/2+(to[1]+to[3]/2-from[1]-from[3]/2)*e,w=(from[2]+(to[2]-from[2])*e)*(1+z),h=(from[3]+(to[3]-from[3])*e)*(1+z);
    if(svg.isConnected)svg.setAttribute('viewBox',`${(cx-w/2).toFixed(1)} ${(cy-h/2).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
    if(k<1&&svg.isConnected)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
// Sau khi dựng màn: bật "rửa ảnh" khi ảnh đã tải xong và đã nhìn thấy; bật hiện-khi-cuộn
function enhance(){
  app.querySelectorAll('[data-develop]').forEach(fig=>{
    const img=fig.querySelector('img');if(!img)return;
    const on=()=>whenVisible(fig,()=>fig.classList.add('is-on'));
    img.decode?img.decode().then(on,on):on(); // ảnh lỗi vẫn bật để không kẹt ở trạng thái ẩn
  });
  app.querySelectorAll('[data-reveal]').forEach(el=>whenVisible(el,()=>el.classList.add('is-in')));
  flyMap();
}

// Khoảng cách từ đỉnh `root` tới đỉnh `el`, đo bằng offsetTop (không bị ảnh hưởng bởi animation trượt/nghiêng của tờ bản đồ)
function offsetWithin(el,root){let y=0,e=el;while(e&&e!==root){y+=e.offsetTop||0;e=e.offsetParent;}return e===root?y:null;}
/* Dời tâm quầng đèn tới giữa phần tử `el` (chỗ cần đọc). Hai lớp sáng cùng dịch bằng transform trong 600ms:
   #lamp = quầng trong căn phòng (tọa độ cả trang), .sheet-light = ánh đèn rọi lên tờ bản đồ (tọa độ trong tờ giấy). */
function aimLamp(el){
  const lamp=$('lamp');if(!lamp||!el||el.offsetTop===undefined||!lamp.style)return;
  const half=(el.offsetHeight||0)/2,docY=offsetWithin(el,document.body);
  if(docY!==null)lamp.style.setProperty('--ly',(docY+half)+'px');
  const sheet=el.closest?.('.sheet');
  if(sheet&&sheet.style){const y=offsetWithin(el,sheet);if(y!==null)sheet.style.setProperty('--ly',(y+half)+'px');}
}

// Dải album + điểm + tuyến 9 chặng (nền phòng). Chỉ hiện ở màn chơi, tổng kết chương và màn kết.
function renderStrip(o={}){const el=$('strip');el.hidden=false;el.innerHTML=UI.strip(D,run,o);}
function hideStrip(){$('strip').hidden=true;}
// Quầng đèn sáng lên một nấc ở màn kết
function setBright(on){if(on)document.body.dataset.bright='';else delete document.body.dataset.bright;}
function setMode(mode){run.mode=mode;document.body.dataset.mode=mode;}

// will-change chỉ gắn trong lúc animation đang chạy, xong thì gỡ
document.addEventListener('animationstart',e=>{if(e.target.style)e.target.style.willChange='transform, opacity, filter';});
['animationend','animationcancel'].forEach(t=>document.addEventListener(t,e=>{if(e.target.style)e.target.style.willChange='';}));

/* ---------- Đầu trang, hồ sơ lịch sử, hộp xem ảnh ---------- */
/* Hộp hồ sơ dựng lại mỗi lần mở để không lộ các giai đoạn chưa tới:
   openRecords('stage')  → chỉ hồ sơ của chặng đang chơi ("Hồ sơ giai đoạn")
   openRecords()         → hồ sơ từ chặng 1 tới chặng đang chơi (nút đầu trang)
   openRecords('all')    → đủ 9 hồ sơ (màn kết) */
function openRecords(mode){
  const dialog=$('archive'),playing=!!$('stage'),cur=run.finished?D.records.length-1:Math.max(0,Math.min(run.index-(playing?0:1),D.records.length-1));
  const only=mode==='all'||run.finished?null:mode==='stage'?[D.scenes[Math.min(run.index,D.scenes.length-1)].record]:Array.from({length:cur+1},(_,i)=>i);
  $('archive-title').textContent=mode==='stage'?`Hồ sơ giai đoạn · Chặng ${run.index+1}`:'Hồ sơ lịch sử';
  $('archive-body').innerHTML=UI.records(D,only,mode==='stage'?only[0]:mode==='all'?8:cur);
  dialog.showModal();paperSound();dialog.querySelector('details[open]')?.scrollIntoView({block:'nearest'});
}
$('records').onclick=()=>openRecords();
$('close').onclick=()=>$('archive').close();
const soundBtn=()=>{const b=$('sound');b.innerHTML=UI.icon(sound?'sound':'mute');b.setAttribute('aria-pressed',sound);};
soundBtn();
$('sound').onclick=()=>{sound=!sound;soundBtn();BGM.setEnabled(sound);sfx('snap');};
/* Bấm vào ảnh nhỏ trong khối "Trong lịch sử" → mở hộp xem ảnh lớn.
   FLIP: đo vị trí ảnh nhỏ và ảnh lớn, rồi cho ảnh lớn bay từ chỗ ảnh nhỏ ra giữa (chỉ animate transform).
   Đóng bằng Esc (mặc định của <dialog>), nút Đóng hoặc bấm ra ngoài; đóng xong focus quay về ảnh nhỏ. */
let lastThumb=null;
app.addEventListener('click',e=>{
  const z=e.target.closest?.('[data-zoom]');if(!z)return;
  const v=$('photo-view'),big=v.querySelector('img'),thumb=z.querySelector('img');
  big.src=z.dataset.zoom;big.alt=z.dataset.alt;
  v.querySelector('figcaption').textContent=[z.dataset.caption,z.dataset.credit].filter(Boolean).join(' — ');
  lastThumb=z;v.showModal();
  if(reducedMotion()||!thumb||!big.animate)return;
  const a=thumb.getBoundingClientRect(),b=big.getBoundingClientRect();
  if(!b.width||!b.height)return;
  big.animate([{transformOrigin:'0 0',transform:`translate(${a.left-b.left}px,${a.top-b.top}px) scale(${a.width/b.width},${a.height/b.height})`},{transformOrigin:'0 0',transform:'none'}],{duration:640,easing:'cubic-bezier(.16,1,.3,1)'});
});
$('photo-close').onclick=()=>$('photo-view').close();
$('photo-view').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect?.();if(r&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))e.currentTarget.close();});
$('photo-view').addEventListener('close',()=>lastThumb?.focus?.());

/* ---------- Chuyển cảnh "Hành quân trên bản đồ": từ chặng fromIdx sang chặng run.index (xem voyage.js) ---------- */
function voyage(fromIdx,build,o={}){
  if(window.GameDebug.skipVoyage||reducedMotion()||!window.Voyage||!window.MAP_DATA||!app.firstElementChild){build();return;}
  const sheet=app.querySelector('.sheet')||app.firstElementChild,to=run.index;
  window.Voyage.run({D,run,from:fromIdx,to,sheet,chapterCard:!!o.chapter,sfx:()=>sfx('snap'),onSwap:()=>{noVT=true;try{build();}finally{noVT=false;}}});
}

/* ---------- Các màn ---------- */
// Màn mở đầu chương: không tự chuyển; bấm nút, Enter hoặc phím → để vào chương. Chương 1 có công tắc chế độ Lớp học.
function chapterIntro(chapter){BGM.play('chuong-'+(chapter+1));show(()=>{
  setAct(String(chapter+1));hideStrip();setBright(false);app.innerHTML=UI.chapterIntro(D,chapter,run);aimLamp(app.querySelector('.intro-media'));scroll();
  const onKey=e=>{if((e.key==='Enter'||e.key==='ArrowRight')&&!e.target.closest?.('input,button')&&!document.querySelector('dialog[open]')){e.preventDefault();go();}};
  const go=()=>{sfx('click');document.removeEventListener('keydown',onKey);voyage(run.index>0?run.index-1:null,play,{chapter:true});};
  document.addEventListener('keydown',onKey);cleanups.push(()=>document.removeEventListener('keydown',onKey));
  const sw=$('mode-class');if(sw)sw.onchange=()=>setMode(sw.checked?'class':'solo');
  $('chapter-go').onclick=e=>{e?.preventDefault?.();go();};
  $('chapter-go').focus?.({preventScroll:true});
});}

const slotIds=()=>E.stageOf(run).ids; // ô của chặng hiện tại: A,B (ghép) · P1..P4 (xếp thứ tự) · rỗng (đúng/sai)
const kindNow=()=>E.kindOf(E.sceneOf(run,D));
const stageEl=()=>$('stage');
const cardEl=id=>app.querySelector(`.ev[data-card="${id}"]`);
const isClass=()=>run.mode==='class';

// Vẽ lại ba vùng phụ thuộc trạng thái (ô, rổ, điểm nóng) + nút + dòng trạng thái. fresh = các ô vừa đúng (chạy hiệu ứng một lần).
function paint(fresh=[]){
  if(kindNow()==='tf'){paintTf();return;}
  if(kindNow()==='boss'){paintBoss();return;}
  const done=E.stageDone(run),st=E.stageOf(run);
  $('slots').innerHTML=UI.slots(D,run,{sel:ui.sel,msg:ui.msg,why:ui.why,classMode:isClass()});
  const hh=UI.hints(D,run,{msg:ui.msg,why:ui.why,classMode:isClass()});$('hints').innerHTML=hh;$('hints').hidden=!hh;
  $('tray').innerHTML=UI.tray(D,run,{sel:ui.sel});
  $('spots').innerHTML=UI.spots(D,run,{sel:ui.sel,fresh});
  $('scene').dataset.lit=slotIds().filter(id=>st[id].locked).length;
  stageEl().classList.toggle('is-done',done);
  app.querySelector('.sheet')?.classList.toggle('is-done',done);
  const c=ui.sel?E.cardOf(E.sceneOf(run,D),ui.sel):null;
  $('save-status').classList.remove('is-wrong');
  $('save-status').textContent=c&&!done?(kindNow()==='order'?`Đã chọn thẻ “${c.name}”. Chạm vào vị trí để đặt.`:`Đã chọn thẻ “${c.name}”. Chạm vào tình huống để đặt.`):'';
  const b=$('proceed');b.hidden=!done; // chấm ngay khi thả thẻ: nút chỉ hiện khi xong chặng
  b.textContent=run.index===D.scenes.length-1?'Xem kết thúc hành trình →':'Tiếp tục hành trình →';
  $('skip').hidden=done||kindNow()!=='match'||E.wrongs(run)<2; // chỉ hiện sau 2 lần đặt sai (kiểu ghép)
}

// Màn chơi một chặng
function play(){if(run.index>=D.scenes.length){ending();return;}
  BGM.play(kindNow()==='boss'?'tran-dau-cuoi':'chuong-'+(D.scenes[run.index].chapter+1)); // chặng 9 đổi bài, chặng khác giữ bài của chương
  const leg=!!app.querySelector('.sheet .stage'); // đang ở một chặng khác thì đổi tờ; từ màn mở chương/tổng kết vào thì giữ cách cũ
  show(()=>{
  ui={sel:null,msg:{},why:{},tf:{started:false,left:UI.tfSecs(D.scenes[run.index]),last:null},nudge:false};const s=D.scenes[run.index];setAct(run.index===8?'finale':String(s.chapter+1));
  if(run.index===D.scenes.length-1)storyEnding.prepare();
  const enter=!app.querySelector('.sheet'); // tờ bản đồ chỉ trượt vào khi vừa vào chương, không trượt lại ở mỗi chặng
  app.innerHTML=UI.play(D,run,{enter,leg});setBright(false);document.body.dataset.mode=run.mode;
  renderStrip();paint();aimLamp(app.querySelector('.stage-main')||app.querySelector('.tf'));
  $('proceed').onclick=proceed;
  if(kindNow()==='tf'){bindTf();}else if(kindNow()==='boss'){bindBoss();}else{$('skip').onclick=skipStage;bindStage();}
  scroll();},leg?'leg':undefined);}

// Thả thẻ đang chọn (hoặc thẻ kéo) vào ô: chấm ngay. Đúng → thẻ "cạch" vào ô, khóa, +điểm bay lên. Sai → thẻ rung rồi về rổ + gợi ý ngắn.
function putCard(slot,id){
  const st=E.stageOf(run),before=slotIds().filter(k=>st[k].locked);
  const from=cardEl(id),slotBox=app.querySelector(`.slot[data-slot="${slot}"] .slot-drop`);
  const res=E.drop(run,slot,id,D);
  if(!res)return false;
  ui.sel=null;delete ui.msg[slot];
  if(res.correct){afterLock(before,{},false,{snap:true,pts:res.pts});return true;}
  const wrongBox=slotBox?.getBoundingClientRect();
  if(kindNow()!=='match')ui.msg[slot]={tier:0,text:'',short:res.short}; // xếp thứ tự: chỉ dòng "Sớm hơn / Muộn hơn", tự khóa khi sai lần 3
  else if(isClass())ui.msg[slot]={tier:0,text:'',short:res.short};
  else{const h=E.hint(run,slot,D);ui.msg[slot]={tier:h.tier,text:h.text,short:res.short};}
  sfx('bad');
  afterLock(before,{},true,{bounce:{id,box:wrongBox,slot}});
  return true;
}
/* Kéo thả bằng Pointer Events (chuột, bút, cảm ứng): kéo >6px mới tính là kéo; dưới ngưỡng là bấm (chạm chọn rồi chạm ô).
   Thả lên ô/điểm nóng thì chấm ngay; thả ra ngoài thì thẻ đứng yên ở rổ. */
/* Kéo thả dùng chung (Pointer Events: chuột, bút, cảm ứng). Kéo >6px mới tính là kéo; dưới ngưỡng là bấm.
   itemSel: thẻ kéo được · dropSel: nơi thả · onDrop(đích, id, rectThẻ) → true nếu nhận · onMiss(id, rectThẻ) khi thả ra ngoài mọi đích.
   Trả hàm swallowed(): true ngay sau một cú kéo (để bỏ cú click đi kèm). */
function pointerDrag(root,{itemSel,idOf,dropSel='[data-drop]',onDrop,onMiss}){
  let drag=null,swallow=false;
  const dropAt=(x,y)=>document.elementFromPoint(x,y)?.closest?.(dropSel)||null;
  const clearOver=()=>app.querySelectorAll('.is-over').forEach(e=>e.classList.remove('is-over'));
  const move=e=>{
    if(!drag||e.pointerId!==drag.pid)return;
    if(!drag.on){
      if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<6)return;
      drag.on=true;const r=drag.el.getBoundingClientRect();
      drag.dx=drag.x-r.left;drag.dy=drag.y-r.top;
      drag.ghost=drag.el.cloneNode(true);drag.ghost.classList.add('ev-ghost');drag.ghost.style.width=r.width+'px';drag.ghost.removeAttribute('data-card');drag.ghost.removeAttribute('data-boss');
      document.body.appendChild(drag.ghost);drag.el.classList.add('is-dragging');document.body.classList.add('is-dragging');
    }
    drag.ghost.style.transform=`translate(${e.clientX-drag.dx}px,${e.clientY-drag.dy}px) rotate(-2deg)`;
    clearOver();dropAt(e.clientX,e.clientY)?.classList.add('is-over');
  };
  const end=e=>{
    if(!drag||e.pointerId!==drag.pid)return;
    document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',end);document.removeEventListener('pointercancel',end);
    const d=drag;drag=null;
    if(!d.on)return;
    swallow=true;setTimeout(()=>swallow=false,0);
    const rect=d.ghost.getBoundingClientRect();
    d.ghost.remove();document.body.classList.remove('is-dragging');clearOver();
    const t=e.type==='pointerup'?dropAt(e.clientX,e.clientY):null;
    if(t&&onDrop(t,d.id,rect))return;
    d.el.classList.remove('is-dragging');
    if(e.type==='pointerup'&&!t&&onMiss)onMiss(d.id,rect);
  };
  root.addEventListener('pointerdown',e=>{
    if(e.button>0||!e.isPrimary)return;
    const el=e.target.closest?.(itemSel);if(!el)return;
    sfx('pick');
    drag={el,id:idOf(el),pid:e.pointerId,x:e.clientX,y:e.clientY,on:false};
    document.addEventListener('pointermove',move);document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
  });
  return ()=>swallow;
}
function bindStage(){
  const root=stageEl();
  const swallowed=pointerDrag(root,{itemSel:'.ev[data-card]:not(.is-faded)',idOf:el=>el.dataset.card,onDrop:(t,id)=>putCard(t.dataset.drop,id)});
  root.addEventListener('click',e=>{
    if(swallowed())return;
    const t=e.target;
    const ev=t.closest?.('.ev[data-card]');
    if(ev){
      if(ev.classList.contains('is-faded')){$('save-status').textContent='Thẻ này đã bị loại, hãy chọn thẻ khác.';return;}
      ui.sel=ui.sel===ev.dataset.card?null:ev.dataset.card;paint();cardEl(ui.sel||ev.dataset.card)?.focus?.({preventScroll:true});return;
    }
    const place=t.closest?.('[data-place]');
    if(place){
      if(ui.sel)putCard(place.dataset.place,ui.sel);
      else $('save-status').textContent='Hãy chọn một thẻ ở rổ trước, rồi chạm vào tình huống.';
      return;
    }
    const why=t.closest?.('[data-why]');
    if(why){const id=why.dataset.why;ui.why[id]=!ui.why[id];paint();app.querySelector(`[data-why="${id}"]`)?.focus?.({preventScroll:true});return;}
    const retry=t.closest?.('[data-retry]');
    if(retry){delete ui.msg[retry.dataset.retry];paint();app.querySelector('.tray .ev:not(.is-faded)')?.focus?.();return;}
    const hint=t.closest?.('[data-hint]');
    if(hint){giveHint(hint.dataset.hint);return;}
    const rev=t.closest?.('[data-reveal]');
    if(rev){settle([rev.dataset.reveal],()=>E.reveal(run,rev.dataset.reveal,D),true);return;}
    const bonus=t.closest?.('#bonus-go');
    if(bonus)startBonus();
  });
  // Bàn phím: 1–4 chọn thẻ, A/B đặt vào ô, Enter triển khai / tiếp tục, Esc bỏ chọn. Ô thả (div) bấm được bằng Enter/Space.
  const onKey=e=>{
    if(e.ctrlKey||e.metaKey||e.altKey||document.querySelector('dialog[open]')||e.target.closest?.('input,textarea'))return;
    const k=e.key.toLowerCase();
    if(/^[1-4]$/.test(k)&&!E.stageDone(run)){const id=E.orderOf(run,D)[Number(k)-1];if(id&&!E.isFaded(run,id)){ui.sel=ui.sel===id?null:id;paint();cardEl(id)?.focus?.({preventScroll:true});}return;}
    if(kindNow()==='order'){if(/^[a-d]$/.test(k)&&ui.sel&&!E.stageDone(run)){putCard('P'+(k.charCodeAt(0)-96),ui.sel);return;}} // xếp thứ tự: A–D = vị trí 1–4
    else if((k==='a'||k==='b')&&ui.sel&&!E.stageDone(run)){putCard(k.toUpperCase(),ui.sel);return;}
    if(k==='escape'&&ui.sel){ui.sel=null;paint();return;}
    if(e.key==='Enter'&&e.target===document.body){e.preventDefault();proceed();return;}
    if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('.slot-drop[data-place]')){e.preventDefault();e.target.click();}
  };
  document.addEventListener('keydown',onKey);cleanups.push(()=>document.removeEventListener('keydown',onKey));
}

// Thẻ bay vào album: bản sao thẻ trượt từ chỗ cũ tới ô tương ứng trong album, ô album hiện ra khi thẻ đáp xuống
function flyToAlbum(flights){
  flights.forEach(({rect,key,delay=0})=>{
    const chip=document.querySelector(`[data-ab="${key}"]`);if(!chip)return;
    const done=()=>chip.classList.remove('is-incoming');
    if(reducedMotion()||!rect||!chip.animate){done();return;}
    const to=chip.getBoundingClientRect(),g=document.createElement('div');
    g.className='ev ev-fly';g.style.cssText=`left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px`;
    document.body.appendChild(g);
    const a=g.animate([{transform:'perspective(700px) translate(0px,0px) scale(1,1) rotateY(0deg)',opacity:1},{transform:`perspective(700px) translate(${to.left+to.width/2-rect.left-rect.width/2}px,${to.top+to.height/2-rect.top-rect.height/2}px) scale(${Math.max(.08,to.width/rect.width)},${Math.max(.08,to.height/rect.height)}) rotateY(360deg)`,opacity:.9}],{duration:720,delay,easing:'cubic-bezier(.65,0,.25,1)',fill:'both'});
    const fin=()=>{g.remove();done();};a.finished.then(fin,fin);setTimeout(fin,1100+delay); // dự phòng khi trình duyệt tạm dừng animation (tab nền)
  });
}

/* Áp dụng một thay đổi làm khóa ô (đúng / xem đáp án / bỏ qua): đo vị trí thẻ, đổi trạng thái, vẽ lại, bay thẻ vào album,
   rồi hiện lời giải nếu xong chặng. fn() thực hiện thay đổi và trả về true nếu có ô khóa thêm. */
function settle(slotsAffected,fn,openWhy){
  const st=E.stageOf(run),before=slotIds().filter(id=>st[id].locked);
  const rects={};slotsAffected.forEach(id=>{const el=app.querySelector(`.slot[data-slot="${id}"] .ev`)||app.querySelector(`.slot[data-slot="${id}"]`);if(el)rects[id]=el.getBoundingClientRect();});
  const ok=fn();if(ok===false)return;
  afterLock(before,rects,openWhy);
}
function afterLock(before,rects,openWhy,o={}){
  const st=E.stageOf(run),fresh=slotIds().filter(id=>st[id].locked&&!before.includes(id)),sc=E.sceneOf(run,D);
  if(openWhy)fresh.forEach(id=>{if(st[id].how==='revealed'||st[id].how==='skipped')ui.why[id]=st[id].how==='revealed';});
  fresh.forEach(id=>delete ui.msg[id]);
  const keys=fresh.map(id=>`${run.index}${id}`);
  paint(fresh);renderStrip({fresh:keys});
  if(fresh.length){
    sfx(o.snap?'ok':'snap');
    if(o.snap)snapIn(fresh[0],o.pts); // thẻ vừa thả đúng: khớp vào ô rồi mới bay vào album
    const late=o.snap?650:0;
    flyToAlbum(fresh.map((id,i)=>({rect:o.snap?app.querySelector(`.slot[data-slot="${id}"] .ev`)?.getBoundingClientRect():rects[id],key:keys[i],delay:late})));
    aimLamp(app.querySelector('.scene'));
  }
  if(o.bounce)bounceBack(o.bounce);
  if(E.stageDone(run)){
    $('feedback').innerHTML=UI.stageDone(D,run,{classMode:isClass()});
    const f=$('feedback');$('more').onclick=()=>openRecords('stage');enhance();aimLamp(f);f.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'nearest'});
  }
}

// Thẻ đúng vừa khóa: "cạch" khớp vào ô (CSS .is-snap) và con số điểm bay lên từ ô
function snapIn(slotId,pts){
  const el=app.querySelector(`.slot[data-slot="${slotId}"]`);if(!el)return;
  el.classList.add('is-snap');
  if(!pts||reducedMotion())return;
  const f=document.createElement('span');f.className='pts-float';f.setAttribute('aria-hidden','true');f.textContent='+'+pts;
  el.appendChild(f);setTimeout(()=>f.remove(),1100);
}

/* Thẻ thả sai: bản sao hiện ở ô, rung ngang rồi bay về chỗ cũ trong rổ (FLIP). Thẻ thật ở rổ ẩn tới khi bản sao đáp xuống.
   Giảm chuyển động: chỉ đánh dấu ô sai (viền đỏ có sẵn). */
function bounceBack({id,box,slot}){
  const real=cardEl(id);if(!real||!box||reducedMotion()||!real.animate)return;
  const to=real.getBoundingClientRect(),g=real.cloneNode(true);
  g.removeAttribute('data-card');g.classList.add('ev-fly','ev-fly--bad');
  g.style.cssText=`left:${box.left+12}px;top:${box.top+4}px;width:${to.width}px;height:${to.height}px`;
  document.body.appendChild(g);real.style.visibility='hidden';
  const dx=to.left-(box.left+12),dy=to.top-(box.top+4);
  const a=g.animate([
    {transform:'translateX(0)',offset:0},{transform:'translateX(-9px) rotate(-2deg)',offset:.12},{transform:'translateX(9px) rotate(2deg)',offset:.3},
    {transform:'translateX(-6px) rotate(-1deg)',offset:.46},{transform:'translateX(0)',offset:.6},
    {transform:`translate(${dx}px,${dy}px)`,offset:1}],{duration:680,easing:'cubic-bezier(.3,.7,.3,1)',fill:'forwards'});
  const fin=()=>{g.remove();real.style.visibility='';};a.finished.then(fin,fin);setTimeout(fin,1100);
}


/* ---------- Kiểu đúng/sai (chương III): 5 câu, 20 giây cho cả chặng (Lớp học: không tính giờ) ---------- */
let tfTimer=null;
const stopTfTimer=()=>{if(tfTimer){clearInterval(tfTimer);tfTimer=null;}};
function paintTf(){
  const t=E.stageOf(run).tf;
  $('tf').innerHTML=UI.tfView(D,run,{started:ui.tf.started,classMode:isClass(),left:ui.tf.left,last:ui.tf.last,secs:UI.tfSecs(D.scenes[run.index])});
  stageEl().classList.toggle('is-done',t.done);
  app.querySelector('.sheet')?.classList.toggle('is-done',t.done);
  const b=$('proceed');b.hidden=!t.done;
  b.textContent=run.index===D.scenes.length-1?'Xem kết thúc hành trình →':'Tiếp tục hành trình →';
  $('save-status').textContent='';
  if(!t.done)($('tf-start')||$('tf-true'))?.focus?.({preventScroll:true});
}
function startTf(){
  if(ui.tf.started||E.stageDone(run))return;
  sfx('click');
  const secs=UI.tfSecs(D.scenes[run.index]);
  ui.tf.started=true;ui.tf.left=secs;paintTf();
  if(isClass())return; // Lớp học: không tính giờ
  const t0=performance.now();
  tfTimer=setInterval(()=>{
    ui.tf.left=Math.max(0,secs-(performance.now()-t0)/1000);
    const clock=app.querySelector('.tf-clock'),out=$('tf-time');
    if(clock){clock.style.setProperty('--f',ui.tf.left/secs);clock.classList.toggle('is-low',ui.tf.left<=5);clock.setAttribute('aria-valuenow',Math.ceil(ui.tf.left));}
    if(out)out.textContent=Math.ceil(ui.tf.left);
    const sec=Math.ceil(ui.tf.left);if(sec<=5&&sec>0&&ui.tf.tick!==sec){ui.tf.tick=sec;sfx('tick');}
    if(ui.tf.left<=0){stopTfTimer();E.tfExpire(run,D);sfx('bad');finishTf();}
  },100);
  cleanups.push(stopTfTimer);
}
function answerTf(ans){
  if(!ui.tf.started||E.stageDone(run))return;
  const top=app.querySelector('.tf-top'),box=top&&top.getBoundingClientRect(),idx=E.stageOf(run).tf.i;
  const res=E.tfAnswer(run,D,ans);if(!res)return;
  sfx(res.ok?'ok':'bad');
  ui.tf.last=res;
  if(res.done){stopTfTimer();finishTf();}else{paintTf();renderStrip();}
  flyTf(top,box,idx,res.ok);
}
/* Phiếu vừa chấm đóng dấu rồi bay xuống khay "đã thẩm định" (bản sao bay, phiếu thật đã là phiếu kế tiếp) */
function flyTf(top,box,idx,ok){
  if(!top||!box||reducedMotion()||!top.animate)return;
  const slot=app.querySelector(`.tf-slip[data-slip="${idx}"]`);if(!slot)return;
  const to=slot.getBoundingClientRect(),g=top.cloneNode(true);
  g.removeAttribute('id');g.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
  g.classList.remove('is-drag');g.classList.add('tf-fly',ok?'is-ok':'is-bad');g.removeAttribute('data-top');g.setAttribute('aria-hidden','true');
  g.style.cssText=`left:${box.left}px;top:${box.top}px;width:${box.width}px;height:${box.height}px;transform:${top.style.transform||'none'}`;
  g.insertAdjacentHTML('beforeend',`<span class="tf-ink">${ok?'CHÍNH XÁC':'CHƯA ĐÚNG'}</span>`);
  document.body.appendChild(g);slot.style.visibility='hidden';
  const dx=to.left+to.width/2-(box.left+box.width/2),dy=to.top+to.height/2-(box.top+box.height/2),sc=Math.max(.08,to.width/box.width);
  const a=g.animate([{transform:g.style.transform,offset:0},{transform:'none',offset:.001},{transform:'none',offset:.42},{transform:`translate(${dx}px,${dy}px) scale(${sc}) rotate(-6deg)`,opacity:.9,offset:1}],{duration:900,easing:'cubic-bezier(.5,0,.3,1)',fill:'forwards'});
  const fin=()=>{g.remove();slot.style.visibility='';};a.finished.then(fin,fin);setTimeout(fin,1400);
}
function finishTf(){
  stopTfTimer();paintTf();renderStrip();
  $('feedback').innerHTML=UI.stageDone(D,run,{classMode:isClass()});
  const f=$('feedback');$('more').onclick=()=>openRecords('stage');enhance();aimLamp(f);f.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'nearest'});
}
function bindTf(){
  const root=stageEl();
  root.addEventListener('click',e=>{
    const t=e.target;
    if(t.closest?.('#tf-start')){startTf();return;}
    if(t.closest?.('#tf-true')){answerTf(true);return;}
    if(t.closest?.('#tf-false')){answerTf(false);return;}
    if(t.closest?.('#bonus-go'))startBonus();
  });
  const onKey=e=>{
    if(e.ctrlKey||e.metaKey||e.altKey||document.querySelector('dialog[open]')||e.target.closest?.('input,textarea'))return;
    const k=e.key.toLowerCase();
    if(E.stageDone(run)){if(e.key==='Enter'&&e.target===document.body){e.preventDefault();proceed();}return;}
    if(!ui.tf.started){if(e.key==='Enter'&&e.target===document.body){e.preventDefault();startTf();}return;}
    if(e.key==='ArrowLeft'||k==='s'){e.preventDefault();answerTf(false);}
    else if(e.key==='ArrowRight'||k==='d'){e.preventDefault();answerTf(true);}
  };
  document.addEventListener('keydown',onKey);cleanups.push(()=>document.removeEventListener('keydown',onKey));
  // Kéo phiếu (chuột hoặc cảm ứng): sang trái = SAI, sang phải = ĐÚNG; kéo quá 100px thì chốt
  let drag=null;
  root.addEventListener('pointerdown',e=>{
    const top=e.target.closest?.('.tf-top[data-top]');if(!top||!ui.tf.started||E.stageDone(run)||e.button>0)return;
    drag={top,x:e.clientX,id:e.pointerId,dx:0};top.classList.add('is-drag');try{top.setPointerCapture(e.pointerId);}catch{}
  });
  root.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    drag.dx=e.clientX-drag.x;const k=Math.max(-1,Math.min(1,drag.dx/120));
    drag.top.style.transform=`translateX(${drag.dx}px) rotate(${drag.dx/22}deg)`;
    drag.top.querySelector('.tf-hint--yes').style.opacity=Math.max(0,k);drag.top.querySelector('.tf-hint--no').style.opacity=Math.max(0,-k);
  });
  const endDrag=e=>{
    if(!drag||e.pointerId!==drag.id)return;
    const {top,dx}=drag;drag=null;top.classList.remove('is-drag');
    if(Math.abs(dx)>100){answerTf(dx>0);return;}
    top.style.transform='';top.querySelectorAll('.tf-hint').forEach(h=>{h.style.opacity='';});
  };
  root.addEventListener('pointerup',endDrag);root.addEventListener('pointercancel',endDrag);
}

/* ---------- Màn trùm (chặng 9): kéo 4 thẻ bằng chứng vào rổ ---------- */
function paintBoss(){
  const b=E.stageOf(run).boss;
  $('boss').innerHTML=UI.bossView(D,run,{nudge:ui.nudge});
  stageEl().classList.toggle('is-done',b.done);
  app.querySelector('.sheet')?.classList.toggle('is-done',b.done);
  const p=$('proceed');p.hidden=!b.done;p.textContent='Xem kết thúc hành trình →';
  $('save-status').textContent='';
}
// Thẻ bay (FLIP) từ khung `from` tới chỗ mới của nó sau khi vẽ lại; rổ nhún khi nhận thẻ
function flyBoss(key,from,intoBasket){
  const el=app.querySelector(`.ev[data-boss="${key}"]`);if(!el||!from||reducedMotion()||!el.animate)return;
  const to=el.getBoundingClientRect(),dx=from.left-to.left,dy=from.top-to.top;
  el.animate([{transform:`translate(${dx}px,${dy}px) rotate(-4deg) scale(${from.width/to.width||1})`,zIndex:5},{transform:'none',zIndex:5}],{duration:460,easing:'cubic-bezier(.2,.9,.25,1)'});
  if(intoBasket){const bk=$('basket');bk?.animate?.([{transform:'scale(1)'},{transform:'scale(.98)',offset:.6},{transform:'scale(1)'}],{duration:520,easing:'ease-out'});}
}
function bossMove(key,fn,from){
  const el=app.querySelector(`.ev[data-boss="${key}"]`);from=from||el?.getBoundingClientRect();
  if(!fn())return false;
  ui.nudge=false;sfx('snap');paintBoss();
  flyBoss(key,from,E.stageOf(run).boss.picked.includes(key));
  return true;
}
function submitBoss(){
  const res=E.bossSubmit(run,D);
  if(!res){ui.nudge=true;paintBoss();return;}
  sfx(res.ok===E.BOSS_PICK?'ok':'bad');paintBoss();renderStrip();
  $('feedback').innerHTML=UI.stageDone(D,run,{classMode:isClass()});
  const f=$('feedback');$('more').onclick=()=>openRecords('stage');enhance();aimLamp(f);f.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'nearest'});
}
function bindBoss(){
  const root=stageEl();
  const inBasket=key=>E.stageOf(run).boss.picked.includes(key);
  const swallowed=pointerDrag(root,{
    itemSel:'.ev[data-boss]:not([disabled])',idOf:el=>el.dataset.boss,dropSel:'[data-bin]',
    onDrop:(t,key,rect)=>bossMove(key,()=>E.bossPlace(run,D,key,Number(t.dataset.bin)),rect),
    onMiss:(key,rect)=>{if(inBasket(key))bossMove(key,()=>E.bossToggle(run,D,key),rect);}
  });
  root.addEventListener('click',e=>{
    if(swallowed())return;
    const pick=e.target.closest?.('.ev[data-boss]');
    if(pick){
      if(pick.disabled)return;
      const key=pick.dataset.boss;
      if(!bossMove(key,()=>E.bossToggle(run,D,key))){ui.nudge=true;paintBoss();}
      app.querySelector(`.ev[data-boss="${key}"]`)?.focus?.({preventScroll:true});return;
    }
    if(e.target.closest?.('#boss-submit')){submitBoss();return;}
    if(e.target.closest?.('#bonus-go'))startBonus();
  });
  const onKey=e=>{
    if(e.ctrlKey||e.metaKey||e.altKey||document.querySelector('dialog[open]')||e.target.closest?.('input,textarea'))return;
    const done=E.stageDone(run);
    if(/^[1-8]$/.test(e.key)&&!done){const it=E.bossPoolOf(run,D)[Number(e.key)-1];if(it){const key=it.key;if(!bossMove(key,()=>E.bossToggle(run,D,key))){ui.nudge=true;paintBoss();}app.querySelector(`.ev[data-boss="${key}"]`)?.focus?.({preventScroll:true});}return;}
    if(e.key==='Enter'&&e.target===document.body){e.preventDefault();if(done)proceed();else submitBoss();}
  };
  document.addEventListener('keydown',onKey);cleanups.push(()=>document.removeEventListener('keydown',onKey));
}

// Gợi ý thủ công (lớp học: MC bấm). Nấc 3 hiện đáp án.
function giveHint(slot){
  const st=E.stageOf(run)[slot];if(st.locked)return;
  const before=slotIds().filter(id=>E.stageOf(run)[id].locked),rects={};
  const el=app.querySelector(`.slot[data-slot="${slot}"]`);if(el)rects[slot]=el.getBoundingClientRect();
  const h=E.hint(run,slot,D);if(!h)return;
  sfx('hint');
  if(h.tier===3){afterLock(before,rects,true);return;}
  ui.msg[slot]={tier:h.tier,text:h.text};
  if(ui.sel&&E.isFaded(run,ui.sel))ui.sel=null;
  paint();
}

// "Tiếp tục hành trình": chỉ có tác dụng khi chặng đã xong (các ô được chấm ngay lúc thả thẻ)
function proceed(){
  if(!E.stageDone(run))return;
  sfx('click');
  if(run.resume!=null){const ch=D.scenes[run.index].chapter;E.finishReplay(run);summary(ch);return;} // chơi lại xong: về tổng kết chương
  next();
}

// "Bỏ qua, ôn lại sau": mọi ô chưa đúng được khóa với 0 điểm và vào danh sách ôn ở màn kết
function skipStage(){
  const open=slotIds().filter(id=>!E.stageOf(run)[id].locked);if(!open.length)return;
  sfx('click');
  settle(open,()=>{open.forEach(id=>E.skip(run,id,D));return true;},true);
}

function next(){
  const s=E.sceneOf(run,D),prevIdx=run.index;E.advance(run,D);
  if(run.finished){ending();return;}
  if(D.scenes[run.index].chapter!==s.chapter)summary(s.chapter);else voyage(prevIdx,play);
}

// Tổng kết cuối chương: album của chương + điểm chương (thay cho câu hỏi cuối chương cũ)
function summary(chapter){show(()=>{
  setAct(String(chapter+1));const enter=!app.querySelector('.sheet');
  app.innerHTML=UI.chapterSummary(D,run,chapter,{enter});renderStrip();setBright(false);aimLamp(app.querySelector('.chapter-break'));
  $('next').onclick=()=>{sfx('click');chapterIntro(chapter+1);};$('next').focus?.({preventScroll:true});scroll();sfx('win');
  bindShelf();
  // Rê chuột vào mốc ↔ ghim: cùng data-stage thì cùng sáng
  const hot=(stage,on)=>app.querySelectorAll(`[data-stage="${stage}"]`).forEach(e=>e.classList.toggle('is-hot',on));
  const hotBox=(stage,on)=>app.querySelectorAll('[data-cluster]').forEach(e=>{if(e.dataset.cluster.split(',').includes(String(stage)))e.classList.toggle('is-hot',on);});
  const cb=app.querySelector('.chapter-break--map');
  if(cb){
    cb.addEventListener('mouseover',e=>{const t=e.target.closest?.('[data-stage]');if(t){hot(t.dataset.stage,true);hotBox(t.dataset.stage,true);}});
    cb.addEventListener('mouseout',e=>{const t=e.target.closest?.('[data-stage]');if(t){hot(t.dataset.stage,false);hotBox(t.dataset.stage,false);}});
  }
  app.querySelectorAll('[data-retry-stage]').forEach(b=>b.onclick=()=>{if(E.retryStage(run,Number(b.dataset.retryStage)))play();});
});}

// Thẻ sưu tầm: chạm để lật mặt sau (aria-pressed = đang xem mặt sau)
function bindShelf(){
  app.querySelectorAll('[data-coll]').forEach(b=>b.onclick=()=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);b.classList.toggle('is-flipped',on);sfx('snap');});
}

// Câu thưởng chặng 9 (chế độ Lớp học): đếm ngược 1 phút
function startBonus(){
  const out=$('bonus-time'),btn=$('bonus-go');if(!out||btn.dataset.running)return;
  btn.dataset.running='1';btn.disabled=true;let left=60;
  const fmt=n=>`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
  const t=setInterval(()=>{left--;out.textContent=left>0?fmt(left):'Hết giờ';if(left<=0){clearInterval(t);sfx('ok');btn.disabled=false;btn.textContent='Bắt đầu lại';delete btn.dataset.running;out.textContent='Hết giờ';left=60;}},1000);
  cleanups.push(()=>clearInterval(t));
}

// Phiếu ghi điểm (chế độ Lớp học): hộp thoại bảng chặng × team, tổng tự cộng, in được
function openScoresheet(){
  const dlg=$('scoresheet');dlg.innerHTML=UI.scoresheet(D);
  const sums=()=>dlg.querySelectorAll('[data-sum]').forEach(c=>{const t=c.dataset.sum;c.textContent=[...dlg.querySelectorAll(`input[data-team="${t}"]`)].reduce((a,i)=>a+(parseInt(i.value,10)||0),0);});
  // Lưu điểm vào localStorage: tự lưu mỗi lần nhập, nút "Lưu phiếu" lưu và báo đã lưu
  const KEY='vnr202-scoresheet',inputs=[...dlg.querySelectorAll('input[data-team]')],cell=i=>i.dataset.row+':'+i.dataset.team;
  let saved={};try{saved=JSON.parse(localStorage.getItem(KEY))||{};}catch{}
  inputs.forEach(i=>{i.value=saved[cell(i)]||'';});
  const save=()=>{const m={};inputs.forEach(i=>{if(i.value.trim())m[cell(i)]=i.value.trim();});try{localStorage.setItem(KEY,JSON.stringify(m));return true;}catch{return false;}};
  const saveBtn=$('sheet-save');let tm;
  dlg.oninput=()=>{sums();save();};
  saveBtn.onclick=()=>{const ok=save();saveBtn.textContent=ok?'Đã lưu ✓':'Không lưu được';clearTimeout(tm);tm=setTimeout(()=>{saveBtn.textContent='Lưu phiếu';},1800);};
  sums();
  $('sheet-close').onclick=()=>{save();dlg.close();};$('sheet-print').onclick=()=>window.print();
  dlg.showModal();paperSound();
}

/* ---------- Màn kết: đoạn phim cờ / Tuyên ngôn / Quốc ca (bản trước merge), rồi trang điểm ---------- */
function ending(){
  if(storyEnding.isActive())return;
  BGM.stop(1500);hideStrip();setAct('finale');setBright(true);storyEnding.start();
}

function endingResults(){show(()=>{
  setAct('finale');sfx('win');app.innerHTML=UI.ending(D,run,{enter:false});
  // tuyến 9 chặng sáng đủ lần lượt, quầng đèn sáng hơn, điểm chạy từ 0 lên
  renderStrip({seq:true});setBright(true);aimLamp(app.querySelector('.end-hero'));
  const out=$('final-score'),total=E.score(run);
  if(out&&!reducedMotion()&&total>0){const t0=performance.now();const step=t=>{const k=Math.min(1,(t-t0)/1200);out.textContent=Math.round(total*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step);};out.textContent='0';requestAnimationFrame(step);}
  bindShelf();
  $('end-records').onclick=()=>openRecords('all');
  $('open-scoresheet')&&($('open-scoresheet').onclick=openScoresheet);
  $('replay-ending')&&($('replay-ending').onclick=()=>storyEnding.start());
  $('replay').onclick=()=>{storyEnding.stopBackgroundMusic();run=E.newRun(run.mode);chapterIntro(0);};
  scroll();});}
$('sheet-btn')&&($('sheet-btn').onclick=openScoresheet);
/* Ctrl + ←/→: đi qua đi lại giữa các chặng chỉ để xem giao diện. Chạy ở mọi bản (kể cả bản deploy) vì không ảnh hưởng điểm. Chỉ đổi run.index, không chạm điểm, đáp án, album hay chuỗi đúng. */
document.addEventListener('keydown',e=>{
  if((e.key!=='ArrowLeft'&&e.key!=='ArrowRight')||!e.ctrlKey||e.repeat||e.metaKey||e.altKey||e.shiftKey)return;
  if(document.querySelector('dialog[open]')||e.target.closest?.('input,textarea,select,[contenteditable="true"]'))return;
  if(storyEnding.isActive())return;
  e.preventDefault();e.stopImmediatePropagation();
  const to=Math.max(0,Math.min(D.scenes.length-1,run.index+(e.key==='ArrowLeft'?-1:1)));
  if(to===run.index&&app.querySelector('.sheet .stage,.sheet .tf'))return;
  const cur=run.stages[run.index];if(cur?.boss&&!cur.boss.done)cur.boss.pool=null; // bộ thẻ trùm tính từ album: rời đi thì bỏ để lúc chơi thật tính lại cho đúng
  run.index=to;play();
},true);
/* Từ landing: tấm ảnh đang bay (index.html bấm nút → sessionStorage 'enter-photo', hanh-trinh.html dựng lại ở đầu <body>) bay nốt vào ô ảnh
   của màn mở chương. FLIP: đo ô ảnh rồi animate transform (dịch + xoay + co/giãn đều) ~0,95s; chữ và đầu trang hiện dần từ giữa chặng bay;
   đáp xuống thì ảnh thật thế chỗ ngay (cùng khung, cùng duotone) và bỏ hiệu ứng rửa ảnh để không chớp. Không có JS/animate: ảnh thật hiện luôn. */
function landPhoto(){
  const h=document.documentElement,f=$('flyer'),d=window.__ep,fig=app.querySelector('.intro-media .photo');
  if(!d)return; // không đến từ landing bằng ảnh bay
  if(fig)fig.classList.add('no-dev');
  let ended=false;
  const end=()=>{if(ended)return;ended=true;f?.remove();h.classList.add('ep-in','ep-done');setTimeout(()=>h.classList.remove('ep','ep-in','ep-done'),800);};
  if(!f||!d||!fig||reducedMotion()||!f.animate){end();return;}
  const r=fig.getBoundingClientRect(),fh=f.offsetHeight,k=fig.offsetWidth/d.fw;
  const at=(x,y,rot,sc)=>`translate(${x-d.fw/2}px,${y-fh/2}px) rotate(${rot}deg) scale(${sc})`;
  const a=f.animate([{transform:at(d.cx,d.cy,d.rot,1)},{transform:at(r.left+r.width/2,r.top+r.height/2,-1,k)}],{duration:950,easing:'cubic-bezier(.65,0,.25,1)',fill:'forwards'});
  setTimeout(()=>h.classList.add('ep-in'),350);
  a.finished.then(end,end);
}

// Vào thẳng chương 1 (landing ở index.html đã là màn chào)
document.body.dataset.mode=run.mode;chapterIntro(0);landPhoto();})();
