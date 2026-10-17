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
const HOW={first:'Đúng ngay lần đầu',retry:'Đúng ở lần chọn lại',faded:'Đúng sau khi thẻ bị làm mờ',revealed:'Đã xem đáp án',skipped:'Đã bỏ qua, ôn lại sau'};

/* Tờ bản đồ: khối giấy da nằm giữa quầng đèn.
   enter = true: tờ bản đồ trượt vào (chỉ khi vừa vào chương). .sheet-light là ánh đèn rọi lên giấy, game.js dời tâm sáng. */
const sheet=(inner,enter)=>`<div class="sheet${enter?' sheet--in':''}"><div class="sheet-light" aria-hidden="true"></div>${inner}</div>`;

/* Chữ uốn cung theo đường cong nhẹ, như địa danh uốn theo bờ biển trên bản đồ cổ. CHỈ dùng cho
   tên chương (màn mở chương). Có bản chữ thường ẩn cho trình đọc màn hình; SVG bị aria-hidden. */
function arc(text,id){
  const fs=Math.min(64,Math.floor(1500/Math.max(text.length,1)));
  return `<span class="sr-only">${esc(text)}</span><svg class="arc" viewBox="0 0 800 170" aria-hidden="true" focusable="false"><defs><path id="${id}" d="M30 140Q400 66 770 140" fill="none"/></defs><text class="place" font-size="${fs}"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${esc(text)}</textPath></text></svg>`;
}

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
    const dots=ss?`<span class="route-ab" aria-hidden="true">${['A','B'].map(id=>{const x=ss[id];return `<i class="ab${x.locked?(x.how==='first'?' ab--ok':' ab--weak'):''}${o.fresh&&o.fresh.includes(i+id)?' is-incoming':''}" data-ab="${i}${id}"></i>`;}).join('')}</span>`:'';
    const evs=ss?['A','B'].filter(id=>ss[id].locked).map(id=>{const c=s.cards.find(c=>c.id===s.slots.find(x=>x.id===id).correct);return ` · ${c.name}`;}).join(''):'';
    return `<li class="route-item is-${st}${first?' is-first':''}${i<cur?' seg-done':''}" style="--i:${i}">${year}<span class="route-stop" role="img" tabindex="0" aria-label="Chặng ${i+1}: ${esc(s.title)}, ${label}"><span class="route-dot"></span><span class="route-tip" aria-hidden="true">${i+1} · ${esc(s.title)}${esc(evs)}</span></span>${dots}</li>`;
  }).join('');
  const here=D.scenes[cur];
  return `<ol class="route${o.seq?' route--seq':''}" aria-label="Tuyến hành trình: ${cur<0?'chưa bắt đầu':cur>=n?'đã hoàn thành '+n+' chặng':'đang ở chặng '+(cur+1)+' trên '+n}">${stops}</ol>${here?`<p class="route-now" aria-hidden="true">Chặng ${cur+1} · ${esc(here.title)}</p>`:''}`;
}

/* Dải trên nền phòng: MỘT thanh tiến trình (tuyến 9 chặng, mỗi mốc có hai chấm A/B) + điểm.
   o.fresh = các ô vừa đúng, dạng "0A" (chấm ẩn cho tới khi thẻ bay tới nơi). Album đầy đủ nằm ở tổng kết chương và màn kết. */
function strip(D,run,o={}){
  const cur=run.index>=D.scenes.length?D.scenes.length:run.index;
  return `<div class="strip-inner"><div class="route-wrap">${route(D,cur,{...o,run})}</div><div class="score" role="status" aria-label="Điểm: ${E.score(run)} trên ${E.MAX(D)}"><span class="score-n" id="score-n">${E.score(run)}</span><span class="score-max">/${E.MAX(D)}</span></div></div>`;
}

