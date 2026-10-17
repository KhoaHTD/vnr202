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
let ui={sel:null,msg:{},why:{}},sound=false,audio;
// Chỉ để test (check.cjs) đọc trạng thái lượt chơi; game không lưu ở đâu cả
window.GameDebug={state:()=>run,ui:()=>ui};

// Tiện ích nhỏ
const $=id=>document.getElementById(id);
const reducedMotion=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
// Âm thanh: chỉ phát khi người chơi bật nút loa. tone = tiếng "tích" ngắn, paperSound = tiếng lật giấy
function tone(){if(!sound)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=440;g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.15);o.start();o.stop(audio.currentTime+.15);}catch{}}
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
let cleanups=[]; // việc cần gỡ khi rời màn (ví dụ listener bàn phím của màn mở chương)
function show(build){
  cleanups.forEach(f=>f());cleanups=[];
  const run=()=>{build();enhance();};
  if(!useVT||!app.childElementCount){run();return;}
  const t=document.startViewTransition(run);
  t.ready.catch(()=>{});t.finished.catch(()=>{}); // chuyển màn bị hủy (ví dụ đổi kích thước cửa sổ) thì bỏ qua, màn mới vẫn hiện
}
// Gọi cb một lần khi phần tử vào khung nhìn (không có IntersectionObserver thì gọi ngay)
function whenVisible(el,cb){
  if(!window.IntersectionObserver){cb();return;}
  const io=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){io.disconnect();cb();}},{rootMargin:'0px 0px -8% 0px'});
  io.observe(el);
}
// Sau khi dựng màn: bật "rửa ảnh" khi ảnh đã tải xong và đã nhìn thấy; bật hiện-khi-cuộn
function enhance(){
  app.querySelectorAll('[data-develop]').forEach(fig=>{
    const img=fig.querySelector('img');if(!img)return;
    const on=()=>whenVisible(fig,()=>fig.classList.add('is-on'));
    img.decode?img.decode().then(on,on):on(); // ảnh lỗi vẫn bật để không kẹt ở trạng thái ẩn
  });
  app.querySelectorAll('[data-reveal]').forEach(el=>whenVisible(el,()=>el.classList.add('is-in')));
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
$('sound').onclick=e=>{sound=!sound;const b=e.currentTarget;b.innerHTML=UI.icon(sound?'sound':'mute');b.setAttribute('aria-pressed',sound);tone();};
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

/* ---------- Các màn ---------- */
// Màn mở đầu chương: không tự chuyển; bấm nút, Enter hoặc phím → để vào chương. Chương 1 có công tắc chế độ Lớp học.
function chapterIntro(chapter){show(()=>{
  setAct(String(chapter+1));hideStrip();setBright(false);app.innerHTML=UI.chapterIntro(D,chapter,run);aimLamp(app.querySelector('.intro-media'));scroll();
  const onKey=e=>{if((e.key==='Enter'||e.key==='ArrowRight')&&!e.target.closest?.('input,button')&&!document.querySelector('dialog[open]')){e.preventDefault();go();}};
  const go=()=>{document.removeEventListener('keydown',onKey);play();};
  document.addEventListener('keydown',onKey);cleanups.push(()=>document.removeEventListener('keydown',onKey));
  const sw=$('mode-class');if(sw)sw.onchange=()=>setMode(sw.checked?'class':'solo');
  $('chapter-go').onclick=e=>{e?.preventDefault?.();go();};
  $('chapter-go').focus?.({preventScroll:true});
});}

const SLOTS=E.SLOT_IDS;
const stageEl=()=>$('stage');
const cardEl=id=>app.querySelector(`.ev[data-card="${id}"]`);
const isClass=()=>run.mode==='class';

// Vẽ lại ba vùng phụ thuộc trạng thái (ô, rổ, điểm nóng) + nút + dòng trạng thái. fresh = các ô vừa đúng (chạy hiệu ứng một lần).
function paint(fresh=[]){
  const done=E.stageDone(run),st=E.stageOf(run);
  $('slots').innerHTML=UI.slots(D,run,{sel:ui.sel,msg:ui.msg,why:ui.why,classMode:isClass()});
  const hh=UI.hints(D,run,{msg:ui.msg,why:ui.why,classMode:isClass()});$('hints').innerHTML=hh;$('hints').hidden=!hh;
  $('tray').innerHTML=UI.tray(D,run,{sel:ui.sel});
  $('spots').innerHTML=UI.spots(D,run,{sel:ui.sel,fresh});
  $('scene').dataset.lit=SLOTS.filter(id=>st[id].locked).length;
  stageEl().classList.toggle('is-done',done);
  app.querySelector('.sheet')?.classList.toggle('is-done',done);
  const c=ui.sel?E.cardOf(E.sceneOf(run,D),ui.sel):null;
  $('save-status').classList.remove('is-wrong');
  $('save-status').textContent=c&&!done?`Đã chọn thẻ “${c.name}”. Chạm vào tình huống để đặt.`:'';
  const b=$('commit');b.disabled=!done&&!E.canDeploy(run);
  b.textContent=done?(run.index===D.scenes.length-1?'Xem kết thúc hành trình →':'Tiếp tục hành trình →'):'Triển khai →';
  $('skip').hidden=done;
}

// Màn chơi một chặng
function play(){if(run.index>=D.scenes.length){ending();return;}show(()=>{
  ui={sel:null,msg:{},why:{}};const s=D.scenes[run.index];setAct(run.index===8?'finale':String(s.chapter+1));
  const enter=!app.querySelector('.sheet'); // tờ bản đồ chỉ trượt vào khi vừa vào chương, không trượt lại ở mỗi chặng
  app.innerHTML=UI.play(D,run,{enter});setBright(false);document.body.dataset.mode=run.mode;
  renderStrip();paint();aimLamp(app.querySelector('.stage-main'));
  $('more').onclick=()=>openRecords('stage');
  $('commit').onclick=commit;$('skip').onclick=skipStage;
  bindStage();scroll();});}

// Đặt thẻ đang chọn (hoặc thẻ kéo) vào ô
function putCard(slot,id){
  if(!E.place(run,slot,id,D))return false;
  ui.sel=null;delete ui.msg[slot];tone();paint();
  app.querySelector(`.slot[data-slot="${slot}"] .ev`)?.focus?.({preventScroll:true});
  return true;
}
function takeCard(id){ // kéo thẻ ra khỏi ô về rổ
  for(const sl of SLOTS){const s=E.stageOf(run)[sl];if(!s.locked&&s.cardId===id){E.unplace(run,sl);ui.sel=null;paint();return true;}}
  return false;
}

/* Kéo thả bằng Pointer Events (chuột, bút, cảm ứng): kéo >6px mới tính là kéo; dưới ngưỡng là bấm (chạm chọn rồi chạm ô).
   Thả lên ô/điểm nóng thì đặt thẻ; thả ra ngoài thì thẻ từ ô trở về rổ, thẻ từ rổ đứng yên. */
function bindStage(){
  const root=stageEl();let drag=null,swallow=false;
  const dropAt=(x,y)=>document.elementFromPoint(x,y)?.closest?.('[data-drop]')||null;
  const clearOver=()=>app.querySelectorAll('.is-over').forEach(e=>e.classList.remove('is-over'));
  const move=e=>{
    if(!drag||e.pointerId!==drag.pid)return;
    if(!drag.on){
      if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<6)return;
      drag.on=true;const r=drag.el.getBoundingClientRect();
      drag.dx=drag.x-r.left;drag.dy=drag.y-r.top;
      drag.ghost=drag.el.cloneNode(true);drag.ghost.classList.add('ev-ghost');drag.ghost.style.width=r.width+'px';drag.ghost.removeAttribute('data-card');
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
    d.ghost.remove();document.body.classList.remove('is-dragging');clearOver();
    const t=e.type==='pointerup'?dropAt(e.clientX,e.clientY):null;
    if(t&&putCard(t.dataset.drop,d.id))return;
    if(!t&&d.el.classList.contains('ev--placed')){takeCard(d.id);return;}
    d.el.classList.remove('is-dragging');
  };
  root.addEventListener('pointerdown',e=>{
    if(e.button>0||!e.isPrimary)return;
    const el=e.target.closest?.('.ev[data-card]');if(!el||el.classList.contains('is-faded'))return;
    drag={el,id:el.dataset.card,pid:e.pointerId,x:e.clientX,y:e.clientY,on:false};
    document.addEventListener('pointermove',move);document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
  });
  root.addEventListener('click',e=>{
    if(swallow)return;
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
    if((k==='a'||k==='b')&&ui.sel&&!E.stageDone(run)){putCard(k.toUpperCase(),ui.sel);return;}
    if(k==='escape'&&ui.sel){ui.sel=null;paint();return;}
    if(e.key==='Enter'&&e.target===document.body){e.preventDefault();commit();return;}
    if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('.slot-drop[data-place]')){e.preventDefault();e.target.click();}
  };
  document.addEventListener('keydown',onKey);cleanups.push(()=>document.removeEventListener('keydown',onKey));
}

// Thẻ bay vào album: bản sao thẻ trượt từ chỗ cũ tới ô tương ứng trong album, ô album hiện ra khi thẻ đáp xuống
function flyToAlbum(flights){
  flights.forEach(({rect,key})=>{
    const chip=document.querySelector(`[data-ab="${key}"]`);if(!chip)return;
    const done=()=>chip.classList.remove('is-incoming');
    if(reducedMotion()||!rect||!chip.animate){done();return;}
    const to=chip.getBoundingClientRect(),g=document.createElement('div');
    g.className='ev ev-fly';g.style.cssText=`left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px`;
    document.body.appendChild(g);
    const a=g.animate([{transform:'none',opacity:1},{transform:`translate(${to.left+to.width/2-rect.left-rect.width/2}px,${to.top+to.height/2-rect.top-rect.height/2}px) scale(${Math.max(.08,to.width/rect.width)},${Math.max(.08,to.height/rect.height)})`,opacity:.9}],{duration:720,easing:'cubic-bezier(.65,0,.25,1)',fill:'forwards'});
    const fin=()=>{g.remove();done();};a.finished.then(fin,fin);setTimeout(fin,1100); // dự phòng khi trình duyệt tạm dừng animation (tab nền)
  });
}

/* Áp dụng một thay đổi làm khóa ô (đúng / xem đáp án / bỏ qua): đo vị trí thẻ, đổi trạng thái, vẽ lại, bay thẻ vào album,
   rồi hiện lời giải nếu xong chặng. fn() thực hiện thay đổi và trả về true nếu có ô khóa thêm. */
function settle(slotsAffected,fn,openWhy){
  const st=E.stageOf(run),before=SLOTS.filter(id=>st[id].locked);
  const rects={};slotsAffected.forEach(id=>{const el=app.querySelector(`.slot[data-slot="${id}"] .ev`)||app.querySelector(`.slot[data-slot="${id}"]`);if(el)rects[id]=el.getBoundingClientRect();});
  const ok=fn();if(ok===false)return;
  afterLock(before,rects,openWhy);
}
function afterLock(before,rects,openWhy){
  const st=E.stageOf(run),fresh=SLOTS.filter(id=>st[id].locked&&!before.includes(id)),sc=E.sceneOf(run,D);
  if(openWhy)fresh.forEach(id=>{if(st[id].how==='revealed'||st[id].how==='skipped')ui.why[id]=st[id].how==='revealed';});
  fresh.forEach(id=>delete ui.msg[id]);
  const keys=fresh.map(id=>`${run.index}${id}`);
  paint(fresh);renderStrip({fresh:keys});
  if(fresh.length){tone();flyToAlbum(fresh.map((id,i)=>({rect:rects[id],key:keys[i]})));aimLamp(app.querySelector('.scene'));}
  if(E.stageDone(run)){
    $('feedback').innerHTML=UI.stageDone(D,run,{classMode:isClass()});
    const f=$('feedback');enhance();aimLamp(f);f.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'nearest'});
  }
}

