# Đối chiếu nội dung và kiểm kê triển khai v2

## 1. Kết luận của đợt 0

Đã đọc ba tài liệu Word do nhóm cung cấp, trích nội dung có định vị theo đoạn, đọc cả mười ghi chú tác giả và đối chiếu với tài liệu Markdown/code hiện có. Đã biên soạn bộ nhiệm vụ–thẻ v2 cho chín màn, gồm 18 ô, 36 thẻ theo màn và 72 cặp đánh giá.

Bộ nội dung mới đủ chi tiết để bắt đầu màn mẫu “Giữ mạch nối”: có nhãn, bối cảnh ngắn, nguồn, đánh giá từng cặp, lý do ngắn, giải thích sâu và phương án thay thế. Chưa sửa gameplay trong đợt này.

Hai trạng thái cần phân biệt:

- **Đã đối chiếu nguồn nội bộ:** có đoạn trong các tài liệu được cung cấp hỗ trợ nội dung sử dụng. Định vị có thể truy ngược về tệp gốc qua SHA256 và số đoạn OOXML.
- **Chưa xác minh độc lập hoặc duyệt chuyên môn:** các tài liệu là bản tổng hợp nhóm, có nội dung lặp, ghi chú và một số điểm còn cần kiểm tra. Sự trùng nhau giữa Word, Markdown và code không tạo thành ba nguồn độc lập.

Các quyết định ghép thẻ theo nhiệm vụ là **biên tập gameplay**, không phải nguyên văn giáo trình. Trạng thái chuyên môn của cả 72 cặp vẫn là `pending`; điều này không ngăn triển khai engine hoặc bản mẫu có nguồn nội bộ rõ ràng.

## 2. Tài liệu đầu vào và định vị

| ID | Tệp gốc | Đoạn OOXML / đoạn có chữ | Bảng | Ghi chú |
|---|---|---:|---:|---:|
| D1 | `GiaiDoan1930Den1935.docx` | 91 / 67 | 0 | 1 |
| D2 | `GiaiDoan1936Den1939.docx` | 112 / 109 | 0 | 7 |
| D3 | `GiaiDoan1939Den1945.docx` | 105 / 100 | 2 | 2 |

- Tất cả nguồn ở thư mục `docs/`; bản trích ở `docs/source-extracts-v2/`.
- Mỗi trích đoạn mang mã Pxxx tính theo mọi đoạn trong phần thân tài liệu, gồm cả đoạn trống và các ô bảng, theo thứ tự OOXML. **Không phải số trang.**
- `catalog.json` ghi hash SHA256, số đoạn và ghi chú. Công cụ kiểm tra sẽ phát hiện Word đã thay đổi so với bản trích.
- Trích xuất thuần đọc; ba Word không được chỉnh sửa. Không phát hiện hình hoặc tracked insert/delete trong phần thân ba Word.
- Hai bảng trong D3 được đọc theo thứ tự đoạn trong từng ô. Đã kiểm tra ngữ cảnh tiêu đề/cặp thời gian–sự kiện, không dùng số thứ tự trích như số trang.
- Ghi chú tác giả được giữ riêng và liên kết bằng Comment IDs ở đoạn có dấu tham chiếu.
- Phạm vi QA đợt này là nội dung OOXML, không phải kiểm định bố cục trang Word. Công cụ nạp runtime tài liệu của ứng dụng trả lỗi; không sử dụng số trang chưa render hoặc tuyên bố đã kiểm tra hình thức trang.

Tái tạo bản trích trên PowerShell:

```powershell
./tools/extract-docx-content-v2.ps1
```

Khi nguồn đổi, phải đọc lại phần liên quan và cập nhật quyết định biên tập trước khi tạo lại ma trận; chạy công cụ không tự làm nội dung trở nên chính xác.

## 3. Các vấn đề nguồn và cách xử lý

### R01 — Mốc 1935/1936 về Mặt trận Nhân dân Pháp

