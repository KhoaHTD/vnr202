# Đoạn kết: cờ Tổ quốc, Tuyên ngôn và Quốc ca

## Luồng chính

Trên `hanh-trinh.html`, đoạn kết tự chạy sau khi hoàn thành chặng 9 (nút “Xem kết thúc hành trình”). Điểm đã được chấm trước khi chuyển cảnh. Có nút xem lại đoạn kết trên trang kết quả; chơi lại không giữ điểm.

## Nhịp hình và tiếng

1. Màn chơi tối dần về đen trong 2000 ms, chưa phát lời đọc hoặc quốc ca.
2. Video cờ xuất hiện trong 1800 ms, lặp, tắt tiếng, độ sáng 0,38 để làm nền.
3. Video đọc Tuyên ngôn hiện chính giữa trong 1200 ms, giữ tỷ lệ gốc, phát tiếng gốc.
4. Dựa trên duration - currentTime của video, quốc ca chỉ bắt đầu khi còn tối đa 3 giây. Mức âm dùng đường cong smoothstep từ 0 tới 1; khi video kết thúc, quốc ca ở mức đầy đủ.
5. Video đọc mờ đi; cờ tiếp tục bay, độ sáng tăng về 0,65. Quốc ca tiếp tục tới hết tệp, sau đó mờ về đen 1500 ms và mở kết quả.

Không dùng bộ hẹn giờ 7 phút cố định để kích hoạt âm thanh. Nếu lời đọc đang chờ tải trong phần giao tiếng, quốc ca cũng tạm dừng để không chạy vượt. Mở tab khác hoặc bấm tạm dừng dừng cả video và audio. Điều khiển phát, tiếng, xem kết quả hiện khi di chuyển/chạm hoặc dùng bàn phím; không có chữ/huy hiệu trang trí trên đoạn phim.

## Tệp gốc

- Cờ: ending/[Thái Triển] Cờ nước CHXHCN Việt Nam tung bay - bản sáng hơn.mp4 — 1920×1080, khoảng 20,155 giây.
- Đọc Tuyên ngôn: ending/Toàn văn Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập ngày 2-9-1945 - Báo VietNamNet.mp4 — 1920×1080, khoảng 422,139 giây.
- Quốc ca: ending/QUỐC CA VIỆT NAM (Tiến Quân Ca) - Quốc ca nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam.mp3 — khoảng 138,809 giây.

Tệp được tham chiếu trực tiếp và không chỉnh sửa; chữ và logo có sẵn trong video được giữ. Hai video dùng AV1/mp4a và đã giải mã được trong Chromium thử nghiệm; chưa có kiểm tra trên Safari/thiết bị di động vật lý.

## Âm thanh và tải media

Media được chuẩn bị ở câu cuối. AudioContext và hai media có tiếng được mở khóa ngay trong thao tác xác nhận cuối, với gain bằng 0 để không lọt âm trong màn tối. Nếu trình duyệt chặn, nút Phát đoạn kết cho phép tiếp tục bằng thao tác của người chơi. Một lần phát lại đặt video và quốc ca về đầu, không sửa điểm.

Máy chủ phát dạng stream với MIME đúng, Content-Length, HEAD, Accept-Ranges, 206/Content-Range và 416 cho range không hợp lệ; không đọc toàn bộ video 114,5 MB vào bộ nhớ cho mỗi request. Chỉ lắng nghe localhost.

Cơ sở triển khai: [MDN về autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), [AudioContext.resume](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/resume), [HTMLMediaElement.currentTime](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime).

## Kiểm tra

- npm test: 14 kiểm tra luật chơi, tệp gốc, bao âm lượng và byte range.
- npm run test:media: tệp thật, MIME, HEAD, nội dung byte đầu, suffix, range ngoài kích thước, ngăn truy cập ra ngoài project.
- npm run test:ending: metadata và giải mã video/audio thật; tối dần đủ 2 giây; cờ hiện trước video giữa; quốc ca tăng dần trong 3 giây cuối; tiếp tục sau video; hết bài quay về; tạm dừng/tắt tiếng/bỏ qua; bố cục 390 px; kích hoạt tự động ở câu cuối; xem lại và giữ nguyên điểm.
- Để kiểm tra chuyển tiếng, bộ kiểm tra tua video thật tới gần cuối và tua audio gần cuối để kiểm tra kết thúc; không giả lập sự kiện ended và không coi đây là bằng chứng xem liên tục toàn bộ 7 phút. Trình duyệt thử riêng tắt đầu ra loa, vẫn chạy media và bộ trộn.
- Ảnh ở .qa/ending/: blackout.png, flag.png, speech.png, anthem.png, mobile-speech.png.

## Xem thử

Mở http://127.0.0.1:5173/ending-preview.html rồi bấm Xem đoạn kết. Trang này không thay đổi lượt chơi đã lưu.
