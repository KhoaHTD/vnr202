# Bộ lệnh giao AI triển khai “Đường đến tháng Tám” v2

Tài liệu gốc cần đọc: `docs/ke-hoach-lot-xac-game-v2.md`. Đây là bộ prompt thực thi, không thay thế đặc tả.

Khuyến nghị: giao từng đợt và xem kết quả thật trước khi giao tiếp. Nếu muốn AI làm liên tục, dùng prompt tổng; AI vẫn phải tự kiểm tra điều kiện qua từng đợt, không dựng chín màn trước khi hoàn thiện màn mẫu.

## A. Prompt tổng — triển khai toàn bộ

```text
Hãy triển khai phiên bản 2 của game “Đường đến tháng Tám” trong repository hiện tại.

Đọc toàn bộ docs/ke-hoach-lot-xac-game-v2.md trước khi sửa code. Đây là đặc tả sản phẩm, gameplay, nội dung, UI/UX, cấu trúc dữ liệu và tiêu chí nghiệm thu chính. Kiểm tra trạng thái Git và code hiện tại; project đã có index.html, hanh-trinh.html, src/js, src/css, assets, test, archive. Không dựa vào các đường dẫn cũ ở thư mục gốc. Giữ nguyên các file tài liệu và thay đổi sẵn có của người dùng.

Mục tiêu: thay game chọn thẻ đọc nhiều bằng kéo thả/matching trên khung cảnh minh họa nhiều màu có ý nghĩa; 3 chương, 9 màn, 2 nhiệm vụ mỗi màn, 4 thẻ. Chuột, cảm ứng, chọn–đặt và bàn phím phải dùng cùng luật. Chấm khi bấm Triển khai, không tiết lộ đáp án khi kéo.

Điểm: mỗi nhiệm vụ phù hợp ngay được 10; điều chỉnh phù hợp sau lần đầu được 5; chưa hoàn thành được 0. Tổng tối đa 180. Không cộng trùng, không trừ vì mở tư liệu hoặc thao tác hụt. Khóa ô đã phù hợp. Lưu lựa chọn ban đầu và các lần thử để tổng kết giải thích đúng từng cặp. Luyện tập không thay điểm lượt gốc.

Ngôn ngữ đánh giá là Phù hợp / Chưa phù hợp trong bối cảnh này / Đã điều chỉnh phù hợp / Chưa hoàn thành. Không dùng Sai, Sai lầm lịch sử, Thất bại để phán xét lựa chọn của người chơi. Các hoạt động có giá trị lịch sử không bị đánh dấu chưa phù hợp chỉ vì khác đáp án dự kiến; nhiệm vụ phải rõ và chấp nhận các phương án có căn cứ.

Đọc các nguồn trong docs, gồm ba tài liệu Word mới. Tạo ma trận 72 cặp và giải thích có nguồn. Nội dung đề xuất trong kế hoạch là bản biên tập, không phải dữ kiện đã xác minh. Ghi rõ mâu thuẫn nguồn; giải quyết bằng kiểm chứng hoặc viết lại nhiệm vụ. Có thể tiếp tục làm engine và giao diện khi một nội dung còn cần xác minh, nhưng không tuyên bố nội dung ấy đã được duyệt.

Thực hiện lần lượt các đợt 0–6. Đầu tiên làm hoàn chỉnh màn mẫu “Giữ mạch nối” trên desktop/mobile và kiểm tra thật, rồi mới mở rộng. Tự xử lý các quyết định kỹ thuật thông thường trong phạm vi đã chốt. Không tạo backend, framework mới, leaderboard hoặc hệ thống tài nguyên ngoài đặc tả.

Mỗi icon, dấu chấm, màu và animation phải có lý do trong docs/ui-semantics-v2.md. Ít chữ nhưng đủ thông tin ra quyết định, nội dung sâu mở qua Tìm hiểu/Vì sao/Hồ sơ. Các vật thể phản hồi hành động có ý nghĩa, không chạy hiệu ứng trang trí vô mục đích. Không xem việc đổi màu CSS là đã lột xác gameplay.

Tách logic chấm/điểm/state khỏi DOM; dùng ID ổn định; dùng sessionStorage v2 trong cùng tab theo kế hoạch, không tự bật localStorage dài hạn. Tổng điểm suy ra từ kết quả từng ô. Nội dung và lịch sử có version. Mọi hành động đặt/đổi/trả thẻ qua cùng lớp placement.

Chạy kiểm tra nội dung, logic và browser. Sửa kiểm tra browser có đường dẫn macOS cố định để phù hợp Windows trước khi dùng. Kiểm tra kéo thật, cảm ứng hoặc ghi rõ emulation, bàn phím, viewport 390 và 1440, reduced motion, phiên hỏng, cộng trùng và tổng kết. Không chỉ gọi handler click rồi tuyên bố đã kiểm tra drag-and-drop.

Cập nhật README, docs/qa-v2.md, ma trận nội dung, bảng ý nghĩa UI và danh sách tài sản. Kết thúc bằng báo cáo ngắn về thay đổi, bằng chứng kiểm tra, cách mở bản chạy và phần nào còn cần xác minh. Nếu chưa có người chơi thử thì ghi rõ, không bịa kết quả 5 người.
```

