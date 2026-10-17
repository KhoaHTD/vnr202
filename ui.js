/* ============================================================
   ui.js: CHỈ dựng chuỗi HTML cho từng màn. Không giữ trạng thái, không gắn sự kiện.
   game.js gọi các hàm ở đây rồi gắn sự kiện vào phần tử theo id.

   Hai lớp vật liệu:
   - NỀN PHÒNG (tối, hiện đại): đầu trang, dải lực lượng (strip), trang chủ, màn mở chương.
   - TỜ BẢN ĐỒ (.sheet, giấy da cổ): màn chơi, câu hỏi cuối chương, màn kết.
   ============================================================ */
window.GameUI=(()=>{
// Biểu tượng SVG nét mảnh (stroke = currentColor nên tự theo màu chữ)
const ICONS={
  people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-3-5"/>',
  base:'<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="2" y="16" width="6" height="5" rx="1"/><rect x="16" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/>',
  reach:'<path d="m3 10 15-5v14L3 14zM6 15l2 6h3l-2-5M21 9v6"/>',
  ready:'<path d="M5 22V3m0 1c5-4 9 4 15 0v10c-6 4-10-4-15 0"/>',
  book:'<path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-3-1-7-2-10 1v15"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  sound:'<path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  mute:'<path d="M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6"/>'
};
// icon('people') trả về thẻ <svg>; tên không có trong ICONS thì trả chuỗi rỗng
const icon=(name,size=24)=>ICONS[name]?`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`:'';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const FORCES=['people','base','reach','ready'];
// Tên ngắn của 4 chỉ số, dùng trong dải lực lượng và hàng "+2 Quần chúng · +1 Mạng lưới"
const SHORT={people:'Quần chúng',base:'Mạng lưới',reach:'Tuyên truyền',ready:'Chuẩn bị'};
// La bàn thời cơ: 4 hướng = 4 điều kiện. [hướng, điều kiện]
const WINDS=[['Bắc','Kẻ thù khủng hoảng'],['Đông','Quần chúng sẵn sàng'],['Nam','Lực lượng đã chuẩn bị'],['Tây','Tầng lớp trung gian ngả theo']];

// Thẻ là mảng [tên, mô tả, chỉ số, điểm, {kind, icon, history, better}]. Phần tử thứ 5 là tùy chọn.
// kind: 'good' (mặc định) | 'trap' (thẻ bẫy) | 'now' (⚡ Hành động ngay)
const meta=card=>card[4]||{};
const kindOf=card=>meta(card).kind||'good';

/* Tờ bản đồ: khối giấy da nằm giữa quầng đèn.
   enter = true: tờ bản đồ trượt vào (chỉ khi vừa vào chương). .sheet-light là ánh đèn rọi lên giấy, game.js dời tâm sáng. */
const sheet=(inner,enter)=>`<div class="sheet${enter?' sheet--in':''}"><div class="sheet-light" aria-hidden="true"></div>${inner}</div>`;

/* Chữ uốn cung theo đường cong nhẹ, như địa danh uốn theo bờ biển trên bản đồ cổ. CHỈ dùng ở 2 chỗ:
   tên game (trang chủ) và tên chương (màn mở chương). Có bản chữ thường ẩn cho trình đọc màn hình; SVG bị aria-hidden. */
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
    return `<li class="route-item is-${st}${first?' is-first':''}${i<cur?' seg-done':''}" style="--i:${i}">${year}<span class="route-stop" role="img" tabindex="0" aria-label="Chặng ${i+1}: ${esc(s.title)}, ${label}"><span class="route-dot"></span><span class="route-tip" aria-hidden="true">${i+1} · ${esc(s.title)}</span></span></li>`;
  }).join('');
  const here=D.scenes[cur];
  return `<ol class="route${o.seq?' route--seq':''}" aria-label="Tuyến hành trình: ${cur<0?'chưa bắt đầu':cur>=n?'đã hoàn thành '+n+' chặng':'đang ở chặng '+(cur+1)+' trên '+n}">${stops}</ol>${here?`<p class="route-now" aria-hidden="true">Chặng ${cur+1} · ${esc(here.title)}</p>`:''}`;
}

// 4 hướng la bàn đã sáng: state.signals là mảng 4 boolean, hoặc số n (n hướng đầu tiên)
const windsLit=(state,o)=>o.forceLit?[true,true,true,true]:[0,1,2,3].map(i=>Array.isArray(state.signals)?!!state.signals[i]:i<(state.signals||0));

/* La bàn thời cơ (44px): bấm mở bảng nhỏ liệt kê 4 hướng. Hướng chưa đạt: nét rỗng; đạt: tô --lamp.
   Cả 4 hướng sáng: kim xoay MỘT lần rồi dừng ở "Tháng Tám" (o.spin), quầng đèn sáng lên một nấc (game.js). */
