# Ma trận nội dung và đánh giá v2

Đợt 0 — bản bàn giao cho AI triển khai. Nguồn dữ liệu có cấu trúc: `docs/content-model-v2.json`. Game hiện tại chưa nạp dữ liệu này.

## Phạm vi kiểm chứng

Đã đối chiếu nội dung với ba tài liệu Word do nhóm cung cấp, gồm cả ghi chú. `source-supported` nghĩa là có đoạn nguồn nội bộ hỗ trợ; `editorial-match` nghĩa là việc ghép theo phạm vi nhiệm vụ do thiết kế biên tập. Không phải xác minh độc lập hoặc phê duyệt chuyên môn. Cả 72 cặp còn trạng thái `subjectReviewStatus: pending`.

D1/D2/D3 lần lượt là tài liệu giai đoạn 1930–1935, 1936–1939, 1939–1945. Pxxx là đoạn OOXML theo thứ tự tài liệu, kể cả đoạn trống và ô bảng; không phải trang. Bản trích có anchor Pxxx trong `docs/source-extracts-v2/`. Nguồn nguyên gốc không được sửa.

Tất cả lý do dưới đây được biên soạn lại, không phải trích dẫn nguyên văn. Dòng “chưa phù hợp” giới hạn vào nhiệm vụ ở ô, không phủ nhận giá trị lịch sử của hoạt động đó.

## Quy tắc để triển khai

- Dùng ID để chấm; không dùng thứ tự thẻ. Một thẻ chỉ có ở một ô.
- Chấm lúc bấm Triển khai. Highlight vùng thả không sử dụng kết quả đánh giá.
- Mọi cặp suitable có điểm như nhau, kể cả phương án thay thế.
- Phù hợp ngay: 10; điều chỉnh phù hợp: 5; chưa hoàn thành: 0. Tổng 180; chương 40/40/100.
- Ghi lựa chọn đầu và mọi lần thử; luyện lại không thay run ban đầu.
- Cặp needs-review dùng đúng reasonShort/reasonDetail và suggestedCardIds của chính cặp đó.
- Kết quả kiểm tra cấu trúc không chứng minh độ thú vị hoặc độ chính xác lịch sử độc lập.

## Danh mục nguồn

| ID | Tệp gốc | Bản trích | Định vị |
|---|---|---|---|
| D1 | [GiaiDoan1930Den1935.docx](../docs/GiaiDoan1930Den1935.docx) | [Bản trích](source-extracts-v2/GiaiDoan1930Den1935.md) | Pxxx, SHA256 trong catalog |
| D2 | [GiaiDoan1936Den1939.docx](../docs/GiaiDoan1936Den1939.docx) | [Bản trích](source-extracts-v2/GiaiDoan1936Den1939.md) | Pxxx, SHA256 trong catalog |
| D3 | [GiaiDoan1939Den1945.docx](../docs/GiaiDoan1939Den1945.docx) | [Bản trích](source-extracts-v2/GiaiDoan1939Den1945.md) | Pxxx, SHA256 trong catalog |

## S01 — Những yêu cầu thiết thực

**Chương:** c1. **Giai đoạn:** 1930–1931. **Tối đa:** 20 điểm.

**Bối cảnh hiện trên màn:** Theo tư liệu, ghép một yêu cầu tiêu biểu với mỗi nhóm công nhân và nông dân.

**Mục tiêu học tập:** Nhận biết những yêu cầu đời sống tiêu biểu được tư liệu gắn với công nhân và nông dân, rồi liên hệ sự kết hợp phong trào công–nông.

**Hồ sơ mở thêm:** r01. **Nguồn nền:** D1:P013, D1:P031.

### Hai nhiệm vụ

- **Yêu cầu công nhân** (s01-workers): Đặt một yêu cầu tiêu biểu của công nhân được tư liệu mô tả; một trong hai thẻ phù hợp đều được chấp nhận.
- **Yêu cầu nông dân** (s01-farmers): Đặt một yêu cầu tiêu biểu của nông dân được tư liệu mô tả. Đây không phải khẳng định mỗi yêu cầu chỉ có ý nghĩa với một nhóm trong mọi hoàn cảnh.

### Bốn thẻ

| ID | Tên trên màn | Nội dung mở bằng nút thông tin |
|---|---|---|
| s01-wages | Tăng lương | Yêu cầu cải thiện tiền lương của công nhân trong phong trào được tư liệu nêu. |
| s01-hours | Giảm giờ làm | Yêu cầu rút ngắn thời gian lao động của công nhân được tư liệu nêu. |
| s01-levies | Giảm sưu | Một yêu cầu giảm gánh nặng đời sống được tư liệu gắn với nông dân. |
| s01-taxes | Giảm thuế | Một yêu cầu kinh tế của nông dân trong phần mô tả phong trào; không có nghĩa các nhóm khác không chịu thuế. |

### Ma trận tám cặp

| Mã cặp | Ô nhiệm vụ | Thẻ | Đánh giá | Lý do ngắn | Nguồn |
|---|---|---|---|---|---|
| s01-e1 | Yêu cầu công nhân | Tăng lương | Phù hợp | Tăng lương là yêu cầu tiêu biểu của công nhân được tư liệu nêu. | D1:P013 |
| s01-e2 | Yêu cầu công nhân | Giảm giờ làm | Phù hợp | Giảm giờ làm là yêu cầu tiêu biểu của công nhân được tư liệu nêu. | D1:P013 |
| s01-e3 | Yêu cầu công nhân | Giảm sưu | Chưa phù hợp với ô này | Trong phần tư liệu đang xét, giảm sưu được nêu ở nhóm yêu cầu của nông dân. | D1:P013 |
| s01-e4 | Yêu cầu công nhân | Giảm thuế | Chưa phù hợp với ô này | Tư liệu gắn giảm thuế với yêu cầu nông dân ở tình huống này. | D1:P013 |
| s01-e5 | Yêu cầu nông dân | Tăng lương | Chưa phù hợp với ô này | Tăng lương nằm trong nhóm yêu cầu của công nhân ở đoạn tư liệu này. | D1:P013 |
| s01-e6 | Yêu cầu nông dân | Giảm giờ làm | Chưa phù hợp với ô này | Giảm giờ làm được tư liệu nêu ở nhóm yêu cầu của công nhân. | D1:P013 |
| s01-e7 | Yêu cầu nông dân | Giảm sưu | Phù hợp | Giảm sưu là một yêu cầu tiêu biểu của nông dân được nguồn nêu. | D1:P013 |
| s01-e8 | Yêu cầu nông dân | Giảm thuế | Phù hợp | Giảm thuế là một yêu cầu tiêu biểu của nông dân được nguồn nêu. | D1:P013 |

### Giải thích theo từng lựa chọn

#### s01-e1 — Tăng lương → Yêu cầu công nhân

Tư liệu mô tả công nhân đấu tranh đòi tăng lương, giảm giờ làm. Đặt Tăng lương ở ô này thể hiện đúng một yêu cầu đời sống được nêu; Giảm giờ làm cũng là phương án được chấp nhận.

Nguồn: D1:P013. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s01-e2 — Giảm giờ làm → Yêu cầu công nhân

Bên cạnh tăng lương, tư liệu nêu yêu cầu giảm giờ làm của công nhân. Ô chỉ cần một yêu cầu tiêu biểu, nên lựa chọn này có giá trị tương đương Tăng lương khi tính điểm.

Nguồn: D1:P013. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s01-e3 — Giảm sưu → Yêu cầu công nhân

Giảm sưu là yêu cầu có ý nghĩa đối với đời sống nhân dân, nhưng đoạn tư liệu đang dùng nêu nó trong nhóm yêu cầu của nông dân. Ô này hỏi yêu cầu tiêu biểu của công nhân trong chính mô tả ấy: bạn có thể chọn Tăng lương hoặc Giảm giờ làm.

Nguồn: D1:P013. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Tăng lương; Giảm giờ làm. Loại phân biệt: category-mismatch.

#### s01-e4 — Giảm thuế → Yêu cầu công nhân

Ô đang yêu cầu một ví dụ thuộc nhóm công nhân theo cách trình bày trong tư liệu. Đoạn này gắn giảm thuế với nông dân, còn công nhân được nêu là đòi tăng lương, giảm giờ làm; cách ghép không khẳng định công nhân không chịu thuế hoặc không có quyền đòi giảm thuế.

Nguồn: D1:P013. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Tăng lương; Giảm giờ làm. Loại phân biệt: category-mismatch.

#### s01-e5 — Tăng lương → Yêu cầu nông dân

Tư liệu phân biệt ví dụ yêu cầu của công nhân là tăng lương, giảm giờ làm và của nông dân là giảm sưu, giảm thuế. Ô này hỏi nhóm nông dân theo chính mô tả đó; không dùng kết quả ghép để phủ nhận hoàn cảnh người lao động có thể đồng thời thuộc nhiều nhóm.

Nguồn: D1:P013. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Giảm sưu; Giảm thuế. Loại phân biệt: category-mismatch.

#### s01-e6 — Giảm giờ làm → Yêu cầu nông dân

Giảm giờ làm là một yêu cầu đời sống hợp lý, nhưng đoạn tư liệu dùng cho màn này đặt nó ở nhóm công nhân. Để đáp ứng ô yêu cầu nông dân theo tư liệu, có thể dùng Giảm sưu hoặc Giảm thuế; cả hai đều được chấp nhận.

Nguồn: D1:P013. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Giảm sưu; Giảm thuế. Loại phân biệt: category-mismatch.

#### s01-e7 — Giảm sưu → Yêu cầu nông dân

Tư liệu mô tả nông dân đấu tranh đòi giảm sưu, giảm thuế. Lựa chọn này đáp ứng ô bằng một trong hai ví dụ của nhóm nông dân, không có yêu cầu phải chọn riêng thẻ Giảm thuế.

Nguồn: D1:P013. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s01-e8 — Giảm thuế → Yêu cầu nông dân

Tư liệu gắn yêu cầu giảm thuế với phong trào nông dân. Bạn đã chọn một ví dụ đáp ứng nhiệm vụ; Giảm sưu cũng được chấp nhận với điểm như nhau.

Nguồn: D1:P013. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

### Các cách hoàn thành được chấp nhận

- Yêu cầu công nhân: **Tăng lương** + Yêu cầu nông dân: **Giảm sưu**
- Yêu cầu công nhân: **Tăng lương** + Yêu cầu nông dân: **Giảm thuế**
- Yêu cầu công nhân: **Giảm giờ làm** + Yêu cầu nông dân: **Giảm sưu**
- Yêu cầu công nhân: **Giảm giờ làm** + Yêu cầu nông dân: **Giảm thuế**

Mọi lựa chọn phù hợp đã được kiểm tra không gây bế tắc sau khi khóa ô.

## S02 — Giữ mạch nối

**Chương:** c1. **Giai đoạn:** 1932–1935. **Tối đa:** 20 điểm.

**Bối cảnh hiện trên màn:** Sau đàn áp, cần khôi phục tổ chức và duy trì việc học tập trong tù.

**Mục tiêu học tập:** Phân biệt khôi phục tổ chức bí mật và duy trì học tập trong tù; nhìn nhận các hoạt động tập hợp, tuyên truyền khác vẫn có giá trị.

**Hồ sơ mở thêm:** r02. **Nguồn nền:** D1:P077, D1:P078, D1:P082, D1:P085, D1:P088.

### Hai nhiệm vụ

- **Khôi phục cơ sở bí mật** (s02-network): Bố trí hoạt động trực tiếp củng cố lại cơ sở tổ chức bí mật bị gián đoạn; không hỏi mọi việc có thể hỗ trợ phong trào.
- **Học tập trong tù** (s02-learning): Bố trí hoạt động học tập và truyền đạt kiến thức của những chiến sĩ trong nhà tù. Cảnh là minh họa, không tái dựng một nhà tù có thật.

### Bốn thẻ

| ID | Tên trên màn | Nội dung mở bằng nút thông tin |
|---|---|---|
| s02-secret-network | Củng cố cơ sở bí mật | Khôi phục các cơ sở và đầu mối tổ chức theo nhiệm vụ xây dựng tổ chức bí mật. Tuyến nối trong cảnh là ký hiệu minh họa, không phải tuyến đường lịch sử đã xác minh. |
| s02-study | Học và dịch sách | Tổ chức học lý luận, dịch sách báo, trao đổi kiến thức trong tù như tư liệu mô tả. |
| s02-mobilize | Tập hợp quần chúng | Một nhiệm vụ quan trọng để khôi phục và phát triển phong trào, được tư liệu nêu cùng công tác tổ chức. |
| s02-antiwar | Tuyên truyền chống chiến tranh | Một nhiệm vụ được nêu ở Đại hội I, có giá trị riêng nhưng không thay mọi công việc khôi phục và học tập. |

### Ma trận tám cặp