// Gợi ý thủ công (lớp học: MC bấm). Nấc 3 hiện đáp án.
function giveHint(slot){
  const st=E.stageOf(run)[slot];if(st.locked)return;
  const before=SLOTS.filter(id=>E.stageOf(run)[id].locked),rects={};
  const el=app.querySelector(`.slot[data-slot="${slot}"]`);if(el)rects[slot]=el.getBoundingClientRect();
  const h=E.hint(run,slot,D);if(!h)return;
  if(h.tier===3){afterLock(before,rects,true);return;}
  ui.msg[slot]={tier:h.tier,text:h.text};
  if(ui.sel&&E.isFaded(run,ui.sel))ui.sel=null;
  paint();
}

// Bấm "Triển khai": chấm các ô chưa khóa. Đúng → khóa + bay vào album. Sai → thẻ về rổ + gợi ý (tự động khi chơi một mình).
function commit(){
  if(E.stageDone(run)){next();return;}
  if(!E.canDeploy(run))return;
  const st=E.stageOf(run),before=SLOTS.filter(id=>st[id].locked),rects={};
  SLOTS.filter(id=>!st[id].locked).forEach(id=>{const el=app.querySelector(`.slot[data-slot="${id}"] .ev`);if(el)rects[id]=el.getBoundingClientRect();});
  const res=E.evaluate(run,D);
  res.forEach(r=>{
    if(r.correct)return;
    if(isClass())ui.msg[r.slot]={tier:0,text:''};
    else{const h=E.hint(run,r.slot,D);ui.msg[r.slot]={tier:h.tier,text:h.text};}
  });
  if(ui.sel&&E.isFaded(run,ui.sel))ui.sel=null;
  afterLock(before,rects,true);
}