function compass(state,o={}){
  const lit=windsLit(state,o),n=lit.filter(Boolean).length,all=n===4;
  const kite=['0,-20 4.5,-7 -4.5,-7','20,0 7,-4.5 7,4.5','0,20 4.5,7 -4.5,7','-20,0 -7,-4.5 -7,4.5'];
  const rows=WINDS.map(([w,c],i)=>`<li><span class="wind">${w}</span><span class="cond">${c}</span><b class="${lit[i]?'ok':''}">${lit[i]?'Đã đạt':'Chưa đạt'}</b></li>`).join('');
  return `<div class="compass-wrap">${all?'<span class="compass-label place">Tháng Tám</span>':''}<button class="icon-btn compass" id="compass-btn" aria-expanded="false" aria-controls="compass-panel" aria-label="Chỉ báo thời cơ: ${n} trên 4 điều kiện đã đạt"><svg viewBox="-24 -24 48 48" width="44" height="44" aria-hidden="true"><circle r="22" class="ring"/>${kite.map((p,i)=>`<polygon points="${p}" class="wind-pt${lit[i]?' on':''}"/>`).join('')}<g class="needle${o.spin&&all?' needle--spin':''}"><path class="n" d="M0 -13L2.4 0H-2.4z"/><path class="s" d="M0 13L2.4 0H-2.4z"/></g></svg></button><div class="compass-panel" id="compass-panel" role="group" aria-label="Chỉ báo thời cơ" hidden><ul>${rows}</ul></div></div>`;
}

/* Dải lực lượng trên nền phòng: 4 lực lượng (mỗi lực lượng một màu nước + biểu tượng + nhãn chữ), la bàn, rồi tuyến 9 chặng.
   o = {prev: chỉ số trước lượt vừa chơi (để chỉ các vạch mới đạt được chạy lên), spin, seq, forceLit} */
function strip(D,state,labels,o={}){
  const seg=s=>Math.min(6,Math.ceil(s/3));
  const forces=FORCES.map(k=>{const v=seg(state.stats[k]),was=o.prev?seg(o.prev[k]):v;return `<li class="force f-${k}${v?' lit':''}" id="node-${k}"><span class="force-icon">${icon(k,20)}</span><span class="force-name">${SHORT[k]}</span><span class="segments" role="meter" aria-label="${labels[k]}" aria-valuemin="0" aria-valuemax="6" aria-valuenow="${v}">${Array.from({length:6},(_,i)=>`<i class="${i<v?'filled':''}${i<v&&i>=was?' new':''}"></i>`).join('')}</span></li>`;}).join('');
  const cur=state.index>=D.scenes.length?D.scenes.length:state.index;
  return `<div class="strip-inner"><ul class="forces">${forces}</ul><div class="pressure" id="pressure" hidden><b>Áp lực địch</b><div class="pressure-bar" role="meter" aria-label="Áp lực địch" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${state.pressure||0}" style="--v:${state.pressure||0}"></div></div>${compass(state,o)}</div>${route(D,cur,o)}`;
}

// Trang chủ (nền phòng): ảnh đặt trên bàn dưới đèn, tên game uốn cung, một nút, tuyến 9 chặng còn trống
function home(D,saved){
  return `<section class="home"><span class="eyebrow">Hành trình lịch sử tương tác</span><h1 class="home-title">${arc('Đường đến tháng Tám','arc-home')}</h1><p class="tagline place">Mỗi bước đi. Một ngày độc lập.</p>`
  +`<div class="home-photo">${photo(D.homeImage,{w:500,h:329,cls:'photo--table',develop:'slow',priority:true})}</div>`
  +`<div class="actions">${saved?'<button class="primary" id="resume">Tiếp tục hành trình '+icon('arrow')+'</button>':''}<button id="start" class="${saved?'secondary':'primary'}">${saved?'Bắt đầu lại':'Bắt đầu hành trình'} ${icon('arrow')}</button></div>`
  +`<p class="hero-meta"><span>3 giai đoạn</span> · <span>9 chặng đường</span> · <span>khoảng 10 phút</span></p><div class="home-route">${route(D,-1)}</div></section>`;
}

// Màn mở đầu chương (nền phòng, chưa có tờ bản đồ): ảnh đặt trên bàn dưới đèn, tên chương uốn cung.
// Bấm "Vào chương" hoặc Enter thì tờ bản đồ trượt vào.
function chapterIntro(D,i){
  const c=D.chapters[i];
  return `<section class="chapter-intro"><div class="intro-media">${photo(c.image,{w:3,h:2,cls:'photo--table photo--intro',develop:'intro'})}</div><div class="chapter-intro-text"><span class="eyebrow">Chương ${i+1} · ${c.years}</span><h1 class="intro-title">${arc(c.name,'arc-chapter')}</h1><button class="primary" id="chapter-go">Vào chương ${icon('arrow')}</button><p class="hint">Hoặc nhấn Enter</p></div></section>`;
}