| Mã cặp | Ô nhiệm vụ | Thẻ | Đánh giá | Lý do ngắn | Nguồn |
|---|---|---|---|---|---|
| s02-e1 | Khôi phục cơ sở bí mật | Củng cố cơ sở bí mật | Phù hợp | Củng cố cơ sở bí mật trực tiếp đáp ứng nhiệm vụ khôi phục tổ chức. | D1:P082, D1:P085 |
| s02-e2 | Khôi phục cơ sở bí mật | Học và dịch sách | Chưa phù hợp với ô này | Học và dịch sách phục vụ bồi dưỡng; ô này cần trực tiếp khôi phục cơ sở tổ chức. | D1:P078, D1:P082 |
| s02-e3 | Khôi phục cơ sở bí mật | Tập hợp quần chúng | Chưa phù hợp với ô này | Tập hợp quần chúng không thay trực tiếp công việc củng cố cơ sở bí mật đang được hỏi. | D1:P082, D1:P088 |
| s02-e4 | Khôi phục cơ sở bí mật | Tuyên truyền chống chiến tranh | Chưa phù hợp với ô này | Tuyên truyền chống chiến tranh là nhiệm vụ khác, chưa trực tiếp khôi phục cơ sở bí mật. | D1:P082, D1:P088 |
| s02-e5 | Học tập trong tù | Củng cố cơ sở bí mật | Chưa phù hợp với ô này | Củng cố tổ chức không thay nội dung học tập và dịch sách trong tù. | D1:P077, D1:P078 |
| s02-e6 | Học tập trong tù | Học và dịch sách | Phù hợp | Tư liệu nêu học lý luận và dịch sách báo trong nhà tù. | D1:P078 |
| s02-e7 | Học tập trong tù | Tập hợp quần chúng | Chưa phù hợp với ô này | Tập hợp lực lượng không trực tiếp đáp ứng nhiệm vụ học và trao đổi kiến thức trong tù. | D1:P078, D1:P088 |
| s02-e8 | Học tập trong tù | Tuyên truyền chống chiến tranh | Chưa phù hợp với ô này | Chủ đề tuyên truyền chống chiến tranh không tự thay hoạt động học và dịch sách trong tù. | D1:P078, D1:P088 |

### Giải thích theo từng lựa chọn

#### s02-e1 — Củng cố cơ sở bí mật → Khôi phục cơ sở bí mật

Chương trình hành động trong tư liệu nhấn mạnh khôi phục tổ chức và xây dựng một tổ chức bí mật có kỷ luật. Lựa chọn này đáp ứng trực tiếp công việc của ô; những tuyến được nối trong cảnh chỉ là cách minh họa quan hệ tổ chức.

Nguồn: D1:P082, D1:P085. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s02-e2 — Học và dịch sách → Khôi phục cơ sở bí mật

Học tập trong tù giúp giữ vững nhận thức và bồi dưỡng con người, nên có đóng góp cho phong trào. Tuy vậy, ô này yêu cầu một hoạt động trực tiếp củng cố cơ sở tổ chức, không phải toàn bộ sự chuẩn bị lâu dài; Củng cố cơ sở bí mật đáp ứng rõ hơn.

Nguồn: D1:P078, D1:P082. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Củng cố cơ sở bí mật. Loại phân biệt: task-mismatch.

#### s02-e3 — Tập hợp quần chúng → Khôi phục cơ sở bí mật

Tư liệu nêu tập hợp quần chúng là nhiệm vụ quan trọng cùng với củng cố, phát triển tổ chức. Hai công việc hỗ trợ nhau, nhưng ô này giới hạn ở khôi phục cơ sở tổ chức bí mật; đánh giá chưa phù hợp với ô không phủ nhận ý nghĩa của vận động quần chúng.

Nguồn: D1:P082, D1:P088. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Củng cố cơ sở bí mật. Loại phân biệt: task-mismatch.

#### s02-e4 — Tuyên truyền chống chiến tranh → Khôi phục cơ sở bí mật

Đại hội I trong tư liệu có nêu tuyên truyền chống chiến tranh, bên cạnh củng cố tổ chức và tập hợp quần chúng. Thẻ có ý nghĩa trong giai đoạn, nhưng không thực hiện trực tiếp phần việc phục hồi cơ sở mà ô đang yêu cầu; hãy dùng Củng cố cơ sở bí mật.

Nguồn: D1:P082, D1:P088. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Củng cố cơ sở bí mật. Loại phân biệt: task-mismatch.

#### s02-e5 — Củng cố cơ sở bí mật → Học tập trong tù

Trong tù có cả tổ chức chi bộ bí mật và hoạt động học tập; hai việc liên quan nhưng không đồng nhất. Ô này hỏi công việc học và truyền đạt kiến thức, nên Học và dịch sách là phương án trực tiếp, thay vì gán mọi sinh hoạt bí mật thành hoạt động học.

Nguồn: D1:P077, D1:P078. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Học và dịch sách. Loại phân biệt: task-mismatch.

#### s02-e6 — Học và dịch sách → Học tập trong tù

Tư liệu mô tả việc biến nhà tù thành trường học cách mạng qua học lý luận, dịch sách báo và xuất bản báo bí mật. Thẻ Học và dịch sách đáp ứng đúng hoạt động kiến thức mà ô này yêu cầu.

Nguồn: D1:P078. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s02-e7 — Tập hợp quần chúng → Học tập trong tù

Tập hợp quần chúng góp phần phục hồi phong trào, nhưng ô đang hỏi một công việc cụ thể trong nhà tù: duy trì học tập và truyền đạt kiến thức. Học và dịch sách phù hợp trực tiếp hơn; không cần phủ nhận nhiệm vụ tập hợp quần chúng để phân biệt hai việc.

Nguồn: D1:P078, D1:P088. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Học và dịch sách. Loại phân biệt: task-mismatch.

#### s02-e8 — Tuyên truyền chống chiến tranh → Học tập trong tù

Tuyên truyền chống chiến tranh là một nhiệm vụ được tư liệu nêu, nhưng tên nhiệm vụ ấy không cho biết hoạt động học tập trong tù đã được tổ chức. Ô này yêu cầu hình thức học và trao đổi kiến thức; chọn Học và dịch sách để thực hiện đúng phần việc đang xét.

Nguồn: D1:P078, D1:P088. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Học và dịch sách. Loại phân biệt: task-mismatch.

### Các cách hoàn thành được chấp nhận

- Khôi phục cơ sở bí mật: **Củng cố cơ sở bí mật** + Học tập trong tù: **Học và dịch sách**

Mọi lựa chọn phù hợp đã được kiểm tra không gây bế tắc sau khi khóa ô.

## S03 — Một cánh cửa mở

**Chương:** c2. **Giai đoạn:** 1936. **Tối đa:** 20 điểm.

**Bối cảnh hiện trên màn:** Phong trào tranh thủ điều kiện công khai, đồng thời giữ cơ sở bí mật.

**Mục tiêu học tập:** Phân biệt tiếp nhận nguyện vọng với phát hành thông tin; hiểu công khai và bí mật được kết hợp.

**Hồ sơ mở thêm:** r03. **Nguồn nền:** D2:P020, D2:P033, D2:P034, D2:P035, D2:P038, D2:P057.

### Hai nhiệm vụ

- **Gom nguyện vọng** (s03-gather-wishes): Tiếp nhận và tập hợp dân nguyện trong cuộc vận động Đông Dương Đại hội. Ở đây, dân nguyện là nguyện vọng của người dân.
- **Xuất bản báo công khai** (s03-publish-news): Đưa nội dung tuyên truyền đến công chúng bằng một hình thức xuất bản công khai.

### Bốn thẻ

| ID | Tên trên màn | Nội dung mở bằng nút thông tin |
|---|---|---|
| s03-petitions | Thu thập dân nguyện | Ghi nhận và tập hợp nguyện vọng của người dân trong cuộc vận động Đông Dương Đại hội. |
| s03-public-press | Báo chí công khai | Xuất bản báo bằng tiếng Việt hoặc tiếng Pháp để truyền đạt nội dung đến công chúng. |
| s03-action-committees | Lập ủy ban hành động | Trong màn này, lập đầu mối tại cơ sở để tiếp nhận, tập hợp dân nguyện; không đại diện mọi việc một ủy ban có thể làm. |
| s03-secret-base | Giữ cơ sở bí mật | Duy trì bộ phận hoạt động bí mật, kết hợp với hoạt động công khai; thẻ không bao gồm xuất bản hoặc nhận dân nguyện. |

### Ma trận tám cặp

| Mã cặp | Ô nhiệm vụ | Thẻ | Đánh giá | Lý do ngắn | Nguồn |
|---|---|---|---|---|---|
| s03-e1 | Gom nguyện vọng | Thu thập dân nguyện | Phù hợp | Thu thập dân nguyện trực tiếp tập hợp nguyện vọng của người dân. | D2:P033, D2:P034 |
| s03-e2 | Gom nguyện vọng | Báo chí công khai | Chưa phù hợp với ô này | Thẻ đang phát hành thông tin; ô này cần tiếp nhận nguyện vọng. | D2:P034, D2:P038 |
| s03-e3 | Gom nguyện vọng | Lập ủy ban hành động | Phù hợp | Đầu mối tại cơ sở giúp tiếp nhận và gom dân nguyện. | D2:P033, D2:P034, D2:P035 |
| s03-e4 | Gom nguyện vọng | Giữ cơ sở bí mật | Chưa phù hợp với ô này | Cơ sở bí mật hỗ trợ phong trào; cần thêm hoạt động tiếp nhận dân nguyện. | D2:P020, D2:P034, D2:P035, D2:P057 |
| s03-e5 | Xuất bản báo công khai | Thu thập dân nguyện | Chưa phù hợp với ô này | Ghi nhận nguyện vọng chưa thực hiện việc xuất bản tin ra công chúng. | D2:P034, D2:P038 |
| s03-e6 | Xuất bản báo công khai | Báo chí công khai | Phù hợp | Báo công khai đưa nội dung tuyên truyền đến công chúng. | D2:P020, D2:P038, D2:P057 |
| s03-e7 | Xuất bản báo công khai | Lập ủy ban hành động | Chưa phù hợp với ô này | Thẻ lập nơi nhận dân nguyện, chưa tổ chức phát hành báo công khai. | D2:P034, D2:P035, D2:P038 |
| s03-e8 | Xuất bản báo công khai | Giữ cơ sở bí mật | Chưa phù hợp với ô này | Giữ cơ sở bí mật chưa tạo ra hình thức phát hành tin công khai. | D2:P020, D2:P038, D2:P057 |

### Giải thích theo từng lựa chọn

#### s03-e1 — Thu thập dân nguyện → Gom nguyện vọng

Trong cuộc vận động Đông Dương Đại hội, việc thu thập dân nguyện giúp tập hợp điều người dân muốn đề đạt. Thẻ đáp ứng nhiệm vụ tiếp nhận nguyện vọng ở ô này; chưa có nghĩa mọi nguyện vọng đã được giải quyết.

Nguồn: D2:P033, D2:P034. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s03-e2 — Báo chí công khai → Gom nguyện vọng

Báo chí công khai giúp đưa nội dung đến công chúng, còn nhiệm vụ ở đây là nhận và tập hợp dân nguyện. Thẻ trong màn chỉ mô tả việc xuất bản, nên chưa thực hiện công việc tiếp nhận đang thiếu; báo chí vẫn có ý nghĩa vận động và phản ánh đời sống.

Nguồn: D2:P034, D2:P038. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Thu thập dân nguyện; Lập ủy ban hành động. Loại phân biệt: task-mismatch.

#### s03-e3 — Lập ủy ban hành động → Gom nguyện vọng

Tài liệu đặt việc lập các ủy ban hành động tại nhà máy, đồn điền, thôn xóm trong cuộc vận động thu thập dân nguyện. Với thẻ được định nghĩa là đầu mối tiếp nhận trong màn này, đây là một cách phù hợp để gom nguyện vọng; không suy ra mọi ủy ban chỉ làm một công việc này.

Nguồn: D2:P033, D2:P034, D2:P035. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s03-e4 — Giữ cơ sở bí mật → Gom nguyện vọng

Duy trì cơ sở bí mật là một phần của cách kết hợp hình thức hoạt động trong giai đoạn này. Tuy nhiên, thẻ chưa bao gồm việc tiếp nhận nguyện vọng đang được ô yêu cầu; có thể chọn thu thập dân nguyện hoặc lập đầu mối nhận dân nguyện để làm rõ công việc đó.

Nguồn: D2:P020, D2:P034, D2:P035, D2:P057. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Thu thập dân nguyện; Lập ủy ban hành động. Loại phân biệt: task-mismatch.

#### s03-e5 — Thu thập dân nguyện → Xuất bản báo công khai

Thu thập dân nguyện có vai trò tiếp nhận điều người dân muốn đề đạt trong cuộc vận động. Ô này cần một hình thức xuất bản công khai, còn thẻ mới dừng ở khâu tập hợp nguyện vọng; báo chí công khai đáp ứng phần phát hành thông tin.

Nguồn: D2:P034, D2:P038. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Báo chí công khai. Loại phân biệt: task-mismatch.

#### s03-e6 — Báo chí công khai → Xuất bản báo công khai