- **Vị trí:** D2:P010, P067; tài liệu Markdown cũng lặp cách ghi.
- **Vấn đề:** một đoạn có nhãn “5/1935” nhưng câu tiếp dùng năm 1936. Không tự chọn một mốc để ra câu hỏi có điểm trong đợt này.
- **Xử lý:** màn 03 nói về điều kiện hoạt động công khai trong khung giai đoạn, không chấm ngày thắng lợi hoặc thành phần chính phủ. Nếu đưa diễn giải chi tiết vào hồ sơ, nhóm cần đối chiếu nguồn chuyên môn.
- **Sắc thái phải giữ:** điều kiện hoạt động có giới hạn, không biến thành tự do hoàn toàn; có kết hợp công khai và bí mật theo D2:P020, P057 và ghi chú C0.

### R02 — Mốc hoạt động truyền bá quốc ngữ

- **Vị trí:** D2:P045, P098; phần trùng trong Markdown không giải quyết được điểm còn cần xác minh.
- **Vấn đề:** nguồn gắn hoạt động với “cuối năm 1937”; bản kế hoạch cũ đã ghi đây là mốc cần kiểm tra.
- **Xử lý:** màn 04 dùng khung 1936–1939, chỉ hỏi công việc dạy và học chữ; không hỏi ngày thành lập Hội, không dùng mốc này để loại thẻ. Phần hồ sơ có ngày cụ thể cần được rà soát trước phát hành.

### R03 — Phần lặp và tên tác phẩm trong D2

- **Vị trí:** D2:P001–P058 và P061–P111 là hai lượt diễn giải tương tự; P042/P096 có tên tác phẩm cần đối chiếu nếu đưa vào phần học chính thức.
- **Xử lý:** không coi bản lặp là xác nhận độc lập; gameplay không chấm tên tác phẩm, số lượng tổ chức hoặc số người tham gia. Không khẳng định tên nào đã sai khi chưa đối chiếu nguồn ngoài.

### R04 — Các mốc và tên tác phẩm trong D1 không cần cho matching

- **Vị trí:** D1:P081 dùng “đầu năm 1932”, P082 nêu 15-6-1932; P083 có tên tác phẩm; ghi chú C0 tại P066 yêu cầu đọc thêm SGK.
- **Xử lý:** không dùng các chi tiết ấy làm căn cứ tính điểm. Màn 02 chỉ khai thác công việc khôi phục tổ chức và học tập trong tù được nguồn nêu rõ. Tư liệu nhóm vẫn giữ nguyên để kiểm tra tiếp.

### R05 — Chuyển hướng 1939–1941 là một quá trình

- **Vị trí:** D3:P007–P038, đặc biệt P029 và P038.
- **Xử lý:** không diễn đạt việc chuyển hướng hoàn tất ngay ở một hội nghị hoặc vào đầu cả giai đoạn. Màn 05 dùng một khung diễn tiến; chi tiết hội nghị đặt trong hồ sơ. Phương pháp hoạt động thay đổi theo điều kiện, không phải một nhãn tốt/xấu vĩnh viễn.

### R06 — Không đánh đồng khởi nghĩa từng phần và tổng khởi nghĩa

- **Vị trí:** D3:P054–P059 và P064–P069.
- **Xử lý:** màn 07 phân biệt công việc/hoàn cảnh cụ thể, không suy từ việc Nhật đảo chính Pháp ra kết luận mọi nơi đã đủ điều kiện tổng khởi nghĩa. Thông tin quá trình chuẩn bị trực tiếp được giữ khi mở giải thích.

### R07 — Không bác bỏ sự chủ động của địa phương

- **Vị trí:** D3:P072 nêu tập trung/thống nhất/kịp thời, P078 và P098 nêu chủ động ở địa phương theo tình hình và chủ trương.
- **Vấn đề thiết kế cũ:** thẻ “Mỗi nơi tự chọn thời điểm” dễ bị chấm theo cách phủ nhận mọi sự chủ động.
- **Xử lý:** không dùng đối lập tuyệt đối “chủ động địa phương = chưa phù hợp”. Màn 09 phải phân biệt công việc phối hợp, huy động và hỗ trợ theo nhiệm vụ, vẫn giữ tính chủ động thích ứng hoàn cảnh trong giải thích.

