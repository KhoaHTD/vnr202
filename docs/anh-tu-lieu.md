# Ảnh tư liệu cần bổ sung

Game đã dựng sẵn khung ảnh. Ô nào chưa có ảnh sẽ hiện khung giấy ghi "Ảnh tư liệu sẽ được bổ sung". Nhóm chỉ cần điền dữ liệu vào `content.js`; không phải sửa code.

## Quy tắc bắt buộc

- **Chỉ dùng ảnh có nguồn và giấy phép rõ ràng** (ví dụ: Bảo tàng Lịch sử quốc gia, TTXVN, Wikimedia Commons có ghi giấy phép, ảnh thuộc phạm vi công cộng).
- **Không dùng ảnh do AI tạo, ảnh minh họa, hoặc ghi nguồn không kiểm chứng được.**
- **Tránh ảnh nạn đói 1945.**
- Giai đoạn 1930–1935 có rất ít ảnh chụp. Ưu tiên bản scan văn kiện, trang báo, truyền đơn.
- Định dạng **WebP**, mỗi ảnh **≤ 150 KB**, đặt trong `assets/img/`.
- Ảnh tự động được lọc sepia nhẹ và hòa vào nền giấy. Không cần chỉnh màu trước.

## Cách điền một ô ảnh

```js
image: {
  src: 'assets/img/hanoi-19-8-1945.webp',  // để '' = hiện khung giữ chỗ
  alt: 'Quần chúng mít tinh trước Nhà hát lớn Hà Nội ngày 19/8/1945', // mô tả cho người khiếm thị, tiếng Việt
  caption: 'Mít tinh tại Nhà hát lớn Hà Nội',  // hiện khi phóng to ảnh
  date: '19/8/1945',
  source: 'Tên kho lưu trữ hoặc tác giả',
  license: 'Giấy phép (ví dụ: Phạm vi công cộng, CC BY-SA 4.0)'
}
```

- Muốn **bỏ** một ô ảnh: xóa hẳn trường `image`. Bố cục tự co lại, không vỡ.
- Muốn **thêm** ô ảnh cho một chặng hay một hồ sơ chưa có: thêm trường `image` theo mẫu trên.
- Chú thích dưới ảnh tự sinh theo dạng: `Ảnh tư liệu · <date> · Nguồn: <source>`.

## Ảnh đã gắn (vòng 4) — CẦN NHÓM XÁC MINH

Ba ảnh dưới đây đã nằm trong `assets/img/` và đã gắn vào game. **Trường `source` và `license` đang để trống**: nhóm phải điền nguồn, giấy phép và xác minh lại chú thích (ngày, địa điểm) trước khi phát hành.

> **Cần bản độ phân giải ≥ 1200px.** Cả 3 ảnh hiện chỉ rộng 500px (cao 260–334px). Game đã giới hạn khung ảnh tối đa 560px và phủ duotone + hạt nhiễu để che bớt độ vỡ, nhưng nên thay bằng bản lớn hơn khi tìm được.

| File | Nội dung nhìn thấy | Đặt ở | `focus` | Chú thích đang dùng (cần xác minh) |
|---|---|---|---|---|
| `1945-08-19-nha-hat-lon.webp` (500×329) | Mít tinh đông người trước Nhà hát lớn, cờ sao lớn giữa mặt tiền | Bìa trang chủ (`homeImage`) và ảnh nhỏ ở kết quả chặng 9 (`scenes[8].image`) | `50% 35%` | Mít tinh tại quảng trường Nhà hát lớn Hà Nội, 19/8/1945 |
| `1945-giai-phong-quan-duong-pho.webp` (500×334) | Đoàn người mang súng, đội mũ, diễu hành trên phố, người dân hai bên | Màn mở Chương 3 (`chapters[2].image`) | `35% 50%` | Lực lượng vũ trang cách mạng trên đường phố, 1945 (**chưa rõ ngày, địa điểm**) |
| `1945-09-02-ba-dinh.webp` (500×260) | **Ảnh ghép hai khung**: biển người, lá cờ sao bên trái; Chủ tịch Hồ Chí Minh đọc Tuyên ngôn bên phải | Màn kết (`endingImage`) và hồ sơ mục 9 (`records[8]`) | `75% 40%` | Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, 2/9/1945 (ảnh ghép) |