Tài liệu ghi nhận việc xuất bản báo công khai bằng tiếng Việt và tiếng Pháp trong phong trào. Hình thức này đáp ứng trực tiếp nhiệm vụ phát hành thông tin ra công chúng; điều đó không có nghĩa mọi hoạt động bí mật đều chấm dứt.

Nguồn: D2:P020, D2:P038, D2:P057. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s03-e7 — Lập ủy ban hành động → Xuất bản báo công khai

Các ủy ban hành động là một hình thức tổ chức của cuộc vận động, và thẻ này chỉ mô tả đầu mối tiếp nhận dân nguyện. Việc đó chưa thực hiện yêu cầu xuất bản tin công khai ở ô này; không phải kết luận rằng các ủy ban không thể tuyên truyền hoặc phổ biến thông tin trong thực tế.

Nguồn: D2:P034, D2:P035, D2:P038. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Báo chí công khai. Loại phân biệt: task-mismatch.

#### s03-e8 — Giữ cơ sở bí mật → Xuất bản báo công khai

Cơ sở bí mật vẫn được duy trì và kết hợp với hoạt động công khai trong giai đoạn này. Ô đang cần xuất bản thông tin tới công chúng, trong khi thẻ chỉ duy trì bộ phận bí mật; báo chí công khai là công việc trực tiếp còn thiếu, không phải sự thay thế toàn bộ cơ sở bí mật.

Nguồn: D2:P020, D2:P038, D2:P057. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Báo chí công khai. Loại phân biệt: task-mismatch.

### Các cách hoàn thành được chấp nhận

- Gom nguyện vọng: **Thu thập dân nguyện** + Xuất bản báo công khai: **Báo chí công khai**
- Gom nguyện vọng: **Lập ủy ban hành động** + Xuất bản báo công khai: **Báo chí công khai**

Mọi lựa chọn phù hợp đã được kiểm tra không gây bế tắc sau khi khóa ô.

## S04 — Mở rộng sự tham gia

**Chương:** c2. **Giai đoạn:** 1936–1939. **Tối đa:** 20 điểm.

**Bối cảnh hiện trên màn:** Phong trào mở rộng bằng hội đoàn, giáo dục và nhiều hình thức vận động.

**Mục tiêu học tập:** Nhận biết nhiều hình thức vận động cùng có ý nghĩa, nhưng mỗi hoạt động đáp ứng một công việc trực tiếp khác nhau.

**Hồ sơ mở thêm:** r04. **Nguồn nền:** D2:P023, D2:P044, D2:P045, D2:P046, D2:P047, D2:P051, D2:P056.

### Hai nhiệm vụ

- **Lập hội tương trợ** (s04-mutual-support): Tạo hội đoàn để người dân sinh hoạt và giúp đỡ nhau. Nhiệm vụ hỏi hình thức tương trợ, không hỏi mọi cách tập hợp quần chúng.
- **Mở lớp học chữ** (s04-literacy): Chọn hoạt động trực tiếp giúp người dân học đọc, học viết chữ quốc ngữ.

### Bốn thẻ

| ID | Tên trên màn | Nội dung mở bằng nút thông tin |
|---|---|---|
| s04-friendship-societies | Lập hội ái hữu | Trong màn này, tổ chức sinh hoạt và tương trợ qua hội ái hữu để tạo sự gắn bó giữa người tham gia. |
| s04-mutual-aid-societies | Lập hội tương tế | Trong màn này, tập hợp người tham gia vào hội để giúp đỡ nhau và cùng duy trì sinh hoạt. |
| s04-literacy-work | Truyền bá quốc ngữ | Tổ chức hoạt động dạy và học chữ quốc ngữ. Thẻ không yêu cầu nhớ ngày thành lập Hội truyền bá quốc ngữ. |
| s04-representative-elections | Tranh cử dân biểu | Tham gia tranh cử vào cơ quan dân biểu để mở rộng tuyên truyền; thẻ không bao gồm mở lớp học hoặc lập hội tương trợ. |

### Ma trận tám cặp

| Mã cặp | Ô nhiệm vụ | Thẻ | Đánh giá | Lý do ngắn | Nguồn |
|---|---|---|---|---|---|
| s04-e1 | Lập hội tương trợ | Lập hội ái hữu | Phù hợp | Sinh hoạt hội ái hữu đáp ứng cách gắn kết bằng tương trợ đang được yêu cầu. | D2:P047, D2:P051, D2:P056 |
| s04-e2 | Lập hội tương trợ | Lập hội tương tế | Phù hợp | Hội tương tế tạo hình thức giúp đỡ nhau để gắn kết người tham gia. | D2:P047, D2:P051, D2:P056 |
| s04-e3 | Lập hội tương trợ | Truyền bá quốc ngữ | Chưa phù hợp với ô này | Dạy chữ có giá trị tập hợp; ô này cần hình thức hội tương trợ. | D2:P044, D2:P045, D2:P047, D2:P051 |
| s04-e4 | Lập hội tương trợ | Tranh cử dân biểu | Chưa phù hợp với ô này | Tranh cử mở diễn đàn tuyên truyền, chưa lập hội sinh hoạt tương trợ. | D2:P044, D2:P046, D2:P047 |
| s04-e5 | Mở lớp học chữ | Lập hội ái hữu | Chưa phù hợp với ô này | Thẻ tổ chức hội ái hữu, chưa bố trí hoạt động dạy và học chữ. | D2:P045, D2:P047 |
| s04-e6 | Mở lớp học chữ | Lập hội tương tế | Chưa phù hợp với ô này | Tương trợ có thể hỗ trợ người học, nhưng thẻ chưa tổ chức dạy chữ. | D2:P045, D2:P047 |
| s04-e7 | Mở lớp học chữ | Truyền bá quốc ngữ | Phù hợp | Truyền bá quốc ngữ đáp ứng trực tiếp hoạt động dạy và học chữ. | D2:P044, D2:P045 |
| s04-e8 | Mở lớp học chữ | Tranh cử dân biểu | Chưa phù hợp với ô này | Diễn đàn dân biểu phục vụ tuyên truyền, chưa thực hiện việc dạy đọc, viết. | D2:P044, D2:P045, D2:P046 |

### Giải thích theo từng lựa chọn

#### s04-e1 — Lập hội ái hữu → Lập hội tương trợ

Hội ái hữu được tài liệu nêu trong các hình thức tổ chức quần chúng của phong trào. Với sinh hoạt và tương trợ được mô tả trên thẻ, hình thức này đáp ứng nhiệm vụ gắn bó người tham gia; đây là một cách phù hợp, không phải cách tập hợp duy nhất.

Nguồn: D2:P047, D2:P051, D2:P056. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s04-e2 — Lập hội tương tế → Lập hội tương trợ

Tài liệu ghi nhận việc thành lập các hội tương tế trong phong trào. Hoạt động giúp đỡ nhau được đặt trong thẻ đáp ứng đúng cách gắn kết mà ô yêu cầu; việc chấp nhận thẻ này không loại vai trò của hội ái hữu hoặc hình thức vận động khác.

Nguồn: D2:P047, D2:P051, D2:P056. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s04-e3 — Truyền bá quốc ngữ → Lập hội tương trợ

Hoạt động truyền bá quốc ngữ thuộc mặt trận văn hóa, giáo dục và có thể góp phần gắn bó người tham gia. Tuy vậy, ô này hỏi việc lập hội lấy tương trợ làm cách sinh hoạt, còn thẻ mô tả dạy chữ; hội ái hữu hoặc hội tương tế đáp ứng phạm vi ấy trực tiếp hơn.

Nguồn: D2:P044, D2:P045, D2:P047, D2:P051. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Lập hội ái hữu; Lập hội tương tế. Loại phân biệt: task-mismatch.

#### s04-e4 — Tranh cử dân biểu → Lập hội tương trợ

Tham gia tranh cử dân biểu được tài liệu nêu là cách mở rộng tuyên truyền đường lối. Đây là hình thức hoạt động nghị trường, còn ô yêu cầu hội đoàn giúp đỡ nhau; thẻ chưa thực hiện công việc ấy, dù tranh cử vẫn có ý nghĩa vận động quần chúng.

Nguồn: D2:P044, D2:P046, D2:P047. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Lập hội ái hữu; Lập hội tương tế. Loại phân biệt: task-mismatch.

#### s04-e5 — Lập hội ái hữu → Mở lớp học chữ

Hội ái hữu là một hình thức tập hợp và sinh hoạt quần chúng trong tài liệu. Thẻ này chưa mô tả dạy đọc, viết nên chưa đáp ứng nhiệm vụ mở lớp; điều đó không phủ nhận một hội có thể hỗ trợ việc học nếu có thêm hoạt động giáo dục cụ thể.

Nguồn: D2:P045, D2:P047. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Truyền bá quốc ngữ. Loại phân biệt: task-mismatch.

#### s04-e6 — Lập hội tương tế → Mở lớp học chữ

Lập hội tương tế tạo hình thức giúp đỡ nhau theo tình huống của thẻ. Mục tiêu ở đây là hoạt động trực tiếp dạy đọc, viết, nên cần thẻ truyền bá quốc ngữ; không suy ra rằng hội tương tế không thể hỗ trợ lớp học trong thực tế.

Nguồn: D2:P045, D2:P047. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Truyền bá quốc ngữ. Loại phân biệt: task-mismatch.

#### s04-e7 — Truyền bá quốc ngữ → Mở lớp học chữ

Tài liệu đặt hoạt động truyền bá quốc ngữ trong lĩnh vực văn hóa, giáo dục của phong trào. Với nội dung dạy và học chữ được mô tả trên thẻ, đây là hoạt động đáp ứng ô mở lớp; màn này không yêu cầu xác định ngày thành lập hoặc quy mô của Hội.

Nguồn: D2:P044, D2:P045. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s04-e8 — Tranh cử dân biểu → Mở lớp học chữ

Tranh cử vào cơ quan dân biểu là một hình thức mở rộng tuyên truyền được ghi trong tài liệu. Ô này cần tổ chức dạy chữ, còn thẻ chưa bố trí hoạt động học tập đó; việc chưa đáp ứng ô không hạ thấp vai trò của đấu tranh nghị trường.

Nguồn: D2:P044, D2:P045, D2:P046. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Truyền bá quốc ngữ. Loại phân biệt: task-mismatch.

### Các cách hoàn thành được chấp nhận

- Lập hội tương trợ: **Lập hội ái hữu** + Mở lớp học chữ: **Truyền bá quốc ngữ**
- Lập hội tương trợ: **Lập hội tương tế** + Mở lớp học chữ: **Truyền bá quốc ngữ**

Mọi lựa chọn phù hợp đã được kiểm tra không gây bế tắc sau khi khóa ô.

## S05 — Nhiệm vụ cấp thiết

**Chương:** c3. **Giai đoạn:** 1939–1941. **Tối đa:** 20 điểm.

**Bối cảnh hiện trên màn:** Điều kiện công khai bị thu hẹp; cần tập hợp lực lượng và thay đổi phương thức hoạt động.

**Mục tiêu học tập:** Nhận ra việc tập hợp lực lượng trong mặt trận và đổi phương thức hoạt động trong quá trình chuyển hướng 1939–1941.

**Hồ sơ mở thêm:** r05. **Nguồn nền:** D3:P003, D3:P005, D3:P009, D3:P010, D3:P029, D3:P035, D3:P038.

### Hai nhiệm vụ

- **Tập hợp thành mặt trận** (s05-front): Chọn hình thức tổ chức liên kết rộng rãi các lực lượng yêu nước trong mặt trận. Ô này hỏi việc xây dựng tổ chức liên kết, không bao quát mọi chính sách vận động.
- **Chọn công khai hay bí mật** (s05-adapt): Chọn hình thức công khai/bí mật cho hoạt động của mạng lưới trước đàn áp và sự thu hẹp điều kiện công khai. Ô không hỏi mọi thay đổi về cách đấu tranh.

### Bốn thẻ

| ID | Tên trên màn | Nội dung mở bằng nút thông tin |
|---|---|---|
| s05-coalition | Lập mặt trận đoàn kết | Liên kết các lực lượng yêu nước trong mặt trận. Quá trình có Mặt trận Thống nhất Dân tộc Phản đế Đông Dương được chủ trương năm 1939 và Việt Minh ra đời năm 1941; đây không phải hai tên gọi của cùng một mặt trận. |
| s05-secret | Chuyển sang bí mật | Chuyển phương thức hoạt động trước đàn áp và việc thu hẹp các điều kiện công khai, hợp pháp. Không hiểu là mọi nơi, mọi hoạt động đều thay đổi đồng loạt trong một thời điểm. |
| s05-rent | Giảm tô, giảm tức | Một chủ trương đáp ứng quyền lợi dân cày trong quá trình tập trung vào giải phóng dân tộc; tiếp tục được nêu ở Hội nghị tháng 5/1941. |
| s05-guerrilla | Xây dựng du kích | Duy trì, phát triển lực lượng du kích và căn cứ theo chủ trương tháng 11/1940; góp phần chuẩn bị lực lượng vũ trang. |