## B. Giao theo từng đợt

### Lệnh 1 — Kiểm kê, nội dung và thiết kế triển khai

```text
Đọc docs/ke-hoach-lot-xac-game-v2.md và thực hiện đợt 0. Kiểm tra repo hiện tại, các thay đổi sẵn có, cấu trúc chạy/test và ba tài liệu Word trong docs. Tạo docs/content-review-v2.md và docs/content-matrix-v2.md gồm 72 cặp nhiệm vụ–thẻ có trạng thái nháp/đã kiểm chứng, lý do và vị trí nguồn thật.

Đánh giá sự mơ hồ trong từng nhiệm vụ; bổ sung phương án chấp nhận nếu có căn cứ hoặc viết lại nhiệm vụ. Không đánh dấu một hoạt động có ý nghĩa là không phù hợp chỉ để ép đáp án. Ghi rõ các nội dung chưa xác minh, không bịa trang nguồn. Đề xuất danh sách giữ/thay/bỏ theo đúng code hiện tại. Chưa thay giao diện game trong đợt này.

Đầu ra phải đủ để một AI khác bắt đầu màn mẫu mà không phải tự đoán luật chấm, luồng điều chỉnh hoặc cách giữ lịch sử.
```

### Lệnh 2 — Làm màn mẫu có thể chơi

```text
Đọc kế hoạch v2, docs/content-review-v2.md, docs/content-model-v2.json và docs/content-matrix-v2.md đã tạo ở đợt 0. Dùng nội dung mới trong model thay phần đề xuất ban đầu đã được sửa sau đối chiếu. Thực hiện đợt 1: làm màn s02 “Giữ mạch nối” hoàn chỉnh với khung cảnh mô hình giấy nhiều màu, hai nhiệm vụ, bốn thẻ, kéo thả, chọn–đặt và bàn phím.

Làm đủ trước chấm, đã đặt, phù hợp, chưa phù hợp, điều chỉnh, giải thích, ôn sau và điểm 10/5/0. Không lộ đáp án trong hover/drop highlight. Vùng nhận có nhãn thật, thẻ có hình và tên ngắn. Kết quả làm cảnh thay đổi có nguyên nhân. Dùng ma trận nội dung đã kiểm chứng; nếu còn chỗ nháp phải báo rõ.

Có desktop và mobile, không tràn ngang, không thu chữ nhỏ để nhét màn. Tạo docs/ui-semantics-v2.md giải thích ý nghĩa icon/dấu/màu/motion. Cho biết URL bản mẫu và kiểm tra bằng tương tác thật. Chưa nhân rộng chín màn trước khi màn này hoạt động và nhìn đủ hoàn chỉnh.
```

### Lệnh 3 — Chuẩn hóa engine, điểm và phiên

```text
Thực hiện đợt 2 theo kế hoạch v2, dựa trên màn mẫu đã có. Tách matching, scoring, state, session và placement khỏi DOM. Mọi input dùng cùng placement. Lưu lựa chọn ban đầu, submissions và kết quả cuối theo ID; điểm suy ra, không cộng dồn theo click.

Thực hiện đúng hoán đổi, trả thẻ, khóa ô phù hợp, chỉ chấm ô chưa giải quyết, không chấm lại bố trí không đổi, không cộng trùng khi double click/reload. Dùng sessionStorage có schemaVersion/contentVersion; storage bị chặn hoặc hỏng vẫn không làm game crash. Practice tách khỏi lượt có điểm.

Viết và chạy test cho điểm, phép gán nhiều đáp án, bế tắc khi khóa ô, lịch sử, version và các đường hủy thao tác. Không đổi ý nghĩa gameplay hoặc giao diện đã chốt chỉ để làm test dễ hơn.
```

### Lệnh 4 — Hoàn thiện chín màn

```text
Thực hiện đợt 3 theo kế hoạch v2. Triển khai đủ chín màn theo phân bố chương 2/2/5, dùng ma trận nội dung có nguồn. Mỗi màn có hai nhiệm vụ rõ, bốn thẻ, tám cặp đánh giá có lời giải thích đúng ngữ cảnh. Bảo đảm ít nhất một phép gán hai thẻ khác nhau phù hợp và mọi lựa chọn được khóa không gây bế tắc.

Làm ba bộ cảnh với biến thể có ý nghĩa cho từng màn, phản hồi khác nhau theo hoạt động. Bỏ checkpoint trắc nghiệm, dải chỉ số/áp lực/la bàn không còn gắn luật. Giữ hồ sơ để đọc tùy chọn. Không sao chép một màn rồi chỉ thay tiêu đề. Chạy kiểm tra toàn bộ nội dung và chơi qua cả chín màn.
```

### Lệnh 5 — Tổng kết và xem lại