// Một thẻ lựa chọn. Viền trên thẻ theo màu lực lượng mà thẻ cộng điểm (thẻ bẫy dùng màu của biểu tượng nó mượn).
function card(c,i){
  const m=meta(c),kind=kindOf(c),ic=m.icon||c[2];
  // Thẻ bẫy hiển thị Y HỆT thẻ thường (cả biểu tượng, nhờ trường icon); chỉ bị đóng dấu sau khi bấm Triển khai.
  return `<button class="card f-${FORCES.includes(ic)?ic:'none'}${kind==='now'?' card--now':''}" aria-pressed="false" data-card="${i}"><span class="card-top">${ic&&ic!=='none'?`<span class="card-icon">${icon(ic)}</span>`:''}${kind==='now'?'<span class="card-bolt" aria-hidden="true">⚡︎</span>':''}<span class="choice-mark" aria-hidden="true"></span></span>${kind==='now'?'<span class="card-tag">Hành động ngay</span>':''}<b>${c[0]}</b><span class="card-description">${c[1]}</span><span class="card-hint">Bỏ chọn một thẻ để đổi</span></button>`;
}

// Màn chơi một chặng, trên tờ bản đồ: tên chặng (địa danh), Tình hình/Chủ trương, câu hỏi, 3 thẻ, nút Triển khai
function play(D,state,labels,o={}){
  const s=D.scenes[state.index];
  return sheet(`<header class="sheet-head"><span class="eyebrow">Chương ${s.chapter+1} · ${s.date}</span><h2 class="place">${s.title}</h2></header>`
  +`<div class="briefing"><div class="news"><b>Tình hình</b><p>${s.news}</p></div><div class="policy"><b>Chủ trương</b><p>${s.policy}</p></div><button class="text-link" id="more">${icon('book',18)} Mở hồ sơ giai đoạn</button></div>`
  +`<section class="decision"><h3 class="task">${s.task}</h3><div class="hand">${s.cards.map(card).join('')}</div><div class="bottom"><span id="save-status" class="toast" aria-live="polite">Chọn 2 hoạt động để tiếp tục</span><button class="primary" id="commit" disabled>Triển khai →</button></div><div id="feedback" aria-live="polite"></div></section>`,o.enter);
}

// Hàng nhãn thay đổi chỉ số sau khi triển khai
function deltas(before,after){
  const parts=FORCES.filter(k=>after[k]>before[k]).map(k=>`<span class="delta f-${k}">${icon(k,16)} +${after[k]-before[k]} ${SHORT[k]}</span>`);
  return `<p class="deltas">${parts.length?parts.join('<span aria-hidden="true"> · </span>'):'Lượt này không cộng điểm.'}</p>`;
}

/* Khối kết quả sau khi triển khai.
   o = {scene, picks: thẻ đã chọn, wrong: các thẻ sai (trap/now), better: thẻ đúng bị bỏ qua,
        before/after: chỉ số trước/sau, retry: true nếu phải chọn lại (chặng 8), synergy: câu cộng hưởng}
   Có thẻ sai: tiêu đề đổi thành "Trong lịch sử, Đảng đã chọn khác" + đoạn history + khung thẻ đúng. */
function feedback(o){
  const s=o.scene,names=o.picks.map(i=>s.cards[i][0]).join(' + ');
  const omitted=s.cards.find((_,i)=>!o.picks.includes(i));
  const wrongBlock=o.wrong.map(i=>`<p>${meta(s.cards[i]).history||''}</p>`).join('')+(o.wrong.length&&o.better!=null?`<p class="better">Lựa chọn của lịch sử: <b>${s.cards[o.better][0]}</b></p>`:'');
  if(o.retry)return `<div class="feedback is-wrong"><div class="eyebrow">Kết quả hành động</div><h3>Trong lịch sử, Đảng đã chọn khác</h3>${wrongBlock}<p class="deltas">Lượt chọn sai không được cộng điểm. Hãy xem lại và chọn lại.</p></div>`;
  const hist=`<div class="history${s.image?' has-photo':''}"><p><strong>Trong lịch sử:</strong> ${s.explain}</p>${photo(s.image,{w:4,h:3,cls:'photo--clip',develop:'fast',zoom:true})}</div>`;
  return `<div class="feedback${o.wrong.length?' is-wrong':''}"><div class="eyebrow">Kết quả hành động</div>${o.wrong.length?`<h3>Trong lịch sử, Đảng đã chọn khác</h3>${wrongBlock}`:`<h3>${names}</h3>`}${deltas(o.before,o.after)}${!o.wrong.length&&!s.answer&&omitted?`<p>Lượt này chưa ưu tiên “${omitted[0]}”.</p>`:''}${o.synergy?`<p class="carry">${o.synergy}</p>`:''}${hist}<div class="chain">${s.link}</div></div>`;
}