### Ma trận tám cặp

| Mã cặp | Ô nhiệm vụ | Thẻ | Đánh giá | Lý do ngắn | Nguồn |
|---|---|---|---|---|---|
| s05-e1 | Tập hợp thành mặt trận | Lập mặt trận đoàn kết | Phù hợp | Mặt trận liên kết rộng rãi các lực lượng yêu nước. | D3:P009, D3:P029, D3:P035, D3:P038 |
| s05-e2 | Tập hợp thành mặt trận | Chuyển sang bí mật | Chưa phù hợp với ô này | Bí mật là phương thức, chưa phải hình thức mặt trận. | D3:P009, D3:P010, D3:P035 |
| s05-e3 | Tập hợp thành mặt trận | Giảm tô, giảm tức | Chưa phù hợp với ô này | Chính sách dân cày chưa thay việc lập mặt trận. | D3:P009, D3:P032, D3:P033, D3:P035 |
| s05-e4 | Tập hợp thành mặt trận | Xây dựng du kích | Chưa phù hợp với ô này | Du kích là một lực lượng, chưa phải mặt trận rộng. | D3:P009, D3:P014, D3:P035 |
| s05-e5 | Chọn công khai hay bí mật | Lập mặt trận đoàn kết | Chưa phù hợp với ô này | Mặt trận tập hợp lực lượng; ô này hỏi phương thức. | D3:P003, D3:P009, D3:P010, D3:P035 |
| s05-e6 | Chọn công khai hay bí mật | Chuyển sang bí mật | Phù hợp | Phương thức được điều chỉnh trước điều kiện đàn áp. | D3:P003, D3:P010 |
| s05-e7 | Chọn công khai hay bí mật | Giảm tô, giảm tức | Chưa phù hợp với ô này | Giảm tô là chính sách, chưa phải đổi phương thức. | D3:P003, D3:P010, D3:P033 |
| s05-e8 | Chọn công khai hay bí mật | Xây dựng du kích | Chưa phù hợp với ô này | Xây du kích chưa chọn hình thức công khai/bí mật cho mạng lưới. | D3:P003, D3:P010, D3:P014 |

### Giải thích theo từng lựa chọn

#### s05-e1 — Lập mặt trận đoàn kết → Tập hợp thành mặt trận

Nhiệm vụ của ô là tổ chức lực lượng yêu nước trong một mặt trận chung. Tài liệu nêu chủ trương mặt trận phản đế năm 1939 và việc thành lập Việt Minh năm 1941 trong quá trình chuyển hướng. Các bước này diễn ra theo thời gian, không phải một quyết định tức thời.

Nguồn: D3:P009, D3:P029, D3:P035, D3:P038. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s05-e2 — Chuyển sang bí mật → Tập hợp thành mặt trận

Chuyển sang bí mật giúp thích ứng với đàn áp và có ý nghĩa đối với hoạt động của tổ chức. Tuy nhiên, ô này hỏi hình thức liên kết rộng rãi các lực lượng yêu nước trong mặt trận, nên 'Lập mặt trận đoàn kết' đáp ứng trực tiếp hơn.

Nguồn: D3:P009, D3:P010, D3:P035. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Lập mặt trận đoàn kết. Loại phân biệt: task-mismatch.

#### s05-e3 — Giảm tô, giảm tức → Tập hợp thành mặt trận

Giảm tô, giảm tức đáp ứng quyền lợi dân cày và không mất ý nghĩa khi giải phóng dân tộc được đặt lên hàng đầu. Nhưng ô này yêu cầu hình thức tổ chức liên kết các lực lượng trong mặt trận, còn thẻ đang nêu một chính sách xã hội. 'Lập mặt trận đoàn kết' trực tiếp thực hiện nhiệm vụ tổ chức ấy.

Nguồn: D3:P009, D3:P032, D3:P033, D3:P035. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Lập mặt trận đoàn kết. Loại phân biệt: task-mismatch.

#### s05-e4 — Xây dựng du kích → Tập hợp thành mặt trận

Duy trì và phát triển du kích là một bước chuẩn bị lực lượng vũ trang có ý nghĩa. Phạm vi thẻ chưa bao quát việc liên kết rộng rãi các giai cấp, tầng lớp yêu nước trong mặt trận mà ô này yêu cầu. Hãy cân nhắc 'Lập mặt trận đoàn kết' cho nhiệm vụ đó.

Nguồn: D3:P009, D3:P014, D3:P035. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Lập mặt trận đoàn kết. Loại phân biệt: scope.

#### s05-e5 — Lập mặt trận đoàn kết → Chọn công khai hay bí mật

Mặt trận góp phần tập hợp lực lượng cho nhiệm vụ giải phóng dân tộc. Ô này đang yêu cầu điều chỉnh cách hoạt động trước đàn áp tăng và điều kiện công khai bị thu hẹp, nên việc lập mặt trận chưa trực tiếp trả lời yêu cầu ấy. 'Chuyển sang bí mật' thể hiện sự thích ứng về phương thức.

Nguồn: D3:P003, D3:P009, D3:P010, D3:P035. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Chuyển sang bí mật. Loại phân biệt: task-mismatch.

#### s05-e6 — Chuyển sang bí mật → Chọn công khai hay bí mật

Chiến tranh và đàn áp làm điều kiện công khai, hợp pháp của phong trào trước đó bị thu hẹp. Tài liệu nêu việc chuyển sang hoạt động bí mật, bất hợp pháp như một điều chỉnh phương thức. Đây là quá trình thích ứng theo hoàn cảnh, không phải kết luận rằng mọi hoạt động công khai đều luôn không có giá trị.

Nguồn: D3:P003, D3:P010. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s05-e7 — Giảm tô, giảm tức → Chọn công khai hay bí mật

Giảm tô, giảm tức là một nội dung chủ trương liên quan quyền lợi dân cày. Ô này hỏi cách tổ chức hoạt động khi điều kiện công khai thay đổi, nên chính sách đó chưa thay cho việc điều chỉnh phương thức. 'Chuyển sang bí mật' đáp ứng đúng loại yêu cầu đang xét.

Nguồn: D3:P003, D3:P010, D3:P033. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Chuyển sang bí mật. Loại phân biệt: category-mismatch.

#### s05-e8 — Xây dựng du kích → Chọn công khai hay bí mật

Lực lượng du kích được duy trì và phát triển trong quá trình chuẩn bị đấu tranh, đồng thời có ý nghĩa với cách đấu tranh mới. Tuy nhiên, ô này hỏi riêng hình thức công khai/bí mật cho hoạt động của mạng lưới trong hoàn cảnh bị thu hẹp điều kiện công khai. 'Chuyển sang bí mật' trả lời trực tiếp lựa chọn đang được yêu cầu, không phủ nhận vai trò của du kích.

Nguồn: D3:P003, D3:P010, D3:P014. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Chuyển sang bí mật. Loại phân biệt: scope.

### Các cách hoàn thành được chấp nhận

- Tập hợp thành mặt trận: **Lập mặt trận đoàn kết** + Chọn công khai hay bí mật: **Chuyển sang bí mật**

Mọi lựa chọn phù hợp đã được kiểm tra không gây bế tắc sau khi khóa ô.

## S06 — Chuẩn bị bền bỉ

**Chương:** c3. **Giai đoạn:** 1941–đầu 1945. **Tối đa:** 20 điểm.

**Bối cảnh hiện trên màn:** Lực lượng và căn cứ được chuẩn bị trên nhiều phương diện.

**Mục tiêu học tập:** Phân biệt những hoạt động trực tiếp phát triển lực lượng chính trị với xây dựng địa bàn căn cứ, đồng thời nhận biết vai trò bổ trợ của lực lượng vũ trang.

**Hồ sơ mở thêm:** r06. **Nguồn nền:** D3:P040, D3:P041, D3:P042, D3:P043, D3:P044, D3:P045, D3:P047.

### Hai nhiệm vụ

- **Mở rộng lực lượng chính trị** (s06-political): Chọn hoạt động trực tiếp vận động, tập hợp quần chúng vào phong trào cứu nước, qua tổ chức hoặc tuyên truyền.
- **Mở địa bàn, nối liên lạc** (s06-base): Mở rộng các địa bàn từ căn cứ và xây dựng tuyến liên lạc kết nối cơ sở; không hỏi chung mọi việc giúp bảo vệ căn cứ.

### Bốn thẻ

| ID | Tên trên màn | Nội dung mở bằng nút thông tin |
|---|---|---|
| s06-associations | Phát triển hội cứu quốc | Vận động nhiều tầng lớp tham gia Việt Minh thông qua các hội cứu quốc. |
| s06-bases | Mở địa bàn và liên lạc | Từ những địa bàn căn cứ, phát triển cơ sở ra vùng lân cận và xây dựng tuyến liên lạc kết nối các lực lượng. |
| s06-defense | Tổ chức tự vệ, du kích | Xây dựng bộ phận lực lượng vũ trang bảo vệ cơ sở, hỗ trợ phong trào và đấu tranh khi có điều kiện. Thẻ tập trung vào nhiệm vụ tổ chức bộ phận này. |
| s06-press | Báo chí vận động | Dùng báo chí cách mạng tuyên truyền mục tiêu độc lập và vận động quần chúng tham gia. |

### Ma trận tám cặp

| Mã cặp | Ô nhiệm vụ | Thẻ | Đánh giá | Lý do ngắn | Nguồn |
|---|---|---|---|---|---|
| s06-e1 | Mở rộng lực lượng chính trị | Phát triển hội cứu quốc | Phù hợp | Hội cứu quốc trực tiếp tập hợp nhiều tầng lớp. | D3:P041, D3:P042 |
| s06-e2 | Mở rộng lực lượng chính trị | Mở địa bàn và liên lạc | Chưa phù hợp với ô này | Căn cứ tạo địa bàn; ô này hỏi vận động quần chúng. | D3:P041, D3:P042, D3:P045 |
| s06-e3 | Mở rộng lực lượng chính trị | Tổ chức tự vệ, du kích | Chưa phù hợp với ô này | Tự vệ hỗ trợ phong trào; cần trực tiếp vận động dân. | D3:P041, D3:P042, D3:P043, D3:P044 |
| s06-e4 | Mở rộng lực lượng chính trị | Báo chí vận động | Phù hợp | Báo chí tuyên truyền độc lập và vận động quần chúng. | D3:P041, D3:P042 |
| s06-e5 | Mở địa bàn, nối liên lạc | Phát triển hội cứu quốc | Chưa phù hợp với ô này | Hội cứu quốc tập hợp người; ô yêu cầu mở địa bàn và tuyến liên lạc. | D3:P041, D3:P045, D3:P047 |
| s06-e6 | Mở địa bàn, nối liên lạc | Mở địa bàn và liên lạc | Phù hợp | Mở rộng địa bàn và tuyến liên lạc đáp ứng nhiệm vụ. | D3:P040, D3:P043, D3:P045, D3:P047 |
| s06-e7 | Mở địa bàn, nối liên lạc | Tổ chức tự vệ, du kích | Chưa phù hợp với ô này | Bảo vệ cơ sở chưa thay công việc mở địa bàn và tuyến liên lạc. | D3:P043, D3:P045 |
| s06-e8 | Mở địa bàn, nối liên lạc | Báo chí vận động | Chưa phù hợp với ô này | Báo chí vận động dân, chưa trực tiếp mở địa bàn và tuyến liên lạc. | D3:P042, D3:P045 |

### Giải thích theo từng lựa chọn

#### s06-e1 — Phát triển hội cứu quốc → Mở rộng lực lượng chính trị

Tài liệu nêu việc vận động nhân dân tham gia Việt Minh thông qua các hội cứu quốc. Đây là cách trực tiếp tập hợp nhiều tầng lớp yêu nước, đáp ứng nhiệm vụ phát triển lực lượng chính trị. Báo chí vận động cũng là một phương án được chấp nhận ở ô này.

Nguồn: D3:P041, D3:P042. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s06-e2 — Mở địa bàn và liên lạc → Mở rộng lực lượng chính trị

Căn cứ giúp bảo toàn và phát triển lực lượng, nên có vai trò hỗ trợ quan trọng. Nhưng ô này yêu cầu hoạt động trực tiếp vận động, tập hợp quần chúng, trong khi thẻ tập trung vào địa bàn đứng chân. Các hội cứu quốc hoặc báo chí vận động trực tiếp đáp ứng nhiệm vụ đang hỏi.

Nguồn: D3:P041, D3:P042, D3:P045. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Phát triển hội cứu quốc; Báo chí vận động. Loại phân biệt: task-mismatch.

#### s06-e3 — Tổ chức tự vệ, du kích → Mở rộng lực lượng chính trị

Tự vệ, du kích bảo vệ cơ sở và hỗ trợ phong trào; hoạt động vũ trang còn có thể kết hợp tuyên truyền. Tuy nhiên, thẻ này được giới hạn ở việc tổ chức bộ phận vũ trang, còn ô hỏi hoạt động trực tiếp tập hợp quần chúng. 'Phát triển hội cứu quốc' hoặc 'Báo chí vận động' trả lời cụ thể hơn, không phủ nhận sự gắn bó giữa chính trị và vũ trang.