// Màn mở đầu chương (nền phòng, chưa có tờ bản đồ): ảnh đặt trên bàn dưới đèn, tên chương uốn cung.
// Chương 1 có thêm "Cách chơi" và công tắc chế độ Lớp học. Bấm "Vào chương" hoặc Enter thì tờ bản đồ trượt vào.
function chapterIntro(D,i,run){
  const c=D.chapters[i];
  const how=i===0?`<ol class="howto"><li>Mỗi chặng có <b>2 tình huống</b> (điểm nóng A và B) và <b>4 thẻ sự kiện</b> kèm năm.</li><li>Kéo (hoặc chạm chọn rồi chạm ô) mỗi thẻ vào đúng tình huống, rồi bấm <b>Triển khai</b>.</li><li>Chưa đúng thì có gợi ý tăng dần. Đúng ngay lần đầu được 10 điểm, tối đa 180.</li></ol><label class="mode-switch"><input type="checkbox" id="mode-class"${run.mode==='class'?' checked':''}><span class="mode-box" aria-hidden="true"></span><span><b>Chế độ Lớp học</b><small>Chiếu lên màn hình lớn, người điều khiển (MC) thao tác, ban tổ chức tự ghi điểm.</small></span></label>`:'';
  return `<section class="chapter-intro"><div class="intro-media">${photo(c.image,{w:3,h:2,cls:'photo--table photo--intro',develop:'intro'})}</div><div class="chapter-intro-text"><span class="eyebrow">Chương ${i+1} · ${c.years}</span><h1 class="intro-title">${arc(c.name,'arc-chapter')}</h1>${how}<button class="primary" id="chapter-go">Vào chương ${icon('arrow')}</button><p class="hint">Hoặc nhấn Enter</p></div></section>`;
}

/* ---------- Màn chơi một chặng ---------- */
// Mặt trống đồng Đông Sơn (SVG nét mảnh): ngôi sao 14 cánh ở tâm, các vòng hoa văn quanh. Làm nền cho cảnh chưa có ảnh.
function drum(){
  const R=(r,a)=>[100+r*Math.sin(a),100-r*Math.cos(a)].map(n=>n.toFixed(1)).join(',');
  const star=Array.from({length:28},(_,i)=>R(i%2?22:44,i*Math.PI/14)).join(' ');
  const rays=Array.from({length:36},(_,i)=>{const a=i*Math.PI/18;return `M${R(58,a)}L${R(66,a)}`;}).join('');
  const tri=Array.from({length:24},(_,i)=>{const a=(i+.5)*Math.PI/12;return `${R(74,a-.07)} ${R(86,a)} ${R(74,a+.07)}`;}).map(p=>`<polygon points="${p}"/>`).join('');
  return `<svg class="drum" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width=".8"><circle cx="100" cy="100" r="96"/><circle cx="100" cy="100" r="92"/><circle cx="100" cy="100" r="70"/><circle cx="100" cy="100" r="56"/><circle cx="100" cy="100" r="48"/><polygon points="${star}"/><path d="${rays}"/>${tri}</g></svg>`;
}

// Ảnh cảnh với lớp điểm nóng. Ảnh thật dùng đúng tỉ lệ của file; chưa có ảnh thì dùng khung 16:10 với mặt trống đồng + biểu tượng chủ đề của chặng.
function scenePhoto(s){
  const img=s.image||{};
  const w=img.width||16,h=img.height||10;
  const pic=img.src?`<img src="${img.src}" alt="${img.alt||''}" width="${w}" height="${h}" decoding="async">`:'';
  const credit=img.src?[img.composite?'Ảnh tư liệu (ảnh ghép)':'Ảnh tư liệu',img.date,img.source&&'Nguồn: '+img.source].filter(Boolean).join(' · '):'Ảnh tư liệu sẽ được bổ sung';
  const art=img.src?`<div class="scene-art scene-art--corner">${drum()}</div>`:`<div class="scene-art">${drum()}<span class="scene-motif">${icon(s.motif||'flag',56)}</span></div>`;
  return `<figure class="photo scene-photo${img.src?'':' is-blank'}"><div class="photo-media" style="aspect-ratio:${w}/${h};--focus:${img.focus||'50% 50%'}">${pic}${art}<div class="spots" id="spots"></div></div><figcaption>${credit}</figcaption></figure>`;
}