### R08 — Ý nghĩa và giới hạn của kết quả lịch sử

- **Vị trí:** D3:P101–P104 và ghi chú C1; P059/C0 nhắc ý nghĩa chính trị, vai trò Việt Minh.
- **Xử lý:** phần tổng kết/hồ sơ cần có vai trò tổ chức, sự tham gia của nhân dân và tác động quốc tế theo nguồn; không chỉ đọc các mốc thời gian. Không đánh đồng chấm dứt quân chủ với giải quyết hoàn toàn quan hệ ruộng đất.
- **Giới hạn của gameplay:** hai ô trong một màn không đại diện tất cả nguyên nhân hoặc tất cả hoạt động lịch sử. Thông điệp sau màn phải giúp liên hệ, không nói rằng thắng lợi chỉ đến từ hai thẻ đã đặt.

### R09 — Ảnh tư liệu chưa đủ thông tin

- **Vị trí code:** `src/js/content.js:2` và `:5`, `docs/anh-tu-lieu.md`.
- **Vấn đề:** ảnh 1945 đang làm mẫu cho chương 1930–1935; nhiều trường nguồn/giấy phép còn trống.
- **Xử lý đợt sau:** không dùng ảnh lệch thời kỳ trong bản mẫu mới. Tạo minh họa gameplay và gọi đúng là minh họa; hồ sơ ảnh tư liệu chỉ dùng ảnh có thông tin đã kiểm tra. Không chỉnh các tệp ảnh gốc trong đợt 0.

## 4. Điều chỉnh nội dung so với khung đề xuất ban đầu

Nguồn triển khai mới là `docs/content-model-v2.json`, bản dễ đọc là `docs/content-matrix-v2.md`. Khung chín màn ở kế hoạch ban đầu vẫn là ý tưởng xuất phát; những phần được sửa sau đối chiếu phải lấy theo model/ma trận mới.

| Màn | Điều chỉnh đã chốt trong đợt 0 | Lý do |
|---|---|---|
| s01 | Ghép những yêu cầu tiêu biểu được nguồn gắn với công nhân/nông dân; chấp nhận hai phương án mỗi nhóm | Tránh loại hoạt động hỗ trợ đời sống trong nhiệm vụ công–nông quá rộng; làm màn đầu dễ tiếp cận |
| s02 | Tách khôi phục cơ sở bí mật và học tập trong tù; dùng các hoạt động có giá trị cùng giai đoạn làm phương án khác | Không phủ định báo chí công khai cho toàn thời kỳ; làm rõ công việc trực tiếp |
| s03 | Chấp nhận thu thập dân nguyện hoặc lập đầu mối ủy ban ở ô gom nguyện vọng | Nguồn không ép một cách duy nhất; báo chí và cơ sở bí mật vẫn có vai trò riêng |
| s04 | Hỏi hội tương trợ và học chữ; chấp nhận hội ái hữu hoặc hội tương tế | Nhiệm vụ tập hợp quần chúng cũ quá rộng để loại lớp học, nghị trường |
| s05 | Bám chuyển hướng; hiện riêng câu hỏi công khai/bí mật trên nhãn | Không dùng Đổi cách hoạt động quá rộng rồi loại du kích dựa vào điều kiện giấu trong đọc thêm |
| s06 | Chấp nhận hội cứu quốc hoặc báo chí ở ô lực lượng chính trị; ô còn lại hỏi mở địa bàn và nối liên lạc | Tự vệ cũng giúp củng cố căn cứ, nên không thể dùng nhãn Củng cố căn cứ chung chung để loại nó |
| s07 | Phân biệt hoạt động trong cao trào; ghi rõ tháng 3/1945 trong bối cảnh và thẻ tổng khởi nghĩa | Không đánh đồng chuẩn bị trực tiếp với tổng khởi nghĩa ngay, hoặc giấu thời điểm ảnh hưởng điểm |
| s08 | Ghép yếu tố khách quan/chủ quan bằng các sự kiện và sự chuẩn bị có thật | Bỏ cặp gần giống “Nhật đầu hàng”/“Chỉ cần Nhật đầu hàng” dễ thành bẫy đọc chữ |
| s09 | Chấm công việc phối hợp/huy động theo nguồn, bỏ đối lập phủ nhận chủ động địa phương | Đảm bảo ngôn ngữ và kết luận công bằng với lịch sử |

