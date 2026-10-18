# Bản triển khai hành trình pixel

> Bản lịch sử triển khai của cơ chế thao tác cũ. Trang chính đã chuyển sang [dẫn truyện và lựa chọn](story-implementation.md); các mô tả thao tác và 2400 điểm dưới đây không áp dụng cho bản hiện tại.

## Trạng thái

Hai URL chính hiện tải engine `august-*`. Bản nháp pixel cũ vẫn ở `pixel-draft.html`; các thử nghiệm matching/nối đường không được tải bởi trang chính.

11 đoạn: 1930–1935; 1936–1939; chuyển hướng; Việt Minh; chuẩn bị lực lượng; tháng 3/1945; kho thóc; khởi nghĩa từng phần; Tân Trào/thời cơ; giành chính quyền; ngày độc lập. Hai đoạn đầu ngắn, 20/24 hoạt động nằm ở chương ba.

## Nội dung và hình ảnh đã đưa vào mã

| Đoạn | Hình ảnh và hoạt động |
|---|---|
| 1930–1935 | Cổng xưởng/đường làng → sinh hoạt cộng đồng gợi Xô viết Nghệ–Tĩnh → khôi phục cơ sở |
| 1936–1939 | Dân nguyện, tài liệu/báo → nhiều nhóm tham gia → mít tinh minh họa |
| Chuyển hướng | Lán họp, trao đổi thông tin, đưa tài liệu tới cơ sở |
| Việt Minh | Gặp nhóm dân, đọc/nghe chung, góp sức tiếp tế |
| Chuẩn bị | Rừng/căn cứ, tiếp tế, học tập và tập hợp lực lượng |
| Tháng 3 | Phố đổi không khí, nhận tin và chuẩn bị cao trào |
| Kho thóc | Cửa đóng/mở, bao thóc, người chuyển và nhận; không lửa |
| Từng phần | Nhóm dân và cơ sở địa phương, sinh hoạt sau tiếp quản |
| Thời cơ | Phác Tân Trào, cơ sở sẵn sàng, tín hiệu duy nhất bay ngang |
| Giành chính quyền | Đoàn người, phối hợp, lát cắt Hà Nội/Huế/Sài Gòn với biến thể phông khác nhau |
| Ngày độc lập | Phác lễ đài tạm, cờ, phát biểu và quần chúng; tách ngày 2/9 khỏi đoạn tháng Tám |

Hành động gồm gặp nhóm, mang vật đến nơi nhận, giữ để thực hiện công việc và nắm tín hiệu. Có chuyển động nhân vật trên cảnh; vật giấy/tài liệu và bao tiếp tế/thóc dùng dáng mang khác nhau. Nền/nhân vật là pixel-native Canvas tự tạo trong repo.

## Những giới hạn cần nói đúng

- Đây là bản game có thể chơi xuyên suốt, không phải bản mỹ thuật lịch sử hoàn thiện. Nhiều hoạt ảnh được thể hiện bằng tư thế khóa và chuyển động vị trí, chưa phải bộ sprite vẽ tay đầy đủ 4–8 khung cho từng động tác như brief sản xuất cuối.
- Địa điểm có tên hiện là phác bố cục/kiến trúc diễn giải; chưa xác nhận đúng từng cấu kiện, trang phục, vũ khí hoặc chân dung. Không dùng chúng thay ảnh tư liệu.
- Chuỗi thành lập lực lượng năm 1944 được nêu trong hồ sơ; cảnh căn cứ không tự nhận là phục dựng đủ đội hình 34 người của lễ thành lập.
- Các lớp cảnh có nền/công trình/nhân vật nhưng chưa là bộ asset PNG/sprite sheet độc lập để giao một pipeline mỹ thuật khác. Bộ tham chiếu chuyên môn vẫn cần hoàn thiện trước bản phát hành chính thức.
- Hai chương đầu tóm tắt; các văn kiện, nhân sự và sự kiện mở rộng nằm trong hồ sơ. Nội dung không thay toàn bộ giáo trình.
- Điểm đánh giá thao tác theo mô hình. Một số điều kiện là trình tự kể chuyện đã giải thích, không phải khẳng định lịch sử chỉ có một cách hành động đúng.

## Luật điểm và thời cơ

24 hoạt động × 100 = 2400. Phù hợp lần đầu nhận 100; lần đầu chưa phù hợp/bỏ lỡ rồi hoàn thành nhận 0 cho mục đó. Không thay điểm khi luyện lại. Hủy giữ, đọc tư liệu và đi chậm không bị phạt.

Tín hiệu chỉ đến sau phần chuẩn bị của cảnh, báo trước nhỏ, bay 5 giây hoạt động, không vòng/số đếm. Hướng dẫn, hộp đọc và tab ở nền tạm dừng. Bỏ lỡ có checkpoint thử lại; toàn hành trình vẫn tới kết cục lịch sử ngày độc lập.

Điểm và tiến độ tính từ log sự kiện, không cộng dồn tùy ý trên UI. Lần đầu được giữ qua tải lại cùng tab; dữ liệu khôi phục được kiểm tra theo schema và replay điều kiện.

## Bằng chứng kiểm tra

- `npm test`: 11 kiểm tra logic qua; gồm đủ nguồn theo đoạn, luồng 2400 điểm, không bỏ qua cảnh chưa hoàn thành, không cộng lặp, sửa vẫn 0, thời cơ đúng 5000 ms, khôi phục còn thời gian, từ chối dữ liệu không hợp lệ và luyện tập độc lập.
- `node test/august-browser.cjs --review-only`: kiểm tra với fixture riêng qua phần nguồn, tổng kết, luyện tập, 10 cảnh trên điện thoại, hủy giữ cảm ứng và không tràn ngang. Fixture không được tính là bằng chứng chơi xuyên suốt.
- `node test/august-browser.cjs` (cùng lệnh của `npm run test:browser`): PASS toàn bộ 11 cảnh bằng thao tác trình duyệt thật trong profile riêng. Lượt chủ đích có một hoạt động làm sớm và một lần bỏ lỡ thời cơ kết thúc ở 2200/2400, xác nhận thử lại không cộng lại điểm. Kiểm tra cả gặp nhóm, chuyển vật, giữ chuột/bàn phím, tải lại giữa hành trình, đọc đúng đoạn nguồn, tổng kết, luyện tập độc lập và bố cục 390/360px.
- Ảnh kiểm tra ở `.qa/august/`, không theo dõi bằng Git. Cảm ứng được mô phỏng bằng trình duyệt; chưa có kiểm thử trên thiết bị vật lý hay đánh giá hiểu nội dung với người chơi.

Đọc [README](../README.md) để chạy và xem các tệp đang được tải. [Kịch bản hình ảnh](kich-ban-hinh-anh-pixel.md) vẫn là brief mục tiêu mỹ thuật để nâng độ chi tiết và tính xác thực tiếp theo.
