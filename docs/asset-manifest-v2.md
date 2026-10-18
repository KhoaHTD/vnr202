# Tài sản minh họa v2

## Nguồn gốc và phạm vi

Toàn bộ SVG của giao diện v2 trong `src/js/v2-art.js` được vẽ bằng mã trong repository này. Không sử dụng ảnh tải về, biểu tượng của một bộ icon bên ngoài hoặc ảnh tư liệu. Các hình là minh họa tổng hợp, không phải ảnh lịch sử, bản đồ địa lý, tuyến liên lạc đã xác minh hoặc tái dựng một công trình có thật. Nhân vật cách điệu không đại diện cho một nhân vật lịch sử cụ thể.

SVG dùng để truyền đạt hoạt động và trạng thái. Nội dung lịch sử, quy tắc ghép và phần giải thích do dữ liệu nội dung đảm nhiệm. Minh họa không phải nguồn sử liệu và không tạo thêm tiêu chí chấm điểm.

## API

`window.V2Art.icon(name, size = 24)` trả SVG đường nét, màu kế thừa `currentColor`. Các tên chính: `info`, `close`, `arrow`, `back`, `sound`, `sound-off`, `check`, `review`, `reset`, `book`, `hand`, `lock`. Có thêm `play`, `pause`, `home`, `trophy`, `chevron`, `expand`, `minus`, `menu`. Tên không có trong danh sách trả icon thông tin.

`window.V2Art.card(cardId)` trả SVG `viewBox="0 0 180 108"` cho đủ 36 ID thẻ trong `docs/content-model-v2.json`. Mỗi thẻ minh họa hoạt động trên thẻ, không dùng màu phân loại phù hợp/chưa phù hợp và không dùng dấu đánh giá. Không cần người chơi nhận diện hình để đọc được tên hoạt động.

`window.V2Art.scene(sceneId)` trả SVG `viewBox="0 0 1000 380"` cho `s01`–`s09`. Hai cụm ở phía trái và phải liên hệ với hai nhiệm vụ của màn; vị trí nhận thẻ và nhãn nằm ở DOM, do UI quản lý. Không nhúng chữ hoặc nút vào SVG.

Tất cả SVG có `aria-hidden="true"` và `focusable="false"`. UI cung cấp tên và mô tả bằng HTML cạnh minh họa; icon độc lập trong nút bắt buộc có tên truy cập trên nút. Không dùng SVG như nội dung duy nhất để truyền đạt kết quả.

## Vai trò hình ảnh

| Thành phần | Ý nghĩa |
|---|---|
| Nhà máy, công nhân | Nhóm công nhân và hoạt động lao động trong màn 1 |
| Ruộng, bao thóc, người đội nón | Đời sống nông dân, lương thực và hoạt động ở địa bàn nông thôn |
| Nhà, cây, cụm nhà | Địa điểm minh họa để thấy các hoạt động được tổ chức ở đâu; không mã hóa địa danh thật |
| Đường nối giữa nhà, giấy trên tuyến | Quan hệ tổ chức, truyền tin, phối hợp |
| Sách mở, trang có dòng | Học tập, trao đổi kiến thức, văn bản; dòng trên trang là cấu trúc trang, không giả nội dung tư liệu |
| Máy in, trang báo có cột | Xuất bản báo và hoạt động báo chí |
| Nhiều người đứng thành nhóm | Tập hợp, tham gia và hoạt động quần chúng |
| Các nhóm người quanh bàn | Hội, ủy ban, mặt trận và cùng tổ chức công việc |
| Hòm phiếu | Tranh cử dân biểu; phiếu không dùng dấu tích có thể nhầm với đáp án phù hợp |
| Đồng xu, đồng hồ | Tiền lương và thời gian lao động |
| Cây, sông, đồi, nền giấy sáng | Không gian và chiều sâu của bàn chơi; không tương tác, không nhấp nháy, không ám chỉ ranh giới thật |
| Bóng nhỏ | Phân biệt lớp vật thể để tăng độ rõ, không biểu thị trạng thái |

## Chín cảnh

| ID | Cụm trái (`art-target-a`) | Cụm phải (`art-target-b`) |
|---|---|---|
| s01 | Nhà máy, công nhân | Ruộng và đời sống nông dân |
| s02 | Các cơ sở và liên lạc | Học tập tại địa điểm minh họa nhà tù |
| s03 | Tiếp nhận nguyện vọng | Xuất bản báo |
| s04 | Hội tương trợ | Lớp học |
| s05 | Tập hợp thành mặt trận | Cơ sở hoạt động bí mật |
| s06 | Tổ chức, vận động chính trị | Địa bàn và liên lạc |
| s07 | Lương thực gắn với tập hợp người dân | Hành động ở địa bàn |
| s08 | Văn bản/tin tức và bộ máy bên ngoài | Tổ chức, chuẩn bị trong nước |
| s09 | Truyền đạt, phối hợp giữa cơ sở | Quần chúng tham gia |

## CSS trạng thái cho UI

SVG không tự chạy animation, không có pointer handlers. UI thêm `is-a-ready` hoặc `is-b-ready` vào wrapper `.scene-illustration` **chỉ sau khi đánh giá phù hợp**, không phải khi thẻ vừa được thả vào. CSS có thể dùng các quy tắc:

```css
.scene-illustration .art-reveal { opacity: 0; }
.scene-illustration.is-a-ready .art-target-a .art-reveal,
.scene-illustration.is-b-ready .art-target-b .art-reveal { opacity: 1; }
```

`art-reveal` chứa thành quả nhìn thấy sau triển khai: `art-connection`, `art-learning`, `art-crowd`. Các nhóm nhiệm vụ còn có lớp `semantic-*` diễn giải nội dung. `scene-base` là nền chung. Không làm toàn bộ cảnh mờ đi khi chưa hoàn thành, vì người chơi cần nhìn rõ địa bàn và hoạt động. Nếu có chuyển tiếp opacity do UI thêm, phải tôn trọng `prefers-reduced-motion`.

Đường nối là quan hệ minh họa được làm rõ khi hoàn thành, không tạo một trò tìm đường phụ. Không thêm chấm, mũi tên, biểu tượng trang trí hoặc icon vào vùng nhận thẻ chỉ để lấp khoảng trống.
