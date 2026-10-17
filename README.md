# Đường đến tháng Tám

Web game tiếng Việt: 3 chương, 9 tình huống. Mục tiêu thời lượng 8–10 phút; chưa đo bằng nhóm người chơi thật.

## Chạy
- Mở `index.html` trong trình duyệt. Không cần cài thư viện.
- Hoặc chạy `node server.cjs`, mở http://localhost:5173.
- Font trực tuyến là tùy chọn; khi mất mạng dùng font hệ thống.

## Nội dung và nguồn
`docs/noi-dung-goc.md` lưu nguyên văn tài liệu nhóm (bao gồm phần lặp). `content.js` chứa nội dung biên soạn và chín hồ sơ đọc thêm. Không coi các chỉ số hoặc hệ quả gameplay là dữ kiện lịch sử.

Đối chiếu: tình huống 1 → phong trào/Xô viết; 2 → Luận cương, khôi phục, Đại hội I; 3–4 → phong trào dân chủ và nhận thức mới; 5 → chuyển hướng 1939–1941; 6 → chuẩn bị; 7 → kháng Nhật; 8 → thời cơ; 9 và kết thúc → tổng khởi nghĩa, ý nghĩa, nguyên nhân.

Các chi tiết không đưa vào lượt chơi nằm trong hồ sơ hoặc bản nguồn. Không tuyên bố mọi chi tiết được học trong 10 phút.

## Cần duyệt trước sử dụng chính thức
- Tài liệu gốc ghi không thống nhất 1935/1936 về Mặt trận Nhân dân Pháp; bản chơi dùng 1936 theo đoạn diễn giải của chính tài liệu.
- Mốc Hội truyền bá Quốc ngữ và một số tên tác phẩm trong bản nguồn cần đối chiếu giáo trình; bản chơi không lặp lại mốc đang nghi vấn.
- Nhóm duyệt lại mọi ngày, thuật ngữ và thêm số trang giáo trình chính thức. Bản này chưa được kiểm chứng độc lập toàn bộ.

## Cấu trúc
Giao diện "bàn bản đồ dưới ánh đèn": căn phòng tối phẳng (đầu trang, dải lực lượng, la bàn thời cơ, tuyến 9 chặng) và tờ bản đồ giấy da (màn chơi, câu hỏi cuối chương, màn kết).
`content.js`: dữ liệu. `ui.js`: dựng HTML. `game.js`: trạng thái, sự kiện, chuyển màn, quầng đèn.
CSS: `tokens.css` (màu, chữ, chuyển động) → `base.css` (căn phòng, nút, đầu trang) → `components.css` (từng khối) → `acts.css` (độ chìm mép tờ giấy theo hồi). `style.css`, `redesign.css`, `archive-paper.css` là bản cũ, không còn được nạp.
Tiến độ lưu localStorage sau mỗi tình huống; âm thanh chỉ bật theo lựa chọn. Kiểm tra: `node test-logic.cjs` (logic) và `node check.cjs` (trình duyệt thật, cần `node server.cjs` đang chạy).
