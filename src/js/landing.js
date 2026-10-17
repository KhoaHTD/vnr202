/* ============================================================
   landing.js (ES module): intro, bỏ qua, tạm dừng, âm thanh và chuyển trang của landing (index.html).
   - Intro dựng lại chuyển cảnh Morph (2 giây) của intro.pptx: ngôi sao đen phóng to + xoay phủ kín ảnh, các mảng cờ mở ra
     từ dải mỏng, hai dòng chữ trồi từ đáy màn hình lên giữa màn hình.
   - Mọi thành phần đã đứng ở vị trí cuối trong HTML/CSS; timeline chỉ animate từ ngoài vào (from/fromTo), nên JS lỗi thì trang
     vẫn ở trạng thái cuối và nút vẫn là liên kết thường.
   - Một master timeline, 5 nhãn: room → star → flags → title → cta (≈ 2,7 giây). Lần sau trong cùng phiên rút còn ≈ 1 giây.
   - Bấm nút: một tấm ảnh in xoay và bay vào giữa màn hình rồi nối tiếp bay vào ô ảnh của hanh-trinh.html (match move).
   - Chỉ animate transform, opacity, clip-path.
   ============================================================ */
import { gsap } from 'gsap';

const $ = s => document.querySelector(s);
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const el = {
  stage: $('.stage'), bg: $('.backdrop img'), star: $('.star'), flagRed: $('.flag--red'), flagBlack: $('.flag--black'),
  shard1: $('.shard--1'), shard2: $('.shard--2'),
  lead: $('.t-lead > span'), main: $('.t-main > span'),
  hero: $('.hero'), cta: $('.cta'), controls: $('.controls'), motion: $('#motion'), sound: $('#sound'),
};
const NEXT = el.cta.getAttribute('href');

// sessionStorage có thể bị chặn (chế độ riêng tư, iframe): mọi lần đọc/ghi bọc try/catch
const session = {
  get: k => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* bỏ qua: chỉ mất phần "nhớ trong phiên" */ } },
};
const firstVisit = session.get('intro-seen') !== '1';
session.set('intro-seen', '1');

/* ---------- Âm thanh: nhiễu lọc dải, âm lượng thấp. Chỉ phát khi người dùng đã bật loa (nhớ trong phiên) ---------- */
let soundOn = session.get('sound') === '1', audio = null;
function burst({ dur, freq, gain }) {
  if (!soundOn) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume();
    const t = audio.currentTime, n = Math.ceil(audio.sampleRate * dur), buf = audio.createBuffer(1, n, audio.sampleRate), d = buf.getChannelData(0);
    let p = 0;
    for (let i = 0; i < n; i++) { p = p * .7 + (Math.random() * 2 - 1) * .3; d[i] = p; }
    const src = audio.createBufferSource(), f = audio.createBiquadFilter(), g = audio.createGain();
    src.buffer = buf; f.type = 'bandpass'; f.Q.value = .7;
    f.frequency.setValueAtTime(freq[0], t); f.frequency.exponentialRampToValueAtTime(freq[1], t + dur * .35); f.frequency.exponentialRampToValueAtTime(freq[2], t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    src.connect(f).connect(g).connect(audio.destination); src.start(t); src.stop(t + dur);
  } catch { /* trình duyệt chặn âm thanh: im lặng */ }
}
const paper = () => burst({ dur: .45, freq: [1400, 3200, 900], gain: .05 }); // giấy / báo sột soạt
const thud = () => burst({ dur: .16, freq: [260, 180, 120], gain: .06 });    // sao chạm, chữ đáp xuống

/* ---------- Điều khiển ---------- */
let paused = false, tl = null, exitTl = null, running = false, exiting = false, navigating = false;
const setPressed = (btn, on) => btn.setAttribute('aria-pressed', String(on));
el.motion.addEventListener('click', () => {
  paused = !paused; setPressed(el.motion, paused);
  if (running) paused ? tl.pause() : tl.resume();
  if (exiting) paused ? exitTl.pause() : exitTl.resume();
});
setPressed(el.sound, soundOn);
el.sound.addEventListener('click', () => {
  soundOn = !soundOn; setPressed(el.sound, soundOn); session.set('sound', soundOn ? '1' : '0');
  if (soundOn) { try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); } catch { /* không có Web Audio */ } }
});

/* ---------- Tải trước trang sau ---------- */
let prefetched = false;
function prefetch() {
  if (prefetched) return; prefetched = true;
  const l = document.createElement('link'); l.rel = 'prefetch'; l.href = NEXT; document.head.append(l);
  new Image().src = PHOTO.src; // ảnh sắp bay: tải sẵn để không nháy
}
el.cta.addEventListener('pointerenter', prefetch);
el.cta.addEventListener('focus', prefetch);