Nguồn: D3:P041, D3:P042, D3:P043, D3:P044. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Phát triển hội cứu quốc; Báo chí vận động. Loại phân biệt: task-mismatch.

#### s06-e4 — Báo chí vận động → Mở rộng lực lượng chính trị

Báo chí cách mạng góp phần tuyên truyền mục tiêu độc lập và vận động quần chúng. Vì ô này yêu cầu mở rộng lực lượng chính trị thông qua vận động, báo chí đáp ứng trực tiếp nhiệm vụ. Cùng với các hội cứu quốc, hoạt động tuyên truyền góp phần mở rộng nền tảng quần chúng.

Nguồn: D3:P041, D3:P042. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s06-e5 — Phát triển hội cứu quốc → Mở địa bàn, nối liên lạc

Các hội cứu quốc phát triển lực lượng chính trị và góp phần tạo nền tảng cho cách mạng. Ô này yêu cầu trực tiếp mở rộng địa bàn từ căn cứ và xây dựng tuyến liên lạc, không hỏi mọi hoạt động giúp phong trào lớn mạnh. 'Mở địa bàn và liên lạc' thực hiện rõ công việc địa bàn ấy.

Nguồn: D3:P041, D3:P045, D3:P047. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Mở địa bàn và liên lạc. Loại phân biệt: task-mismatch.

#### s06-e6 — Mở địa bàn và liên lạc → Mở địa bàn, nối liên lạc

Tài liệu nêu Bắc Sơn – Võ Nhai và Cao Bằng là những địa bàn bảo toàn, phát triển lực lượng, từ đó mở rộng cơ sở và các tuyến liên lạc. Thẻ trực tiếp mô tả phát triển địa bàn và kết nối các lực lượng như ô yêu cầu. Đây chỉ là một mặt của chuẩn bị, còn lực lượng chính trị và vũ trang vẫn có vai trò quan trọng.

Nguồn: D3:P040, D3:P043, D3:P045, D3:P047. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s06-e7 — Tổ chức tự vệ, du kích → Mở địa bàn, nối liên lạc

Tự vệ, du kích trực tiếp góp phần bảo vệ cơ sở và có vai trò với căn cứ, nên sẽ là một cách hợp lý nếu nhiệm vụ chỉ hỏi củng cố căn cứ nói chung. Nhưng ô này giới hạn ở mở rộng địa bàn và xây dựng tuyến liên lạc, trong khi thẻ mô tả tổ chức lực lượng bảo vệ. 'Mở địa bàn và liên lạc' đáp ứng công việc cụ thể đang xét.

Nguồn: D3:P043, D3:P045. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Mở địa bàn và liên lạc. Loại phân biệt: task-mismatch.

#### s06-e8 — Báo chí vận động → Mở địa bàn, nối liên lạc

Báo chí có vai trò tuyên truyền và vận động quần chúng, góp phần mở rộng lực lượng chính trị. Ô này hỏi công việc phát triển cơ sở ra địa bàn lân cận và nối các tuyến liên lạc, không chỉ việc đưa thông tin đến người đọc. 'Mở địa bàn và liên lạc' là phương án thể hiện trực tiếp công việc của ô.

Nguồn: D3:P042, D3:P045. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Mở địa bàn và liên lạc. Loại phân biệt: task-mismatch.

### Các cách hoàn thành được chấp nhận

- Mở rộng lực lượng chính trị: **Phát triển hội cứu quốc** + Mở địa bàn, nối liên lạc: **Mở địa bàn và liên lạc**
- Mở rộng lực lượng chính trị: **Báo chí vận động** + Mở địa bàn, nối liên lạc: **Mở địa bàn và liên lạc**

Mọi lựa chọn phù hợp đã được kiểm tra không gây bế tắc sau khi khóa ô.

## S07 — Chuẩn bị trực tiếp

**Chương:** c3. **Giai đoạn:** Tháng 3–7/1945. **Tối đa:** 20 điểm.

**Bối cảnh hiện trên màn:** Tháng 3/1945, sau đảo chính, điều kiện tổng khởi nghĩa chưa chín muồi.

**Mục tiêu học tập:** Hiểu quan hệ giữa cứu đói và vận động chính trị; phân biệt khởi nghĩa từng phần với phát động tổng khởi nghĩa khi chưa đủ điều kiện.

**Hồ sơ mở thêm:** r07. **Nguồn nền:** D3:P053, D3:P054, D3:P055, D3:P056, D3:P058, D3:P059, D3:P060, D3:P064.

### Hai nhiệm vụ

- **Cứu đói gắn chống Nhật** (s07-food): Chọn hoạt động trực tiếp giải quyết nhu cầu lương thực, đồng thời thu hút, tổ chức quần chúng trong cao trào kháng Nhật.
- **Giành chính quyền từng phần** (s07-partial): Hành động ở các địa phương có điều kiện để giải phóng từng nơi, tạo thêm tiền đề; chưa đồng nhất với tổng khởi nghĩa toàn quốc.

### Bốn thẻ

| ID | Tên trên màn | Nội dung mở bằng nút thông tin |
|---|---|---|
| s07-rice | Phá kho thóc cứu đói | Gắn nhu cầu sống còn của nhân dân với đấu tranh chống Nhật; qua hoạt động, quần chúng được thu hút, tổ chức và rèn luyện. |
| s07-local-uprising | Khởi nghĩa từng phần | Phối hợp lực lượng và quần chúng giành chính quyền ở từng nơi có điều kiện, phát triển vùng giải phóng. |
| s07-self-defense | Xây dựng tự vệ | Chuẩn bị lực lượng bảo vệ và hỗ trợ phong trào; hoạt động này tiếp tục được đẩy mạnh trong các đô thị. |
| s07-national-now | Tổng khởi nghĩa ngay tháng 3 | Phát động đồng loạt trên toàn quốc ngay sau đảo chính tháng 3/1945, thay vì cao trào và bước chuẩn bị từng phần. |

### Ma trận tám cặp

| Mã cặp | Ô nhiệm vụ | Thẻ | Đánh giá | Lý do ngắn | Nguồn |
|---|---|---|---|---|---|
| s07-e1 | Cứu đói gắn chống Nhật | Phá kho thóc cứu đói | Phù hợp | Cứu đói đồng thời thu hút, tổ chức quần chúng. | D3:P055, D3:P059 |
| s07-e2 | Cứu đói gắn chống Nhật | Khởi nghĩa từng phần | Chưa phù hợp với ô này | Khởi nghĩa từng phần chưa trực tiếp giải quyết lương thực. | D3:P058, D3:P059, D3:P064 |
| s07-e3 | Cứu đói gắn chống Nhật | Xây dựng tự vệ | Chưa phù hợp với ô này | Tự vệ hỗ trợ phong trào, chưa trực tiếp cứu đói. | D3:P043, D3:P059, D3:P060 |
| s07-e4 | Cứu đói gắn chống Nhật | Tổng khởi nghĩa ngay tháng 3 | Chưa phù hợp với ô này | Tháng 3 chưa đủ điều kiện tổng khởi nghĩa. | D3:P054, D3:P055, D3:P056, D3:P059 |
| s07-e5 | Giành chính quyền từng phần | Phá kho thóc cứu đói | Chưa phù hợp với ô này | Cứu đói góp phần cao trào, chưa thay giành chính quyền. | D3:P058, D3:P059, D3:P064 |
| s07-e6 | Giành chính quyền từng phần | Khởi nghĩa từng phần | Phù hợp | Từng địa phương hành động khi có điều kiện. | D3:P054, D3:P058, D3:P064 |
| s07-e7 | Giành chính quyền từng phần | Xây dựng tự vệ | Chưa phù hợp với ô này | Có lực lượng hỗ trợ chưa đủ thành khởi nghĩa. | D3:P043, D3:P058, D3:P060, D3:P064 |
| s07-e8 | Giành chính quyền từng phần | Tổng khởi nghĩa ngay tháng 3 | Chưa phù hợp với ô này | Khủng hoảng tháng 3 chưa đồng nghĩa thời cơ toàn quốc. | D3:P054, D3:P055, D3:P056, D3:P058 |

### Giải thích theo từng lựa chọn

#### s07-e1 — Phá kho thóc cứu đói → Cứu đói gắn chống Nhật

Phong trào phá kho thóc gắn nhu cầu lương thực sống còn với đấu tranh chống Nhật. Tài liệu nhấn mạnh qua hoạt động này, quần chúng được thu hút, tổ chức và rèn luyện, nên ý nghĩa vượt ra ngoài cứu trợ đơn thuần. Thẻ đáp ứng cả hai phần của nhiệm vụ: cứu đói và vận động trong cao trào.

Nguồn: D3:P055, D3:P059. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s07-e2 — Khởi nghĩa từng phần → Cứu đói gắn chống Nhật

Khởi nghĩa từng phần góp phần giải phóng địa phương và tạo tiền đề cho tổng khởi nghĩa. Nhưng ô này yêu cầu hoạt động trực tiếp gắn việc giải quyết nạn đói với vận động quần chúng chống Nhật. 'Phá kho thóc cứu đói' thể hiện rõ mối quan hệ cụ thể ấy.

Nguồn: D3:P058, D3:P059, D3:P064. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Phá kho thóc cứu đói. Loại phân biệt: task-mismatch.

#### s07-e3 — Xây dựng tự vệ → Cứu đói gắn chống Nhật

Xây dựng tự vệ là công việc chuẩn bị và hỗ trợ phong trào được tiếp tục trong các đô thị. Ô này đang yêu cầu hoạt động trực tiếp đáp ứng nhu cầu lương thực đồng thời tổ chức quần chúng chống Nhật, nên tự vệ chưa thay cho nhiệm vụ đó. 'Phá kho thóc cứu đói' phù hợp hơn với yêu cầu cụ thể.

Nguồn: D3:P043, D3:P059, D3:P060. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Phá kho thóc cứu đói. Loại phân biệt: task-mismatch.

#### s07-e4 — Tổng khởi nghĩa ngay tháng 3 → Cứu đói gắn chống Nhật

Chỉ thị tháng 3 nhận định đảo chính tạo khủng hoảng chính trị nhưng điều kiện tổng khởi nghĩa chưa chín muồi. Phát động toàn quốc ngay lúc đó vừa chưa đáp ứng điều kiện, vừa chưa trực tiếp thể hiện việc gắn cứu đói với vận động mà ô yêu cầu. 'Phá kho thóc cứu đói' là một hoạt động cụ thể trong cao trào chuẩn bị.

Nguồn: D3:P054, D3:P055, D3:P056, D3:P059. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Phá kho thóc cứu đói. Loại phân biệt: timing.

#### s07-e5 — Phá kho thóc cứu đói → Giành chính quyền từng phần

Phong trào phá kho thóc thu hút và rèn luyện quần chúng, có ý nghĩa chính trị quan trọng. Ô này hỏi hình thức phối hợp để giành chính quyền ở từng địa phương có điều kiện, nên hoạt động cứu đói riêng chưa thể hiện đủ nhiệm vụ ấy. 'Khởi nghĩa từng phần' đáp ứng trực tiếp phạm vi đang xét.

Nguồn: D3:P058, D3:P059, D3:P064. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Khởi nghĩa từng phần. Loại phân biệt: scope.

#### s07-e6 — Khởi nghĩa từng phần → Giành chính quyền từng phần

Từ tháng 3/1945, lực lượng vũ trang phối hợp quần chúng giải phóng nhiều địa phương và lập chính quyền cách mạng. Đây là khởi nghĩa từng phần trong cao trào kháng Nhật, góp phần chuẩn bị trực tiếp cho tổng khởi nghĩa. Điều đó không có nghĩa mọi địa phương đều phải hành động cùng lúc ngay sau đảo chính.

Nguồn: D3:P054, D3:P058, D3:P064. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s07-e7 — Xây dựng tự vệ → Giành chính quyền từng phần

Tự vệ là một bộ phận chuẩn bị và hỗ trợ phong trào, nhưng việc tổ chức lực lượng này riêng lẻ chưa thể hiện phối hợp giành chính quyền ở địa phương. Ô đang hỏi hình thức hành động với quần chúng tại nơi có điều kiện. 'Khởi nghĩa từng phần' trực tiếp thể hiện bước hành động đó.

Nguồn: D3:P043, D3:P058, D3:P060, D3:P064. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Khởi nghĩa từng phần. Loại phân biệt: missing-condition.

#### s07-e8 — Tổng khởi nghĩa ngay tháng 3 → Giành chính quyền từng phần

Sau đảo chính, tài liệu nêu điều kiện tổng khởi nghĩa chưa chín muồi và chủ trương thúc đẩy cao trào để tạo tiền đề. Ô này yêu cầu hành động từng phần ở nơi có điều kiện, nên phát động đồng loạt toàn quốc ngay lúc đó vượt quá bước đi đang xét. 'Khởi nghĩa từng phần' thể hiện sự chủ động phù hợp với tình hình ấy.

