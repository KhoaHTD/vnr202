> **Lưu ý (cơ chế mới):** game ghép tình huống – sự kiện không còn câu hỏi cuối chương (`QUESTIONS` đã bỏ; màn cuối chương nay là tổng kết dòng thời gian). Các đề xuất dưới đây chỉ còn giá trị làm câu hỏi thưởng hoặc nội dung ôn tập, và **chưa được nhóm duyệt**.

# Đề xuất câu hỏi cuối chương (chờ nhóm duyệt)

Câu hỏi hiện tại nằm trong `game.js` (hằng `QUESTIONS`). File này **chỉ là đề xuất**, chưa sửa vào code.

Vấn đề hiện tại: đáp án sai quá dễ đoán (ví dụ "Chỉ để ghi nhớ các mốc thời gian"). Đề xuất dưới đây thay đáp án sai bằng **một nhầm lẫn có thật trong lịch sử**, lấy từ `docs/noi-dung-goc.md`, để người chơi phải hiểu mới chọn đúng.

Giao diện đã sẵn sàng cho mọi câu hỏi: đáp án đúng nhận dấu tích, đáp án sai nhận dấu son "CHƯA ĐÚNG" kèm giải thích, không trừ điểm.

---

## Cuối chương 1 (1930–1935)

**Câu hỏi (giữ nguyên):** Vì sao khôi phục tổ chức có ý nghĩa cho giai đoạn sau?

- **Đúng (giữ nguyên):** Tạo mạng lưới để tiếp tục vận động và phối hợp.
- **Sai (hiện tại):** Chỉ để ghi nhớ các mốc thời gian.
- **Sai (đề xuất):** Thanh trừ mạnh tay trí thức, phú hào, địa chủ trong hàng ngũ để giữ tổ chức trong sạch.
- **Giải thích khi chọn sai (đề xuất):** Đây là sai lầm "tả" khuynh của Xứ ủy Trung Kỳ năm 1931 ("thanh trừ trí, phú, địa, hào"). Tháng 5/1931, Thường vụ Trung ương phê phán gay gắt sai lầm này và đề ra phương hướng "Bôn-sê-vích hóa" Đảng để duy trì cơ sở, phát triển phong trào.
- **Nguồn:** `docs/noi-dung-goc.md`, mục "Cuộc đấu tranh khôi phục tổ chức và phong trào cách mạng".

## Cuối chương 2 (1936–1939)

**Câu hỏi (giữ nguyên):** Điều gì nổi bật trong cách lãnh đạo giai đoạn 1936–1939?

- **Đúng (giữ nguyên):** Điều chỉnh phương pháp theo hoàn cảnh, mở rộng lực lượng.
- **Sai (hiện tại):** Dùng một hình thức đấu tranh cho mọi hoàn cảnh.
- **Sai (đề xuất):** Tiếp tục gắn chặt giải phóng dân tộc với cách mạng ruộng đất như Luận cương tháng 10/1930.
- **Giải thích khi chọn sai (đề xuất):** Văn kiện "Chung quanh vấn đề chiến sách mới" (10/1936) khẳng định cuộc giải phóng dân tộc không nhất thiết phải kết chặt với cách mạng điền địa; cần chọn kẻ thù chính, nguy hiểm nhất để tập trung lực lượng. Đây là bước đầu khắc phục hạn chế tả khuynh của Luận cương.
- **Nguồn:** `docs/noi-dung-goc.md`, mục "Bước phát triển mới về nhận thức lý luận".

## (Tùy chọn) Câu hỏi cho chương 3

Hiện game không có câu hỏi sau chương 3 vì chương này kết thúc bằng màn kết. Nếu nhóm muốn thêm:

**Câu hỏi:** Vì sao sau khi Nhật đảo chính Pháp (9/3/1945), Đảng chưa phát động tổng khởi nghĩa ngay?

- **Đúng:** Cuộc đảo chính tạo khủng hoảng chính trị sâu sắc, nhưng điều kiện tổng khởi nghĩa chưa chín muồi; cần phát động cao trào kháng Nhật để chuẩn bị.
- **Sai:** Phát động tổng khởi nghĩa ngay khi kẻ thù chia rẽ, vì thời cơ chỉ đến một lần.
- **Giải thích khi chọn sai:** Chỉ thị "Nhật – Pháp bắn nhau và hành động của chúng ta" (12/3/1945) nhận định điều kiện tổng khởi nghĩa chưa chín muồi, chủ trương phát động cao trào kháng Nhật cứu nước làm tiền đề, tránh khởi nghĩa quá sớm.
- **Nguồn:** `docs/noi-dung-goc.md`, mục "Nhật đảo chính Pháp và sự điều chỉnh chủ trương".

---

## Cách áp dụng sau khi nhóm duyệt

Sửa hằng `QUESTIONS` trong `game.js`. Mỗi câu gồm 4 phần tử:

```js
['Câu hỏi', 'Đáp án đúng', 'Đáp án sai', 'Giải thích khi chọn sai']
```