- Ảnh Ba Đình là ảnh ghép: game hiển thị nguyên tỉ lệ, **không cắt** phần nào, và chú thích tự ghi "Ảnh tư liệu (ảnh ghép)" nhờ trường `composite: true`.
- Ảnh Nhà hát lớn và ảnh Ba Đình đang được **dùng lại** ở hai chỗ. Khi có ảnh khác phù hợp hơn cho kết quả chặng 9 hoặc hồ sơ mục 9, chỉ cần thay trường `image` ở chỗ đó.

## Danh sách ô ảnh

| # | Vị trí trong game | Trường trong `content.js` | Khung hiển thị | Gợi ý nội dung | Trạng thái |
|---|---|---|---|---|---|
| 1 | Bìa trang chủ | `homeImage` | cắt 5:4, rộng ≤ 440px | Mít tinh 19/8/1945 tại Nhà hát lớn Hà Nội | **Đã gắn**, cần nguồn |
| 2 | Màn mở chương 1 | `chapters[0].image` | tỉ lệ gốc, rộng ≤ 560px | Bản scan văn kiện hoặc trang báo bí mật đầu những năm 1930 | Khung giữ chỗ |
| 3 | Màn mở chương 2 | `chapters[1].image` | tỉ lệ gốc, rộng ≤ 560px | Trang báo công khai 1936–1939, hoặc ảnh phong trào Đông Dương Đại hội | Khung giữ chỗ |
| 4 | Màn mở chương 3 | `chapters[2].image` | tỉ lệ gốc, rộng ≤ 560px | Lực lượng vũ trang cách mạng 1945 (hoặc Pác Bó) | **Đã gắn**, cần nguồn |
| 5 | Kết quả chặng 9 | `scenes[8].image` | ảnh nhỏ rộng 160px, bấm để phóng to | Mít tinh 19/8/1945 tại Hà Nội | **Đã gắn** (dùng lại ảnh bìa) |
| 6 | Hồ sơ mục 9 | `records[8]` (phần tử thứ 3) | tỉ lệ gốc, rộng ≤ 480px | Lễ đọc Tuyên ngôn Độc lập tại Ba Đình 2/9/1945 | **Đã gắn** (dùng lại ảnh màn kết) |
| 7 | Màn kết | `endingImage` | tỉ lệ gốc, rộng ≤ 560px | Quảng trường Ba Đình 2/9/1945 | **Đã gắn**, cần nguồn |

Mỗi ảnh có thêm các trường hiển thị: `width`, `height` (kích thước thật của file, để trang không giật khi ảnh tải), `focus` (điểm nhìn chính khi phải cắt ảnh, dạng `"x% y%"`), `composite: true` nếu là ảnh ghép.

### Ô có thể thêm (chưa tạo khung)

Thêm trường `image` vào đúng chặng hoặc hồ sơ nếu tìm được ảnh phù hợp. Mỗi chặng tối đa 1 ảnh.

| Vị trí | Trường | Gợi ý nội dung |
|---|---|---|
| Kết quả chặng 1 | `scenes[0].image` | Bản scan tài liệu về Xô viết Nghệ–Tĩnh |
| Kết quả chặng 2 | `scenes[1].image` | Bản scan văn kiện Đại hội I (3/1935) |
| Kết quả chặng 5 | `scenes[4].image` | Pác Bó, nơi họp Hội nghị Trung ương 8 (5/1941) |
| Kết quả chặng 6 | `scenes[5].image` | Đội Việt Nam Tuyên truyền Giải phóng quân (22/12/1944) |
| Kết quả chặng 8 | `scenes[7].image` | Tân Trào, Hội nghị toàn quốc của Đảng (14–15/8/1945) |
| Hồ sơ mục 1–8 | `records[0..7]` (phần tử thứ 3) | Theo nội dung từng mục |

## Kiểm tra sau khi thêm ảnh

1. Chạy `node test-logic.cjs` và `node check.cjs` (cần `node server.cjs` đang chạy).
2. Mở game ở chiều rộng 360px và 1280px, xem ảnh không làm vỡ bố cục.
3. Kiểm tra dung lượng: `ls -lh assets/img/` (mỗi file ≤ 150 KB).
