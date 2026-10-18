# Ý nghĩa giao diện và tương tác v2

Tài liệu đối chiếu các thành phần được dựng bởi `src/js/v2-ui.js`, `v2-game.js`, `v2-art.js` và token màu v2. Mục đích là giữ một ngôn ngữ giao diện nhất quán: mỗi dấu hiệu phải giúp nhận biết nội dung, thao tác, trạng thái hoặc bối cảnh. Đây không phải bằng chứng đã thử với người chơi thật.

## Trật tự thông tin

Màn chơi dẫn mắt theo trình tự: giai đoạn → nhiệm vụ → hoạt động → triển khai → kết quả. Bối cảnh ngắn nằm ngay trước bàn chơi. Điều kiện quyết định việc ghép phải có trong nhãn/bối cảnh hoặc tên thẻ; nút đọc thêm bổ sung chiều sâu, không giấu điều kiện làm đổi điểm.

Địa bàn và khay thẻ là hai nhóm chức năng. Khoảng cách nhóm phân biệt nơi cần hoạt động với hoạt động có thể dùng. Hai cụm trái/phải trong cảnh tương ứng thứ tự hai nhiệm vụ bên dưới. Không thêm đường nối giả từ một thẻ tới đáp án trước khi triển khai.

## Màu và lớp thị giác

| Dấu hiệu / token | Ý nghĩa | Ràng buộc |
|---|---|---|
| Nền kem `--page`, bề mặt `--surface` | Môi trường sáng và vùng nội dung có thể đọc | Không dùng độ cũ của giấy để làm chữ mờ |
| Bề mặt dịu `--surface-soft` | Phân nhóm phụ, nhãn nền | Không đồng nghĩa ô bị khóa hoặc chưa phù hợp |
| Chữ `--ink`, chữ phụ `--muted` | Nội dung chính và thông tin hỗ trợ | Chữ phụ vẫn phải đủ rõ để đọc |
| Đường biên `--line` | Phân định thẻ, nhóm, vùng thao tác | Độ nổi không ngụ ý thẻ có đáp án tốt hơn |
| Đỏ đất `--accent` / `--accent-hover` | Hành động chính và nhấn thương hiệu | Không dùng để gọi một lựa chọn lịch sử “sai”; hover chỉ báo tương tác |
| Xanh `--green` / `--green-soft` | Đã triển khai phù hợp, hoàn thành | Luôn đi cùng dấu tích và nhãn trạng thái |
| Hổ phách `--amber` / `--amber-soft` | Lựa chọn cần xem lại hoặc nhiệm vụ chưa hoàn thành | Đi cùng biểu tượng thông tin và lời giải thích; không dùng báo động nặng nề |
| Xanh lam `--focus` / `--focus-soft` | Focus bàn phím, chọn hoặc vùng thao tác đang được chú ý | Tách khỏi màu kết quả; không chấm nội dung khi mới hover/đặt |
| Nhiều màu trong SVG | Phân biệt vật thể, nghề nghiệp và chiều sâu | Màu minh họa không mã hóa suitable/needs-review; không có mẹo chọn thẻ xanh |
| Bóng dưới vật thể và thẻ | Chiều sâu, phân biệt lớp đang kéo với bề mặt | Không biểu thị rủi ro, điểm hoặc chất lượng phương án |

Nhãn, hình và màu phải cùng làm rõ trạng thái. Không yêu cầu người chơi phân biệt chỉ bằng màu. Kích thước chữ phục vụ thứ bậc, không biến thông tin cần thiết thành chữ quá nhỏ để giữ bố cục.

## Icon, số, dấu và đường nét