Nhiều đáp án phù hợp không làm điểm khó hiểu: mọi cặp được chấp nhận đều được 10 ngay lần đầu, 5 nếu điều chỉnh sau phản hồi. Kiểm tra phép gán bảo đảm khóa một thẻ phù hợp không khiến ô khác mất hết nghiệm.

## 5. Đọc code hiện tại và bản đồ giữ/thay/bỏ

| Thành phần | Quyết định cho v2 | Chứng cứ/ghi chú |
|---|---|---|
| Hai URL `index.html`, `hanh-trinh.html` | Giữ | Landing riêng, game riêng; không tạo lại code ở gốc |
| Server tĩnh Node, HTML/CSS/JS thuần | Giữ | `server.cjs`, cổng 5173, bind 127.0.0.1 |
| Ba chương, chín tình huống, hồ sơ | Giữ khung, đổi schema nội dung | Phân bố 2/2/5; tuple thẻ cũ thiếu ID và đánh giá theo ô |
| Hồ sơ, ảnh phóng to, âm thanh tùy chọn, reduced motion | Giữ hành vi cần thiết, thiết kế lại | Không cần thêm cơ chế để đọc bắt buộc |
| Chọn 2/3 thẻ | Thay | `src/js/game.js:135`, `src/js/ui.js:117`; chưa có placement chung |
| Bốn stats, synergy | Bỏ khỏi luật mới | `src/js/game.js:9`, `:179`; không phải điểm 10/5/0 |
| La bàn, pressure | Bỏ khỏi giao diện mới nếu không có luật thực | `src/js/ui.js:99`; signals không được cập nhật; pressure ẩn |
| Checkpoint trắc nghiệm | Thay bằng tổng kết chương | `src/js/game.js:201` |
| “Sai lầm lịch sử”, “Bạn đã mắc…” | Thay toàn bộ lời đánh giá người chơi | `src/js/game.js:169`, `src/js/ui.js:151` |
| Token CSS | Giữ nguyên tắc token, đổi vai trò màu và bố cục | Các luật son/giấy/phòng tối cũ không ràng buộc bản mới |
| Landing GSAP, ảnh bay | Chỉ tái sử dụng khi còn phù hợp | Phụ thuộc ảnh chương I cũ; không để hiệu ứng quyết định cấu trúc game mới |
| Tài liệu Word/Markdown và ảnh gốc | Giữ nguyên | Không xóa/đổi tên/ghi đè tài liệu người dùng |

### Lưu phiên thực tế

- README còn nói localStorage sau mỗi tình huống, nhưng game hiện tại không lưu tiến độ.
- `src/js/game.js:4`, `:9`, `:240`: mỗi lượt mở khởi tạo lại từ chương đầu.
- `test/test-logic.cjs:84` cố ý yêu cầu không đụng localStorage. `history` hiện chỉ có scene/picks; `mistakes` dùng chỉ số mảng, chưa lưu đủ lựa chọn đầu và mọi lần thử.
- sessionStorage của landing chỉ dùng intro/âm/chuyển ảnh, không lưu kết quả chơi.
- V2 dùng schema phiên riêng trong sessionStorage như kế hoạch, không diễn giải kết quả cũ thành điểm mới. Cần thay assertion trái v2 khi thực hiện đợt engine; chưa thay trong đợt kiểm kê.

### Chạy và kiểm tra trên Windows