Nguồn: D3:P054, D3:P055, D3:P056, D3:P058. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Khởi nghĩa từng phần. Loại phân biệt: timing.

### Các cách hoàn thành được chấp nhận

- Cứu đói gắn chống Nhật: **Phá kho thóc cứu đói** + Giành chính quyền từng phần: **Khởi nghĩa từng phần**

Mọi lựa chọn phù hợp đã được kiểm tra không gây bế tắc sau khi khóa ô.

## S08 — Hai điều kiện cùng hội tụ

**Chương:** c3. **Giai đoạn:** Tháng 8/1945. **Tối đa:** 20 điểm.

**Bối cảnh hiện trên màn:** Hoàn cảnh thuận lợi gặp sự chuẩn bị trong nước.

**Mục tiêu học tập:** Phân biệt điều kiện khách quan với sự chuẩn bị chủ quan; hiểu thời cơ gắn sự kết hợp hai mặt chứ không chỉ một biến cố bên ngoài.

**Hồ sơ mở thêm:** r08. **Nguồn nền:** D3:P067, D3:P068, D3:P069, D3:P096, D3:P097, D3:P099, D3:P100.

### Hai nhiệm vụ

- **Điều kiện khách quan** (s08-objective): Chọn một biến chuyển ngoài sự chuẩn bị của lực lượng cách mạng, làm bộ máy thống trị suy yếu. Các thẻ là ví dụ liên quan với nhau, không phải một danh sách đầy đủ.
- **Sự chuẩn bị trong nước** (s08-subjective): Chọn một kết quả của quá trình tổ chức, xây dựng lực lượng và vận động quần chúng, còn gọi là sự chuẩn bị chủ quan.

### Bốn thẻ

| ID | Tên trên màn | Nội dung mở bằng nút thông tin |
|---|---|---|
| s08-japan-surrender | Nhật đầu hàng Đồng minh | Biến chuyển quốc tế làm quân Nhật tại Đông Dương hoang mang; phân biệt thông tin Nhật sắp đầu hàng với tuyên bố chính thức. |
| s08-regime-crisis | Chính quyền thân Nhật khủng hoảng | Bộ máy chính quyền thân Nhật lâm vào khủng hoảng trong tình thế Nhật đi đến đầu hàng. |
| s08-ready-forces | Tổ chức, lực lượng sẵn sàng | Kết quả chuẩn bị lâu dài về tổ chức, cán bộ, lực lượng chính trị, lực lượng vũ trang và căn cứ. |
| s08-trained-masses | Quần chúng được rèn luyện | Nhân dân được tập hợp, tổ chức và rèn luyện qua hoạt động thực tiễn, đặc biệt trong cao trào kháng Nhật. |

### Ma trận tám cặp

| Mã cặp | Ô nhiệm vụ | Thẻ | Đánh giá | Lý do ngắn | Nguồn |
|---|---|---|---|---|---|
| s08-e1 | Điều kiện khách quan | Nhật đầu hàng Đồng minh | Phù hợp | Biến chuyển quốc tế tạo hoàn cảnh thuận lợi. | D3:P067, D3:P068, D3:P099, D3:P100 |
| s08-e2 | Điều kiện khách quan | Chính quyền thân Nhật khủng hoảng | Phù hợp | Khủng hoảng bộ máy thống trị thuộc hoàn cảnh bên ngoài. | D3:P067, D3:P068, D3:P100 |
| s08-e3 | Điều kiện khách quan | Tổ chức, lực lượng sẵn sàng | Chưa phù hợp với ô này | Sẵn sàng của tổ chức thuộc sự chuẩn bị trong nước. | D3:P067, D3:P068, D3:P096, D3:P100 |
| s08-e4 | Điều kiện khách quan | Quần chúng được rèn luyện | Chưa phù hợp với ô này | Quần chúng được rèn luyện là kết quả chuẩn bị. | D3:P059, D3:P064, D3:P067, D3:P068, D3:P097 |
| s08-e5 | Sự chuẩn bị trong nước | Nhật đầu hàng Đồng minh | Chưa phù hợp với ô này | Nhật đầu hàng là hoàn cảnh, chưa phải chuẩn bị nội lực. | D3:P067, D3:P068, D3:P096, D3:P097, D3:P100 |
| s08-e6 | Sự chuẩn bị trong nước | Chính quyền thân Nhật khủng hoảng | Chưa phù hợp với ô này | Khủng hoảng phía đối phương chưa thay sự chuẩn bị. | D3:P067, D3:P068, D3:P096, D3:P097, D3:P100 |
| s08-e7 | Sự chuẩn bị trong nước | Tổ chức, lực lượng sẵn sàng | Phù hợp | Lực lượng sẵn sàng là thành quả chuẩn bị chủ động. | D3:P068, D3:P096, D3:P100 |
| s08-e8 | Sự chuẩn bị trong nước | Quần chúng được rèn luyện | Phù hợp | Quần chúng được tổ chức, rèn luyện qua phong trào. | D3:P059, D3:P064, D3:P068, D3:P097 |

### Giải thích theo từng lựa chọn

#### s08-e1 — Nhật đầu hàng Đồng minh → Điều kiện khách quan

Nhật đi đến đầu hàng Đồng minh làm suy yếu nghiêm trọng bộ máy thống trị ở Đông Dương, là điều kiện khách quan thuận lợi. Tài liệu đồng thời nhấn mạnh khả năng tận dụng hoàn cảnh ấy đến từ sự chuẩn bị trong nước. Đặt thẻ ở ô này không có nghĩa một mình sự đầu hàng đủ bảo đảm thắng lợi.

Nguồn: D3:P067, D3:P068, D3:P099, D3:P100. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s08-e2 — Chính quyền thân Nhật khủng hoảng → Điều kiện khách quan

Tài liệu nêu chính quyền thân Nhật lâm vào khủng hoảng khi Nhật đi đến đầu hàng. Đây là một biểu hiện của hoàn cảnh khách quan thuận lợi, liên quan trực tiếp với biến chuyển quốc tế, nên được chấp nhận ở ô này. Nó vẫn cần kết hợp với lực lượng cách mạng đã chuẩn bị để trở thành khả năng hành động thực tế.

Nguồn: D3:P067, D3:P068, D3:P100. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s08-e3 — Tổ chức, lực lượng sẵn sàng → Điều kiện khách quan

Tổ chức và lực lượng sẵn sàng là thành quả chủ động xây dựng trong nước, có vai trò thiết yếu. Ô này đang hỏi biến chuyển khách quan ngoài quá trình chuẩn bị ấy, nên thẻ thuộc nhóm còn lại. 'Nhật đầu hàng Đồng minh' hoặc 'Chính quyền thân Nhật khủng hoảng' thể hiện loại yếu tố của ô.

Nguồn: D3:P067, D3:P068, D3:P096, D3:P100. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Nhật đầu hàng Đồng minh; Chính quyền thân Nhật khủng hoảng. Loại phân biệt: category-mismatch.

#### s08-e4 — Quần chúng được rèn luyện → Điều kiện khách quan

Quần chúng được tổ chức và rèn luyện qua phong trào là kết quả của hoạt động trong nước. Thẻ có ý nghĩa đối với sự sẵn sàng chủ quan, còn ô đang phân loại hoàn cảnh khách quan tạo thuận lợi. Có thể chọn sự đầu hàng của Nhật hoặc khủng hoảng chính quyền thân Nhật cho ô này.

Nguồn: D3:P059, D3:P064, D3:P067, D3:P068, D3:P097. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Nhật đầu hàng Đồng minh; Chính quyền thân Nhật khủng hoảng. Loại phân biệt: category-mismatch.

#### s08-e5 — Nhật đầu hàng Đồng minh → Sự chuẩn bị trong nước

Nhật đầu hàng là điều kiện khách quan quan trọng, không phải thành quả tổ chức và xây dựng lực lượng trong nước. Ô này yêu cầu phần chuẩn bị chủ quan giúp tận dụng thời cơ, nên thẻ thuộc nhóm khác. 'Tổ chức, lực lượng sẵn sàng' hoặc 'Quần chúng được rèn luyện' thể hiện phần chuẩn bị ấy.

Nguồn: D3:P067, D3:P068, D3:P096, D3:P097, D3:P100. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Tổ chức, lực lượng sẵn sàng; Quần chúng được rèn luyện. Loại phân biệt: category-mismatch.

#### s08-e6 — Chính quyền thân Nhật khủng hoảng → Sự chuẩn bị trong nước

Khủng hoảng của chính quyền thân Nhật tạo hoàn cảnh thuận lợi nhưng không phải sự chuẩn bị của lực lượng cách mạng. Ô đang hỏi nội lực đã được xây dựng để biến cơ hội thành hành động. Tổ chức, lực lượng sẵn sàng hoặc quần chúng được rèn luyện đều là ví dụ được chấp nhận.

Nguồn: D3:P067, D3:P068, D3:P096, D3:P097, D3:P100. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Tổ chức, lực lượng sẵn sàng; Quần chúng được rèn luyện. Loại phân biệt: category-mismatch.

#### s08-e7 — Tổ chức, lực lượng sẵn sàng → Sự chuẩn bị trong nước

Tài liệu nêu sự chuẩn bị lâu dài về tổ chức, cán bộ, lực lượng chính trị, lực lượng vũ trang và căn cứ là nền tảng tận dụng thời cơ. Đây là phần chủ quan được xây dựng trong nước, khác với biến chuyển của chiến tranh quốc tế. Thẻ đại diện cho một mặt của sự chuẩn bị, không có nghĩa chỉ cần một yếu tố riêng lẻ.

Nguồn: D3:P068, D3:P096, D3:P100. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s08-e8 — Quần chúng được rèn luyện → Sự chuẩn bị trong nước

Các hoạt động đấu tranh và cao trào kháng Nhật đã thu hút, tổ chức và rèn luyện quần chúng. Đó là một kết quả chuẩn bị trong nước, góp phần tạo sự sẵn sàng chủ quan khi thời cơ đến. Sự sẵn sàng của tổ chức và lực lượng cũng thuộc nhóm chuẩn bị chủ động này.

Nguồn: D3:P059, D3:P064, D3:P068, D3:P097. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

### Các cách hoàn thành được chấp nhận

- Điều kiện khách quan: **Nhật đầu hàng Đồng minh** + Sự chuẩn bị trong nước: **Tổ chức, lực lượng sẵn sàng**
- Điều kiện khách quan: **Nhật đầu hàng Đồng minh** + Sự chuẩn bị trong nước: **Quần chúng được rèn luyện**
- Điều kiện khách quan: **Chính quyền thân Nhật khủng hoảng** + Sự chuẩn bị trong nước: **Tổ chức, lực lượng sẵn sàng**
- Điều kiện khách quan: **Chính quyền thân Nhật khủng hoảng** + Sự chuẩn bị trong nước: **Quần chúng được rèn luyện**

Mọi lựa chọn phù hợp đã được kiểm tra không gây bế tắc sau khi khóa ô.

## S09 — Phối hợp hành động

**Chương:** c3. **Giai đoạn:** Tháng 8/1945. **Tối đa:** 20 điểm.

**Bối cảnh hiện trên màn:** Cần tập trung, thống nhất và kịp thời huy động sức dân.

**Mục tiêu học tập:** Nhận ra vai trò của chỉ đạo phối hợp và lực lượng quần chúng trong tổng khởi nghĩa; không phủ nhận sự chủ động địa phương hoặc vai trò hỗ trợ của lực lượng vũ trang.

**Hồ sơ mở thêm:** r09. **Nguồn nền:** D3:P069, D3:P071, D3:P072, D3:P078, D3:P093, D3:P097, D3:P098.

### Hai nhiệm vụ

- **Thống nhất chỉ đạo** (s09-coordinate): Truyền đạt chủ trương và phối hợp hành động tập trung, thống nhất, kịp thời; địa phương vẫn chủ động vận dụng theo tình hình thực tế.
- **Huy động quần chúng** (s09-mobilize): Trực tiếp tập hợp đông đảo nhân dân thành lực lượng hành động. Nhiệm vụ này khác với riêng việc tổ chức bộ phận vũ trang hỗ trợ.

### Bốn thẻ

| ID | Tên trên màn | Nội dung mở bằng nút thông tin |
|---|---|---|
| s09-communicate | Truyền đạt và phối hợp | Đưa chủ trương đến các đầu mối, phối hợp chỉ đạo tập trung, thống nhất, kịp thời; kết hợp sự chủ động của từng địa phương. |
| s09-masses | Tập hợp quần chúng | Huy động đông đảo nhân dân trực tiếp tham gia hành động giành chính quyền. |
| s09-armed-support | Vũ trang hỗ trợ | Phát huy vai trò của bộ phận lực lượng vũ trang trong hỗ trợ đấu tranh chính trị và sức mạnh quần chúng. |
| s09-base | Củng cố căn cứ | Bảo toàn, phát triển địa bàn đứng chân cho lực lượng; một công việc chuẩn bị có giá trị nhưng không thay mọi yêu cầu hành động. |

### Ma trận tám cặp