| Thành phần đang xuất hiện | Ý nghĩa riêng | Phản hồi hoặc tên truy cập |
|---|---|---|
| Dấu bản đồ gấp ở thương hiệu | Hành trình và kết nối; đồng thời là liên kết về trang đầu | Link có tên “Đường đến tháng Tám — Trang đầu” |
| Bàn tay | Có thao tác chọn/kéo/đặt; trong header mở cách chơi | Đặt kèm tên thao tác, không dùng như dấu đáp án |
| Chữ i trong vòng tròn | Có thông tin thêm; sau triển khai chỉ phần cần xem lại | Nút thông tin thẻ có `aria-label` cụ thể; kết quả có nhãn chữ riêng |
| Quyển sách | Hồ sơ hoặc đọc tư liệu | Mở nội dung đọc tự chọn |
| Mũi tên sang phải | Hành động dẫn tới bước/nội dung tiếp theo | Luôn đi cùng tên hành động, không trang trí mọi dòng |
| Mũi tên trở lại | Rời phần xem lại về kết quả/chương | Không thay nghĩa bằng “chơi lại” |
| Loa / loa gạch | Âm thanh đang bật/tắt | `aria-pressed` và tên trạng thái trên nút |
| Dấu tích | Hoàn thành hoặc phù hợp đã được xác nhận | Xuất hiện sau đánh giá; ở thanh chương là chương đã đi qua |
| Ổ khóa | Thẻ/ô đã phù hợp, không cần bố trí lại | Đi cùng chữ “Đã hoàn thành”; nút thẻ và ô bị vô hiệu hóa |
| Mũi tên vòng “luyện lại” | Mở một lượt luyện riêng | Có chữ “Luyện lại tình huống”; không hứa ghi lại điểm cũ |
| Dấu X ở bảng đọc | Đóng bảng và quay lại vị trí tương tác | Nút có tên “Đóng” |
| Số `01`, `02` trên hai nhiệm vụ | Thứ tự hai nơi nhận trong màn hiện tại | Không phải độ khó, điểm hoặc thứ tự bắt buộc phải đặt |
| Số `01`–`03` trên thanh chương | Vị trí trong ba chương | `aria-current="step"` đánh dấu chương hiện tại; chương đã qua thay số bằng tích |
| “Chặng 02 / 09” | Vị trí trong toàn hành trình | Tách với hai số nhiệm vụ và ba số chương |
| `03`, `09`, `180` ở trang đầu | Số chương, số chặng và điểm tối đa | Có tên đơn vị; không phải chỉ số đang thay đổi |
| `+10`, `+5` ở phản hồi | Điểm của chính nhiệm vụ đó theo lần đánh giá | Không cộng lặp mỗi lần render; engine tính lại từ lịch sử |
| `/10`, `/20`, `/180` | Giới hạn của nhiệm vụ, lượt luyện/chặng, hành trình | Dùng đúng phạm vi; tổng kết chương có mẫu số 40/40/100 |
| Dấu `·`, gạch dài, dấu `/` | Ngăn các trường metadata, khoảng giai đoạn hoặc tỷ lệ | Không tạo thành chấm tiến độ vô danh |
| Dấu mở rộng của hàng xem lại/hồ sơ | Có thể mở phần đọc chi tiết | Dùng `details/summary`, điều khiển bằng chuột hoặc bàn phím |
| Các dòng nhỏ trên báo/sách | Gợi cấu trúc một ấn phẩm, giúp nhận diện hoạt động | Không giả một trích dẫn lịch sử có thể đọc được |
| Chấm/nút của sơ đồ mạng | Đại diện đầu mối trong quan hệ tổ chức | Không phải địa danh thật, dấu bấm hoặc trạng thái ẩn |
| Đường nối mạng và trang giấy trên tuyến | Liên lạc, truyền đạt hoặc phối hợp | Không phải tuyến đường địa lý được xác minh; không tạo câu đố tìm đường phụ |
| Đường cong sông, đồi và cây | Phân vùng cảnh, chiều sâu và không khí địa bàn | Không tương tác, không phát sáng gọi bấm; không ảnh hưởng chấm điểm |

Thư viện SVG có một số icon dự phòng. Việc có một hình trong `V2Art` không phải lý do để đưa nó lên màn hình. Không dùng cúp, sao, hạt sáng, dấu chấm hoặc mũi tên không có thông tin cần truyền đạt.

## Trạng thái thẻ và vùng nhận