function play(D,run,o={}){
  const s=D.scenes[run.index];
  return sheet(`<header class="sheet-head"><div><span class="eyebrow">Chương ${s.chapter+1} · ${s.date} · Chặng ${run.index+1}/9</span><h2 class="place">${s.title}</h2></div><button class="text-link" id="more">${icon('book',18)} Hồ sơ giai đoạn</button></header>`
  +`<div class="stage" id="stage"><p class="brief">${s.news}</p>`
  +`<div class="stage-main"><div class="col-left"><div class="scene" id="scene" data-lit="0">${scenePhoto(s)}</div><div id="hints" aria-live="polite" hidden></div></div>`
  +`<div class="col-right"><div class="slots" id="slots"></div>`
  +`<div class="bottom"><span id="save-status" class="toast" aria-live="polite"></span><div class="bottom-btns"><button id="skip" class="link-btn">${icon('skip',16)} Bỏ qua, ôn lại sau</button><button class="primary" id="commit" disabled>Triển khai →</button></div></div></div></div>`
  +`<div class="tray-wrap"><div class="tray" id="tray" role="group" aria-label="4 phiếu sự kiện, xếp theo thời gian"></div></div>`
  +`<div id="feedback" aria-live="polite"></div></div>`,o.enter);
}

// Thẻ sự kiện. kind: 'tray' | 'placed' (đang ở ô, còn kéo được) | 'locked' (đã đúng, khóa)
const KIND_LABEL={meeting:'Hội nghị',document:'Văn kiện',crowd:'Phong trào',flag:'Khởi nghĩa',star:'Lực lượng vũ trang',rice:'Cứu đói',base:'Căn cứ'};
/* Phiếu sự kiện kiểu vé tư liệu retro: dải đầu màu theo loại (số, năm, biểu tượng), đường đục lỗ, thân giấy (tên + nhãn loại).
   kind: 'tray' | 'placed' (đang ở ô, còn kéo được) | 'locked' (đã đúng, khóa) */
function evCard(c,n,kind,o={}){
  const faded=!!o.faded,k=kindOf(c),label=`Thẻ ${n}: ${c.year}, ${c.name}${faded?', đã loại':''}`;
  const num=kind==='locked'?icon('check',14):n;
  const inner=`<span class="ev-head"><span class="ev-n" aria-hidden="true">${num}</span><span class="ev-year">${esc(c.year)}</span><span class="ev-icon" aria-hidden="true">${icon(k,18)}</span></span><span class="ev-body"><span class="ev-name">${esc(c.name)}</span><span class="ev-kind">${KIND_LABEL[k]}</span>${faded?'<span class="ev-tag">Đã loại</span>':''}</span>`;
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
    if(!inTray.has(id)){const where=E.SLOT_IDS.find(k=>st[k].cardId===id);return `<div class="tl-slot is-empty">${pin}<div class="ev-gap" aria-hidden="true"><span>${where?'đã gắn vào '+where:''}</span></div></div>`;}
    return `<div class="tl-slot">${pin}${evCard(c,n,'tray',{selected:o.sel===id,faded:E.isFaded(run,id)})}</div>`;
  }).join('');
  return `${garland()}<div class="tl-cards">${cards}</div>`;
}

/* Hai ô tình huống (điểm nóng A, B). o = {sel, msg:{A:{tier,text,stamp}}, why:{A:true}, classMode}
   Ô chưa khóa: vùng thả (nhận thẻ) + thông báo gợi ý. Ô đã khóa: thẻ đúng, điểm, "Vì sao?". */
