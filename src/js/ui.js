/* ============================================================
   ui.js: CHỈ dựng chuỗi HTML cho từng màn. Không giữ trạng thái, không gắn sự kiện.
   game.js gọi các hàm ở đây rồi gắn sự kiện vào phần tử theo id / data-*.

   Hai lớp vật liệu:
   - NỀN PHÒNG (tối, hiện đại): đầu trang, dải album + điểm (strip), màn mở chương. (Trang chủ là index.html riêng.)
   - TỜ BẢN ĐỒ (.sheet, giấy da cổ): màn chơi, tổng kết chương, màn kết.
   Luật chơi nằm ở engine.js; ở đây chỉ đọc `run` (trạng thái lượt chơi) để vẽ.
   ============================================================ */
window.GameUI=(()=>{
const E=window.GameEngine;
// Biểu tượng SVG nét mảnh (stroke = currentColor nên tự theo màu chữ)
const ICONS={
  book:'<path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-3-1-7-2-10 1v15"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  sound:'<path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  mute:'<path d="M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  why:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.1"/>',
  hint:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  skip:'<path d="m5 5 7 7-7 7M13 5l7 7-7 7"/>',
  print:'<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',
  timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
  meeting:'<circle cx="6" cy="8" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="8" r="2"/><path d="M3 20v-3a3 3 0 0 1 6 0v3M9 20v-4a3 3 0 0 1 6 0v4M15 20v-3a3 3 0 0 1 6 0v3"/>',
  document:'<path d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7"/>',
  crowd:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-3-5"/>',
  flag:'<path d="M5 22V3m0 1c5-4 9 4 15 0v10c-6 4-10-4-15 0"/>',
  flame:'<path d="M12 21c3.9 0 6.5-2.7 6.5-6.4 0-3.2-2-5.3-3.2-7.1-.7 1.7-1.6 2.6-2.8 3C12.5 7 11.4 4.5 9 3c.2 3.6-3.5 5.6-3.5 11.3C5.5 18.3 8 21 12 21z"/>',
  star:'<path d="m12 3 2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.2l-5.6 3.1 1.2-6.3L3 9.6l6.3-.8z"/>',
  rice:'<path d="M12 22V9M12 9c-3-1-4-3-4-5 3 0 4 2 4 5zM12 9c3-1 4-3 4-5-3 0-4 2-4 5zM12 15c-3-1-4-3-4-5M12 15c3-1 4-3 4-5"/>',
  base:'<path d="m2 20 7-13 4 7 3-5 6 11z"/>',
  screen:'<rect x="2" y="4" width="20" height="13" rx="1"/><path d="M8 21h8M12 17v4"/>'
};
// icon('book') trả về thẻ <svg>; tên không có trong ICONS thì trả chuỗi rỗng
const icon=(name,size=24)=>ICONS[name]?`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`:'';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const yearOf=c=>Math.floor(c.t);
// Loại sự kiện → biểu tượng (suy từ tên thẻ; thẻ có trường kind thì dùng kind)
function kindOf(c){
  if(c.kind)return c.kind;
  const n=c.name;
  if(/kho thóc/i.test(n))return 'rice';
  if(/Khu giải phóng/i.test(n))return 'base';
  if(/Quân lệnh|Chương trình|Văn kiện|Chỉ thị|Đề cương|Tuyên ngôn/i.test(n))return 'document';
  if(/Hội nghị|Đại hội (I|Quốc)/i.test(n)&&!/Đông Dương Đại hội/i.test(n))return 'meeting';
  if(/Xô viết|Phong trào|Đón phái viên/i.test(n))return 'crowd';
  if(/Khởi nghĩa|Giành chính quyền|đảo chính/i.test(n))return 'flag';
  if(/Đội Việt Nam|Giải phóng quân/i.test(n))return 'star';
  return 'document';
}
const HOW={first:'Đúng ngay lần đầu',retry:'Đúng ở lần chọn lại',faded:'Đúng sau khi thẻ bị làm mờ',revealed:'Đã xem đáp án',skipped:'Đã bỏ qua, ôn lại sau',missed:'Trả lời sai hoặc hết giờ'};

/* Tờ bản đồ: khối giấy da nằm giữa quầng đèn.
   enter = true: tờ bản đồ trượt vào (chỉ khi vừa vào chương). .sheet-light là ánh đèn rọi lên giấy, game.js dời tâm sáng. */
const sheet=(inner,enter)=>`<div class="sheet${enter?' sheet--in':''}"><div class="sheet-light" aria-hidden="true"></div>${inner}</div>`;


/* Ảnh tư liệu.
   - Không có trường image: không hiện gì. src rỗng: khung giữ chỗ "Ảnh tư liệu sẽ được bổ sung".
   - o.w, o.h: tỉ lệ khung khi chưa có ảnh. Ảnh thật dùng tỉ lệ gốc của file (không cắt), trừ khi o.crop = true.
   - o.develop: 'slow' (rửa ảnh 1,4s) | 'fast' (0,64s) | 'intro' (màn mở chương: rửa + Ken Burns). game.js bật khi ảnh đã tải.
   - o.priority: ảnh bìa tải ngay (fetchpriority=high); các ảnh khác tải lười (loading=lazy).
   - o.zoom: bấm để mở hộp xem ảnh lớn. o.extra: HTML chèn thêm vào khung (ví dụ con dấu). */
function photo(img,o={}){
  if(!img)return '';
  const cls=o.cls||'';
  if(!img.src)return `<figure class="photo photo--empty ${cls}"><div class="photo-frame" style="aspect-ratio:${o.w}/${o.h}"><span>Ảnh tư liệu sẽ được bổ sung</span></div>${o.extra||''}</figure>`;
  const w=img.width||o.w,h=img.height||o.h,ratio=o.crop?`${o.w}/${o.h}`:`${w}/${h}`;
  const credit=[img.composite?'Ảnh tư liệu (ảnh ghép)':'Ảnh tư liệu',img.date,img.source&&'Nguồn: '+img.source].filter(Boolean).join(' · ');
  const dev=o.develop==='slow'?' develop':o.develop==='fast'?' develop develop--fast':'';
  const pic=`<img src="${img.src}" alt="${img.alt}" width="${w}" height="${h}" decoding="async" ${o.priority?'fetchpriority="high"':'loading="lazy"'}>`;
  const media=`<div class="photo-media" style="aspect-ratio:${ratio};--focus:${img.focus||'50% 50%'}">${pic}</div>`;
  return `<figure class="photo ${cls}${dev}"${o.develop?' data-develop':''}>${o.zoom?`<button class="photo-zoom" data-zoom="${img.src}" data-alt="${img.alt}" data-caption="${img.caption||''}" data-credit="${credit}" aria-label="Phóng to ảnh: ${img.alt}">${media}</button>`:media}<figcaption>${credit}</figcaption>${o.extra||''}</figure>`;
}

/* Tuyến 9 chặng, vẽ như đường hành trình trên bản đồ. cur = chặng đang ở (0–8); -1 = chưa bắt đầu; 9 = đã xong.
   Đã qua: chấm đặc + đoạn nét liền. Đang ở: vòng --lamp. Chưa tới: chấm rỗng + đoạn nét đứt.
   Mốc chương ngăn bằng vạch nhỏ kèm năm (chữ nghiêng). Rê chuột/focus hiện tên chặng; KHÔNG bấm nhảy chặng.
   o.seq: màn kết, các mốc sáng lần lượt (chuyển động lớn của màn kết). */
function route(D,cur,o={}){
  const n=D.scenes.length;
  const stops=D.scenes.map((s,i)=>{
    const st=i<cur?'done':i===cur?'now':'todo';
    const label={done:'đã qua',now:'đang ở',todo:'chưa tới'}[st];
    const first=i===0||s.chapter!==D.scenes[i-1].chapter;
    const year=first?`<span class="route-year" aria-hidden="true">${D.chapters[s.chapter].years.split('–')[0]}</span>`:'';
    // Hai chấm A/B dưới mốc: đặc = đúng ngay lần đầu, rỗng viền vàng = cần ôn, mờ = chưa xong
    const run=o.run,ss=run&&run.stages[i];
    const dots=ss?`<span class="route-ab" aria-hidden="true">${E.dots(run,i).map((x,k)=>{const id=['A','B'][k];return `<i class="ab${x.locked?(x.how==='first'?' ab--ok':' ab--weak'):''}${o.fresh&&o.fresh.includes(i+id)?' is-incoming':''}" data-ab="${i}${id}"></i>`;}).join('')}</span>`:'';
    const evs=ss?run.album.filter(a=>a.scene===i).map(a=>` · ${s.cards.find(c=>c.id===a.card).name}`).join(''):'';
    return `<li class="route-item is-${st}${first?' is-first':''}${i<cur?' seg-done':''}" style="--i:${i}">${year}<span class="route-stop" role="img" tabindex="0" aria-label="Chặng ${i+1}: ${esc(s.title)}, ${label}"><span class="route-dot"></span><span class="route-tip" aria-hidden="true">${i+1} · ${esc(s.title)}${esc(evs)}</span></span>${dots}</li>`;
  }).join('');
  const here=D.scenes[cur];
  return `<ol class="route${o.seq?' route--seq':''}" aria-label="Tuyến hành trình: ${cur<0?'chưa bắt đầu':cur>=n?'đã hoàn thành '+n+' chặng':'đang ở chặng '+(cur+1)+' trên '+n}">${stops}</ol>${here?`<p class="route-now" aria-hidden="true">Chặng ${cur+1} · ${esc(here.title)}</p>`:''}`;
}

/* Dải trên nền phòng: MỘT thanh tiến trình (tuyến 9 chặng, mỗi mốc có hai chấm A/B) + điểm.
   o.fresh = các ô vừa đúng, dạng "0A" (chấm ẩn cho tới khi thẻ bay tới nơi). Album đầy đủ nằm ở tổng kết chương và màn kết. */
function strip(D,run,o={}){
  const cur=run.index>=D.scenes.length?D.scenes.length:run.index;
  return `<div class="strip-inner"><div class="route-wrap">${route(D,cur,{...o,run})}</div><div class="score" role="status" aria-label="Điểm: ${E.score(run)} trên ${E.MAX(D)}"><span class="score-n" id="score-n">${E.score(run)}</span><span class="score-max">/${E.MAX(D)}</span>${run.streak>=2?`<span class="streak" title="Đúng liên tiếp, không cộng điểm">${icon('flame',16)} Chuỗi ${run.streak}</span>`:''}</div></div>`;
}

// Màn mở đầu chương (nền phòng, chưa có tờ bản đồ): ảnh đặt trên bàn dưới đèn, tên chương uốn cung.
// Chương 1 có thêm "Cách chơi" và công tắc chế độ Lớp học. Bấm "Vào chương" hoặc Enter thì tờ bản đồ trượt vào.
function chapterIntro(D,i,run){
  const c=D.chapters[i];
  // Mỗi chương: 3 bước + một dòng luật theo kiểu chơi của chương (ghép / xếp thứ tự / đúng-sai). Chỉ chương 1 có công tắc Lớp học (mô tả dài chỉ cho trình đọc màn hình).
  const STEPS=[
    [['Đọc','2 tình huống A, B'],['Kéo','vé sự kiện vào đúng ô'],['Thả','đúng thì khóa ngay']],
    [['Đọc','bối cảnh của chặng'],['Kéo','4 vé vào vị trí 1 → 4 theo thời gian'],['Thả','đúng thì khóa ngay']],
    [['Đọc','từng câu về các mốc thời gian'],['Chọn','Đúng hoặc Sai (phím ← →)'],['Kịp','5 câu trong 20 giây']]][i]||[];
  const RULES=['Sai có gợi ý <i>·</i> Đúng ngay 10 điểm <i>·</i> Tối đa 180','Đúng ngay 5 điểm mỗi vị trí <i>·</i> Tối đa 20 điểm mỗi chặng','4 điểm mỗi câu <i>·</i> Hết giờ thì câu chưa trả lời tính sai <i>·</i> Chặng 9 là màn trùm'][i]||'';
  const steps=STEPS.length?`<ol class="steps" aria-label="Cách chơi">${STEPS.map(([b,t],k)=>`<li><span class="step-n">${k+1}</span><span class="step-t"><b>${b}</b> ${t}</span></li>`).join('')}</ol><p class="rules-line">${RULES}</p>`:'';
  const how=steps?`<div class="intro-how"><span class="how-label">Cách chơi</span>${steps}</div>`:'';
  const sw=i===0?`<label class="toggle"><input type="checkbox" id="mode-class" aria-describedby="mode-desc"${run.mode==='class'?' checked':''}><span class="toggle-track" aria-hidden="true"></span><span>Chế độ Lớp học</span><span class="sr-only" id="mode-desc">Chiếu lên màn hình lớn, người điều khiển thao tác, ban tổ chức tự ghi điểm.</span></label>`:'';
  return `<section class="chapter-intro"><div class="intro-media">${photo(c.image,{w:3,h:2,cls:'photo--table photo--intro',develop:'intro'})}</div><div class="chapter-intro-text"><div class="intro-head"><span class="chap-badge">Chương <b>${['I','II','III'][i]}</b></span><span class="chap-years">${c.years}</span></div><h1 class="intro-title place">${c.name}</h1><div class="intro-actions"><button class="primary" id="chapter-go" aria-keyshortcuts="Enter">Vào chương ${icon('arrow')}</button>${sw}</div>${how}</div></section>`;
}

/* ---------- Màn chơi một chặng ---------- */
// Ảnh cảnh với lớp điểm nóng. Ảnh thật dùng đúng tỉ lệ của file; chưa có ảnh thì dùng khung 16:10 tối với biểu tượng chủ đề của chặng.
function scenePhoto(s){
  const img=s.image||{};
  const w=img.width||16,h=img.height||10;
  const pic=img.src?`<img src="${img.src}" alt="${img.alt||''}" width="${w}" height="${h}" decoding="async">`:'';
  const credit=img.src?[img.composite?'Ảnh tư liệu (ảnh ghép)':'Ảnh tư liệu',img.date,img.source&&'Nguồn: '+img.source].filter(Boolean).join(' · '):'Ảnh tư liệu sẽ được bổ sung';
  const art=img.src?'':`<div class="scene-art"><span class="scene-motif">${icon(s.motif||'flag',56)}</span></div>`;
  return `<figure class="photo scene-photo${img.src?'':' is-blank'}" style="--ar:${(w/h).toFixed(3)}"><div class="photo-media" style="aspect-ratio:${w}/${h};--focus:${img.focus||'50% 50%'}">${pic}${art}<div class="spots" id="spots"></div></div><figcaption>${credit}</figcaption></figure>`;
}

/* Dải bối cảnh mỏng: bản đồ nhỏ có ghim + một dòng bản tin. Không thêm thông tin nào khác để người chơi tập trung vào câu hỏi. */
function tfContext(D,run){
  const s=D.scenes[run.index];
  return `<div class="ctx"><div class="ctx-map">${journeyMap(D,run,{size:'mini',now:run.index})}</div><p class="ctx-news brief">${s.news}</p></div>`;
}
function play(D,run,o={}){
  const s=D.scenes[run.index],kind=E.kindOf(s);
  // Chặng → chặng: một vệt đèn quét qua mặt giấy tờ mới (chỉ trang trí)
  const leg=o.leg?`<span class="sheet-sweep" aria-hidden="true"></span>`:'';
  const head=`<header class="sheet-head"><div><span class="eyebrow">Chương ${s.chapter+1} · ${s.date} · Chặng ${run.index+1}/9</span><h2 class="place">${s.title}</h2></div></header>`;
  const proceed=`<div class="bottom"><span id="save-status" class="toast" aria-live="polite"></span><div class="bottom-btns"><button class="primary" id="proceed" hidden>Tiếp tục hành trình →</button></div></div>`;
  if(kind==='tf'||kind==='boss')return sheet(leg+head+`<div class="stage stage--${kind}" id="stage">${tfContext(D,run)}<div class="${kind}" id="${kind}"></div>${proceed}<div id="feedback" aria-live="polite"></div></div>`,o.enter);
  return sheet(leg+head
  +`<div class="stage stage--${kind}" id="stage">${kind==='order'?tfContext(D,run):`<p class="brief">${s.news}</p>`}`
  +`<div class="stage-main"><div class="col-left"><div class="scene" id="scene" data-lit="0">${scenePhoto(s)}</div><div id="hints" aria-live="polite" hidden></div></div>`
  +`<div class="col-right"><div class="slots" id="slots"></div>`
  +`${proceed}<button id="skip" class="skip-link" hidden>Bỏ qua, ôn lại sau</button></div></div>`
  +`<div class="tray-wrap"><div class="tray" id="tray" role="group" aria-label="4 phiếu sự kiện${kind==='order'?', chưa xếp thứ tự':', xếp theo thời gian'}"></div></div>`
  +`<div id="feedback" aria-live="polite"></div></div>`,o.enter);
}

// Thẻ sự kiện. kind: 'tray' | 'placed' (đang ở ô, còn kéo được) | 'locked' (đã đúng, khóa)
/* Phiếu sự kiện kiểu vé tư liệu retro: dải đầu màu theo loại (số, năm, biểu tượng), đường đục lỗ, thân giấy (tên + nhãn loại).
   kind: 'tray' | 'placed' (đang ở ô, còn kéo được) | 'locked' (đã đúng, khóa) */
function evCard(c,n,kind,o={}){
  const faded=!!o.faded,k=kindOf(c),label=`Thẻ ${n}: ${o.hideYear?'':c.year+', '}${c.name}${faded?', đã loại':''}`; // hideYear: kiểu xếp thứ tự không được lộ năm trên thẻ
  const num=kind==='locked'?icon('check',14):n;
  const inner=`<span class="ev-head"><span class="ev-n" aria-hidden="true">${num}</span><span class="ev-year">${o.hideYear?'?':esc(c.year)}</span><span class="ev-icon" aria-hidden="true">${icon(k,18)}</span></span><span class="ev-body"><span class="ev-name">${esc(c.name)}</span>${faded?'<span class="ev-tag">Đã loại</span>':''}</span>`;
  if(kind==='locked')return `<div class="ev ev--locked ev--k-${k}">${inner}</div>`;
  return `<button class="ev ev--k-${k}${o.selected?' is-selected':''}${faded?' is-faded':''}${kind==='placed'?' ev--placed':''}" data-card="${c.id}" aria-pressed="${!!o.selected}" aria-label="${esc(label)}"${faded?' aria-disabled="true"':''}>${inner}</button>`;
}

/* Dây phiếu: một sợi dây mảnh võng xuống giữa các điểm treo như dây đèn, hai đầu là cụm mây cuộn,
   mỗi điểm treo là một bông sen tròn, giữa mỗi chỗ võng có cặp lá cuốn nhỏ (hoa văn truyền thống).
   Dây vẽ bằng SVG co giãn theo chiều rộng (nét không đổi); hoa văn là phần tử cỡ cố định đặt theo % nên không méo.
   4 phiếu xếp theo thời gian, số 1–4 cố định; phiếu đã đặt vào ô để lại bông sen trống. */
const CLOUD='<svg viewBox="0 0 24 22" width="40" height="36" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" aria-hidden="true"><path d="M3 16a4 4 0 0 1 6-5 6 6 0 0 1 11 1 4 4 0 0 1 2 8H5a3 3 0 0 1-2-4z"/><path d="M10 14a2 2 0 1 1 3 2M16 15a1.6 1.6 0 1 1 2 1.5M6 18a1.4 1.4 0 1 1 2 .5"/></svg>';
const LEAF='<svg viewBox="0 0 24 16" width="22" height="15" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round" aria-hidden="true"><path d="M12 9C9 4 4 4 2 6c3 1 6 3 10 3zM12 9c3-5 8-5 10-3-3 1-6 3-10 3zM12 9v5"/></svg>';
const LOTUS=(()=>{const p=Array.from({length:8},(_,i)=>`<ellipse cx="12" cy="6.2" rx="2.4" ry="4.6" transform="rotate(${i*45} 12 12)"/>`).join('');return `<svg viewBox="0 0 24 24" width="20" height="20" fill="var(--parchment)" stroke="currentColor" stroke-width="1" aria-hidden="true">${p}<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>`;})();
function garland(){
  const line='M1.5 4Q7 10 12.5 6Q25 30 37.5 6Q50 34 62.5 6Q75 28 87.5 6Q93 10 98.5 4';
  const leaves=[[25,18],[50,20],[75,17]].map(([x,y])=>`<span class="g-leaf" style="left:${x}%;top:${y}px">${LEAF}</span>`).join('');
  return `<div class="garland" aria-hidden="true"><svg class="garland-line" viewBox="0 0 100 30" preserveAspectRatio="none"><path d="${line}"/></svg><span class="g-cloud g-cloud--l">${CLOUD}</span><span class="g-cloud g-cloud--r">${CLOUD}</span>${leaves}</div>`;
}
function tray(D,run,o={}){
  const s=D.scenes[run.index],st=run.stages[run.index],order=E.orderOf(run,D),inTray=new Set(E.tray(run,D));
  const cards=order.map((id,i)=>{
    const c=s.cards.find(x=>x.id===id),n=i+1,pin=`<span class="g-lotus" aria-hidden="true">${LOTUS}</span>`;
    if(!inTray.has(id)){const where=st.ids.find(k=>st[k].cardId===id);return `<div class="tl-slot is-empty">${pin}<div class="ev-gap" aria-hidden="true"><span>${where?(/^P/.test(where)?'đã xếp vào vị trí '+where[1]:'đã gắn vào '+where):''}</span></div></div>`;}
    return `<div class="tl-slot">${pin}${evCard(c,n,'tray',{selected:o.sel===id,faded:E.isFaded(run,id),hideYear:E.kindOf(s)==='order'})}</div>`;
  }).join('');
  return `${garland()}<div class="tl-cards">${cards}</div>`;
}

/* Hai ô tình huống (điểm nóng A, B). o = {sel, msg:{A:{tier,text,stamp}}, why:{A:true}, classMode}
   Ô chưa khóa: vùng thả (nhận thẻ) + thông báo gợi ý. Ô đã khóa: thẻ đúng, điểm, "Vì sao?". */
function slotsOrder(D,run,o={}){
  const s=D.scenes[run.index],st=run.stages[run.index],order=E.orderOf(run,D);
  return st.ids.map((id,k)=>{
    const ss=st[id],n=k+1,msg=o.msg&&o.msg[id];
    const band=`<div class="slot-band"><span class="slot-badge" aria-hidden="true">${ss.locked?icon('check',14):n}</span><span class="slot-label">Vị trí ${n}${n===1?' · sớm nhất':n===4?' · muộn nhất':''}</span>${msg&&!ss.locked?'<span class="slot-no slot-no--bad">Chưa đúng</span>':''}</div>`;
    if(ss.locked){
      const c=s.cards.find(x=>x.id===ss.cardId);
      return `<section class="slot slot--pos is-locked is-${ss.how}" data-slot="${id}">${band}<div class="slot-drop">${evCard(c,order.indexOf(c.id)+1,'locked')}</div><div class="slot-result"><span class="pts${ss.pts===0?' pts--zero':''}">+${ss.pts} <small>điểm</small></span><span class="how">${HOW[ss.how]||''}</span></div></section>`;
    }
    return `<section class="slot slot--pos${msg?' is-wrong':''}${o.sel?' is-target':''}" data-slot="${id}" data-drop="${id}">${band}<div class="slot-drop" tabindex="0" role="button" aria-label="Đặt thẻ vào vị trí ${n}" data-place="${id}"><span class="drop-hint">Thả thẻ vào đây</span></div>${msg&&msg.short?`<p class="slot-quick" role="status">${msg.short}</p>`:''}</section>`;
  }).join('');
}
function slots(D,run,o={}){
  if(E.kindOf(D.scenes[run.index])==='order')return slotsOrder(D,run,o);
  const s=D.scenes[run.index],st=run.stages[run.index],order=E.orderOf(run,D);
  return s.slots.map(sl=>{
    const ss=st[sl.id],cardId=ss.cardId,card=cardId?s.cards.find(c=>c.id===cardId):null,n=card?order.indexOf(card.id)+1:0;
    const head=`<div class="slot-band"><span class="slot-badge" aria-hidden="true">${ss.locked?icon('check',14):sl.id}</span><span class="slot-label">Tình huống ${sl.id}</span></div><p class="slot-situation">${sl.situation}</p>`;
    if(ss.locked){
      const m=s.cards.find(c=>c.id===sl.correct),mn=order.indexOf(m.id)+1,open=o.why&&o.why[sl.id];
      return `<section class="slot is-locked is-${ss.how}" data-slot="${sl.id}">${head}<div class="slot-drop">${evCard(m,mn,'locked')}</div><div class="slot-result"><span class="pts${ss.pts===0?' pts--zero':''}">${ss.pts===10?'+10':ss.pts===5?'+5':'0'} <small>điểm</small></span><span class="how">${HOW[ss.how]||''}</span><button class="text-link" data-why="${sl.id}" aria-expanded="${!!open}" aria-controls="hints">${icon('why',18)} Vì sao?</button></div></section>`;
    }
    const msg=o.msg&&o.msg[sl.id];
    return `<section class="slot${card?' has-card':''}${o.sel&&!card?' is-target':''}${msg?' is-wrong':''}" data-slot="${sl.id}" data-drop="${sl.id}">${msg?head.replace('</div><p class="slot-situation">','<span class="slot-no slot-no--bad">Chưa phù hợp</span></div><p class="slot-situation">'):head}<div class="slot-drop"${card?'':` tabindex="0" role="button" aria-label="Đặt thẻ vào tình huống ${sl.id}" data-place="${sl.id}"`}>${card?evCard(card,n,'placed',{selected:o.sel===card.id}):`<span class="drop-hint">Thả thẻ vào đây</span>`}</div>${msg&&msg.short?`<p class="slot-quick" role="status">${msg.short}</p>`:''}</section>`;
  }).join('');
}

/* Sổ gợi ý (dưới ảnh cảnh): mỗi ô sai một dòng gợi ý theo nấc; ô đã đúng mở "Vì sao?" thì hiện lời giải ở đây.
   Chế độ Lớp học: dòng của ô sai có nút "Đọc gợi ý" / "Hiện đáp án" cho MC. Rỗng nếu không có gì để hiện. */
function hints(D,run,o={}){
  if(E.kindOf(D.scenes[run.index])!=='match')return '';
  const s=D.scenes[run.index],st=run.stages[run.index],rows=[];
  let wrong=false;
  for(const sl of s.slots){
    const msg=o.msg&&o.msg[sl.id];
    if(!st[sl.id].locked&&msg){
      wrong=true;
      const tools=o.classMode?`<span class="hint-tools"><button data-hint="${sl.id}">${icon('hint',16)} Đọc gợi ý</button><button data-reveal="${sl.id}">Hiện đáp án</button></span>`:`<button class="hint-retry" data-retry="${sl.id}">Chọn lại</button>`;
      rows.push(`<li class="hint-row is-tier${msg.tier}" data-hint-row="${sl.id}"><span class="hint-badge" aria-hidden="true">${sl.id}</span><div class="hint-text"><span class="hint-step">${msg.tier?`Gợi ý ${msg.tier}/3`:'Chưa có gợi ý'}</span>${msg.text?`<p>${msg.text}</p>`:''}${msg.tier===2?'<p class="sub">Một thẻ nhiễu đã được làm mờ.</p>':''}</div>${tools}</li>`);
    }else if(st[sl.id].locked&&o.why&&o.why[sl.id]){
      rows.push(`<li class="hint-row hint-row--why" data-hint-row="${sl.id}"><span class="hint-badge hint-badge--ok" aria-hidden="true">${icon('check',13)}</span><div class="hint-text"><span class="hint-step">Vì sao? · Tình huống ${sl.id}</span><p>${sl.why}</p></div></li>`);
    }
  }
  if(!rows.length)return '';
  const title=wrong?(o.classMode?'Chưa đúng — MC đọc gợi ý hoặc mở đáp án':'Chưa đúng — đọc gợi ý rồi chọn lại'):'Lời giải';
  return `<div class="hints${wrong?' hints--wrong':''}" role="status"><p class="hints-title">${wrong?'✕ ':''}${title}</p><ul>${rows.join('')}</ul></div>`;
}

/* Lớp điểm nóng trên ảnh. Chưa khóa: nút A/B (cũng nhận thẻ). Đã khóa: dấu ✓ + hiệu ứng theo slot.fx
   (light = quầng sáng, seal = con dấu năm, route = đường mực nối hai điểm) + chú thích. o.fresh = các ô vừa đúng (chạy hiệu ứng một lần). */
function spots(D,run,o={}){
  if(E.kindOf(D.scenes[run.index])!=='match')return '';
  const s=D.scenes[run.index],st=run.stages[run.index],fresh=o.fresh||[];
  const [a,b]=s.slots;
  const lines=s.slots.filter(sl=>st[sl.id].locked&&sl.fx==='route').map(sl=>`<path class="route-draw${fresh.includes(sl.id)?' is-new':''}" d="M${a.x} ${a.y}Q${(a.x+b.x)/2} ${Math.min(a.y,b.y)-14} ${b.x} ${b.y}" pathLength="1"/>`).join('');
  const svg=lines?`<svg class="scene-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>`:'';
  const pts=s.slots.map(sl=>{
    const ss=st[sl.id],pos=`left:${sl.x}%;top:${sl.y}%`;
    if(ss.locked){
      const c=s.cards.find(x=>x.id===sl.correct);
      return `<div class="spot is-lit fx-${sl.fx}${fresh.includes(sl.id)?' is-new':''}" style="${pos}"><span class="fx-glow" aria-hidden="true"></span><span class="spot-pin" aria-hidden="true">${icon('check',16)}</span>${sl.fx==='seal'?`<span class="seal-mark" aria-hidden="true">${yearOf(c)}</span>`:''}<span class="spot-cap">${sl.caption}</span></div>`;
    }
    return `<button class="spot${ss.cardId?' has-card':''}${o.sel?' is-target':''}" style="${pos}" data-drop="${sl.id}" data-place="${sl.id}" aria-label="Điểm nóng ${sl.id}: ${esc(sl.situation)}"><span class="spot-pin">${sl.id}</span></button>`;
  }).join('');
  return svg+pts;
}


// Hàng ba ngôi sao của một chặng (đặc = đạt). Có chữ cho trình đọc màn hình, không báo bằng màu một mình.
function starRow(n,size=18){
  return `<span class="stars" role="img" aria-label="${n} trên 3 sao">${[1,2,3].map(k=>`<i class="star${k<=n?' is-on':''}" aria-hidden="true">${icon('star',size)}</i>`).join('')}</span>`;
}

/* Bản đồ hành trình: bản đồ Việt Nam thật (Natural Earth, dựng bởi tools/build-map.cjs → map-data.js) kiểu bản đồ cổ.
   Lớp: vân nước ven bờ → nước láng giềng → Việt Nam → sông → lưới kinh vĩ độ → quần đảo → chữ → tuyến hành trình → ghim.
   Điểm dừng lấy từ D.scenes[i].place {lat, lon}; điểm ngoài khung (Thượng Hải) vẽ thành mũi tên ở mép trên bên phải.
   size 'full' = cả nước, có tên địa danh · 'mini' = ô vuông cắt quanh điểm dừng hiện tại, không chữ. */
const MAPW=()=>window.MAP_DATA;
function mapView(M,o){
  const P=(la,lo)=>M.project(la,lo);
  if(o.size==='mini'&&o.at){const [x,y]=o.at,r=150;return [Math.max(0,Math.min(M.W-2*r,x-r)),Math.max(0,Math.min(M.H-2*r,y-r)),2*r,2*r];}
  const [x0,y0]=P(24.4,101.4),[x1,y1]=P(7.6,115.4);
  return [x0,y0,x1-x0,y1-y0];
}
// Tọa độ SVG của một địa danh; ngoài khung (Thượng Hải) thì đặt ở góc trên bên phải, nơi vẽ mũi tên
function placeXY(M,pl){
  if(pl.lat==null)return [pl.x,pl.y];
  if(pl.lat>M.lat[1]||pl.lon>M.lon[1]||pl.lat<M.lat[0]||pl.lon<M.lon[0])return [M.W-78,38];
  return M.project(pl.lat,pl.lon);
}
const placeAt=(D,i)=>placeXY(MAPW(),D.scenes[i].place);
function journeyMap(D,run,o={}){
  const M=MAPW(),full=o.size==='full';
  if(!M)return '';
  const done=D.scenes.map((s,i)=>E.isDone(run,i));
  const lit=D.scenes.map((s,i)=>i).filter(i=>done[i]);
  const at=i=>placeXY(M,D.scenes[i].place);
  const isOff=i=>{const pl=D.scenes[i].place;return pl.lat!=null&&(pl.lat>M.lat[1]||pl.lon>M.lon[1]);};
  const cur=o.now!=null?at(o.now):null;
  const vb=mapView(M,{size:o.size,at:cur});
  // Tuyến hành trình: cung cong nối các điểm đã qua, theo thứ tự chặng.
  const chap=o.chapter!=null,inCh=i=>chap&&D.scenes[i].chapter===o.chapter;
  const curve=(p,q)=>{const mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,dx=q[0]-p[0],dy=q[1]-p[1];return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}Q${(mx-dy*.13).toFixed(1)} ${(my+dx*.13).toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`;};
  const chStages=chap?D.scenes.map((s,i)=>i).filter(i=>inCh(i)&&done[i]):[];
  // Chế độ chương: các điểm của chương cách nhau < 70 đơn vị gom thành một cụm, hiện trong khung phóng to (như bản đồ cổ) thay vì ghim đè nhau
  let cluster=[];
  if(chap){
    const near=(a,b)=>Math.hypot(at(a)[0]-at(b)[0],at(a)[1]-at(b)[1])<70;
    let groups=[];
    chStages.filter(i=>!isOff(i)).forEach(i=>{const hit=groups.filter(g=>g.some(j=>near(i,j)));groups=groups.filter(g=>!hit.includes(g));groups.push([i].concat(...hit));});
    cluster=(groups.sort((x,y)=>y.length-x.length)[0]||[]).slice().sort((x,y)=>x-y);
    if(cluster.length<2)cluster=[];
  }
  const inCl=i=>cluster.includes(i);
  let zoom='',zoomPos=null,zoomBox='';
  if(cluster.length){
    const pts=cluster.map(at),xs=pts.map(q=>q[0]),ys=pts.map(q=>q[1]);
    const minx=Math.min(...xs),miny=Math.min(...ys),bw=Math.max(...xs)-minx,bh=Math.max(...ys)-miny;
    const hdr=30,rowH=36,ih=hdr+Math.max(cluster.length*rowH+20,210),iw=Math.min(380,vb[2]*.56),mw=Math.round(iw*.36),lw=iw-mw;
    const x0=vb[0]+vb[2]-iw-10,y0=M.project(22.2,113.55)[1]+22,mh=ih-hdr;
    const z=Math.min(2.8,(mh-34)/Math.max(bh,1),(mw-34)/Math.max(bw,1));
    const wx=minx-(mw/z-bw)/2,wy=miny-(mh/z-bh)/2;
    zoomPos=i=>{const q=at(i);return [x0+(q[0]-wx)*z,y0+hdr+(q[1]-wy)*z];};
    const rows=cluster.map((i,k)=>`<g class="jm-lab" data-stage="${i}" transform="translate(${(x0+mw+16).toFixed(1)} ${(y0+hdr+18+k*rowH+rowH/2).toFixed(1)})"><circle class="jm-lnb" r="12"/><text class="jm-lnn" y="5" text-anchor="middle">${i+1}</text><text class="jm-label" x="20" y="6">${esc(D.scenes[i].place.name)}</text></g>`).join('');
    const nest=`<svg class="jm-zoom-map" x="${x0.toFixed(1)}" y="${(y0+hdr).toFixed(1)}" width="${mw}" height="${mh}" viewBox="${wx.toFixed(1)} ${wy.toFixed(1)} ${(mw/z).toFixed(1)} ${(mh/z).toFixed(1)}" style="--z:${z.toFixed(3)}">${M.nb.map(n=>`<path class="jm-nb" d="${n.d}"/>`).join('')}<path class="jm-vn" d="${M.vn}"/>${M.rivers.map(r=>`<path class="jm-river${r.major?' is-major':''}" d="${r.d}"/>`).join('')}</svg>`;
    zoom=`<g class="jm-zoom"><rect class="jm-zbg" x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${iw.toFixed(1)}" height="${ih}"/><rect class="jm-zin" x="${(x0+5).toFixed(1)}" y="${(y0+5).toFixed(1)}" width="${(iw-10).toFixed(1)}" height="${ih-10}"/><text class="jm-ztitle" x="${(x0+16).toFixed(1)}" y="${(y0+22).toFixed(1)}">Việt Bắc – Bắc Bộ · phóng to</text>${nest}<path class="jm-zdiv" d="M${(x0+mw).toFixed(1)} ${y0+hdr}v${mh}"/>${rows}</g>`;
    const m=12;zoomBox=`<rect class="jm-zbox" data-cluster="${cluster.join(',')}" x="${(minx-m).toFixed(1)}" y="${(miny-m).toFixed(1)}" width="${(bw+2*m).toFixed(1)}" height="${(bh+2*m).toFixed(1)}" rx="3"/>`;
  }
  const posOf=i=>(zoomPos&&inCl(i))?zoomPos(i):at(i);
  let route='';
  if(chap){
    let fresh=0;
    for(let k=1;k<chStages.length;k++){
      const a=chStages[k-1],bI=chStages[k];
      if(inCl(a)!==inCl(bI))continue; // đoạn đi vào hoặc ra khỏi cụm không vẽ
      route+=`<path class="jm-route is-now" pathLength="1" style="--d:${(fresh++)*320}ms" d="${curve(posOf(a),posOf(bI))}"/>`;
    }
  }else{
    const pts=lit.map(at).filter((q,k,arr)=>k===0||Math.abs(q[0]-arr[k-1][0])+Math.abs(q[1]-arr[k-1][1])>1);
    if(pts.length>1)route=`<path class="jm-route" d="${pts.slice(1).map((q,k)=>curve(pts[k],q)).join('')}"/>`;
  }
  const land=M.nb.map(n=>n.d).concat([M.vn]);
  const halo=['jm-w1','jm-w2','jm-w3'].map(c=>`<g class="${c}">${land.map(d=>`<path d="${d}"/>`).join('')}</g>`).join('');
  const pins=D.scenes.map((s,i)=>{
    const on=done[i],pl=s.place,off=isOff(i);
    if(chap&&(!on||s.chapter>o.chapter))return '';
    const prevCh=chap&&s.chapter<o.chapter,zin=chap&&inCl(i);
    if(zin&&false)return '';
    const p=posOf(i);
    const east=p[0]<(vb[0]+vb[2]*.55),anchor=east?'start':'end';
    const showLabel=chap?(inCh(i)&&!zin):(full&&on);
    const label=showLabel?(off?`<text class="jm-label" x="14" y="38" text-anchor="end">${esc(pl.name)}</text>`:`<text class="jm-label" x="${east?22:-22}" y="6" text-anchor="${anchor}">${esc(pl.name)}</text>`):'';
    const arrow=off?`<path class="jm-arrow" d="M-26 4h22m-7-7 7 7-7 7"/>`:'';
    // ghim của chương trước nằm trong vùng cụm thì bỏ (chỉ còn trong khung phóng to nếu thuộc chương này)
    if(chap&&prevCh&&cluster.length&&Math.hypot(p[0]-at(cluster[0])[0],p[1]-at(cluster[0])[1])<70)return '';
    const mark=chap?(prevCh?'<circle class="jm-ring" r="8"/><circle class="jm-dot" r="3.5"/>':`<circle class="jm-ring" r="${zin?12:14}"/><text class="jm-num" y="5" text-anchor="middle">${i+1}</text>`):'<circle class="jm-ring" r="12"/><circle class="jm-dot" r="6"/>';
    return `<g class="jm-pin${on?' is-lit':''}${o.now===i?' is-now':''}${off?' is-off':''}${prevCh?' is-prev':''}${zin?' is-zoomed':''}" data-stage="${i}" transform="translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})">${arrow}<ellipse class="jm-shadow" cx="3" cy="4" rx="9" ry="4"/>${mark}${label}</g>`;
  }).join('');
  const txt=(c,x,y,t,rot=0,extra='')=>`<text class="${c}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle"${rot?` transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"`:''}${extra}>${t}</text>`;
  const pj=(la,lo)=>M.project(la,lo);
  const labels=full?[
    txt('jm-sea',...pj(14.2,111.4),'BIỂN ĐÔNG',-62),(cluster.length?'':txt('jm-sea jm-sea--s',...pj(19.9,107.6),'VỊNH BẮC BỘ',-34)),
    txt('jm-cty',...pj(24.0,104.2),'TRUNG QUỐC'),txt('jm-cty',...pj(19.4,102.7),'LÀO',-60),txt('jm-cty',...pj(12.9,104.4),'CAM-PU-CHIA')
  ].join(''):'';
  const isl=Object.values(M.isl).map(g=>`<g class="jm-isl">${g.pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${full?2.6:3.4}"/>`).join('')}${full?txt('jm-islname',g.at[0]+(g.label.includes('Hoàng')?0:-6),g.at[1]+(g.label.includes('Hoàng')?-22:-26),g.label):''}</g>`).join('');
  const lonT=M.ticks.lon.filter(t=>t.x>vb[0]+10&&t.x<vb[0]+vb[2]-10).map(t=>txt('jm-tick',t.x,vb[1]+22,t.v+'°Đ')).join('');
  const latT=M.ticks.lat.filter(t=>t.y>vb[1]+30&&t.y<vb[1]+vb[3]-10).map(t=>`<text class="jm-tick" x="${(vb[0]+8).toFixed(1)}" y="${(t.y-4).toFixed(1)}">${t.v}°B</text>`).join('');
  const rose=full?`<g class="jm-rose" transform="translate(${(vb[0]+78).toFixed(1)} ${(vb[1]+vb[3]-84).toFixed(1)})"><circle r="40"/><circle r="26"/><path d="M0 -52 8 -8 52 0 8 8 0 52 -8 8 -52 0 -8 -8Z"/><text y="-58" text-anchor="middle">B</text></g>`:'';
  const names=lit.map(i=>D.scenes[i].place.name);
  const alt=lit.length?`Bản đồ hành trình: đã qua ${lit.length} trên ${D.scenes.length} điểm, mới nhất là ${names[names.length-1]}`:'Bản đồ hành trình: chưa có điểm nào sáng';
  const body=`<g class="jm-halo">${halo}</g>${M.nb.map(n=>`<path class="jm-nb" d="${n.d}"/>`).join('')}<path class="jm-vn" d="${M.vn}"/>${M.lakes.map(d=>`<path class="jm-lake" d="${d}"/>`).join('')}${M.rivers.map(r=>`<path class="jm-river${r.major?' is-major':''}" d="${r.d}"/>`).join('')}<path class="jm-grat" d="${M.grat}"/>${isl}${labels}${full?lonT+latT:''}${zoomBox}${zoom}${route}${pins}${rose}`;
  const cap=o.size==='mini'&&o.now!=null?`<figcaption>${esc(D.scenes[o.now].place.name)}</figcaption>`:chap?'<figcaption class="jm-legend"><span class="lg lg-now"></span>Điểm của chương <span class="lg lg-old"></span>Chương trước <span class="lg lg-route"></span>Tuyến hành trình</figcaption>':'';
  return `<figure class="jmap jmap--${full?'full':'mini'}"><svg viewBox="${vb.map(v=>v.toFixed(1)).join(' ')}" role="img" aria-label="${esc(alt)}" focusable="false">${body}</svg>${cap}</figure>`;
}

/* Thẻ sưu tầm: thẻ đúng đã vào album, chạm để lật. Mặt sau: địa danh, câu ý nghĩa của ô (slot.caption) và ảnh tư liệu nếu chặng có, không thì biểu tượng chủ đề. */
function collectShelf(D,run,chapter=null){
  const list=E.timeline(run,D).filter(a=>chapter===null||D.scenes[a.scene].chapter===chapter);
  if(!list.length)return '';
  const items=list.map(a=>{
    const sc=D.scenes[a.scene],sl=sc.slots.find(x=>x.id===a.slot),img=sc.image||{};
    const art=img.src?`<img src="${img.src}" alt="${esc(img.alt||sc.place.name)}" loading="lazy">`:`<span class="coll-motif" aria-hidden="true">${icon(sc.motif||'flag',34)}</span>`;
    return `<li><button type="button" class="coll" data-coll aria-pressed="false" aria-label="Thẻ sưu tầm: ${esc(a.card.name)}. Chạm để lật."><span class="coll-in"><span class="coll-face coll-front"><b>${esc(a.card.year)}</b><span>${esc(a.card.name)}</span></span><span class="coll-face coll-back">${art}<span class="coll-place">${esc(sc.place.name)}</span><span class="coll-cap">${sl.caption}</span></span></span></button></li>`;
  }).join('');
  return `<section class="shelf" aria-label="Thẻ sưu tầm"><h3 class="shelf-title">Thẻ sưu tầm <small>chạm để lật mặt sau</small></h3><ul class="shelf-list">${items}</ul></section>`;
}

/* Kiểu đúng/sai (chương III): một câu một lần, nút Đúng / Sai to, 5 chấm tiến độ, thanh đếm ngược 20 giây (Lớp học: không tính giờ).
   o = {started, classMode, left (giây còn lại)}. Câu đã trả lời hiện chấm ✓ / ✕ (có ký hiệu, không chỉ màu). */
const TF_SECONDS=40;const tfSecs=scene=>(scene&&scene.tfSeconds)||TF_SECONDS;
function tfView(D,run,o={}){
  const t=run.stages[run.index].tf,items=E.tfItemsOf(run,D),n=items.length,secs=o.secs||TF_SECONDS;
  const tray=`<ol class="tf-tray" aria-label="Phiếu đã thẩm định ${t.i}/${n}">${items.map((it,k)=>`<li class="tf-slip${it.ok===true?' is-ok':it.ok===false?' is-bad':k===t.i&&o.started?' is-now':''}" data-slip="${k}"><span class="sr-only">Phiếu ${k+1}: ${it.ok===true?'đúng':it.ok===false?'sai':'chưa trả lời'}</span><span aria-hidden="true">${it.ok===true?'✓':it.ok===false?'✕':k+1}</span></li>`).join('')}</ol>`;
  if(t.done)return `<div class="tf-desk tf-desk--done"><p class="tf-result"><b>${t.pts}</b><span>/20 điểm</span><em>${items.filter(i=>i.ok).length}/${n} phiếu đúng</em></p>${tray}</div>`;
  const left=o.left==null?secs:o.left,rest=n-t.i-1;
  const pile=`${rest>1?'<i class="tf-sheet s3" aria-hidden="true"></i>':''}${rest>0?'<i class="tf-sheet s2" aria-hidden="true"></i>':''}`;
  if(!o.started)return `<div class="tf-desk is-ready"><div class="tf-pile is-closed"><i class="tf-sheet s3" aria-hidden="true"></i><i class="tf-sheet s2" aria-hidden="true"></i><div class="tf-sheet tf-top"><span class="tf-ribbon">Hồ sơ · ${n} phiếu</span><p class="tf-ready">${o.classMode?'Không tính giờ. MC đọc to từng phiếu rồi bấm SAI hoặc ĐÚNG theo lớp.':`Thẩm định ${n} phiếu trong ${secs} giây. Hết giờ, phiếu chưa chấm tính là sai.`}</p><button class="primary tf-start" id="tf-start">Mở hồ sơ ${icon('arrow')}</button></div></div></div>${tray}`;
  const it=items[t.i];
  const clock=o.classMode?'':`<div class="tf-clock${left<=5?' is-low':''}" style="--f:${left/secs}" role="progressbar" aria-label="Thời gian còn lại" aria-valuemin="0" aria-valuemax="${secs}" aria-valuenow="${Math.ceil(left)}"><output id="tf-time" aria-live="off">${Math.ceil(left)}</output></div>`;
  const stamp=(id,cls,mark,word,key,short)=>`<button class="tf-stamp tf-stamp--${cls}" id="${id}" aria-keyshortcuts="${key}"><span class="tf-stamp-face"><i aria-hidden="true">★</i><b>${word}</b><small aria-hidden="true">${mark}</small></span><kbd aria-hidden="true">${short}</kbd></button>`;
  const last=o.last?`<p class="tf-verdict ${o.last.ok?'is-ok':'is-bad'}" role="status"><b>${o.last.ok?'✓ Chính xác.':'✕ Chưa đúng.'}</b> ${o.last.item.explain}</p>`:'<p class="tf-verdict" aria-hidden="true">&nbsp;</p>';
  return `<div class="tf-desk">${stamp('tf-false','no','✕','SAI','ArrowLeft','←')}<div class="tf-pile">${pile}<article class="tf-sheet tf-top" data-top><header><span class="tf-no">Phiếu ${t.i+1}/${n}</span>${clock}</header><p class="tf-q" id="tf-q" aria-live="polite">${it.text}</p><span class="tf-hint tf-hint--no" aria-hidden="true">SAI</span><span class="tf-hint tf-hint--yes" aria-hidden="true">ĐÚNG</span></article></div>${stamp('tf-true','yes','✓','ĐÚNG','ArrowRight','→')}</div>${last}${tray}`;
}
// Sau chặng đúng/sai: từng câu, đáp án đúng và lời giải
function tfReview(D,run){
  const items=E.tfItemsOf(run,D);
  return `<ol class="tf-review" aria-label="Đáp án từng câu">${items.map(it=>`<li class="${it.ok?'is-ok':'is-bad'}"><span class="tf-mark" aria-hidden="true">${it.ok?'✓':'✕'}</span><div><p>${it.text} <b>${it.answer?'Đúng':'Sai'}.</b>${it.ok?'':` <em>${it.ans===null?'Chưa kịp trả lời.':'Bạn chọn '+(it.ans?'Đúng':'Sai')+'.'}</em>`}</p><p class="tf-why">${it.explain}</p></div></li>`).join('')}</ol>`;
}

/* Màn trùm (chặng 9): chọn 4 trong 8 thẻ đã sưu tầm làm bằng chứng "chuẩn bị lâu dài". Sau khi chốt: ✓ chọn đúng, ✕ chọn nhầm (thẻ thời cơ), "bỏ sót". */
function bossView(D,run,o={}){
  const b=run.stages[run.index].boss,pool=E.bossPoolOf(run,D),n=E.BOSS_PICK,cnt=b.picked.filter(Boolean).length;
  const num=key=>pool.findIndex(x=>x.key===key)+1;
  // Thẻ bằng chứng: phiếu vé như các chặng trước, ẩn năm tới khi chốt. data-boss = khóa duy nhất (thẻ trùng id giữa các chặng).
  const card=it=>{
    let cls='',mark='';
    if(b.done&&b.picked.includes(it.key)){cls=it.prep?' is-ok':' is-bad';mark=it.prep?'✓ Bằng chứng đúng':'✕ Thời cơ, không phải chuẩn bị';}
    else if(b.done&&it.prep){cls=' is-miss';mark='Bỏ sót';}
    const h=evCard(it.card,num(it.key),'tray',{hideYear:!b.done}).replace(/ data-card="[^"]*"/,` data-boss="${it.key}"`).replace('class="ev ',`class="ev${cls} `);
    const out=b.done?h.replace('<button ','<button disabled '):h;
    return mark?out.replace(/<\/button>$/,`<span class="boss-mark">${mark}</span></button>`):out;
  };
  const col=items=>`<ul class="boss-col">${items.map((it,k)=>`<li style="--t:${(k%2?1:-1)*(1+k%3*.2)}deg">${b.picked.includes(it.key)?'<span class="boss-hole" aria-hidden="true"></span>':card(it)}</li>`).join('')}</ul>`;
  const bins=b.picked.map((key,k)=>{const it=key&&pool.find(x=>x.key===key);return `<div class="bin${it?' has-card':''}" data-bin="${k}" style="--i:${k}" role="group" aria-label="Ô bằng chứng ${k+1}/${n}${it?'':', còn trống'}">${it?card(it):''}</div>`;}).join('');
  const foot=b.done
    ?`<p class="tf-result"><b>${b.pts}</b><span>/20 điểm</span><em>${b.pts/5}/${n} bằng chứng đúng</em></p>`
    :`<p class="boss-count" aria-live="polite">${o.nudge&&cnt<n?`Còn thiếu ${n-cnt} bằng chứng`:cnt>=n?'Rổ đã đầy, lấy một thẻ ra nếu muốn đổi':`Đã bỏ ${cnt}/${n}`}</p><button class="primary${cnt>=n?' is-ready':''}" id="boss-submit">Đóng hồ sơ ${icon('arrow')}</button>`;
  return `<div class="boss-card${b.done?' is-done':''}"><p class="boss-kicker">Màn trùm</p><h3 class="boss-q">Cách mạng Tháng Tám có phải là “ăn may”?</h3><p class="boss-sub">Kéo ${n} thẻ chứng minh đây là kết quả của <b>chuẩn bị lâu dài</b>, không chỉ của thời cơ tháng 8/1945, vào rổ.</p><div class="boss-board">${col(pool.slice(0,4))}<div class="basket" id="basket"><span class="basket-label">Bằng chứng</span><div class="basket-bins">${bins}</div>${b.done?'<span class="boss-seal" aria-hidden="true"><i>★</i><b>Đã thẩm định</b></span>':''}</div>${col(pool.slice(4))}</div><div class="boss-foot">${foot}</div></div>`;
}

