# Bản triển khai dẫn truyện và lựa chọn

Trang chính hiện dùng story-content/core/game và story.css, giữ AugustWorld để vẽ pixel. Luồng bấm việc/giữ tay/chuyển vật của bản trước không còn chạy ở trang chính.

## Phân bổ và luật

- 1930–1935: 4 câu, 400 điểm.
- 1936–1939: 4 câu, 400 điểm.
- 1939–1945: 18 câu, 1800 điểm; đón thời cơ tối đa 100 điểm, tổng 1900.
- Mỗi giai đoạn có thể bắt đầu trực tiếp, có điểm/tiến độ và kết quả riêng.
- Phù hợp lần đầu: 100. Đã chọn chưa phù hợp rồi sửa: 0. Tín hiệu bị bỏ lỡ rồi đón lại: 0.
- Phương án được trộn ổn định theo ID câu, không theo chu kỳ A/B/C/D. Thứ tự câu giữ tiến trình dẫn truyện.
- Mỗi phương án có giải thích riêng. Nội dung biên tập và mã đối chiếu không được kết xuất vào giao diện.
- Thời cơ bắt đầu khi người chơi bấm chủ động sau câu Tân Trào. Báo trước 2500 ms, bay 5000 ms; mở hộp đọc và tab ẩn tạm dừng. Không chạy trong lúc đọc/chọn phương án.

## Biên tập nội dung

Câu hỏi được đối chiếu với bản trích ba tệp Word của nhóm. Không bổ sung mốc ngoài tài liệu để làm đáp án. Những phương án nhiễu có thể ghép nhầm sự kiện–ngày hoặc đưa một chủ trương có thật vào sai bối cảnh; phần giải thích nêu rõ sự khác biệt. Các ghi chú và đoạn trùng/lệch trong bản 1936–1939 không được biến thành câu hỏi yêu cầu nhớ một mốc còn chưa thống nhất, ví dụ chi tiết Mặt trận Nhân dân Pháp ở đoạn P010. Đoạn dẫn là lời kể biên tập, không đóng vai trích dẫn của nhân vật lịch sử.

Độ khó chủ yếu đến từ: phân biệt nhiệm vụ trước mắt/mục tiêu lâu dài; mở đầu/hoàn chỉnh chuyển hướng; vai trò các cơ quan Tân Trào; ghép đúng mốc gần nhau; lực lượng chính trị/vũ trang/căn cứ; khách quan/chủ quan và nguyên nhân thắng lợi. Chưa có dữ liệu thử với người học để định lượng độ khó từng câu.

## Bảng đối chiếu nội bộ

Mã P là vị trí đoạn trong bản trích, chỉ dùng cho người biên tập; không phải thành phần UI.