```text
Thực hiện đợt 4. Làm tổng kết chương 40/40/100, tổng kết cuối 180 điểm và ba số lượng phù hợp ngay/đã điều chỉnh/chưa hoàn thành. Màn xem lại có bộ lọc, lựa chọn ban đầu, trạng thái cuối, điểm, lý do cụ thể, phương án phù hợp hơn và nguồn.

Danh sách cần ôn ban đầu phải bao gồm cả các ô đã điều chỉnh. Hỗ trợ xem nhiều lần thử, luyện lại không sửa điểm gốc, quay lại giữ vị trí đọc. Test case 12 phù hợp ngay + 5 điều chỉnh + 1 chưa hoàn thành = 145 điểm và 6 mục cần ôn. Test cả 180, 90, 0 điểm và trạng thái không có mục cần ôn.
```

### Lệnh 6 — Hoàn thiện thiết kế toàn sản phẩm

```text
Thực hiện đợt 5. Đồng bộ landing, hướng dẫn, game, giải thích, hồ sơ, tổng kết và xem lại theo art direction v2. Dùng token theo vai trò, hai font, icon nhất quán; ưu tiên cảnh và thao tác, không để điểm/tư liệu lấn át bàn chơi.

Kiểm từng chi tiết qua bảng semantics: nếu không truyền đạt trạng thái, hành động, quan hệ hoặc bối cảnh cần thiết thì bỏ/sửa. Không thêm dấu chấm, sao, viền phát sáng và chuyển động cho có. Motion phải diễn tả kết quả, có reduced motion; âm thanh tự chọn và đồng bộ trong phiên.

Kiểm nguồn tài sản và phân biệt minh họa với ảnh tư liệu. Gỡ ảnh sai thời kỳ làm placeholder khỏi luồng mới. Cập nhật asset-manifest. Kiểm tra focus/dialog/tương phản/mobile/zoom; không chỉ chụp một ảnh desktop đẹp.
```

### Lệnh 7 — Nghiệm thu và sửa lỗi

```text
Thực hiện đợt 6 và toàn bộ Definition of Done trong kế hoạch v2. Đọc code hiện tại, chạy test thực tế, sửa các lỗi tìm thấy trong phạm vi v2, rồi chạy lại kiểm tra liên quan. Kiểm tra logic và thao tác drag thực, chọn–đặt, bàn phím, mobile, phiên, ôn tập và điểm.

Ghi docs/qa-v2.md: môi trường, lệnh đã chạy, kết quả, screenshot desktop/mobile từng trạng thái quan trọng, lỗi đã sửa, hạn chế còn lại. Chỉ công bố test đã thực sự chạy. Nếu không có người chơi thật hoặc thiết bị thật, ghi rõ và tạo checklist để nhóm thử, không bịa kết quả.

Cập nhật README cho đúng cách chạy và lưu phiên. Báo cáo mục nào của Definition of Done đã đạt, mục nào còn thiếu. Không kết luận hoàn thành chỉ vì npm test trả về thành công nếu kéo thả, giải thích hoặc tổng kết còn thiếu.
```

## C. Prompt rà soát chất lượng thiết kế

```text
Rà soát sản phẩm v2 đang chạy theo docs/ke-hoach-lot-xac-game-v2.md. Chưa sửa code; chỉ báo phát hiện có bằng chứng.

Quan sát landing, một màn chưa đặt thẻ, thao tác kéo, trạng thái phù hợp/chưa phù hợp, giải thích, tổng kết và xem lại trên desktop/mobile. Với mỗi icon, dấu chấm, đường, màu, chuyển động và dòng chữ, xác định vai trò và liệu người chơi hiểu đúng hay không. Kiểm tra việc lộ đáp án trước chấm, khó phân biệt vùng tương tác, lượng chữ, lịch sử và điểm.

Chỉ ra vấn đề cụ thể, vị trí, ảnh/trạng thái quan sát được, tác động đến người chơi và đề xuất sửa. Phân biệt lỗi thực với sở thích thẩm mỹ. Không khen chung chung hoặc đề nghị thêm animation chỉ để làm sinh động.
```

## D. Checklist xem nhanh của người giao việc

- Chơi được bằng kéo thật trên điện thoại hoặc emulation được ghi rõ chưa?
- Nếu tắt animation và âm thanh, còn hiểu cách chơi và kết quả không?
- Đặt hai thẻ chưa phù hợp có được giải thích riêng cho từng ô không?
- Sửa một ô có làm điểm tăng đúng 5 và không sửa lịch sử ban đầu không?
- Xem lại có hiện cả lựa chọn đã sửa và lựa chọn còn bỏ ngỏ không?
- Có hoạt động lịch sử hợp lý nào bị bác bỏ chỉ vì nhóm định sẵn một đáp án không?
- Có chi tiết nào trông bấm được nhưng không làm gì, hoặc trông chỉ trang trí mà lại là nút không?
- Màn tổng kết có giúp hiểu vì sao cần ôn, thay vì chỉ thông báo điểm không?
- AI có báo bằng chứng đã kiểm tra, nguồn nội dung và giới hạn còn lại không?