// Khối cuối chặng: lời giải lịch sử + chuỗi nhân quả; chặng 9 chế độ Lớp học có thêm câu thưởng
function stageDone(D,run,o={}){
  const s=D.scenes[run.index],pts=E.stagePoints(run,run.index);
  const bonus=o.classMode&&s.bonus?`<div class="bonus"><div class="eyebrow">Câu hỏi thưởng · BTC chấm 0–20 điểm</div><p class="bonus-q">${s.bonus}</p><div class="bonus-tools"><output id="bonus-time" class="bonus-time" aria-live="off">1:00</output><button id="bonus-go">${icon('timer',18)} Bắt đầu 1 phút</button></div></div>`:'';
  return `<div class="feedback"><div class="feedback-text"><div class="eyebrow">Chặng ${run.index+1} hoàn thành · ${pts}/20 điểm ${starRow(E.stars(pts))}</div>${E.kindOf(s)==='tf'?tfReview(D,run):''}<p><strong>Trong lịch sử:</strong> ${s.explain}</p><div class="chain">${s.link}</div><button class="text-link" id="more" type="button">${icon('book',18)} Mở hồ sơ giai đoạn</button>${bonus}</div>${journeyMap(D,run,{size:'mini',now:run.index})}</div>`;
}

// Tổng kết cuối chương: album của chương + điểm chương + nút sang chương sau
function chapterSummary(D,run,chapter,o={}){
  const stages=D.scenes.map((s,i)=>i).filter(i=>D.scenes[i].chapter===chapter);
  const pts=stages.reduce((a,i)=>a+E.stagePoints(run,i),0),max=stages.length*20;
  const items=E.timeline(run,D).filter(a=>D.scenes[a.scene].chapter===chapter).map(a=>{const sl=D.scenes[a.scene].slots.find(x=>x.id===a.slot);return `<li data-stage="${a.scene}"><b class="tl-year">${esc(a.card.year)}</b><div><span class="tl-name">${esc(a.card.name)}</span><span class="tl-sit">${sl.situation}</span></div></li>`;}).join('');
  const links=stages.map(i=>`<li>${D.scenes[i].link}</li>`).join('');
  // Mỗi chặng: sao đạt được; chặng chưa đủ 3 sao có link chơi lại (điểm giữ bản cao hơn nên tổng không vượt 180)
  const rows=stages.map(i=>{const p=E.stagePoints(run,i),n=E.stars(p);return `<li data-stage="${i}"><span class="ss-name">Chặng ${i+1} · ${esc(D.scenes[i].title)}</span>${starRow(n,16)}<b class="ss-pts">${p}/20</b>${n<3?`<button type="button" class="text-link" data-retry-stage="${i}">Chơi lại để đủ 3 sao</button>`:''}</li>`;}).join('');
  return sheet(`<div class="chapter-break chapter-break--map"><div class="eyebrow">Hoàn thành chương ${chapter+1} · ${D.chapters[chapter].years}</div><h1 class="place">${D.chapters[chapter].name}</h1><p class="chapter-score"><b>${pts}</b>/${max} điểm của chương</p><div class="cb-grid"><div class="cb-main"><h2 class="sr-only">Dòng thời gian của chương</h2><ol class="tl-list">${items}</ol><ul class="stage-stars" aria-label="Sao từng chặng">${rows}</ul></div><div class="cb-map">${journeyMap(D,run,{size:'full',chapter,now:stages[stages.length-1]})}</div></div>${collectShelf(D,run,chapter)}<ul class="links">${links}</ul><button id="next" class="primary">Sang chương tiếp theo →</button></div>`,o.enter);
}