| Mã cặp | Ô nhiệm vụ | Thẻ | Đánh giá | Lý do ngắn | Nguồn |
|---|---|---|---|---|---|
| s09-e1 | Thống nhất chỉ đạo | Truyền đạt và phối hợp | Phù hợp | Chủ trương chung giúp hành động thống nhất, kịp thời. | D3:P071, D3:P072, D3:P078, D3:P098 |
| s09-e2 | Thống nhất chỉ đạo | Tập hợp quần chúng | Chưa phù hợp với ô này | Có đông người chưa tự tạo chỉ đạo thống nhất. | D3:P072, D3:P093, D3:P097 |
| s09-e3 | Thống nhất chỉ đạo | Vũ trang hỗ trợ | Chưa phù hợp với ô này | Vũ trang hỗ trợ chưa thay phối hợp chỉ đạo chung. | D3:P072, D3:P093 |
| s09-e4 | Thống nhất chỉ đạo | Củng cố căn cứ | Chưa phù hợp với ô này | Căn cứ tạo nền tảng, chưa thay truyền đạt chủ trương. | D3:P045, D3:P069, D3:P072, D3:P096 |
| s09-e5 | Huy động quần chúng | Truyền đạt và phối hợp | Chưa phù hợp với ô này | Chỉ đạo cần đi cùng việc trực tiếp huy động dân. | D3:P072, D3:P093, D3:P097 |
| s09-e6 | Huy động quần chúng | Tập hợp quần chúng | Phù hợp | Quần chúng là lực lượng trực tiếp giành chính quyền. | D3:P093, D3:P097 |
| s09-e7 | Huy động quần chúng | Vũ trang hỗ trợ | Chưa phù hợp với ô này | Lực lượng hỗ trợ chưa thay huy động đông đảo nhân dân. | D3:P093, D3:P097 |
| s09-e8 | Huy động quần chúng | Củng cố căn cứ | Chưa phù hợp với ô này | Địa bàn chuẩn bị chưa tự huy động quần chúng. | D3:P045, D3:P093, D3:P096, D3:P097 |

### Giải thích theo từng lựa chọn

#### s09-e1 — Truyền đạt và phối hợp → Thống nhất chỉ đạo

Tài liệu nêu việc chỉ đạo tổng khởi nghĩa dựa trên nguyên tắc tập trung, thống nhất và kịp thời. Truyền đạt chủ trương và phối hợp giữa các đầu mối trực tiếp đáp ứng yêu cầu đó. Sự thống nhất vẫn đi cùng việc địa phương chủ động vận dụng theo tình hình, không phải mọi nơi đều có diễn biến giống nhau.

Nguồn: D3:P071, D3:P072, D3:P078, D3:P098. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s09-e2 — Tập hợp quần chúng → Thống nhất chỉ đạo

Quần chúng là lực lượng trực tiếp giành chính quyền và có vai trò thiết yếu. Tuy nhiên, ô này hỏi công việc truyền đạt chủ trương và phối hợp chỉ đạo; việc tập hợp người riêng chưa thể hiện đầy đủ quan hệ chỉ đạo chung. 'Truyền đạt và phối hợp' đáp ứng trực tiếp nhiệm vụ đang hỏi.

Nguồn: D3:P072, D3:P093, D3:P097. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Truyền đạt và phối hợp. Loại phân biệt: task-mismatch.

#### s09-e3 — Vũ trang hỗ trợ → Thống nhất chỉ đạo

Lực lượng vũ trang hỗ trợ đấu tranh chính trị và sức mạnh của đông đảo quần chúng trong tổng khởi nghĩa. Thẻ mô tả một vai trò lực lượng, còn ô yêu cầu phối hợp chỉ đạo trên các đầu mối để hành động thống nhất, kịp thời. 'Truyền đạt và phối hợp' trực tiếp đáp ứng yêu cầu rộng hơn ấy.

Nguồn: D3:P072, D3:P093. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Truyền đạt và phối hợp. Loại phân biệt: scope.

#### s09-e4 — Củng cố căn cứ → Thống nhất chỉ đạo

Căn cứ là một phần chuẩn bị lâu dài giúp bảo toàn và phát triển lực lượng. Trong nhiệm vụ hiện tại, địa bàn đứng chân chưa thay cho truyền đạt chủ trương và phối hợp hành động kịp thời giữa các đầu mối. 'Truyền đạt và phối hợp' trực tiếp giải quyết yêu cầu của ô; điều đó không làm mất giá trị của căn cứ.

Nguồn: D3:P045, D3:P069, D3:P072, D3:P096. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Truyền đạt và phối hợp. Loại phân biệt: task-mismatch.

#### s09-e5 — Truyền đạt và phối hợp → Huy động quần chúng

Truyền đạt chủ trương và phối hợp chỉ đạo giúp thống nhất hành động. Nhưng ô này đang yêu cầu công việc trực tiếp tập hợp đông đảo nhân dân tham gia, nên chỉ nêu luồng chỉ đạo chưa thể hiện đầy đủ việc huy động lực lượng quần chúng. 'Tập hợp quần chúng' trực tiếp đáp ứng phần việc đó.

Nguồn: D3:P072, D3:P093, D3:P097. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Tập hợp quần chúng. Loại phân biệt: task-mismatch.

#### s09-e6 — Tập hợp quần chúng → Huy động quần chúng

Tổng khởi nghĩa diễn ra bằng sức mạnh của đông đảo quần chúng, kết hợp đấu tranh chính trị với lực lượng vũ trang hỗ trợ. Tập hợp quần chúng trực tiếp đáp ứng nhiệm vụ huy động sức dân ở ô này. Điều đó thể hiện sự gắn bó giữa vận động chính trị với hoạt động của các lực lượng hỗ trợ.

Nguồn: D3:P093, D3:P097. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

#### s09-e7 — Vũ trang hỗ trợ → Huy động quần chúng

Lực lượng vũ trang giữ vai trò hỗ trợ quan trọng trong sự kết hợp các hình thức đấu tranh. Ô này yêu cầu trực tiếp huy động đông đảo nhân dân, nên riêng bộ phận vũ trang chưa bao quát lực lượng quần chúng đang được hỏi. 'Tập hợp quần chúng' đáp ứng nhiệm vụ ấy mà không phủ nhận vai trò hỗ trợ vũ trang.

Nguồn: D3:P093, D3:P097. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Tập hợp quần chúng. Loại phân biệt: scope.

#### s09-e8 — Củng cố căn cứ → Huy động quần chúng

Củng cố căn cứ góp phần tạo nền tảng để lực lượng cách mạng hoạt động. Ô này đang hỏi việc trực tiếp huy động đông đảo nhân dân hành động giành chính quyền, chứ không chỉ duy trì địa bàn đứng chân. 'Tập hợp quần chúng' thể hiện trực tiếp yêu cầu ấy.

Nguồn: D3:P045, D3:P093, D3:P096, D3:P097. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.

Phương án đáp ứng ô: Tập hợp quần chúng. Loại phân biệt: task-mismatch.

### Các cách hoàn thành được chấp nhận

- Thống nhất chỉ đạo: **Truyền đạt và phối hợp** + Huy động quần chúng: **Tập hợp quần chúng**

Mọi lựa chọn phù hợp đã được kiểm tra không gây bế tắc sau khi khóa ô.

## Các quyết định biên tập và nội dung cần chú ý

### C1-01

**Vấn đề:** Màn 01 cũ dùng nhiệm vụ kết nối công–nông quá rộng, nên loại Hỗ trợ đời sống sẽ không công bằng.

**Chứng cứ:** D1:P013 nêu yêu cầu đời sống; D1:P031 nêu liên minh công–nông. Hai ý hỗ trợ nhau, không loại trừ nhau.

**Quyết định:** Đổi màn mở đầu thành ghép những yêu cầu tiêu biểu của công nhân và nông dân được nguồn nêu. Mỗi ô nhận một trong hai phương án phù hợp; liên hệ công–nông được trình bày sau màn và trong hồ sơ. Không nói thuế chỉ liên quan nông dân trong mọi hoàn cảnh.

### C1-02

**Vấn đề:** Báo chí công khai ở màn 02 không có căn cứ đủ cụ thể để phủ định toàn giai đoạn chỉ bằng đối lập công khai/bí mật.

**Chứng cứ:** D1:P077–P078 nói về chi bộ và học tập, báo bí mật trong tù; D1:P082 nêu xây dựng tổ chức bí mật; D1:P088 nêu nhiều nhiệm vụ có giá trị.

**Quyết định:** Dùng bốn hoạt động có căn cứ: củng cố cơ sở bí mật, học và dịch sách trong tù, tập hợp quần chúng, tuyên truyền chống chiến tranh. Chấm theo hai công việc cụ thể, không coi hai thẻ chưa ghép là hoạt động vô ích.

### C1-03

**Vấn đề:** Tài liệu nguồn chưa phải giáo trình chính thức có số trang kiểm chứng; còn ghi chú biên tập và mốc cần xem lại.

**Chứng cứ:** D1:P066/C0 ghi đọc lại thêm trong sgk; P081 dùng đầu năm 1932 trong khi P082 nêu ngày 15-6-1932; P083 có tên một tác phẩm cần đối chiếu trước khi sử dụng.

**Quyết định:** Nội dung gameplay không dùng ngày công bố Chương trình hành động hoặc tên tác phẩm này để chấm điểm. Đánh dấu source-supported/editorial-match, chưa tuyên bố xác minh độc lập hoặc duyệt chuyên môn.

### c2-source-status

**Vấn đề:** Nội dung có căn cứ trong tài liệu nội bộ, chưa được xác minh độc lập.

**Chứng cứ:** Đã đọc toàn bộ D2 (GiaiDoan1936Den1939.docx qua bản trích OOXML), các ghi chú C0–C6 và đối chiếu phần tương ứng trong docs/noi-dung-goc.md. Hai văn bản có nhiều đoạn trùng nhau; đây không phải hai chứng cứ lịch sử độc lập. Pxxx là đoạn OOXML, không phải trang.

**Quyết định:** Trạng thái bản nháp là source-supported, cần nhóm duyệt. sourceRefs chỉ định vị căn cứ nội bộ; không dùng nhãn verified. Mọi đánh giá phù hợp/chưa phù hợp là quy tắc biên tập theo nhiệm vụ cụ thể, không phải lời trích hoặc kết luận nguyên văn của tài liệu.

### c2-france-date

**Vấn đề:** Mốc về Mặt trận Nhân dân Pháp trong tài liệu không nhất quán.

**Chứng cứ:** D2:P010 ghi '(5/1935)' nhưng ngay sau đó ghi chính phủ lên nắm quyền năm 1936; D2:P067 dùng năm 1936 mà không có mốc 5/1935. Ghi chú C0 còn nhấn mạnh các chính sách chỉ được áp dụng hạn chế và bị cản trở ở thuộc địa.

**Quyết định:** Không dùng tháng hoặc năm thắng lợi của Mặt trận Nhân dân Pháp làm dữ kiện chấm điểm. Bối cảnh chỉ nói tranh thủ điều kiện hoạt động công khai, kết hợp cơ sở bí mật; không mô tả có tự do hoàn toàn hay công khai thay thế hoàn toàn bí mật. Nhóm cần đối chiếu nguồn học thuật trước khi phát hành phần tư liệu có mốc cụ thể.

### c2-literacy-date

**Vấn đề:** Mốc truyền bá quốc ngữ chưa đủ chắc chắn để đưa vào bài ghép.

**Chứng cứ:** D2:P045 và D2:P098 cùng ghi Hội truyền bá quốc ngữ 'phát triển mạnh từ cuối năm 1937'; docs/noi-dung-goc.md lặp lại cách viết này nên không giải quyết được điểm cần xác minh. Không có kiểm chứng độc lập trong đợt này.

**Quyết định:** Màn s04 dùng phạm vi 1936–1939 để nói về phong trào của cả giai đoạn, không nói mọi hoạt động bắt đầu cùng lúc hoặc tồn tại suốt cả giai đoạn. Không hỏi ngày thành lập, không ghi mốc cuối 1937 và không dùng mốc đó để loại phương án. Nhóm cần duyệt riêng cách diễn giải hoạt động dạy chữ trước phát hành.

### c2-card-revision

**Vấn đề:** Thẻ vũ trang và tổng khởi nghĩa trong kế hoạch cũ quá xa hai nhiệm vụ của chương, dễ bị loại bằng mẹo.

**Chứng cứ:** D2:P034–P038 mô tả dân nguyện, ủy ban hành động và báo chí; D2:P045–P047 mô tả truyền bá quốc ngữ, nghị trường và hội ái hữu/tương tế. D2:P020/P057 khẳng định kết hợp công khai với bí mật.

**Quyết định:** Thay bằng các hoạt động có thật trong khung tư liệu cùng giai đoạn. Màn s03 nhận cả thu thập dân nguyện và lập ủy ban hành động cho nhiệm vụ gom nguyện vọng; thẻ ủy ban được định nghĩa trong màn là đầu mối tiếp nhận dân nguyện. Thẻ cơ sở bí mật được giữ như một công việc hỗ trợ có ý nghĩa, không bị đánh giá là không phù hợp với toàn giai đoạn.