| Giai đoạn | Câu | Nội dung kiểm tra | Đoạn đối chiếu |
|---|---|---|---|
| 1930–1935 | c1-demands | Nhóm yêu sách nào thể hiện đúng sự kết hợp trong phong trào đầu năm 1930? | D1:P013, D2:P018, D3:P009, D3:P055 |
| 1930–1935 | c1-xoviet | Dấu hiệu nào phân biệt Xô viết Nghệ–Tĩnh với một cuộc vận động đòi cải cách dân chủ? | D1:P019, D1:P020, D1:P038, D1:P039, D1:P040, D2:P034, D3:P041, D3:P045 |
| 1930–1935 | c1-thesis | Nhận xét nào phân biệt đúng hạn chế của Luận cương tháng 10/1930 với chủ trương được hoàn chỉnh năm 1941? | D1:P052, D1:P054, D1:P061, D3:P032, D3:P033 |
| 1930–1935 | c1-restore | Bộ nhiệm vụ nào thuộc Đại hội lần thứ nhất tháng 3/1935? | D1:P086, D1:P088, D2:P018, D3:P035, D3:P036, D3:P062 |
| 1936–1939 | c2-immediate | Chủ trương nào phù hợp với giai đoạn 1936–1939? | D2:P018, D1:P052, D3:P008, D3:P055 |
| 1936–1939 | c2-method | Cách tổ chức nào thể hiện đúng sự thích ứng của phong trào dân chủ? | D2:P020, D2:P057, D1:P082, D3:P010, D3:P036, D3:P043 |
| 1936–1939 | c2-policy | Văn kiện “Chung quanh vấn đề chiến sách mới” tháng 10/1936 điều chỉnh nhận thức theo hướng nào? | D2:P027, D2:P028, D2:P029, D2:P030, D1:P052, D3:P036, D3:P055 |
| 1936–1939 | c2-legacy | Vì sao phong trào 1936–1939 được xem là một bước chuẩn bị cho Cách mạng tháng Tám? | D2:P048, D2:P051, D2:P053, D3:P063, D1:P038, D1:P039, D1:P040 |
| 1939–1945 | c3-turn-date | Hội nghị nào mở đầu chuyển hướng chỉ đạo chiến lược, trước khi chủ trương được hoàn chỉnh năm 1941? | D3:P008, D3:P011, D3:P029, D3:P038, D2:P024 |
| 1939–1945 | c3-turn-process | Chuỗi nhận định nào phản ánh đúng quá trình 1939–1941? | D3:P008, D3:P029, D3:P033, D3:P035, D3:P036, D3:P038, D2:P046 |
| 1939–1945 | c3-front | Phương án nào phù hợp với cách giải quyết vấn đề dân tộc tại Hội nghị Trung ương VIII? | D3:P009, D3:P034, D3:P035, D3:P038, D2:P024, D1:P064 |
| 1939–1945 | c3-political-force | Đâu là cách lý giải đầy đủ vai trò xây dựng lực lượng chính trị giai đoạn 1941–1944? | D3:P040, D3:P041, D3:P042, D3:P097, D2:P034, D2:P046, D1:P082 |
| 1939–1945 | c3-army-date | Ngày thành lập Đội Việt Nam Tuyên truyền Giải phóng quân là mốc nào? | D3:P038, D3:P044, D3:P063 |
| 1939–1945 | c3-preparation | Mô hình nào phản ánh đúng sự chuẩn bị toàn diện trước năm 1945? | D3:P040, D3:P043, D3:P044, D3:P045, D3:P047, D3:P096 |
| 1939–1945 | c3-directive-date | Chỉ thị “Nhật – Pháp bắn nhau và hành động của chúng ta” được ban hành khi nào? | D3:P053, D3:P054, D3:P071, D3:P073 |
| 1939–1945 | c3-march-response | Cặp nhận định – hành động nào phù hợp với chỉ thị tháng 3/1945? | D3:P053, D3:P054, D3:P055, D3:P056, D2:P034, D2:P038, D2:P046 |
| 1939–1945 | c3-rice-purpose | Vì sao phá kho thóc, giải quyết nạn đói có ý nghĩa trong cao trào kháng Nhật? | D3:P055, D3:P057, D3:P058, D3:P059, D2:P034 |
| 1939–1945 | c3-rice-people | Nhận định nào nối đúng phong trào cứu đói với vai trò quần chúng trong thắng lợi sau đó? | D3:P059, D3:P064, D3:P093, D3:P097, D2:P047 |
| 1939–1945 | c3-preparation-dates | Cặp sự kiện – thời gian nào được ghép phù hợp? | D3:P038, D3:P044, D3:P063 |
| 1939–1945 | c3-partial | Quan hệ nào phản ánh đúng khởi nghĩa từng phần với tổng khởi nghĩa? | D3:P036, D3:P054, D3:P063, D3:P064, D3:P069, D3:P093 |
| 1939–1945 | c3-window | Cách đánh giá nào xác định đúng thời cơ tổng khởi nghĩa tháng Tám? | D3:P054, D3:P067, D3:P068, D3:P069, D3:P072 |
| 1939–1945 | c3-tantrao | Phương án nào ghép đúng cơ quan với quyết định trong tháng 8/1945? | D3:P063, D3:P071, D3:P072, D3:P073 |
| 1939–1945 | c3-cities | Chuỗi địa phương – ngày giành chính quyền nào phù hợp? | D3:P079, D3:P080, D3:P081, D3:P082, D3:P083, D3:P084, D3:P085, D3:P086, D3:P087, D3:P088 |
| 1939–1945 | c3-uprising-force | Nhận định nào phản ánh đúng phương thức và lực lượng của Tổng khởi nghĩa? | D3:P078, D3:P093, D3:P097, D3:P098, D2:P034, D2:P038, D2:P046 |
| 1939–1945 | c3-outcome | Chuỗi kết quả nào giữ đúng cả thời điểm lẫn ý nghĩa? | D3:P085, D3:P086, D3:P087, D3:P088, D3:P089, D3:P090, D3:P091, D3:P092 |
| 1939–1945 | c3-causes | Nhận định nào giải thích đầy đủ quan hệ khách quan – chủ quan của thắng lợi tháng Tám? | D3:P069, D3:P095, D3:P096, D3:P097, D3:P098, D3:P099, D3:P100 |

## Xác nhận triển khai

- 9 kiểm tra logic: cấu trúc 26 câu, tồn tại đoạn nguồn và hash Word gốc, vào riêng từng giai đoạn, điểm lần đầu, ngăn bỏ qua câu, thời cơ chính xác, kết quả sau thử lại, khôi phục và từ chối dữ liệu không hợp lệ.
- Trình duyệt thật trong hồ sơ riêng: đi hết 26 câu; vào giai đoạn chính trước hai giai đoạn dẫn; chọn chưa phù hợp rồi sửa; bỏ lỡ thời cơ rồi đón lại; kết quả chính 1700/1900; hai giai đoạn dẫn 400/400; khôi phục sau tải lại; lưu độc lập; bài đọc; bàn phím; bố cục 390/360 px không tràn ngang; không có lỗi chạy hoặc yêu cầu tài nguyên thất bại.
- Ảnh: .qa/story/chapter-select.png, main-question.png, unsuitable.png, opportunity.png, main-results.png, review.png, mobile-select.png, mobile-question.png, mobile-feedback.png, mobile-help.png.
- Chưa thử trên thiết bị vật lý hoặc đo hiệu quả học tập. Bộ vẽ pixel được giữ từ bản trước; bản này thay hình thức chơi và nội dung lựa chọn, không tuyên bố hoàn tất mỹ thuật lịch sử.


## Hướng giao diện lịch sử

Lớp story-tone.css giữ bố cục và luật chơi, đổi sang nền nâu đen, giấy ngà, mực sẫm và đỏ son. Chữ tiêu đề/lời dẫn dùng Times New Roman có dấu tiếng Việt; phương án dùng chữ sans để đọc rõ. Lựa chọn là các dòng có đường phân cách; chỉ phương án đang chọn mới có dấu nhấn màu. Điểm thu nhỏ, phản hồi phù hợp không dùng mảng xanh rực, lựa chọn chưa phù hợp không gắn dấu X. Cảnh có sắc độ ấm và chuyển cảnh mờ nhẹ; thời cơ có nhấn ánh sáng riêng, kết thúc độc lập giữ hình ảnh sáng hơn. Không thêm nhãn mô tả, huy hiệu hoặc chữ biên tập trên màn hình. Tôn trọng giảm chuyển động.