| Trạng thái | Điều người chơi cần hiểu | Hành vi |
|---|---|---|
| Thẻ trong khay | Hoạt động có thể chọn, kéo hoặc mở thông tin | Tên ngắn và minh họa; tên truy cập nêu cách thao tác |
| Đang chọn | Đây là thẻ sẽ được đặt ở thao tác tiếp theo | `aria-pressed=true`; chọn lại hoặc Escape để hủy |
| Đang kéo | Một bản sao thị giác đi theo con trỏ | Bản sao không có focus, không thay trạng thái trước khi thả hợp lệ |
| Vùng nhận được làm rõ | Ô này có thể nhận thẻ về mặt thao tác | Tất cả ô chưa khóa đều được làm rõ như nhau, không dùng ma trận đáp án để hover |
| Con trỏ ở trên vùng nhận | Nếu thả lúc này, thẻ được bố trí tại đây | Một trạng thái focus/hover duy nhất; chưa có dấu tích hay lý do phù hợp |
| Thả hụt / hủy kéo | Cách bố trí trước đó được giữ lại | Không trừ điểm, không tính lần triển khai; thông báo ngắn nếu cần |
| Đã đặt, chưa triển khai | Thẻ đã có vị trí nhưng chưa được chấm | Nhãn ô hiện tên thẻ, khay nói đang ở nhiệm vụ nào; vẫn đổi/đưa về khay |
| Đặt vào ô đã có thẻ | Thay hoặc hoán đổi có quy tắc rõ ràng | Không nhân đôi một thẻ ở hai ô; ô phù hợp đã khóa không bị thay |
| Chưa đủ hai ô | Chưa có kế hoạch để triển khai | Nút triển khai vô hiệu hóa; helper nói số hoạt động đã bố trí |
| Triển khai phù hợp | Hoạt động đáp ứng nhiệm vụ cụ thể | Tích, chữ, điểm, lý do ngắn và thành quả trong cảnh; khóa ô/thẻ |
| Triển khai chưa phù hợp | Cần cân nhắc lại quan hệ nhiệm vụ–hoạt động | Thông tin hổ phách, lý do riêng và nút “Vì sao?”; không ném thẻ ra xa |
| Đã điều chỉnh phù hợp | Nhiệm vụ hoàn thành sau phản hồi | Chữ nêu rõ đã điều chỉnh, +5; lựa chọn ban đầu vẫn trong xem lại |
| Chưa thay đổi sau phản hồi | Triển khai lại hiện tại không tạo một quyết định mới | Nút triển khai lại vô hiệu hóa để tránh tạo lần thử trùng |

Phân biệt bắt buộc: **thả hợp lệ là kết quả thao tác; phù hợp là kết quả đối chiếu nội dung sau Triển khai**. Khoảng cách tới ô, tốc độ kéo và số lần mở thông tin không tham gia chấm điểm.

## Thành quả trong cảnh và chuyển động

Minh họa dùng hai nhóm `art-target-a` và `art-target-b`; `is-a-ready`/`is-b-ready` chỉ được thêm khi nhiệm vụ tương ứng đã được chấm phù hợp. Các nhóm `art-reveal` là phần thành quả, không phải vật trang trí lấp khoảng trống.

| Nhóm thành quả | Ý nghĩa |
|---|---|
| `art-connection` | Quan hệ liên lạc hoặc phối hợp đã được làm rõ |
| `art-learning` | Hoạt động học tập, truyền đạt kiến thức được tổ chức |
| `art-crowd` | Sự tập hợp hoặc tham gia được tăng cường |

Mỗi cảnh chọn nhóm gắn với công việc ở hai nhiệm vụ. Thành quả khái quát hoạt động, không khẳng định một bức hình hoặc hai thẻ tái hiện đầy đủ diễn biến thật.

Chuyển tiếp trạng thái có điểm bắt đầu/kết thúc và gắn với sự kiện do người chơi tạo. Con trỏ kéo đi theo tay vì cần phản hồi vị trí. Tự cuộn gần mép màn hình hỗ trợ đưa thẻ đến vùng nhận trên màn nhỏ. Nền không rung, phát sáng, chạy người hoặc phun hạt liên tục để thu hút chú ý. Với `prefers-reduced-motion`, chuyển trạng thái vẫn phải truyền đạt được bằng hình tĩnh, chữ và biểu tượng.

Âm báo ngắn xác nhận đặt thẻ/triển khai khi người chơi bật âm. Không dùng âm thanh làm kênh duy nhất để phân biệt kết quả; không tự bật nhạc hoặc dùng âm báo lỗi để phán xét người chơi.

## Phần đọc, nguồn và xem lại