// "Bỏ qua, ôn lại sau": mọi ô chưa đúng được khóa với 0 điểm và vào danh sách ôn ở màn kết
function skipStage(){
  const open=SLOTS.filter(id=>!E.stageOf(run)[id].locked);if(!open.length)return;
  settle(open,()=>{open.forEach(id=>E.skip(run,id,D));return true;},true);
}

function next(){
  const s=E.sceneOf(run,D);E.advance(run,D);
  if(run.finished){ending();return;}
  if(D.scenes[run.index].chapter!==s.chapter)summary(s.chapter);else play();
}

// Tổng kết cuối chương: album của chương + điểm chương (thay cho câu hỏi cuối chương cũ)
function summary(chapter){show(()=>{
  setAct(String(chapter+1));const enter=!app.querySelector('.sheet');
  app.innerHTML=UI.chapterSummary(D,run,chapter,{enter});renderStrip();setBright(false);aimLamp(app.querySelector('.chapter-break'));
  $('next').onclick=()=>chapterIntro(chapter+1);$('next').focus?.({preventScroll:true});scroll();
});}

// Câu thưởng chặng 9 (chế độ Lớp học): đếm ngược 1 phút
function startBonus(){
  const out=$('bonus-time'),btn=$('bonus-go');if(!out||btn.dataset.running)return;
  btn.dataset.running='1';btn.disabled=true;let left=60;
  const fmt=n=>`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
  const t=setInterval(()=>{left--;out.textContent=left>0?fmt(left):'Hết giờ';if(left<=0){clearInterval(t);tone();btn.disabled=false;btn.textContent='Bắt đầu lại';delete btn.dataset.running;out.textContent='Hết giờ';left=60;}},1000);
  cleanups.push(()=>clearInterval(t));
}

// Phiếu ghi điểm (chế độ Lớp học): hộp thoại bảng chặng × team, tổng tự cộng, in được
function openScoresheet(){
  const dlg=$('scoresheet');dlg.innerHTML=UI.scoresheet(D);
  const sums=()=>dlg.querySelectorAll('[data-sum]').forEach(c=>{const t=c.dataset.sum;c.textContent=[...dlg.querySelectorAll(`input[data-team="${t}"]`)].reduce((a,i)=>a+(parseInt(i.value,10)||0),0);});
  dlg.oninput=sums;
  $('sheet-close').onclick=()=>dlg.close();$('sheet-print').onclick=()=>window.print();
  dlg.showModal();paperSound();
}

// Màn kết
function ending(){show(()=>{
  setAct('finale');const enter=!app.querySelector('.sheet');app.innerHTML=UI.ending(D,run,{enter});
  // Màn kết: tuyến 9 chặng sáng đủ lần lượt, quầng đèn sáng hơn, điểm chạy từ 0 lên, ảnh Ba Đình hiện
  renderStrip({seq:true});setBright(true);aimLamp(app.querySelector('.end-hero'));
  const out=$('final-score'),total=E.score(run);
  if(out&&!reducedMotion()&&total>0){const t0=performance.now();const step=t=>{const k=Math.min(1,(t-t0)/1200);out.textContent=Math.round(total*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step);};out.textContent='0';requestAnimationFrame(step);}
  $('end-records').onclick=()=>openRecords('all');
  $('open-scoresheet')&&($('open-scoresheet').onclick=openScoresheet);
  $('replay').onclick=()=>{run=E.newRun(run.mode);chapterIntro(0);};
  scroll();});}
$('sheet-btn')&&($('sheet-btn').onclick=openScoresheet);

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