### c2-target-scope

**Vấn đề:** Nhiệm vụ 'Kết nối nhiều tầng lớp' quá rộng: báo chí, lớp học, nghị trường hoặc hội đoàn đều có thể góp phần thực hiện.

**Chứng cứ:** D2:P023/P024 nói tập hợp quần chúng, D2:P044–P047 liệt kê nhiều hình thức vận động; D2:P051/P056 nêu kết quả và bài học tập hợp lực lượng rộng rãi. Nguồn không cung cấp một xếp hạng cho các hình thức này.

**Quyết định:** Đổi nhiệm vụ s04 thành 'Lập hội tương trợ' và 'Mở lớp học chữ', chấp nhận cả hội ái hữu lẫn hội tương tế ở ô tương trợ. Điều kiện lập hội hiện ngay trên nhãn, không giấu trong phần đọc thêm. Đánh giá các thẻ còn lại chỉ theo công việc trực tiếp được yêu cầu, không phủ nhận khả năng góp phần vận động quần chúng. Chi tiết hoạt động của thẻ là tình huống biên tập để làm rõ phạm vi, không trình bày như trích dẫn lịch sử.

### c2-author-comments

**Vấn đề:** Cần bảo toàn ý nghĩa các ghi chú tác giả thay vì chỉ đọc phần thân tài liệu.

**Chứng cứ:** Ghi chú C6 diễn giải dân nguyện là nguyện vọng quần chúng; C0 giới hạn điều kiện công khai; C1/C2 làm rõ giai đoạn phục hồi và hệ thống tổ chức; C3/C4 bổ sung Tổng Bí thư và tên Mặt trận; C5 làm rõ bối cảnh thuộc địa. Bản sau tại D2:P061–P111 tích hợp nhiều bổ sung nhưng vẫn lặp mốc truyền bá quốc ngữ.

**Quyết định:** Dùng 'nguyện vọng' để giải nghĩa dân nguyện, giữ tính có điều kiện của hoạt động công khai và không đưa tên người, ngày hội nghị hoặc danh xưng Mặt trận đang cần rà soát thành câu hỏi phụ. Không coi phần lặp hoặc bình luận tác giả là xác minh độc lập.

### c3-source-status

**Vấn đề:** Toàn bộ nội dung chỉ được đối chiếu với nguồn nội bộ D3, chưa được kiểm chứng độc lập hoặc duyệt môn học.

**Chứng cứ:** D3 là bản trích GiaiDoan1939Den1945.docx, SHA256 95ba78fcd428f2ba280c6b8ea227e7a63651aae5ef04571b6344776efae233c8. Pxxx là thứ tự đoạn OOXML, không phải trang; các bảng và hai comments đã được đọc.

**Quyết định:** Trạng thái của mọi cặp là source-supported draft, cần nhóm/người phụ trách môn học duyệt. Các lý do giới hạn ở lập luận mà đoạn nguồn thực sự hỗ trợ; không biến tài liệu nội bộ thành bằng chứng đã xác minh độc lập.

### c3-transition-process

**Vấn đề:** Dễ trình bày chuyển hướng 1939–1941 như một quyết định tức thời, hoặc coi mọi nội dung đã hoàn chỉnh ngay tháng 11/1940.

**Chứng cứ:** D3:P008–P011 nêu bước mở đầu năm 1939; D3:P029 phân biệt hạn chế của Hội nghị tháng 11/1940; D3:P032–P038 nêu việc hoàn chỉnh tháng 5/1941.

**Quyết định:** Giữ s05 trên khoảng 1939–1941 và ghi rõ quá trình trong phần giải thích. Không hỏi một mốc hội nghị duy nhất như toàn bộ sự chuyển hướng.

### c3-s05-meaningful-cards

**Vấn đề:** Thẻ đề xuất 'Duy trì nguyên cách công khai' và 'Tổng khởi nghĩa ngay' khiến s05 dựa vào hai phương án phủ định khá dễ loại; nhãn 'Tập hợp cứu quốc' còn dễ đồng nhất mặt trận năm 1939 với Việt Minh năm 1941.

**Chứng cứ:** D3:P009 ghi Mặt trận Thống nhất Dân tộc Phản đế Đông Dương; D3:P035–P038 ghi Việt Minh. D3:P010 nêu đổi phương thức; D3:P014 và D3:P033 nêu các hoạt động khác có ý nghĩa trong cùng giai đoạn.

**Quyết định:** Thẻ s05 là 'Lập mặt trận đoàn kết', 'Chuyển sang bí mật', 'Giảm tô, giảm tức', 'Xây dựng du kích'. Nhiệm vụ tách rõ hình thức tổ chức mặt trận với đổi phương thức hoạt động; phần đọc thêm phân biệt hai mặt trận theo thời điểm. Không phủ nhận vai trò chính sách xã hội hoặc du kích.

### c3-s06-multiple-valid

**Vấn đề:** Nguồn cho phép hơn một cách phát triển lực lượng chính trị; chỉ chấp nhận hội cứu quốc sẽ loại một lựa chọn có căn cứ.

**Chứng cứ:** D3:P041 nêu các hội cứu quốc tập hợp lực lượng; D3:P042 nêu báo chí cách mạng tuyên truyền và vận động quần chúng. D3:P043–P044 cho thấy hoạt động vũ trang còn kết hợp tuyên truyền, nên không thể khẳng định vũ trang tách biệt tuyệt đối với chính trị.

**Quyết định:** s06 chấp nhận cả 'Phát triển hội cứu quốc' và 'Báo chí vận động' cho ô lực lượng chính trị. Thẻ 'Tổ chức tự vệ, du kích' được mô tả riêng về chức năng bảo vệ cơ sở, không gộp toàn bộ hoạt động quân sự kết hợp tuyên truyền. Chấm theo việc trực tiếp đáp ứng nhiệm vụ, không xếp thẻ thành tốt/xấu.

### c3-s07-famine-politics

**Vấn đề:** Comment C0 yêu cầu bổ sung ý nghĩa chính trị và nhấn mạnh Việt Minh; nếu chỉ minh họa phát gạo thì thu hẹp phong trào phá kho thóc thành cứu trợ.

**Chứng cứ:** D3:P059 gắn cứu đói với chống Nhật, thu hút, tổ chức và rèn luyện quần chúng; D3:P041 nêu công tác vận động qua Việt Minh; D3:P054–P055 đặt hoạt động trong cao trào kháng Nhật. Comment C0: 'Thiếu ý nghĩa chính trị. Nhấn mạnh hoạt động của Việt Minh'.

**Quyết định:** Ô s07 yêu cầu 'Cứu đói gắn chống Nhật'; cả giải thích phù hợp và chưa phù hợp đều giữ quan hệ dân sinh–vận động chính trị. Cần nhóm duyệt phần hồ sơ bổ sung vai trò Việt Minh; không coi comment là một nguồn sự kiện độc lập.

### c3-s08-avoid-word-trap

**Vấn đề:** Cặp 'Nhật đầu hàng Đồng minh' với 'Chỉ cần Nhật đầu hàng' kiểm tra sự chú ý vào hai chữ 'chỉ cần' nhiều hơn hiểu lịch sử.

**Chứng cứ:** D3:P067 mô tả Nhật đầu hàng và chính quyền thân Nhật khủng hoảng; D3:P068–P069, D3:P096–P100 giải thích thời cơ gắn hoàn cảnh khách quan với sự chuẩn bị và hành động trong nước.

**Quyết định:** Thay s08 bằng bốn yếu tố có thật, hai yếu tố khách quan và hai ví dụ chuẩn bị chủ quan; mỗi ô chấp nhận hai thẻ. Hai thẻ khách quan liên quan với nhau, không trình bày như hai điều kiện độc lập hoặc một danh sách đầy đủ. Khi khóa một thẻ luôn còn thẻ thuộc nhóm còn lại.

### c3-s08-chronology

**Vấn đề:** Nếu đặt việc ban lệnh tổng khởi nghĩa sau ngày Nhật hoàng tuyên bố đầu hàng một cách máy móc sẽ trái trình tự nêu trong chính tài liệu.

**Chứng cứ:** D3:P071 nêu đêm 13/8 đã ban Quân lệnh số 1 khi nhận tin Nhật sắp đầu hàng; D3:P067 nêu tuyên bố ngày 15/8; D3:P072 nêu Hội nghị 14–15/8.

**Quyết định:** s08 chỉ hỏi loại yếu tố trong tháng 8, không chấm thứ tự kéo thẻ như niên biểu hoặc ngụ ý chỉ sau 15/8 mới có quyết định. Các mốc chính xác để trong tư liệu nếu cần và phải giữ phân biệt thông tin sắp đầu hàng với tuyên bố chính thức.

### c3-s09-local-initiative

**Vấn đề:** Thẻ 'Mỗi nơi tự chọn thời điểm' dễ khiến chủ động địa phương bị đánh giá chung là chưa phù hợp.

**Chứng cứ:** D3:P072 nhấn mạnh tập trung, thống nhất, kịp thời; D3:P078 và D3:P098 ghi nhận địa phương chủ động theo tình hình thực tế và chủ trương đã được quán triệt.

**Quyết định:** Bỏ thẻ này, thay bằng 'Củng cố căn cứ', một hoạt động chuẩn bị có giá trị nhưng khác nhiệm vụ của màn. Phần lý do ô chỉ đạo khẳng định phối hợp chung vẫn đi cùng chủ động vận dụng tại địa phương.

### c3-date-granularity

**Vấn đề:** Tài liệu chứa mốc ngày hội nghị, tên địa phương và bảng diễn biến chưa có trích thư mục/trang đủ để kiểm tra độc lập; không cần các chi tiết ấy để chấm matching.

**Chứng cứ:** D3:P062 tự dẫn 'Theo sách Lịch sử 12 nâng cao'; D3:P075–P092 là bảng thời gian–diễn biến. Không xác định được trang nguồn hay phiên bản sách từ bản trích.

**Quyết định:** Không khẳng định có mâu thuẫn đã được kiểm chứng. Loại ngày chi tiết và tên tỉnh lỵ khỏi đáp án gameplay s05–s09; giữ khoảng thời gian và mối quan hệ có căn cứ trong nguồn nội bộ.

### c3-visible-scope

**Vấn đề:** Một số nhãn nhiệm vụ còn rộng hơn phạm vi chấm nằm trong phần đọc thêm.

**Chứng cứ:** D3:P010 phân biệt phương thức công khai/bí mật với hoạt động vũ trang; D3:P043/P045 cho thấy lực lượng bảo vệ cũng góp phần củng cố căn cứ; D3:P054 nêu rõ điều kiện ngay sau đảo chính tháng 3.

**Quyết định:** Hiện ngay lựa chọn công khai/bí mật ở nhãn s05. Đổi ô s06 thành Mở địa bàn, nối liên lạc và thẻ địa bàn tương ứng, thay vì dùng Củng cố căn cứ quá rộng để loại tự vệ. Hiện tháng 3/1945 trong bối cảnh và thẻ tổng khởi nghĩa ở s07; không giấu mốc đang dùng để đánh giá trong nút đọc thêm.

### c3-final-significance

**Vấn đề:** Comment C1 cho rằng phần ý nghĩa chưa nhấn mạnh đủ chuyển biến vai trò, vị thế của Đảng và tác động quốc tế.

**Chứng cứ:** D3:P101–P104 và Comment C1; D3:P102 có nêu cổ vũ phong trào giải phóng dân tộc trên thế giới nhưng không triển khai đầy đủ nội dung comment đề nghị.

**Quyết định:** Không dựng đáp án chấm điểm mới chỉ từ yêu cầu của comment. Ghi thành hạng mục nhóm bổ sung/duyệt cho hồ sơ kết thúc; điểm người chơi không thay đổi diễn biến và ý nghĩa lịch sử.

## Kiểm tra cấu trúc

- 9 màn, 18 ô, 36 thẻ theo màn, 72 cặp đánh giá.
- 25 cặp phù hợp, 47 cặp cần xem lại.
- Tất cả nguồn tham chiếu trỏ tới đoạn có thật; hash ba Word khớp bản trích.
- Mỗi màn có nghiệm dùng hai thẻ khác nhau; không có bế tắc do khóa phương án phù hợp.
- Số cách giải theo màn: s01: 4; s02: 1; s03: 2; s04: 2; s05: 1; s06: 2; s07: 1; s08: 4; s09: 1.
- Tất cả gợi ý dẫn tới một cặp được chấp nhận ở đúng ô.
- Chưa chạy kiểm tra engine v2, UI kéo thả hoặc người chơi thật vì chưa triển khai gameplay trong đợt này.

Tái tạo và kiểm tra: `node tools/build-content-spec-v2.cjs`. Lệnh đọc các bản biên tập trong `docs/content-drafts-v2/`, kiểm tra, rồi ghi lại model và tài liệu này. Khi sửa nội dung, sửa bản biên tập tương ứng và tái tạo; không sửa riêng một bản output.