| Điểm mở | Nội dung cần đáp ứng |
|---|---|
| “Tìm hiểu” cạnh bối cảnh | Bối cảnh, mục tiêu học và hồ sơ giai đoạn |
| “Nhiệm vụ” dưới ô | Phạm vi trực tiếp của công việc, không đổi điều kiện chấm |
| i trên thẻ | Diễn giải hoạt động trên chính thẻ đó |
| “Vì sao?” sau triển khai | Nhiệm vụ + lựa chọn đã đánh giá + lý do riêng của cặp + gợi ý nếu cần + nguồn |
| “Hồ sơ” trên header | Chín hồ sơ tự chọn, mặc định gọn trong các hàng mở rộng |
| “Xem cách tính điểm” từ điểm số | Luật 10/5/0 và phạm vi điểm, không giấu hình phạt tốc độ |
| Hàng xem lại | Lựa chọn đầu, kết quả hiện tại, điểm; mở ra lý do, cách đáp ứng và lịch sử thử |
| Bộ lọc “Cần ôn từ lượt đầu” | Cả những lựa chọn ban đầu chưa phù hợp đã điều chỉnh xong |
| Bộ lọc “Chưa hoàn thành” | Các nhiệm vụ vẫn chưa phù hợp khi đi tiếp |
| “Luyện lại tình huống” | Một bản luyện tách biệt; banner nói rõ không đổi điểm lượt trước |
| Liên kết `D#:Pxxx` | Tra căn cứ trong tài liệu nhóm; Pxxx là đoạn OOXML, không phải số trang |

Liên kết nguồn mở đúng bản trích. Server tĩnh đang trả Markdown dạng văn bản: người đọc dùng tìm trong trang với mã Pxxx; fragment không bảo đảm tự cuộn. Không gắn nhãn “đã xác minh” cho nguồn nội bộ đang chờ duyệt chuyên môn.

Tổng kết có số liệu và lời học ngắn. Điểm là phản hồi hiểu nhiệm vụ, không thay đổi kết quả lịch sử hoặc đánh giá phẩm chất người chơi. Không gán kết thúc lịch sử khác nhau theo điểm.

## Focus và khả năng thao tác

- Nút có chữ hoặc tên truy cập. SVG đi kèm có `aria-hidden=true`, tránh trình đọc lặp tên icon.
- Focus bàn phím phải nhìn rõ, không bị dùng như màu phù hợp. Tab/Enter/Space dùng cùng đường đặt thẻ với chuột và thao tác chạm.
- Sau đặt thẻ, focus trở về ô vừa nhận; sau trả thẻ, về thẻ trong khay. Sau chọn bộ lọc, focus ở bộ lọc đó.
- Bảng đọc dùng dialog, có nút đóng và Escape. Tiêu đề được focus khi mở; khi đóng, trả focus cho phần tử mở nếu còn tồn tại.
- Skip link cho phép đến nội dung chính. Vùng trạng thái thông báo thay đổi đặt thẻ/kết quả mà không ép mở bảng đọc.
- Khi kéo bị hủy, cửa sổ mất focus, đổi kích thước hoặc tab bị ẩn, bản sao kéo được dọn; không bỏ thẻ trong trạng thái treo.
- Với màn nhỏ, vẫn phải đọc được nhãn và dùng chọn–đặt; không coi thao tác kéo chính xác là điều kiện học tập. Xác minh cảm ứng trên thiết bị thật vẫn là công việc thử riêng.

## Câu hỏi duyệt từng chi tiết

1. Chi tiết này cho biết nội dung, hành động, trạng thái hay bối cảnh nào?
2. Người chơi phân biệt nó với điểm, tiến độ và đáp án ra sao?
3. Bỏ chi tiết này có mất thông tin hoặc cảm xúc cần thiết không?
4. Tên truy cập hoặc chữ đi kèm có đủ để hiểu khi không thấy màu/animation không?
5. Chi tiết có hứa hẹn thao tác mà hệ thống không thực hiện, hoặc tiết lộ kết quả trước Triển khai không?

Chi tiết không trả lời được cần được bỏ hoặc thiết kế lại. Checklist này là nguyên tắc duyệt; chất lượng trải nghiệm cuối cùng cần quan sát người chơi trực tiếp.