- Cách chạy đích: `npm start` qua HTTP; không dựa vào mở trực tiếp file vì landing dùng ES module.
- Node kiểm tra trong môi trường này là v22.21.0. Có Chrome/Edge tại đường dẫn Windows chuẩn.
- `node test/test-logic.cjs` đã chạy qua trong audit: PASS. Đây là DOM giả, không phải bằng chứng tương tác hình ảnh hoặc cảm ứng.
- Chưa chạy `npm test`: nhánh browser cần server và hardcode Chrome macOS (`test/check.cjs:6`, `:14`), chưa xử lý spawn phù hợp.
- Browser test hiện xóa toàn localStorage của origin và có thể đóng browser debug có sẵn (`:66`, `:143`). Đợt sau phải tạo phiên kiểm tra riêng và chỉ dọn thứ nó sở hữu.
- Screenshot trỏ vào `archive/` (`:113`) nhưng thư mục này không có ở checkout hiện tại. Cần đường output QA rõ ràng và tạo thư mục trước khi ghi.
- `vendor:gsap` dùng `cp` và brace expansion POSIX; cần script đa nền tảng nếu tiếp tục dùng trên Windows. GSAP đã có bản vendor cho landing; đợt 0 không cài lại thư viện.
- `.gitignore` hiện có `node_modules/`; không có vấn đề mất rule này ở trạng thái đã kiểm tra.

## 6. Tài liệu và công cụ bàn giao

| Đầu ra | Mục đích |
|---|---|
| `docs/content-matrix-v2.md` | Bản đọc dành cho nhóm: nhiệm vụ/thẻ, 72 cặp, lý do và các phương án hoàn thành |
| `docs/content-model-v2.json` | Hợp đồng nội dung có ID ổn định cho AI xây màn mẫu; chưa import vào game |
| `docs/content-drafts-v2/c1.json`, `c2.json`, `c3.json` | Bản biên tập theo chương; sửa tại đây rồi build lại model/ma trận |
| `docs/source-extracts-v2/` | Nội dung trích với số đoạn và ghi chú; phục vụ tra cứu nguồn |
| `tools/extract-docx-content-v2.ps1` | Tái tạo trích xuất và hash; không sửa Word |
| `tools/build-content-spec-v2.cjs` | Kiểm cấu trúc, định vị nguồn, gợi ý, nghiệm và bế tắc; sinh model/ma trận |

Lệnh kiểm tra tài liệu:

```text
node tools/build-content-spec-v2.cjs
node tools/build-content-spec-v2.cjs --check
```

Lệnh đầu ghi lại output sau khi đã kiểm dữ liệu; `--check` kiểm mà không ghi lại. Hai lệnh không khởi động hoặc sửa gameplay.

## 7. Mức độ sẵn sàng và công việc tiếp theo

**Sẵn sàng triển khai màn mẫu s02** theo dữ liệu mới. Nội dung đủ rõ cho hai ô, điểm và giải thích; không cần đợi xác minh các mốc đang loại khỏi gameplay để làm giao diện/engine.

Đợt tiếp theo cần tạo entry preview riêng, giữ game cũ chạy được trong lúc thử, và hoàn thiện một màn trên desktop/mobile trước. Mẫu phải có bốn thẻ, hai ô, kéo/chọn–đặt/bàn phím, chấm 10/5/0, khóa ô phù hợp, điều chỉnh, đọc giải thích và phản hồi cảnh có ý nghĩa.

Các tiêu chí bắt buộc của mẫu:

1. Người chơi biết mọi vùng nhận đều có thể nhận thẻ; vị trí được highlight không tiết lộ nội dung phù hợp.
2. Hoạt động triển khai làm cảnh thay đổi theo công việc, không chỉ đổi viền thẻ.
3. Hai nhiệm vụ rõ ngay trên màn; các điều kiện ảnh hưởng điểm không bị giấu hoàn toàn trong nút đọc thêm.
4. Lý do của từng cặp được lấy từ dữ liệu, không thay bằng một đoạn chung cho cả màn.
5. Một ô phù hợp và một ô điều chỉnh cho kết quả 15/20, đồng thời còn lịch sử lựa chọn ban đầu.
6. Có thể hoàn thành bằng chạm/chọn–đặt và bàn phím, không phải thu chữ quá nhỏ hoặc kéo thật chính xác.

Chưa có bằng chứng người chơi thật thấy matching thú vị. Sau bản mẫu phải quan sát thao tác và phản hồi của người thử; không dùng việc ma trận đầy đủ để thay cho kiểm chứng trải nghiệm.