/* ---------- Intro ---------- */
const animated = [el.stage, el.bg, el.star, el.flagRed, el.flagBlack, el.shard1, el.shard2, el.lead, el.main, el.cta, el.controls];
const BLACK_FULL = 'inset(0% 0 0 0)'; // cờ đen đủ 588px; trạng thái cuối trong CSS chỉ còn dải rách ở đáy

// Kết thúc intro (chạy hết hoặc bị bỏ qua): trả mọi thứ về CSS cuối, gỡ will-change, tải trước trang sau
function finish() {
  running = false;
  gsap.set(animated, { clearProps: 'all' });
  removeEventListener('pointerdown', onSkip, true); removeEventListener('keydown', onSkip, true);
  prefetch();
}

// Bỏ qua: click, chạm hoặc phím bất kỳ trong lúc intro. Click đó KHÔNG được tính là bấm nút.
let swallowClick = false;
function onSkip(e) {
  if (!running || e.target.closest?.('.controls')) return;
  if (e.type === 'keydown') {
    if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
    if (e.key === 'Enter' || e.key === ' ') e.preventDefault(); // Enter/Space không được kích hoạt nút trong lúc intro
  } else { swallowClick = true; setTimeout(() => { swallowClick = false; }, 600); }
  tl.progress(1, true); // nhảy tới cuối, không bắn callback (không phát dồn âm thanh)
  finish();
}
addEventListener('click', e => { if (swallowClick) { swallowClick = false; e.preventDefault(); e.stopPropagation(); } }, true);

function buildIntro() {
  gsap.set(animated, { willChange: 'transform, opacity, clip-path' });
  tl = gsap.timeline({ paused: true, onComplete: finish });
  const MORPH = 'power3.inOut';

  tl.from(el.stage, { opacity: 0, duration: .5, ease: 'power1.out' }, 0)                                  // room: màn hình sáng lên từ tối
    .from(el.bg, { scale: 1.1, duration: 2.4, ease: 'power2.out' }, 0)                                   // ảnh mít tinh lùi dần ra
    .fromTo(el.star, { scale: .02, rotation: 180 }, { scale: 1, rotation: 32, duration: 2, ease: MORPH }, .15) // star: 87px → phủ kín, xoay 180° → 32°
    .call(thud, null, 1.0)
    .fromTo(el.flagBlack, { clipPath: BLACK_FULL, opacity: 0 }, { clipPath: 'inset(84.9% 0 0 0)', opacity: 1, duration: 1.5, ease: MORPH }, .3)
    .from(el.flagRed, { clipPath: 'inset(0 0 94% 0)', duration: 1.4, ease: MORPH }, .5)                   // flags: cờ đỏ mở từ dải 25px xuống đủ 408px
    .from(el.shard1, { clipPath: 'inset(93% 0 0 0)', duration: 1.3, ease: MORPH }, .6)
    .from(el.shard2, { clipPath: 'inset(0 88% 0 0)', duration: 1.3, ease: MORPH }, .7)
    .from(el.lead, { y: '70vh', opacity: 0, duration: 1.1, ease: 'expo.out' }, .9)                        // title: hai dòng trồi từ đáy màn hình
    .from(el.main, { y: '90vh', opacity: 0, duration: 1.2, ease: 'expo.out' }, 1.05)
    .call(paper, null, 1.05)
    .call(thud, null, 1.7)
    .from(el.cta, { y: 12, opacity: 0, duration: .5, ease: 'power2.out' }, 2.2)                           // cta: nút và hai nút điều khiển
    .from(el.controls, { opacity: 0, duration: .5, ease: 'power1.out' }, 2.2);

  if (!firstVisit) tl.timeScale(tl.duration() / 1); // đã xem trong phiên này: rút còn ≈ 1 giây
}

/* ---------- Chuyển sang trang game: ảnh bay vào ô ảnh (match move, ≈ 1,3 giây rồi nối tiếp ở trang sau) ----------
   0 – 0,45s  chữ, nút mờ đi · 0,15 – 0,75s tấm phủ --room hiện dần (cảnh intro tối lại)
   0,12 – 1,2s  một tấm ảnh in (cùng khung với ô ảnh ở trang sau) bay từ góc dưới phải vào giữa màn hình, vừa xoay (rotateZ + rotateY) vừa hạ cỡ rồi đứng lại nghiêng nhẹ
   1,3s  ghi vị trí/kích thước/góc xoay vào sessionStorage ('enter-photo') rồi điều hướng. hanh-trinh.html dựng lại đúng tấm ảnh đó ở đúng chỗ,
   rồi bay nốt vào ô ảnh của màn mở chương (game.js, FLIP). Không lưu được sessionStorage: chỉ chuyển trang, trang sau hiện dần từ --room.
   Bấm hay nhấn phím bất kỳ trong lúc chuyển: điều hướng ngay. Giảm chuyển động: điều hướng ngay (để liên kết tự chạy). */
