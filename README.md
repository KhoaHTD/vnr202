# Đường đến tháng Tám

Web game tiếng Việt ghép tình huống – sự kiện lịch sử 1930–1945: 3 chương, 9 chặng. Mỗi chặng có một cảnh ảnh với **2 điểm nóng** (hai tình huống A, B) và **rổ 4 thẻ sự kiện kèm năm** (2 đúng, 2 nhiễu là sự kiện thật nhưng thuộc thời điểm khác). Người chơi kéo thẻ vào đúng tình huống rồi bấm "Triển khai"; đúng thì ô khóa, cảnh đổi và thẻ bay vào album dòng thời gian; chưa đúng thì có gợi ý tăng dần. Mục tiêu: nhớ sự kiện nào diễn ra khi nào và giải quyết vấn đề gì. Chưa đo thời lượng bằng nhóm người chơi thật.

## Luật chơi
- **Điểm mỗi ô:** đúng ngay lần đầu 10 · đúng ở lần chọn lại sau gợi ý nấc 1 là 5 · đúng sau khi thẻ bị làm mờ, hoặc xem đáp án, hoặc bỏ qua là 0. Mỗi chặng tối đa 20, cả game 180.
- **Gợi ý 3 nấc:** (1) "Chưa phù hợp" + gợi ý thời điểm viết riêng cho thẻ nhiễu vừa chọn; (2) làm mờ 1 thẻ nhiễu + gợi ý nội dung; (3) hiện đáp án + nút "Vì sao?". Ô đúng khóa lại, thẻ sai quay về rổ, luôn có nút "Bỏ qua, ôn lại sau".
- **Cuối game:** điểm /180, album 1930–1945 do người chơi hoàn thành, danh sách ô cần ôn kèm lời giải.
- **Chế độ Lớp học** (công tắc ở chương 1 hoặc `hanh-trinh.html?mode=class`): chiếu màn hình lớn, MC thao tác. Thẻ phóng to và đánh số 1–4; sai không tự gợi ý, MC bấm "Đọc gợi ý" / "Hiện đáp án"; có **Phiếu ghi điểm** in được (ban tổ chức tự ghi điểm team); chặng 9 có đồng hồ 1 phút cho câu thưởng. Cách A (cả lớp cùng giơ bảng, mỗi ô đúng +10) và Cách B (lần lượt từng team) được ghi trong phiếu.
- Đặt thẻ bằng **kéo thả**, hoặc **chạm thẻ rồi chạm ô** (điện thoại), hoặc **bàn phím** (1–4 chọn thẻ, A/B đặt vào ô, Enter triển khai).

## Chạy
- Mở `index.html` trong trình duyệt. Không cần cài thư viện.
- Hoặc chạy `node server.cjs`, mở http://localhost:5173.
- Font trực tuyến là tùy chọn; khi mất mạng dùng font hệ thống.

## Nội dung và nguồn
`docs/noi-dung-goc.md` lưu nguyên văn tài liệu nhóm (bao gồm phần lặp). `content.js` chứa 9 chặng (tình huống, thẻ, năm, gợi ý, lời giải) và chín hồ sơ đọc thêm. **Nội dung 9 chặng là BẢN NHÁP biên soạn từ tài liệu nhóm: mọi ngày, tên sự kiện, gợi ý cần nhóm đối chiếu giáo trình trước khi dùng thật.**

Đối chiếu: chặng 1 → thành lập Đảng, Xô viết Nghệ–Tĩnh; 2 → Chương trình hành động 1932, Đại hội I; 3–4 → phong trào dân chủ và nhận thức mới (Hội nghị 7/1936, Đông Dương Đại hội, chiến sách mới, đón phái viên); 5 → chuyển hướng 1939–1941; 6 → Đề cương văn hóa, Đội Việt Nam Tuyên truyền Giải phóng quân; 7 → Chỉ thị 12/3, phá kho thóc; 8 → Quân lệnh số 1, Đại hội Quốc dân; 9 → Hà Nội 19/8, Tuyên ngôn Độc lập.

Các chi tiết không đưa vào lượt chơi nằm trong hồ sơ hoặc bản nguồn. Không tuyên bố mọi chi tiết được học trong 10 phút.

## Cần duyệt trước sử dụng chính thức
- Tài liệu gốc ghi không thống nhất 1935/1936 về Mặt trận Nhân dân Pháp; bản chơi dùng 1936 theo đoạn diễn giải của chính tài liệu.
- Mốc Hội truyền bá Quốc ngữ và một số tên tác phẩm trong bản nguồn cần đối chiếu giáo trình; bản chơi không lặp lại mốc đang nghi vấn.
- Nhóm duyệt lại mọi ngày, thuật ngữ và thêm số trang giáo trình chính thức. Bản này chưa được kiểm chứng độc lập toàn bộ.

## Cấu trúc
Giao diện "bàn bản đồ dưới ánh đèn": căn phòng tối phẳng (đầu trang, album dòng thời gian + điểm, tuyến 9 chặng) và tờ bản đồ giấy da (màn chơi, tổng kết chương, màn kết).
Mã nguồn: `index.html` (landing) và `hanh-trinh.html` (game) nằm ở gốc để giữ nguyên URL. Trong `src/js/`: `content.js` dữ liệu, `engine.js` luật chơi thuần (chấm điểm, gợi ý, album; không đụng DOM), `ui.js` dựng HTML, `game.js` kéo thả, gợi ý và chuyển màn, `landing.js` intro và lật trang của landing. Trong `src/css/`: `tokens.css` (màu, chữ, chuyển động) → `base.css` (căn phòng, nút, đầu trang) → `components.css` (ảnh, tờ bản đồ, hộp thoại) → `play.css` (màn chơi, album, Lớp học, responsive) → `acts.css` (độ chìm mép tờ giấy theo hồi); `landing.css` cho landing.
Thư mục khác: `assets/` ảnh tư liệu, `vendor/` gsap, `docs/` tài liệu nhóm, `tools/` công cụ dev, `test/` kiểm tra, `archive/` bản cũ không còn được nạp (`style.css`, `redesign.css`, `archive-paper.css`, `duong-den-thang-tam.html`, file zip, ảnh chụp cũ).
Game không lưu tiến độ (mỗi lần mở là một lượt mới); âm thanh chỉ bật theo lựa chọn. Kiểm tra: `npm test` (chạy `test/test-engine.cjs`: dữ liệu và luật chơi; và `test/check.cjs`: chơi đủ 9 chặng và chế độ Lớp học trong Chrome thật; `check.cjs` cần `node server.cjs` đang chạy).