// Câu hỏi cuối chương, trên tờ bản đồ. q = [câu hỏi, đáp án đúng, đáp án sai, giải thích khi sai]
function checkpoint(D,chapter,q,o={}){
  return sheet(`<div class="chapter-break"><div class="eyebrow">Hoàn thành chương ${chapter+1}</div><h1 class="place">${D.chapters[chapter].name}</h1><p>${q[0]}</p><div class="check"><button data-good="true">${q[1]}</button><button data-good="false">${q[2]}</button></div><p id="check-feedback" aria-live="polite"></p><button id="next" class="primary">Sang chương tiếp theo →</button></div>`,o.enter);
}

// Màn kết, trên tờ bản đồ: tuyến 9 chặng đã sáng đủ ở dải phía trên, rồi ảnh Ba Đình + con dấu ngày
function ending(D,state,o={}){
  const names=(state.mistakes||[]).map(id=>{const [s,c]=id.split('-').map(Number);return D.scenes[s]?.cards[c]?.[0];}).filter(Boolean);
  const verdict=names.length?`<div class="mistakes"><p>Bạn đã mắc ${names.length} sai lầm mà lịch sử từng mắc:</p><ul>${names.map(n=>`<li>${n}</li>`).join('')}</ul></div>`:'<p class="stamp stamp--big">Đọc đúng thời cơ</p>';
  // Con dấu ngày đóng lên góc ảnh; không có ảnh thì đóng ở đầu phần chữ
  const dateStamp='<span class="stamp stamp--date">2 tháng 9 năm 1945</span>';
  const pic=photo(D.endingImage,{w:500,h:260,develop:'slow',extra:dateStamp});
  const steps=[['19/8','Hà Nội'],['23/8','Huế'],['25/8','Sài Gòn'],['2/9','Tuyên ngôn Độc lập']];
  const pillars=[['01 · Lãnh đạo','Nhận định đúng, hành động kịp thời','Đảng và Hồ Chí Minh xác định nhiệm vụ, tập hợp lực lượng, điều chỉnh phương pháp và nắm bắt thời cơ.'],['02 · Nhân dân','Sức mạnh của đoàn kết','Quần chúng được vận động, tổ chức và trực tiếp tham gia đấu tranh giành chính quyền.'],['03 · Chuẩn bị','Thành quả tích lũy lâu dài','Lực lượng chính trị, vũ trang, tổ chức và căn cứ được xây dựng qua nhiều giai đoạn.'],['04 · Quốc tế','Thời cơ thuận lợi','Thắng lợi Đồng minh và Nhật đầu hàng tạo điều kiện khách quan; sự chuẩn bị giúp biến thời cơ thành thắng lợi.']];
  return sheet(`<div class="end"><div class="end-hero">${pic}<div>${pic?'':`<p>${dateStamp}</p>`}<h1 class="place">Độc lập là thành quả<br>của cả một hành trình.</h1><p>Từ gây dựng tổ chức, mở rộng phong trào đến chuẩn bị và chớp thời cơ: những yếu tố cùng kết hợp để làm nên thắng lợi.</p>${verdict}</div></div>`
  +`<div class="end-body"><div class="timeline" data-reveal>${steps.map(([d,p])=>`<div><b>${d}</b>${p}</div>`).join('')}</div>`
  +`<div class="end-grid">${pillars.map(([k,h,p],i)=>`<article data-reveal style="--i:${i}"><div class="eyebrow">${k}</div><h3>${h}</h3><p>${p}</p></article>`).join('')}</div>`
  +`<h3>Một kỷ nguyên mới</h3><p class="end-note">Nước Việt Nam Dân chủ Cộng hòa ra đời; nhân dân từ địa vị bị trị trở thành người làm chủ. Thắng lợi cổ vũ phong trào giải phóng dân tộc trên thế giới.</p><div class="actions"><button id="end-records">Đọc hồ sơ đầy đủ</button><button id="replay" class="primary">Trở về màn đầu</button></div><p class="notice">Hoàn thành ${state.history.length}/9 chặng đường.</p></div></div>`,o.enter);
}

// Nội dung hộp Hồ sơ lịch sử. Mỗi hồ sơ là [tiêu đề, nội dung, image tùy chọn]
function records(D){
  return D.records.map(([title,body,img])=>`<details><summary>${title}</summary>${photo(img,{w:16,h:10,cls:'photo--record'})}<p>${body}</p></details>`).join('');
}

return {home,chapterIntro,strip,play,feedback,checkpoint,ending,records,icon,kindOf,meta};})();