// Màn kết (sau đoạn phim cờ / Tuyên ngôn / Quốc ca): điểm, album 1930–1945, danh sách cần ôn, bốn bài học
function ending(D,run,o={}){
  const score=E.score(run),max=E.MAX(D),rev=E.review(run,D);
  const verdict=score===max?'Trọn vẹn: không ô nào phải gợi ý.':score>=max*.75?'Rất tốt: nắm vững phần lớn các mốc.':score>=max*.5?'Khá: còn vài mốc cần ôn lại.':'Mới bắt đầu: hãy xem danh sách ôn bên dưới rồi chơi lại.';
  const totalStars=D.scenes.reduce((a,s,i)=>a+E.stars(E.stagePoints(run,i)),0);
  const tl=E.timeline(run,D).map(a=>`<li><b class="tl-year">${esc(a.card.year)}</b><span class="tl-name">${esc(a.card.name)}</span>${a.how==='first'?'':`<span class="tl-flag">${a.how==='skipped'?'bỏ qua':a.how==='revealed'?'xem đáp án':'cần ôn'}</span>`}</li>`).join('');
  const review=rev.length?`<section class="review"><h3>Cần ôn lại (${rev.length})</h3><ul>${rev.map(r=>`<li><div class="rv-top"><b>${esc(r.card.year)} · ${esc(r.card.name)}</b><span class="rv-pts">${r.pts} điểm · ${HOW[r.how]}</span></div><p class="rv-sit"><em>Tình huống:</em> ${r.situation}</p><p class="rv-why">${r.why}</p></li>`).join('')}</ul></section>`:'<p class="stamp stamp--big">Không ô nào cần ôn</p>';
  const pillars=[['01 · Lãnh đạo','Nhận định đúng, hành động kịp thời','Đảng và Hồ Chí Minh xác định nhiệm vụ, tập hợp lực lượng, điều chỉnh phương pháp và nắm bắt thời cơ.'],['02 · Nhân dân','Sức mạnh của đoàn kết','Quần chúng được vận động, tổ chức và trực tiếp tham gia đấu tranh giành chính quyền.'],['03 · Chuẩn bị','Thành quả tích lũy lâu dài','Lực lượng chính trị, vũ trang, tổ chức và căn cứ được xây dựng qua nhiều giai đoạn.'],['04 · Quốc tế','Thời cơ thuận lợi','Thắng lợi Đồng minh và Nhật đầu hàng tạo điều kiện khách quan; sự chuẩn bị giúp biến thời cơ thành thắng lợi.']];
  return sheet(`<div class="end"><div class="end-hero"><div><p class="end-score"><span id="final-score">${score}</span><small>/${max} điểm</small></p><p class="end-stars">${starRow(Math.round(totalStars/D.scenes.length),22)} <small>${totalStars}/${D.scenes.length*3} sao</small></p><h1 class="place">Độc lập là thành quả<br>của cả một hành trình.</h1><p>${verdict}</p></div></div>`
  +`<div class="end-body"><section class="album-full" data-reveal><h3>Dòng thời gian 1930–1945 do bạn hoàn thành</h3><div class="cb-grid"><ol class="tl-list tl-list--full">${tl}</ol>${journeyMap(D,run,{size:'full'})}</div></section>${collectShelf(D,run)}${review}`
  +`<div class="end-grid">${pillars.map(([k,h,p],i)=>`<article data-reveal style="--i:${i}"><div class="eyebrow">${k}</div><h3>${h}</h3><p>${p}</p></article>`).join('')}</div>`
  +`<p class="end-note">Nước Việt Nam Dân chủ Cộng hòa ra đời; nhân dân từ địa vị bị trị trở thành người làm chủ. Thắng lợi cổ vũ phong trào giải phóng dân tộc trên thế giới.</p><div class="actions"><button id="end-records">Đọc hồ sơ đầy đủ</button>${run.mode==='class'?`<button id="open-scoresheet">${icon('print',18)} Phiếu ghi điểm</button>`:''}<button type="button" id="replay-ending">Xem lại đoạn kết</button><button id="replay" class="primary">Chơi lại</button></div><p class="end-credit">Nhạc nền: “Eternal Hope”, “Long Road Ahead”, “Lasting Hope”, “Ascending the Vale”, “Heroic Age” – Kevin MacLeod (incompetech.com), giấy phép CC BY 4.0. Nguồn đầy đủ: docs/am-thanh.md.</p></div></div>`,o.enter);
}

