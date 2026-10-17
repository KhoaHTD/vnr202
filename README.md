# Đường đến tháng Tám · v2

Web game lịch sử Việt Nam giai đoạn 1930–1945, giao diện tiếng Việt. Người chơi kéo thả hoặc chọn–đặt các hoạt động để đáp ứng hai nhiệm vụ trên địa bàn minh họa. Bản mới có 3 chương, 9 chặng, 36 thẻ theo màn và 18 nhiệm vụ được chấm điểm.

## Mở và chơi thử

Yêu cầu Node.js; dùng Node 22 trở lên để chạy cả bộ kiểm tra trình duyệt. Game dùng HTML/CSS/JavaScript thuần và SVG được tạo trong mã nguồn, không cần cài thư viện để khởi động.

```powershell
npm start
```

Giữ cửa sổ chạy mở, sau đó truy cập:

- Trang đầu: [http://localhost:5173/index.html](http://localhost:5173/index.html).
- Bàn chơi: [http://localhost:5173/hanh-trinh.html](http://localhost:5173/hanh-trinh.html).

Chạy qua HTTP để hai trang và phiên chơi dùng cùng một nguồn. Không dùng việc mở tệp HTML trực tiếp làm cách chạy được hỗ trợ. Font Google là tùy chọn; khi không tải được, trình duyệt dùng font dự phòng của hệ thống.

## Cách chơi và điểm số

Mỗi chặng hiện một câu bối cảnh, hai nhiệm vụ và bốn hoạt động có minh họa. Đặt hai thẻ vào hai nhiệm vụ rồi bấm **Triển khai**. Có thể mở **Tìm hiểu**, thông tin thẻ, thông tin nhiệm vụ hoặc **Hồ sơ** để đọc thêm; phần đọc sâu không bắt buộc để đi tiếp.

- Kéo bằng chuột hoặc thao tác con trỏ; cũng có thể chọn một thẻ rồi chọn nhiệm vụ để đặt.
- Bàn phím: Tab đến thẻ, Enter/Space để chọn; Tab đến nhiệm vụ, Enter/Space để đặt. Escape hủy chọn. Nút **Đưa về khay** trả thẻ chưa khóa.
- Đặt thẻ vào ô đã có thẻ sẽ thay thẻ; nếu chuyển một thẻ giữa hai ô đã có thẻ thì hai thẻ đổi chỗ. Có thể đổi cách bố trí trước khi triển khai.
- Thả hụt không tính là một lần trả lời và không làm mất điểm. Highlight vùng nhận chỉ cho biết có thể thả, không tiết lộ phương án phù hợp.
- Sau triển khai, ô phù hợp được khóa. Phần chưa phù hợp có thể điều chỉnh hoặc chọn **Tiếp tục và ôn lại sau**. Cần triển khai ít nhất một lần trước khi chuyển chặng.

| Kết quả một nhiệm vụ | Điểm |
|---|---:|
| Phù hợp ngay lần triển khai đầu | 10 |
| Phù hợp sau khi điều chỉnh | 5 |
| Chưa hoàn thành khi chuyển chặng | 0 |

Mỗi chặng tối đa 20 điểm; toàn hành trình tối đa **180 điểm**. Chương 1 và 2 mỗi chương tối đa 40 điểm, chương 3 tối đa 100 điểm. Không có điểm tốc độ hoặc phạt khi đọc tư liệu. Nhiều thẻ cùng đáp ứng nhiệm vụ được chấp nhận với điểm như nhau.

Phản hồi đánh giá sự phù hợp với nhiệm vụ và bối cảnh, không gọi người chơi hay hoạt động lịch sử là “sai”. Nút **Vì sao?** giải thích đúng cặp nhiệm vụ–thẻ đã triển khai, kèm phương án đáp ứng và định vị nguồn.

## Xem kết quả, ôn tập và lưu phiên

Sau hành trình có tổng điểm, điểm từng chương và số nhiệm vụ phù hợp ngay, đã điều chỉnh hoặc chưa hoàn thành. Phần xem lại giữ lựa chọn ban đầu kể cả khi đã sửa; có bộ lọc, lý do riêng cho từng cặp, các phương án phù hợp và lịch sử những lần triển khai. Có thể xem lại chương sau hai chương đầu.

**Luyện lại tình huống** mở một lượt luyện riêng của chặng đó. Điểm luyện được thông báo khi hoàn tất, không viết lại điểm hoặc lịch sử của lượt hành trình. Quay lại xem lại giữ các mục đang mở và vị trí cuộn trong lượt luyện hiện tại.

Tiến độ, thứ tự thẻ đã xáo và tùy chọn âm thanh được lưu bằng **sessionStorage trong cùng tab**. Tải lại trang hoặc chuyển giữa hai URL trên cùng nguồn có thể tiếp tục lượt đang chơi. Đóng tab kết thúc phạm vi lưu phiên; đây không phải tài khoản, lịch sử lưu dài hạn hoặc bảng xếp hạng. Lượt luyện đang thực hiện chỉ ở bộ nhớ, không tự tiếp tục sau tải lại. Nếu trình duyệt chặn lưu phiên, game thông báo và vẫn cho chơi, nhưng tải lại có thể mất tiến độ.

Lượt mới thay tiến độ lượt cũ; game hỏi lại nếu hành trình còn đang chơi. Âm thanh mặc định tắt và có nút bật/tắt. Các hiệu ứng trạng thái cần tôn trọng tùy chọn giảm chuyển động của hệ điều hành.

## Nội dung, minh họa và nguồn

Bộ matching đã đối chiếu ba Word của nhóm qua bản trích OOXML. Đây là căn cứ nội bộ, **chưa phải xác minh lịch sử độc lập hoặc duyệt chuyên môn**. Các đánh giá là quy tắc biên tập theo nhiệm vụ cụ thể, không phải kết luận trích nguyên văn giáo trình.

- `docs/content-model-v2.json`: nguồn dữ liệu 9 màn, 72 cặp đánh giá, lý do và phương án được chấp nhận.
- `docs/content-matrix-v2.md`: bản đọc ma trận cho nhóm.
- `docs/content-review-v2.md`: giới hạn nguồn, nội dung đã điều chỉnh và chi tiết cần duyệt.
- `docs/source-extracts-v2/`: bản trích có hash và định vị đoạn `D1:P013`… Số Pxxx là đoạn OOXML, không phải trang.
- `docs/ui-semantics-v2.md`: ý nghĩa màu, icon, số, đường nối và trạng thái tương tác.
- `docs/asset-manifest-v2.md`: phạm vi và nguồn gốc minh họa.

Nguồn trong game mở bản trích liên quan ở tab mới. Khi bản trích được phục vụ dưới dạng văn bản, dùng tìm kiếm trong trang với mã Pxxx để đến đoạn; fragment không thay thế một trình đọc Markdown.

Minh họa v2 là **SVG tạo trong repository**, không phải ảnh tư liệu, bản đồ địa lý hay tái dựng địa điểm có thật. Cây, sông, nhà và nhân vật tạo ngữ cảnh; các đường nối biểu thị quan hệ tổ chức và liên lạc. Điểm người chơi phản ánh mức độ hiểu nhiệm vụ, không thay đổi diễn biến lịch sử. Ảnh cũ chưa rõ nguồn/khác thời kỳ không được dùng làm ảnh tư liệu cho bản v2.

## Cấu trúc đang chạy

| Tệp | Vai trò |
|---|---|
| `index.html`, `hanh-trinh.html` | Trang đầu và game, giữ URL hiện có |
| `src/js/v2-content.js` | Payload tạo sẵn: `window.V2_DATA`; không fetch JSON trong lượt chơi |
| `src/js/v2-core.js` | Luật đặt/hoán đổi, triển khai, 10/5/0, lịch sử, tổng kết, khôi phục phiên |
| `src/js/v2-art.js` | Icon, hình 36 thẻ và 9 cảnh SVG |
| `src/js/v2-ui.js` | HTML của landing, chương, bàn chơi, kết quả, xem lại và bảng đọc thêm |
| `src/js/v2-game.js` | Điều phối giao diện, chuột/chạm/bàn phím, dialog, phiên và âm báo |
| `src/css/v2-tokens.css`, `src/css/v2.css` | Vai trò màu, chữ, khoảng cách, bố cục và trạng thái |
| `server.cjs` | Máy chủ tĩnh cục bộ, bind `127.0.0.1:5173` |

Các tệp giao diện/luật cũ được giữ trong repository nhưng hai entry HTML mới không nạp chúng. Không chỉnh trực tiếp payload `v2-content.js` vì lần build sau sẽ ghi lại.

## Cập nhật nội dung và kiểm tra

Khi biên tập matching, cập nhật bản nháp chương ở `docs/content-drafts-v2/`, đối chiếu nguồn và chạy theo thứ tự:

```powershell
node tools/build-content-spec-v2.cjs
node tools/build-runtime-content-v2.cjs
node tools/build-content-spec-v2.cjs --check
node tools/build-runtime-content-v2.cjs --check
```

Hồ sơ đọc thêm và thông điệp chương được biên soạn trong `tools/build-runtime-content-v2.cjs`. Công cụ sinh payload kiểm định vị nguồn, độ dài hồ sơ và giữ nguyên scenes/evaluations của model. Nếu Word thay đổi, đọc lại nguồn trước; `tools/extract-docx-content-v2.ps1` chỉ trích xuất, không tự duyệt nội dung.

```powershell
npm test
npm run test:browser
```

`npm test` kiểm tra engine và tính đồng bộ tài liệu/payload. `npm run test:browser` chạy Chromium thật bằng hồ sơ kiểm tra riêng, tự mở server cục bộ khi cần. Script không gắn vào trình duyệt cá nhân. Có thể chỉ định `GAME_BROWSER_PATH`, `GAME_TEST_BASE_URL` hoặc `GAME_QA_DIR` khi cần chọn trình duyệt, nguồn chạy hay nơi lưu ảnh kiểm tra.

Đã chạy 14 kiểm tra luật v2 và kiểm tra tính đồng bộ nội dung đạt. Kết quả kiểm tra trình duyệt và bằng chứng hình ảnh được ghi riêng trong `docs/qa-v2.md` khi thực hiện. Kiểm tra tự động không chứng minh thao tác trên phần cứng cảm ứng hoặc mức độ thú vị với người chơi thật; các phần này cần thử trực tiếp.
