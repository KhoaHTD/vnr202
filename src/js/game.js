/* ============================================================
   game.js (trang hanh-trinh.html): trạng thái game, xử lý bấm nút và chuyển màn.
   HTML của từng màn nằm trong ui.js; dữ liệu lịch sử nằm trong content.js.
   Trang chủ là index.html (landing riêng). Game KHÔNG lưu/đọc tiến độ: mỗi lần mở là một lượt mới từ chương 1.
   ============================================================ */
(()=>{'use strict';
const D=window.GAME_DATA,UI=window.GameUI,app=document.getElementById('app');
// Trạng thái một lượt chơi mới. mistakes: id các thẻ sai đã chọn, dạng "<chặng>-<thẻ>", ví dụ "7-2"
const fresh=()=>({index:0,stats:{people:0,base:0,reach:0,ready:0},history:[],mistakes:[],finished:false});
let state=fresh(),selected=[],resolved=false,sound=false,audio;
// Chỉ để test (test-logic.cjs, check.cjs) đọc trạng thái lượt chơi; game không lưu ở đâu cả
window.GameDebug={state:()=>state};
const labels={people:'Lực lượng quần chúng',base:'Mạng lưới tổ chức',reach:'Tuyên truyền, vận động',ready:'Chuẩn bị hành động'};
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

/* ---------- Ánh sáng, dải lực lượng, chuyển màn, rửa ảnh, hiện khi cuộn ---------- */
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
// Dải lực lượng + la bàn + tuyến 9 chặng (nền phòng). Chỉ hiện ở màn chơi, câu hỏi cuối chương và màn kết.
function renderStrip(o={}){const el=$('strip');el.hidden=false;el.innerHTML=UI.strip(D,state,labels,o);}
function hideStrip(){$('strip').hidden=true;}
// Cả 4 hướng la bàn đã sáng thì quầng đèn sáng lên một nấc
function setBright(on){if(on)document.body.dataset.bright='';else delete document.body.dataset.bright;}
const allWindsLit=()=>(Array.isArray(state.signals)?state.signals.filter(Boolean).length:(state.signals||0))>=4;
// Bấm la bàn → mở/đóng bảng 4 hướng; bấm ra ngoài hoặc Esc → đóng
function toggleCompass(open){const b=$('compass-btn'),p=$('compass-panel');if(!b||!p)return;const want=open===undefined?p.hidden:open;p.hidden=!want;b.setAttribute('aria-expanded',want);}
$('strip').addEventListener('click',e=>{if(e.target.closest?.('#compass-btn'))toggleCompass();else if(!e.target.closest?.('#compass-panel'))toggleCompass(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleCompass(false);});
// will-change chỉ gắn trong lúc animation đang chạy, xong thì gỡ
document.addEventListener('animationstart',e=>{if(e.target.style)e.target.style.willChange='transform, opacity, filter';});
['animationend','animationcancel'].forEach(t=>document.addEventListener(t,e=>{if(e.target.style)e.target.style.willChange='';}));

/* ---------- Đầu trang, hồ sơ lịch sử, hộp xem ảnh ---------- */
function openRecords(index){const dialog=$('archive');dialog.showModal();paperSound();if(Number.isInteger(index)){dialog.querySelectorAll('details').forEach((d,i)=>d.open=i===index);dialog.querySelectorAll('details')[index].scrollIntoView({block:'nearest'});}}
$('archive-body').innerHTML=UI.records(D);
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
// Màn mở đầu chương: không tự chuyển; bấm nút, Enter hoặc phím → để vào chương
function chapterIntro(chapter){show(()=>{
  setAct(String(chapter+1));hideStrip();setBright(false);app.innerHTML=UI.chapterIntro(D,chapter);aimLamp(app.querySelector('.intro-media'));scroll();
  const onKey=e=>{if((e.key==='Enter'||e.key==='ArrowRight')&&!document.querySelector('dialog[open]')){e.preventDefault();go();}};
  const go=()=>{document.removeEventListener('keydown',onKey);play();};
  document.addEventListener('keydown',onKey);
  $('chapter-go').onclick=e=>{e?.preventDefault?.();go();};
  $('chapter-go').focus?.({preventScroll:true});
});}

// Các nút thẻ trên màn hiện tại
function cards(){return app.querySelectorAll('[data-card]');}
// Cập nhật thẻ sau mỗi lần chọn/bỏ chọn.
// Chọn đủ 2 thẻ: thẻ còn lại nhận aria-disabled (không làm mờ, CSS hiện gợi ý "Bỏ chọn một thẻ để đổi")
function syncCards(){
  cards().forEach(btn=>{const yes=selected.includes(Number(btn.dataset.card));btn.setAttribute('aria-pressed',yes);btn.setAttribute('aria-disabled',selected.length===2&&!yes);});
  $('commit').disabled=selected.length!==2;
  $('save-status').textContent=selected.length===2?'Sẵn sàng triển khai':`Chọn thêm ${2-selected.length} hoạt động`;
}

// Màn chơi một chặng
function play(){if(state.index>=9){ending();return;}show(()=>{selected=[];resolved=false;const s=D.scenes[state.index];setAct(state.index===8?'finale':String(s.chapter+1));
const enter=!app.querySelector('.sheet'); // tờ bản đồ chỉ trượt vào khi vừa vào chương, không trượt lại ở mỗi chặng
app.innerHTML=UI.play(D,state,labels,{enter});
// Chặng 9: nếu cả 4 hướng đã sáng, kim la bàn xoay một lần và quầng đèn sáng lên một nấc
renderStrip({spin:state.index===8});setBright(state.index===8&&allWindsLit());aimLamp(app.querySelector('.hand'));
$('more').onclick=()=>openRecords(s.record);
cards().forEach(b=>b.onclick=()=>{if(resolved)return;const i=Number(b.dataset.card);if(selected.includes(i))selected=selected.filter(n=>n!==i);else if(selected.length<2)selected.push(i);else return;syncCards();tone();});
$('commit').onclick=commit;scroll();});}

// Đóng dấu son lên thẻ sai (có chữ, không chỉ báo bằng màu) và cho thẻ rung nhẹ
function stamp(i,text){const b=[...cards()].find(c=>Number(c.dataset.card)===i);if(!b)return;b.classList.add('is-wrong');b.insertAdjacentHTML('beforeend',`<span class="stamp">${text}</span>`);}
// Hiện khối kết quả và cuộn mượt tới đầu khối (cuộn ngay nếu người dùng tắt chuyển động)
function showFeedback(html){const f=$('feedback');f.innerHTML=html;enhance();aimLamp(f);f.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'start'});}

/* Bấm "Triển khai".
   - Thẻ trap → dấu "SAI LẦM LỊCH SỬ"; thẻ now → dấu "CHƯA ĐẾN LÚC"; thẻ good không có dấu.
   - Thẻ sai ghi vào state.mistakes (không trùng) và không được cộng điểm.
   - Chặng có `answer` (chặng 8): chọn sai thì không qua chặng, nút đổi thành "Xem lại và chọn lại".
   - Các chặng khác: vẫn cho đi tiếp, phản hồi giải thích lựa chọn của lịch sử. */
function commit(){if(resolved||selected.length!==2)return;resolved=true;
const s=D.scenes[state.index],idx=state.index,picks=[...selected];
const wrong=picks.filter(i=>UI.kindOf(s.cards[i])!=='good');
cards().forEach(b=>{b.disabled=true;b.removeAttribute?.('aria-disabled');});
wrong.forEach(i=>{stamp(i,UI.kindOf(s.cards[i])==='trap'?'Sai lầm lịch sử':'Chưa đến lúc');const id=`${idx}-${i}`;if(!state.mistakes.includes(id))state.mistakes.push(id);});
const omitted=s.cards.findIndex((_,i)=>!picks.includes(i));
// Thẻ đúng bị bỏ qua: thẻ còn lại nếu là thẻ good, nếu không thì lấy trường better của thẻ sai
const better=wrong.length?(UI.kindOf(s.cards[omitted])==='good'?omitted:UI.meta(s.cards[wrong[0]]).better??null):null;
const b=$('commit');
if(wrong.length&&s.answer){ // scene 8 keeps the old rule: no progress, no points, try again
  $('save-status').textContent='Chưa triển khai được';
  showFeedback(UI.feedback({scene:s,picks,wrong,better,retry:true}));
  b.textContent='Xem lại và chọn lại';b.onclick=retry;tone();return;
}
// Cộng điểm: chỉ thẻ good được cộng
const before={...state.stats};
picks.forEach(i=>{const c=s.cards[i];if(UI.kindOf(c)==='good'&&c[2]!=='none')state.stats[c[2]]+=c[3];});
// Cộng hưởng giữa các chặng (giữ nguyên quy tắc cũ)
let synergy='';if(idx===3&&before.base>=3){state.stats.people++;synergy='Cơ sở đã khôi phục từ chương I giúp hoạt động tập hợp quần chúng được hỗ trợ tốt hơn.';}else if(idx===6&&before.people>=7){state.stats.ready++;synergy='Mạng lưới quần chúng từ các chương trước hỗ trợ cao trào kháng Nhật.';}else if(idx===8){synergy='Các cơ sở, hoạt động vận động và lực lượng bạn xây dựng từ đầu cùng hiện diện trong nhiệm vụ cuối.';}
state.history.push({scene:idx,picks});state.index++;
// Chọn đúng hết: thu gọn thẻ. Có thẻ sai: giữ nguyên thẻ để thấy rõ con dấu
if(!wrong.length)document.querySelector('.decision')?.classList.add('is-resolved');
$('save-status').textContent='Đã hoàn thành chặng này';
renderStrip({prev:before});
showFeedback(UI.feedback({scene:s,picks,wrong,better,before,after:state.stats,synergy}));
b.textContent=state.index===9?'Xem kết thúc hành trình →':'Tiếp tục hành trình →';b.disabled=false;
b.onclick=()=>{const next=D.scenes[state.index];if(!next){state.finished=true;ending();}else if(next.chapter!==s.chapter)checkpoint(s.chapter);else play();};tone();}

// "Xem lại và chọn lại" (chặng 8): gỡ dấu, mở khóa thẻ, xóa phản hồi; lần sai không được cộng điểm
function retry(){resolved=false;selected=[];
app.querySelectorAll('.stamp').forEach(x=>x.remove());
cards().forEach(c=>{c.disabled=false;c.classList.remove('is-wrong');});
$('feedback').innerHTML='';syncCards();
const b=$('commit');b.textContent='Triển khai →';b.onclick=commit;
document.querySelector('.hand')?.scrollIntoView?.({behavior:reducedMotion()?'instant':'smooth',block:'center'});}

// Câu hỏi cuối chương: [câu hỏi, đáp án đúng, đáp án sai, giải thích khi sai].
// Đề xuất đáp án sai mới (lấy từ nhầm lẫn có thật) nằm trong docs/de-xuat-cau-hoi.md, chờ nhóm duyệt.
const QUESTIONS=[
  ['Vì sao khôi phục tổ chức có ý nghĩa cho giai đoạn sau?','Tạo mạng lưới để tiếp tục vận động và phối hợp.','Chỉ để ghi nhớ các mốc thời gian.','Thử nghĩ đến cách tổ chức và phương pháp đã thích ứng với tình hình.'],
  ['Điều gì nổi bật trong cách lãnh đạo giai đoạn 1936–1939?','Điều chỉnh phương pháp theo hoàn cảnh, mở rộng lực lượng.','Dùng một hình thức đấu tranh cho mọi hoàn cảnh.','Thử nghĩ đến cách tổ chức và phương pháp đã thích ứng với tình hình.']
];
// Màn câu hỏi cuối chương: đúng → dấu tích; sai → dấu son "CHƯA ĐÚNG" + giải thích. Không trừ điểm, chọn lại thoải mái
function checkpoint(chapter){show(()=>{setAct(String(chapter+1));const q=QUESTIONS[chapter];const enter=!app.querySelector('.sheet');app.innerHTML=UI.checkpoint(D,chapter,q,{enter});renderStrip();setBright(false);aimLamp(app.querySelector('.check'));
app.querySelectorAll('[data-good]').forEach(b=>b.onclick=()=>{
  const good=b.dataset.good==='true';
  if(good){b.className='correct';}
  else if(!b.classList.contains('wrong')){b.className='wrong';b.insertAdjacentHTML('beforeend','<span class="stamp">Chưa đúng</span>');}
  $('check-feedback').textContent=good?'Đúng. Thành quả ấy được mang sang chương tiếp theo.':q[3];});
$('next').onclick=()=>chapterIntro(chapter+1);scroll();});}

// Màn kết
function ending(){state.finished=true;show(()=>{setAct('finale');const enter=!app.querySelector('.sheet');app.innerHTML=UI.ending(D,state,{enter});
// Màn kết: tuyến 9 chặng sáng đủ lần lượt, la bàn chỉ "Tháng Tám", rồi ảnh Ba Đình hiện
renderStrip({seq:true,forceLit:true});setBright(true);aimLamp(app.querySelector('.end-hero'));
$('end-records').onclick=()=>openRecords(8);$('replay').onclick=()=>{location.href='index.html';}; /* "Trở về màn đầu" = landing */scroll();});}

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
chapterIntro(0);landPhoto();})();