// Phiếu ghi điểm cho ban tổ chức (chế độ Lớp học): bảng chặng × team, tổng tự cộng, in được. Điểm lưu trong trình duyệt (localStorage).
function scoresheet(D,teams=4){
  const head=Array.from({length:teams},(_,t)=>`<th scope="col">Team ${t+1}</th>`).join('');
  const rows=D.scenes.map((s,i)=>`<tr><th scope="row">${i+1}<small>${s.date}</small></th>${Array.from({length:teams},(_,t)=>`<td><input inputmode="numeric" maxlength="2" data-team="${t}" data-row="${i}" aria-label="Chặng ${i+1}, Team ${t+1}"></td>`).join('')}</tr>`).join('');
  const sums=Array.from({length:teams},(_,t)=>`<td data-sum="${t}">0</td>`).join('');
  return `<div class="paper-topline"><span>PHIẾU GHI ĐIỂM · CHẾ ĐỘ LỚP HỌC</span><span>1930 — 1945</span></div><div class="dialog-head"><div><div class="paper-kicker">DÀNH CHO BAN TỔ CHỨC</div><h2 id="sheet-title">Phiếu ghi điểm</h2></div><div class="dialog-btns"><button id="sheet-save">Lưu phiếu</button><button id="sheet-print">${icon('print',18)} In phiếu</button><button id="sheet-close" aria-label="Đóng phiếu">Đóng ×</button></div></div><table class="scoretable"><thead><tr><th scope="col">Chặng</th>${head}</tr></thead><tbody>${rows}</tbody><tfoot><tr><th scope="row">Tổng / 180</th>${sums}</tr></tfoot></table><ul class="rules"><li><b>Cách A (khuyên dùng):</b> mọi team cùng ghi đáp án, giơ bảng cùng lúc; mỗi ô đúng +10, không chọn lại.</li><li><b>Cách B:</b> mỗi chặng giao một team: đúng ngay +10 mỗi ô; chưa đúng thì MC đọc gợi ý, team khác giành quyền đúng +5; không ai đúng thì mở đáp án, không ai được điểm ô đó.</li><li><b>Thưởng chặng 9:</b> BTC chấm thêm 0–20 điểm cho câu “Cách mạng Tháng Tám có phải ăn may?”.</li><li><b>Hòa điểm:</b> team đúng nhiều ô hơn ở chương III (1939–1945) thắng.</li></ul>`;
}

// Nội dung hộp Hồ sơ lịch sử. Mỗi hồ sơ là [tiêu đề, nội dung, image tùy chọn]
// only = danh sách chỉ số hồ sơ cần hiện (mặc định: tất cả); open = chỉ số hồ sơ mở sẵn. Số thứ tự 01–09 giữ nguyên theo hồ sơ gốc.
function records(D,only,open){
  const idx=only||D.records.map((_,i)=>i);
  const items=idx.map(i=>{const [title,body,img]=D.records[i];return `<details style="counter-set:folio ${i}"${i===open?' open':''}><summary>${title}</summary>${photo(img,{w:16,h:10,cls:'photo--record'})}<p>${body}</p></details>`;}).join('');
  return items+(idx.length<D.records.length?'<p class="records-note">Các hồ sơ sau sẽ mở khi bạn đi tới giai đoạn đó.</p>':'');
}

return {placeAt,bossView,tfView,TF_SECONDS,tfSecs,starRow,journeyMap,collectShelf,chapterIntro,strip,play,tray,slots,hints,spots,stageDone,chapterSummary,ending,scoresheet,records,icon};})();
