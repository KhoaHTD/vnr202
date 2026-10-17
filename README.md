# Đường đến tháng Tám

Game dẫn truyện và lựa chọn cho môn Lịch sử Đảng. Màn hình máy tính có cảnh pixel bên trái, dẫn truyện và câu hỏi bên phải. Mỗi giai đoạn bắt đầu độc lập từ trang chọn; trên điện thoại, cảnh nằm trên phần đọc và lựa chọn.

## Chạy và xem

Cần Node.js 22 trở lên. Không cần cài thêm thư viện.

```powershell
npm start
```

- [Chọn giai đoạn](http://127.0.0.1:5173/)
- [Xem thử đoạn kết](http://127.0.0.1:5173/ending-preview.html)
- [1930–1935](http://127.0.0.1:5173/hanh-trinh.html?giai-doan=1930-1935)
- [1936–1939](http://127.0.0.1:5173/hanh-trinh.html?giai-doan=1936-1939)
- [1939–1945](http://127.0.0.1:5173/hanh-trinh.html?giai-doan=1939-1945)

Máy chủ chỉ lắng nghe tại 127.0.0.1:5173. Đây là bản chạy tại máy, chưa xuất bản lên Internet.

## Luồng chơi hiện tại

| Giai đoạn | Câu hỏi | Điểm tối đa |
|---|---:|---:|
| 1930–1935 | 4 | 400 |
| 1936–1939 | 4 | 400 |
| 1939–1945 | 18 và một lượt đón thời cơ | 1900 |

Đọc đoạn dẫn, chọn một trong bốn phương án, rồi xác nhận. Mỗi phương án có giải thích riêng. Phù hợp lần đầu được 100 điểm; sau một lựa chọn chưa phù hợp, câu ấy vẫn phải được hoàn thành nhưng nhận 0 điểm. Những lựa chọn đã thử được giữ lại và không được chọn lặp. Không chấm điểm bằng thứ tự bấm các hoạt động trong cảnh nữa.

Câu hỏi có phương án nhiễu từ những thời kỳ khác, những mốc gần nhau và các cặp cơ quan–quyết định dễ nhầm. Dẫn truyện không tự nêu đáp án trước câu hỏi. Sách mở bài đọc bối cảnh tự chọn; bóng đèn mở hướng dẫn và cách tính điểm. Không hiển thị mã nguồn tư liệu hoặc ghi chú biên tập cho người chơi.

Sau câu hỏi thứ hai ở Tân Trào, người chơi chủ động bấm Đón thời cơ. Thông báo nhỏ hiện trước 2,5 giây; tín hiệu bay qua đúng 5 giây hoạt động, không có vòng đếm ngược. Bắt ở lượt đầu nhận 100 điểm; bỏ lỡ được đón lại với 0 điểm. Không tính thời gian khi hộp đọc đang mở hoặc tab ở nền. Tín hiệu không tự xuất hiện trong lúc đọc câu hỏi.

Kết quả có điểm, số câu phù hợp ngay lần đầu và phần xem lại: câu hỏi, lựa chọn đầu, lý do, phương án phù hợp. Giai đoạn chính luôn khép lại bằng thắng lợi tháng Tám và sự ra đời của nước Việt Nam Dân chủ Cộng hòa ngày 2/9/1945. Hai giai đoạn dẫn có lời kết riêng.

## Đoạn kết điện ảnh

Sau khi xác nhận phương án phù hợp ở câu cuối giai đoạn 1939–1945, điểm được lưu và đoạn kết tự chạy: tối dần 2 giây; nền video cờ hiện trong 1,8 giây với độ sáng giảm; video đọc Tuyên ngôn xuất hiện ở giữa trong 1,2 giây. Quốc ca bắt đầu từ mức 0 khi còn 3 giây video, tăng theo thời gian phát thực tế tới mức đầy đủ lúc video kết thúc. Sau đó video đọc mờ đi, cờ tiếp tục bay và quốc ca phát hết; màn hình chuyển về kết quả.

Dùng nguyên ba tệp trong ending/, không sửa hoặc thay thế video/audio gốc. Video cờ lặp và luôn tắt tiếng. Có tạm dừng, bật/tắt âm thanh, nút Xem kết quả và Escape để rời đoạn kết; điều khiển tự ẩn khi không dùng. Rời tab tạm dừng. Kết quả có nút Xem lại đoạn kết. Trang ending-preview.html cho xem thử độc lập với điểm chơi.

Âm thanh được mở khóa bằng thao tác xác nhận cuối hoặc nút xem thử; nếu trình duyệt từ chối phát, một nút Phát đoạn kết xuất hiện. Bộ trộn dùng Web Audio khi có hỗ trợ. Máy chủ hỗ trợ video/mp4, audio/mpeg, HEAD và HTTP Range để video dài có thể tải, tua theo từng đoạn.

Xem [ghi chú triển khai đoạn kết](docs/ending-implementation.md).

## Lưu tiến độ

Mỗi giai đoạn dùng một khóa localStorage riêng: thang-tam:story:1:<giai-doan>. Lưu câu trả lời, lần lựa chọn đầu và thời gian tín hiệu đã qua; tải lại hoặc đóng rồi mở lại trình duyệt có thể tiếp tục trên cùng hồ sơ trình duyệt. Không có tài khoản hay đồng bộ sang máy khác. Chơi lại chỉ xóa lượt của giai đoạn đang chọn, có xác nhận trước khi thay điểm.

Dữ liệu được kiểm tra và dựng lại theo luật khi khôi phục. Điểm tính từ câu trả lời đầu, không lấy tổng điểm lưu sẵn. Nếu bộ nhớ trình duyệt bị chặn, game vẫn chơi được và hiện thông báo không lưu được.

## Mã đang được tải

| Tệp | Vai trò |
|---|---|
| index.html, hanh-trinh.html | Chọn giai đoạn và chơi độc lập theo URL |
| src/js/story-content.js | 26 câu, dẫn truyện, phương án, lý do và bài đọc bối cảnh |
| src/js/story-core.js | Luật chọn, thử lại, điểm, thời cơ và khôi phục tiến độ |
| src/js/story-game.js | Giao diện, phím, hộp đọc và tổng kết |
| src/js/story-ending.js, src/css/story-ending.css | Chuyển cảnh, video, trộn quốc ca và điều khiển đoạn kết |
| src/css/story.css | Bố cục hai cột và điện thoại |
| src/css/story-tone.css | Màu mực/giấy, chữ, lựa chọn và không khí lịch sử |
| src/js/august-world.js | Bộ vẽ cảnh pixel được giữ từ bản trước |

Các bộ august-content/core/game, v2, network và pixel-draft được giữ để tham khảo, không điều khiển trang chơi chính. Tiến độ cũ không được chuyển thành điểm của bộ câu hỏi mới.

## Nguồn và phạm vi

Nội dung dựa vào ba tài liệu Word của nhóm; tệp gốc được giữ nguyên. Xem [bảng đối chiếu câu hỏi](docs/story-implementation.md), [bản trích](docs/source-extracts-v2/) và [kịch bản hình ảnh](docs/kich-ban-hinh-anh-pixel.md). Các mã đối chiếu chỉ phục vụ biên tập trong dữ liệu và tài liệu phát triển.

Cảnh pixel là hình minh họa, chưa phải phục dựng chính xác kiến trúc hoặc trang phục. Độ khó được thiết kế qua phân biệt bối cảnh, chủ trương và mốc dễ nhầm; chưa được đo qua thử nghiệm với lớp sinh viên thực tế.

## Kiểm tra

```powershell
npm test
npm run test:browser
npm run test:ending
npm run test:media
```

Bộ kiểm tra trình duyệt cần Chrome hoặc Edge, tạo hồ sơ riêng và không gắn vào trình duyệt người dùng. Ảnh kiểm tra ở .qa/story/ (không theo dõi bằng Git). npm run test:august và npm run test:legacy dành cho các bộ luật trước.