const PHOTO = { src: 'assets/img/1945-giai-phong-quan-duong-pho.webp', w: 500, h: 334, focus: '35% 50%', caption: 'Ảnh tư liệu' }; // phải khớp ảnh chương 1 trong content.js
function go(fly) {
  if (navigating) return; navigating = true;
  if (fly) session.set('enter-photo', JSON.stringify({ ...PHOTO, ...fly, vw: innerWidth, vh: innerHeight }));
  else session.set('enter-fade', '1');
  location.assign(NEXT);
}
let veil = null, flyer = null;
function skipExit(e) {
  if (!exiting || e.repeat || e.target.closest?.('.controls')) return;
  if (e.type === 'keydown' && ['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
  e.preventDefault(); exitTl?.kill(); go();
}
function leaveListeners(on) { for (const t of ['pointerdown', 'keydown']) (on ? addEventListener : removeEventListener)(t, skipExit, true); }

el.cta.addEventListener('click', e => {
  if (REDUCED || e.defaultPrevented) return;                                      // giảm chuyển động: liên kết tự điều hướng ngay
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;  // mở tab mới: để trình duyệt tự xử lý
  e.preventDefault();
  if (exiting) return;                                                             // chặn bấm đúp
  exiting = true; el.cta.setAttribute('aria-disabled', 'true'); prefetch(); leaveListeners(true);
  veil = document.createElement('div'); veil.className = 'veil'; veil.setAttribute('aria-hidden', 'true'); document.body.append(veil);
  flyer = document.createElement('figure'); flyer.className = 'flyer'; flyer.setAttribute('aria-hidden', 'true');
  flyer.innerHTML = `<div class="flyer-media"><img src="${PHOTO.src}" alt="" width="${PHOTO.w}" height="${PHOTO.h}" style="object-position:${PHOTO.focus}"></div><figcaption>${PHOTO.caption}</figcaption>`;
  document.body.append(flyer);
  gsap.set(flyer, { xPercent: -50, yPercent: -50, transformPerspective: 1400 });
  exitTl = gsap.timeline({ onComplete: () => { const r = flyer.getBoundingClientRect(); go({ fw: flyer.offsetWidth, cx: r.left + r.width / 2, cy: r.top + r.height / 2, rot: gsap.getProperty(flyer, 'rotation') }); } })
    .to([el.hero, el.controls], { opacity: 0, duration: .45, ease: 'power1.out' }, 0)
    .to(veil, { opacity: 1, duration: .6, ease: 'none' }, .15)
    .call(paper, null, .15)
    .fromTo(flyer, { x: '38vw', y: '52vh', scale: 1.55, rotation: 24, rotationY: -38, opacity: 0 },
                   { x: 0, y: 0, scale: 1, rotation: -4, rotationY: 0, duration: 1.1, ease: 'power3.out' }, .12)
    .to(flyer, { opacity: 1, duration: .25, ease: 'none' }, .12)
    .to({}, { duration: .1 }, 1.2);                                                 // dừng 0,1 giây rồi chuyển (tổng 1,3s)
  if (paused) exitTl.pause();
});

// Quay lại bằng nút Back (trang lấy từ bfcache): trả về trạng thái cuối, mở khóa nút
addEventListener('pageshow', e => {
  if (!e.persisted || !exitTl) return;
  exitTl.kill(); exitTl = null; exiting = false; navigating = false; leaveListeners(false);
  veil?.remove(); veil = null; flyer?.remove(); flyer = null;
  el.cta.removeAttribute('aria-disabled');
  gsap.set([el.hero, el.controls, el.cta], { clearProps: 'all' });
});

/* ---------- Khởi động ---------- */
async function start() {
  el.controls.hidden = false;
  if (REDUCED) { // hiện ngay trạng thái cuối, không timeline
    setPressed(el.motion, true); el.motion.disabled = true; el.motion.setAttribute('aria-label', 'Chuyển động đã tắt theo cài đặt hệ thống');
    document.documentElement.classList.remove('intro-wait');
    return;
  }
  await Promise.race([document.fonts?.ready, new Promise(r => setTimeout(r, 1200))]); // chờ font để bố cục không xê dịch giữa chừng
  buildIntro();
  document.documentElement.classList.remove('intro-wait'); // trạng thái đầu đã đặt bằng gsap: gỡ lớp chống nháy
  running = true;
  addEventListener('pointerdown', onSkip, true);
  addEventListener('keydown', onSkip, true);
  tl.play();
}
start();
