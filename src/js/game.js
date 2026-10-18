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
const storyEnding=window.StoryEnding.create({onFinish:()=>endingResults()});
// Chỉ để test (check.cjs) đọc trạng thái lượt chơi; game không lưu ở đâu cả
window.GameDebug={state:()=>run,ui:()=>ui,ending:()=>storyEnding.state()};

// Tiện ích nhỏ
const $=id=>document.getElementById(id);
const reducedMotion=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
// Âm thanh: chỉ phát khi người chơi bật nút loa. tone = tiếng "tích" ngắn, paperSound = tiếng lật giấy
/* Âm ngắn (chỉ khi người chơi bật Âm thanh): snap = thẻ khớp, ok = đúng, bad = sai. Dao động đơn, 40–180ms, nhỏ tiếng. */
function sfx(kind){
  if(!sound)return;
  const notes={snap:[[220,.04,'square',.02]],ok:[[523,.07,'sine',.05],[784,.12,'sine',.05]],bad:[[190,.14,'sawtooth',.03]]}[kind];
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
let cleanups=[]; // việc cần gỡ khi rời màn (ví dụ listener bàn phím của màn mở chương)
function show(build,kind){
  cleanups.forEach(f=>f());cleanups=[];
  const run=()=>{build();enhance();};
  if(!useVT||!app.childElementCount){run();return;}
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
  const leg=!!app.querySelector('.sheet .stage'); // đang ở một chặng khác thì đổi tờ; từ màn mở chương/tổng kết vào thì giữ cách cũ
  show(()=>{
  ui={sel:null,msg:{},why:{},tf:{started:false,left:UI.TF_SECONDS}};const s=D.scenes[run.index];setAct(run.index===8?'finale':String(s.chapter+1));
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
  $('tf').innerHTML=UI.tfView(D,run,{started:ui.tf.started,classMode:isClass(),left:ui.tf.left});
  stageEl().classList.toggle('is-done',t.done);
  app.querySelector('.sheet')?.classList.toggle('is-done',t.done);
  const b=$('proceed');b.hidden=!t.done;
  b.textContent=run.index===D.scenes.length-1?'Xem kết thúc hành trình →':'Tiếp tục hành trình →';
  $('save-status').textContent='';
  if(!t.done)($('tf-start')||$('tf-true'))?.focus?.({preventScroll:true});
}
function startTf(){
  if(ui.tf.started||E.stageDone(run))return;
  ui.tf.started=true;ui.tf.left=UI.TF_SECONDS;paintTf();
  if(isClass())return; // Lớp học: không tính giờ
  const t0=performance.now();
  tfTimer=setInterval(()=>{
    ui.tf.left=Math.max(0,UI.TF_SECONDS-(performance.now()-t0)/1000);
    const bar=app.querySelector('.tf-bar i'),out=$('tf-time');
    if(bar)bar.style.transform=`scaleX(${ui.tf.left/UI.TF_SECONDS})`;
    if(out)out.textContent=Math.ceil(ui.tf.left);
    if(ui.tf.left<=0){stopTfTimer();E.tfExpire(run,D);sfx('bad');finishTf();}
  },100);
  cleanups.push(stopTfTimer);
}
function answerTf(ans){
  if(!ui.tf.started||E.stageDone(run))return;
  const res=E.tfAnswer(run,D,ans);if(!res)return;
  sfx(res.ok?'ok':'bad');
  if(res.done){stopTfTimer();finishTf();}else{paintTf();renderStrip();}
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
}

/* ---------- Màn trùm (chặng 9): chọn 4 thẻ đã sưu tầm ---------- */
function paintBoss(){
  const b=E.stageOf(run).boss;
  $('boss').innerHTML=UI.bossView(D,run);
  stageEl().classList.toggle('is-done',b.done);
  app.querySelector('.sheet')?.classList.toggle('is-done',b.done);
  const p=$('proceed');p.hidden=!b.done;p.textContent='Xem kết thúc hành trình →';
  $('save-status').textContent='';
}
function bindBoss(){
  stageEl().addEventListener('click',e=>{
    const pick=e.target.closest?.('[data-boss]');
    if(pick){if(E.bossToggle(run,D,pick.dataset.boss)){sfx('snap');paintBoss();app.querySelector(`[data-boss="${pick.dataset.boss}"]`)?.focus?.({preventScroll:true});}return;}
    if(e.target.closest?.('#boss-submit')){
      const res=E.bossSubmit(run,D);if(!res)return;
      sfx(res.ok===E.BOSS_PICK?'ok':'bad');paintBoss();renderStrip();
      $('feedback').innerHTML=UI.stageDone(D,run,{classMode:isClass()});
      const f=$('feedback');$('more').onclick=()=>openRecords('stage');enhance();aimLamp(f);f.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'nearest'});return;
    }
    if(e.target.closest?.('#bonus-go'))startBonus();
  });
  const onKey=e=>{if(e.key==='Enter'&&e.target===document.body&&E.stageDone(run)){e.preventDefault();proceed();}};
  document.addEventListener('keydown',onKey);cleanups.push(()=>document.removeEventListener('keydown',onKey));
}

// Gợi ý thủ công (lớp học: MC bấm). Nấc 3 hiện đáp án.
function giveHint(slot){
  const st=E.stageOf(run)[slot];if(st.locked)return;
  const before=slotIds().filter(id=>E.stageOf(run)[id].locked),rects={};
  const el=app.querySelector(`.slot[data-slot="${slot}"]`);if(el)rects[slot]=el.getBoundingClientRect();
  const h=E.hint(run,slot,D);if(!h)return;
  if(h.tier===3){afterLock(before,rects,true);return;}
  ui.msg[slot]={tier:h.tier,text:h.text};
  if(ui.sel&&E.isFaded(run,ui.sel))ui.sel=null;
  paint();
}

// "Tiếp tục hành trình": chỉ có tác dụng khi chặng đã xong (các ô được chấm ngay lúc thả thẻ)
function proceed(){
  if(!E.stageDone(run))return;
  if(run.resume!=null){const ch=D.scenes[run.index].chapter;E.finishReplay(run);summary(ch);return;} // chơi lại xong: về tổng kết chương
  next();
}

// "Bỏ qua, ôn lại sau": mọi ô chưa đúng được khóa với 0 điểm và vào danh sách ôn ở màn kết
function skipStage(){
  const open=slotIds().filter(id=>!E.stageOf(run)[id].locked);if(!open.length)return;
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
  bindShelf();
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
  dlg.oninput=sums;
  $('sheet-close').onclick=()=>dlg.close();$('sheet-print').onclick=()=>window.print();
  dlg.showModal();paperSound();
}

/* ---------- Màn kết: đoạn phim cờ / Tuyên ngôn / Quốc ca (bản trước merge), rồi trang điểm ---------- */
function ending(){
  if(storyEnding.isActive())return;
  hideStrip();setAct('finale');setBright(true);storyEnding.start();
}

function endingResults(){show(()=>{
  setAct('finale');app.innerHTML=UI.ending(D,run,{enter:false});
  // tuyến 9 chặng sáng đủ lần lượt, quầng đèn sáng hơn, điểm chạy từ 0 lên
  renderStrip({seq:true});setBright(true);aimLamp(app.querySelector('.end-hero'));
  const out=$('final-score'),total=E.score(run);
  if(out&&!reducedMotion()&&total>0){const t0=performance.now();const step=t=>{const k=Math.min(1,(t-t0)/1200);out.textContent=Math.round(total*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step);};out.textContent='0';requestAnimationFrame(step);}
  bindShelf();
  $('end-records').onclick=()=>openRecords('all');
  $('open-scoresheet')&&($('open-scoresheet').onclick=openScoresheet);
  $('replay-ending')&&($('replay-ending').onclick=()=>storyEnding.start());
  $('replay').onclick=()=>{run=E.newRun(run.mode);chapterIntro(0);};
  scroll();});}
$('sheet-btn')&&($('sheet-btn').onclick=openScoresheet);
/* Nút "Tua" để thử từng kiểu chơi: nhỏ, dưới điểm ở góc phải. Mỗi lần bấm chơi hoàn hảo chặng hiện tại rồi sang chặng sau (chặng cuối → màn kết).
   Chỉ hiện khi chạy ở localhost / 127.0.0.1 hoặc thêm ?dev vào địa chỉ. */
if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)||/[?&]dev\b/.test(location.search)){
  const btn=document.createElement('button');btn.type='button';btn.id='dev-go';btn.textContent='Tua ›';btn.title='Tua sang chặng sau (chỉ để thử)';btn.setAttribute('aria-label','Tua sang chặng sau');
  document.body.appendChild(btn);
  btn.onclick=()=>{
    if(run.index>=D.scenes.length)return;
    const i=run.index+1;
    E.fastForward(run,D,i);
    if(i>=D.scenes.length)ending();else play();
  };
}


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