function slots(D,run,o={}){
  const s=D.scenes[run.index],st=run.stages[run.index],order=E.orderOf(run,D);
  return s.slots.map(sl=>{
    const ss=st[sl.id],cardId=ss.cardId,card=cardId?s.cards.find(c=>c.id===cardId):null,n=card?order.indexOf(card.id)+1:0;
    const head=`<div class="slot-band"><span class="slot-badge" aria-hidden="true">${ss.locked?icon('check',14):sl.id}</span><span class="slot-label">Tình huống ${sl.id}</span><span class="slot-no" aria-hidden="true">Hồ sơ ${run.index+1}/9</span></div><p class="slot-situation">${sl.situation}</p>`;
    if(ss.locked){
      const m=s.cards.find(c=>c.id===sl.correct),mn=order.indexOf(m.id)+1,open=o.why&&o.why[sl.id];
      return `<section class="slot is-locked is-${ss.how}" data-slot="${sl.id}">${head}<div class="slot-drop">${evCard(m,mn,'locked')}</div><div class="slot-result"><span class="pts${ss.pts===0?' pts--zero':''}">${ss.pts===10?'+10':ss.pts===5?'+5':'0'} <small>điểm</small></span><span class="how">${HOW[ss.how]||''}</span><button class="text-link" data-why="${sl.id}" aria-expanded="${!!open}" aria-controls="hints">${icon('why',18)} Vì sao?</button></div></section>`;
    }
    const msg=o.msg&&o.msg[sl.id];
    return `<section class="slot${card?' has-card':''}${o.sel&&!card?' is-target':''}${msg?' is-wrong':''}" data-slot="${sl.id}" data-drop="${sl.id}">${msg?head.replace(/<span class="slot-no"[^>]*>[^<]*<\/span>/,'<span class="slot-no slot-no--bad">Chưa phù hợp</span>'):head}<div class="slot-drop"${card?'':` tabindex="0" role="button" aria-label="Đặt thẻ vào tình huống ${sl.id}" data-place="${sl.id}"`}>${card?evCard(card,n,'placed',{selected:o.sel===card.id}):`<span class="drop-hint">Thả thẻ vào đây</span>`}</div></section>`;
  }).join('');
}

/* Sổ gợi ý (dưới ảnh cảnh): mỗi ô sai một dòng gợi ý theo nấc; ô đã đúng mở "Vì sao?" thì hiện lời giải ở đây.
   Chế độ Lớp học: dòng của ô sai có nút "Đọc gợi ý" / "Hiện đáp án" cho MC. Rỗng nếu không có gì để hiện. */
