# gsap 3.15.0 (bản ESM, chép từ node_modules/gsap)

Chỉ giữ 3 file landing cần: `index.js`, `gsap-core.js`, `CSSPlugin.js`.
Import map trong `index.html` trỏ `gsap` về đây, nên trang chạy được trên host tĩnh mà không cần node_modules.

Cập nhật: `npm i gsap@latest && npm run vendor:gsap`.
Giấy phép: GSAP Standard "No Charge" License, https://gsap.com/standard-license (miễn phí).