function hints(D,run,o={}){
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

// Khối cuối chặng: lời giải lịch sử + chuỗi nhân quả; chặng 9 chế độ Lớp học có thêm câu thưởng
function stageDone(D,run,o={}){
  const s=D.scenes[run.index],pts=E.stagePoints(run,run.index);
  const bonus=o.classMode&&s.bonus?`<div class="bonus"><div class="eyebrow">Câu hỏi thưởng · BTC chấm 0–20 điểm</div><p class="bonus-q">${s.bonus}</p><div class="bonus-tools"><output id="bonus-time" class="bonus-time" aria-live="off">1:00</output><button id="bonus-go">${icon('timer',18)} Bắt đầu 1 phút</button></div></div>`:'';
  return `<div class="feedback"><div class="eyebrow">Chặng ${run.index+1} hoàn thành · ${pts}/20 điểm</div><p><strong>Trong lịch sử:</strong> ${s.explain}</p><div class="chain">${s.link}</div>${bonus}</div>`;
}

// Tổng kết cuối chương: album của chương + điểm chương + nút sang chương sau
function chapterSummary(D,run,chapter,o={}){
  const stages=D.scenes.map((s,i)=>i).filter(i=>D.scenes[i].chapter===chapter);
  const pts=stages.reduce((a,i)=>a+E.stagePoints(run,i),0),max=stages.length*20;
  const items=E.timeline(run,D).filter(a=>D.scenes[a.scene].chapter===chapter).map(a=>{const sl=D.scenes[a.scene].slots.find(x=>x.id===a.slot);return `<li><b class="tl-year">${esc(a.card.year)}</b><div><span class="tl-name">${esc(a.card.name)}</span><span class="tl-sit">${sl.situation}</span></div></li>`;}).join('');
  const links=stages.map(i=>`<li>${D.scenes[i].link}</li>`).join('');
  return sheet(`<div class="chapter-break"><div class="eyebrow">Hoàn thành chương ${chapter+1} · ${D.chapters[chapter].years}</div><h1 class="place">${D.chapters[chapter].name}</h1><p class="chapter-score"><b>${pts}</b>/${max} điểm của chương</p><h2 class="sr-only">Dòng thời gian của chương</h2><ol class="tl-list">${items}</ol><ul class="links">${links}</ul><button id="next" class="primary">Sang chương tiếp theo →</button></div>`,o.enter);
}

// Màn kết: điểm, album 1930–1945 hoàn chỉnh, danh sách cần ôn kèm lời giải, bốn bài học
function ending(D,run,o={}){
  const score=E.score(run),max=E.MAX(D),rev=E.review(run,D);
  const verdict=score===max?'Trọn vẹn: không ô nào phải gợi ý.':score>=max*.75?'Rất tốt: nắm vững phần lớn các mốc.':score>=max*.5?'Khá: còn vài mốc cần ôn lại.':'Mới bắt đầu: hãy xem danh sách ôn bên dưới rồi chơi lại.';
  const dateStamp='<span class="stamp stamp--date">2 tháng 9 năm 1945</span>';
  const pic=photo(D.endingImage,{w:500,h:260,develop:'slow',extra:dateStamp});
  const tl=E.timeline(run,D).map(a=>`<li><b class="tl-year">${esc(a.card.year)}</b><span class="tl-name">${esc(a.card.name)}</span>${a.how==='first'?'':`<span class="tl-flag">${a.how==='skipped'?'bỏ qua':a.how==='revealed'?'xem đáp án':'cần ôn'}</span>`}</li>`).join('');
  const review=rev.length?`<section class="review"><h3>Cần ôn lại (${rev.length})</h3><ul>${rev.map(r=>`<li><div class="rv-top"><b>${esc(r.card.year)} · ${esc(r.card.name)}</b><span class="rv-pts">${r.pts} điểm · ${HOW[r.how]}</span></div><p class="rv-sit"><em>Tình huống:</em> ${r.situation}</p><p class="rv-why">${r.why}</p></li>`).join('')}</ul></section>`:'<p class="stamp stamp--big">Không ô nào cần ôn</p>';
  const pillars=[['01 · Lãnh đạo','Nhận định đúng, hành động kịp thời','Đảng và Hồ Chí Minh xác định nhiệm vụ, tập hợp lực lượng, điều chỉnh phương pháp và nắm bắt thời cơ.'],['02 · Nhân dân','Sức mạnh của đoàn kết','Quần chúng được vận động, tổ chức và trực tiếp tham gia đấu tranh giành chính quyền.'],['03 · Chuẩn bị','Thành quả tích lũy lâu dài','Lực lượng chính trị, vũ trang, tổ chức và căn cứ được xây dựng qua nhiều giai đoạn.'],['04 · Quốc tế','Thời cơ thuận lợi','Thắng lợi Đồng minh và Nhật đầu hàng tạo điều kiện khách quan; sự chuẩn bị giúp biến thời cơ thành thắng lợi.']];
  return sheet(`<div class="end"><div class="end-hero">${pic}<div><p class="end-score"><span id="final-score">${score}</span><small>/${max} điểm</small></p><h1 class="place">Độc lập là thành quả<br>của cả một hành trình.</h1><p>${verdict}</p></div></div>`
  +`<div class="end-body"><section class="album-full" data-reveal><h3>Dòng thời gian 1930–1945 do bạn hoàn thành</h3><ol class="tl-list tl-list--full">${tl}</ol></section>${review}`
  +`<div class="end-grid">${pillars.map(([k,h,p],i)=>`<article data-reveal style="--i:${i}"><div class="eyebrow">${k}</div><h3>${h}</h3><p>${p}</p></article>`).join('')}</div>`
  +`<p class="end-note">Nước Việt Nam Dân chủ Cộng hòa ra đời; nhân dân từ địa vị bị trị trở thành người làm chủ. Thắng lợi cổ vũ phong trào giải phóng dân tộc trên thế giới.</p><div class="actions"><button id="end-records">Đọc hồ sơ đầy đủ</button>${run.mode==='class'?`<button id="open-scoresheet">${icon('print',18)} Phiếu ghi điểm</button>`:''}<button id="replay" class="primary">Chơi lại</button></div></div></div>`,o.enter);
}

// Phiếu ghi điểm cho ban tổ chức (chế độ Lớp học): bảng chặng × team, tổng tự cộng, in được. Không lưu gì.
function scoresheet(D,teams=4){
  const head=Array.from({length:teams},(_,t)=>`<th scope="col">Team ${t+1}</th>`).join('');
  const rows=D.scenes.map((s,i)=>`<tr><th scope="row">${i+1}<small>${s.date}</small></th>${Array.from({length:teams},(_,t)=>`<td><input inputmode="numeric" maxlength="2" data-team="${t}" aria-label="Chặng ${i+1}, Team ${t+1}"></td>`).join('')}</tr>`).join('');
  const sums=Array.from({length:teams},(_,t)=>`<td data-sum="${t}">0</td>`).join('');
  return `<div class="paper-topline"><span>PHIẾU GHI ĐIỂM · CHẾ ĐỘ LỚP HỌC</span><span>1930 — 1945</span></div><div class="dialog-head"><div><div class="paper-kicker">DÀNH CHO BAN TỔ CHỨC</div><h2 id="sheet-title">Phiếu ghi điểm</h2></div><div class="dialog-btns"><button id="sheet-print">${icon('print',18)} In phiếu</button><button id="sheet-close" aria-label="Đóng phiếu">Đóng ×</button></div></div><table class="scoretable"><thead><tr><th scope="col">Chặng</th>${head}</tr></thead><tbody>${rows}</tbody><tfoot><tr><th scope="row">Tổng / 180</th>${sums}</tr></tfoot></table><ul class="rules"><li><b>Cách A (khuyên dùng):</b> mọi team cùng ghi đáp án, giơ bảng cùng lúc; mỗi ô đúng +10, không chọn lại.</li><li><b>Cách B:</b> mỗi chặng giao một team: đúng ngay +10 mỗi ô; chưa đúng thì MC đọc gợi ý, team khác giành quyền đúng +5; không ai đúng thì mở đáp án, không ai được điểm ô đó.</li><li><b>Thưởng chặng 9:</b> BTC chấm thêm 0–20 điểm cho câu “Cách mạng Tháng Tám có phải ăn may?”.</li><li><b>Hòa điểm:</b> team đúng nhiều ô hơn ở chương III (1939–1945) thắng.</li></ul>`;
}

// Nội dung hộp Hồ sơ lịch sử. Mỗi hồ sơ là [tiêu đề, nội dung, image tùy chọn]
// only = danh sách chỉ số hồ sơ cần hiện (mặc định: tất cả); open = chỉ số hồ sơ mở sẵn. Số thứ tự 01–09 giữ nguyên theo hồ sơ gốc.
function records(D,only,open){
  const idx=only||D.records.map((_,i)=>i);
  const items=idx.map(i=>{const [title,body,img]=D.records[i];return `<details style="counter-set:folio ${i}"${i===open?' open':''}><summary>${title}</summary>${photo(img,{w:16,h:10,cls:'photo--record'})}<p>${body}</p></details>`;}).join('');
  return items+(idx.length<D.records.length?'<p class="records-note">Các hồ sơ sau sẽ mở khi bạn đi tới giai đoạn đó.</p>':'');
}

return {chapterIntro,strip,play,tray,slots,hints,spots,stageDone,chapterSummary,ending,scoresheet,records,icon};})();
