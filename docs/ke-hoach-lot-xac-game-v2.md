# Kế hoạch lột xác “Đường đến tháng Tám” — phiên bản 2

Ngày lập: 18/10/2026. Đây là đặc tả để giao cho AI triển khai; không phải báo cáo tính năng đã hoàn thành.

## 1. Mục tiêu và các quyết định đã chốt

Đổi trải nghiệm từ đọc nhiều, chọn hai thẻ rồi xem giải thích sang trò chơi kéo thả và ghép hoạt động với nhiệm vụ trong khung cảnh minh họa. Người chơi quan sát, bố trí, triển khai, nhìn kết quả và điều chỉnh. Kiến thức dài được mở theo nhu cầu.

Các yêu cầu bắt buộc:

1. Giữ tên game, chủ đề lịch sử 1930–1945 và ba chương.
2. Giữ chín tình huống làm khung nội dung; thay toàn bộ thao tác chọn hai trong ba thẻ của bản cũ.
3. Mỗi màn có hai nhiệm vụ nhận thẻ, bốn thẻ hoạt động; mỗi thẻ chỉ dùng tại một vị trí trong một lần bố trí.
4. Có kéo thả bằng chuột và cảm ứng. Có cách chọn thẻ rồi chọn nơi đặt, và điều khiển bằng bàn phím với kết quả tương đương.
5. Mỗi lượt ghép được đánh giá theo bối cảnh và nhiệm vụ cụ thể. Chấp nhận mọi phương án đã được xác định là hợp lý trong dữ liệu.
6. Có điểm, điều chỉnh, tổng kết và xem lại từng lựa chọn ban đầu chưa phù hợp.
7. Ngôn ngữ đánh giá người chơi: “Phù hợp”, “Chưa phù hợp trong bối cảnh này”, “Đã điều chỉnh phù hợp”, “Chưa hoàn thành”. Không gọi lựa chọn của người chơi là “sai”, “sai lầm lịch sử”, “thất bại”, “kém”.
8. Hình ảnh nhiều màu nhưng có phân cấp; mỗi biểu tượng, dấu chấm, đường nối và chuyển động đều có vai trò được mô tả.
9. Phần giải thích luôn truy cập được. Giảm chữ trên màn chơi không có nghĩa là giấu thông tin cần thiết để đưa ra quyết định.
10. Game hoàn thành được trên điện thoại, không đòi hỏi kéo chính xác, phản xạ nhanh hoặc đọc đoạn dài.

Mục tiêu thời lượng: khoảng 8–12 phút cho lượt đầu, chưa gồm đọc hồ sơ tự chọn. Đây là giả thuyết cần đo bằng chơi thử.

## 2. Hiện trạng đã đọc và giới hạn của bản kế hoạch

### 2.1. Cấu trúc đang có

- `index.html`: landing có intro và chuyển trang.
- `hanh-trinh.html`: trang game.
- `src/js/content.js`: chương, chín tình huống, hồ sơ và dữ liệu ảnh.
- `src/js/ui.js`: dựng giao diện, dải chỉ số, tiến trình, la bàn và các màn.
- `src/js/game.js`: trạng thái, thao tác chọn thẻ, chuyển màn và kết quả.
- `src/js/landing.js`: intro dùng GSAP và chuyển ảnh giữa hai trang.
- `src/css/tokens.css`, `base.css`, `components.css`, `acts.css`, `landing.css`, `flyer.css`.
- `assets/img/`, `vendor/gsap/`, `test/`, `archive/`, `docs/`.
- `package.json`: có GSAP; `npm test` hiện ghép kiểm tra logic và kiểm tra trình duyệt.

### 2.2. Những điều AI triển khai phải biết

- Repo đã thay đổi so với mô tả đầu cuộc trò chuyện. Không tạo lại các file `game.js`, `ui.js`, `content.js` ở thư mục gốc.
- README còn nói có lưu localStorage, nhưng code và kiểm tra hiện tại thể hiện lượt chơi không lưu localStorage. Không coi README là nguồn duy nhất về hành vi.
- Có ba file Word mới trong `docs/`: `GiaiDoan1930Den1935.docx`, `GiaiDoan1936Den1939.docx`, `GiaiDoan1939Den1945.docx`. Bản kế hoạch này mới ghi nhận sự hiện diện, chưa đọc hoặc xác minh nội dung của chúng.
- `docs/de-xuat-cau-hoi.md` thuộc thiết kế trắc nghiệm trước; không tự động đưa các câu đó vào v2.
- Một số ảnh đang thiếu nguồn/giấy phép; có ảnh năm 1945 làm mẫu chương 1930–1935. Không tiếp tục dùng ảnh lệch thời kỳ để minh họa sự kiện của chương khác.
- `test/check.cjs` đang có đường dẫn Chrome macOS cố định. Môi trường hiện tại là Windows; phải sửa phần phát hiện trình duyệt trước khi dùng nó làm bằng chứng nghiệm thu.
- Các file Word chưa được Git theo dõi là tài liệu của người dùng: giữ nguyên, không xóa, đổi tên hay ghi đè.

### 2.3. Phạm vi v2

Làm: landing đồng bộ, hướng dẫn bằng tương tác, 9 màn matching, phản hồi, tính điểm, tổng kết chương, tổng kết cuối, xem lại, luyện lại, hồ sơ, âm thanh tùy chọn, trải nghiệm mobile và bàn phím.

Chưa làm: tài khoản, backend, leaderboard online, nhiều người chơi, bản đồ địa lý chính xác, chiến thuật thời gian thực, đường đi nhân vật có AI, tài nguyên phức tạp, thay đổi kết quả lịch sử, phần thưởng may rủi.

Các nhân vật, đường nối và nhà in phản hồi kết quả ghép; không ngầm tạo thêm một hệ thống mô phỏng mà người chơi phải học nhưng không có luật rõ ràng.

## 3. Ý tưởng trải nghiệm và vòng chơi

Tên mô tả nội bộ: “Bàn điều phối lịch sử”. Người chơi tổ chức hoạt động trên một địa bàn minh họa giả định. Mỗi màn làm rõ một mối quan hệ lịch sử.

Vòng chơi:

1. Nhận bối cảnh rất ngắn và nhìn mục tiêu trên cảnh.
2. Quan sát bốn thẻ bằng hình ảnh và tên hoạt động.
3. Kéo hai thẻ vào hai vị trí; có thể đổi, lấy ra và sắp lại.
4. Bấm “Triển khai” để chấm cả hai vị trí.
5. Xem cảnh thay đổi ở vị trí phù hợp; vị trí cần điều chỉnh có phản hồi ngắn và nút “Vì sao?”.
6. Điều chỉnh phần chưa phù hợp, hoặc tiếp tục và để phần đó vào danh sách ôn lại.
7. Sang màn tiếp theo; kết quả đã chấm không bị viết lại.

Không chấm lúc thả. “Có thể đặt thẻ ở đây” là trạng thái thao tác, hoàn toàn khác “Thẻ này phù hợp về nội dung”.

Giá trị học tập cần tạo ra: hiểu hoạt động đáp ứng nhiệm vụ nào trong hoàn cảnh nào, thấy mối quan hệ giữa tổ chức, vận động, chuẩn bị và thời cơ. Matching tự nó không bảo đảm thú vị; phải kiểm chứng bằng chơi thử trước khi mở rộng toàn bộ.

## 4. Luật tương tác chính xác

### 4.1. Bố trí trước lần chấm đầu

- Có hai ô A, B và bốn thẻ. A/B là ID nội bộ; nhãn người chơi là nhiệm vụ thực tế.
- Một ô nhận một thẻ; một thẻ không xuất hiện đồng thời ở hai ô.
- Tất cả thẻ có thể được đặt vào mọi ô chưa khóa. Không chỉ làm sáng ô có đáp án phù hợp.
- Thả thẻ từ khay vào ô đã có thẻ: thẻ cũ trở về vị trí gốc trong khay.
- Chuyển thẻ từ ô này sang ô có thẻ khác: hoán đổi hai thẻ nếu cả hai ô đều chưa khóa.
- Thả ra ngoài vùng nhận: quay về vị trí trước khi kéo; không ghi lần thử, không trừ điểm.
- Có nút “Đưa về khay” khi chọn một thẻ đã đặt; không phụ thuộc thao tác kéo ngược.
- “Triển khai” chỉ bật khi cả hai ô có thẻ. Dòng hỗ trợ nêu rõ “Còn 1 nhiệm vụ cần bố trí”, thay vì nút mờ không rõ lý do.
- Có thể xem thông tin thẻ và bối cảnh trước khi chấm; không bị trừ điểm.
- Thứ tự bốn thẻ xáo trộn một lần khi khởi tạo màn trong lượt chơi. Giữ nguyên sau chấm, mở modal và tải lại.

### 4.2. Sau khi chấm

- Ô phù hợp được khóa, có nhãn trạng thái và điểm; thẻ tại đó không thể bị lấy ra để vô tình phá kết quả đã chốt.
- Ô chưa phù hợp giữ thẻ để người chơi thấy mình đã chọn gì, hiện phản hồi ngắn; ô này còn chỉnh được.
- Lần triển khai tiếp theo chỉ đánh giá các ô chưa giải quyết; không cộng lại điểm ở ô khóa.
- Không chấm lại nếu bố trí của các ô chưa giải quyết không thay đổi so với lần trước; hiển thị “Hãy điều chỉnh một lựa chọn trước khi triển khai lại”.
- Có thể tiếp tục sau ít nhất một lần triển khai, kể cả còn ô chưa phù hợp. Nút phụ ghi “Tiếp tục và ôn lại sau”; chỉ rõ số nhiệm vụ còn lại. Không ép người chơi đoán cho đến khi trúng.
- Nếu cả hai ô phù hợp thì nút chính đổi thành “Chặng tiếp theo”.
- Không bỏ qua màn chưa triển khai trong luồng thường. Thoát trang là dừng lượt chơi, không giả lập đã hoàn thành.

### 4.3. Luyện lại và lượt chơi mới

- “Luyện lại tình huống” từ tổng kết chạy trong chế độ practice, không thay điểm và lịch sử của lượt gốc.
- Hiện một nhãn ngắn “Luyện tập · không đổi điểm lượt trước”.
- Có thể ghi riêng `practiceCompleted` để đánh dấu đã ôn; bộ lọc “Cần ôn từ lượt đầu” vẫn giữ đúng lịch sử.
- “Chơi lượt mới” tạo runId mới, xóa trạng thái chơi dở của lượt mới sau thao tác xác nhận nếu đang có lượt chưa xong; không trộn điểm hai lượt.
- Không có bảng xếp hạng hoặc khẳng định điểm phản ánh mức độ yêu nước hay giá trị cá nhân.

## 5. Chấm điểm, thống kê và chống cộng trùng

### 5.1. Quy tắc

Mỗi ô nhiệm vụ là một lượt ghép độc lập:

| Trạng thái cuối của ô | Điều kiện | Điểm |
|---|---|---:|
| Phù hợp ngay | Lần triển khai đầu tiên của ô đã phù hợp | 10 |
| Đã điều chỉnh phù hợp | Lần đầu chưa phù hợp; một lần sau phù hợp | 5 |
| Chưa hoàn thành | Đã triển khai nhưng sang màn khi ô vẫn chưa phù hợp | 0 |

- 9 màn × 2 ô × 10 = 180 điểm tối đa.
- Giữ phân bố hiện tại: chương I có 2 màn = 40 điểm; chương II có 2 màn = 40 điểm; chương III có 5 màn = 100 điểm.
- Mỗi màn tối đa 20. Ví dụ lần đầu A phù hợp, B chưa phù hợp: 10; sửa B phù hợp: 15/20. Chấm thêm không thể thành 20.
- Không trừ điểm vì mở bối cảnh, đọc hồ sơ, thao tác kéo hụt, dùng bàn phím, âm thanh tắt hoặc chơi chậm.
- Không có điểm âm, điểm tốc độ, streak hoặc combo trong v2.
- Sau khi hiện đáp án qua “Vì sao?”, nếu người chơi sửa phù hợp thì vẫn đạt 5; điểm biểu thị hoàn thành sau phản hồi, không khẳng định đã tự tìm ra mà không được hỗ trợ.

### 5.2. Cách tính

Nguồn sự thật là kết quả từng ô. Tổng điểm là tổng được suy ra từ kết quả, không dùng `score += ...` ở mỗi lần click.

```text
points(slot) = 10 nếu firstOutcome là suitable
            =  5 nếu firstOutcome là needs-review và finalOutcome là suitable
            =  0 trong các trường hợp còn lại
totalScore = tổng points của 18 ô
```

Khi đang chơi, hiển thị “Điểm: 25” và “Chặng 3/9”; tổng tối đa và cách tính mở bằng nút “Cách tính điểm”. Khi kết thúc hiển thị “145/180 điểm”. Không trình bày như điểm số đang bị mất vì chưa chơi những màn sau.

### 5.3. Các tổng phải nhất quán

- `firstSuitableCount + correctedCount + unresolvedCount = 18` sau khi hoàn thành chín màn.
- `totalScore = firstSuitableCount * 10 + correctedCount * 5`.
- Ví dụ hợp lệ: 12 phù hợp ngay, 5 đã điều chỉnh, 1 chưa hoàn thành → 145/180.
- “Cần ôn từ lượt đầu” = 5 + 1 = 6 trong ví dụ này, không chỉ hiển thị 1 ô còn bỏ ngỏ.
- Chương có số màn khác nhau: dùng x/y điểm hoặc tỷ lệ có mẫu số, không so sánh bằng chiều dài cột điểm thô.

## 6. Hệ thống nội dung và sự công bằng của matching

### 6.1. Quy tắc biên soạn

- Viết nhiệm vụ đủ cụ thể để có thể đánh giá. “Phát triển cách mạng” quá rộng; “Khôi phục các đầu mối liên lạc” cụ thể hơn.
- Đánh giá cặp `sceneId + targetId + cardId`, không đánh dấu cả thẻ là tốt/xấu trong mọi hoàn cảnh.
- Phân biệt: chưa đáp ứng trực tiếp nhiệm vụ, chưa phù hợp thời điểm, thiếu điều kiện, nhầm loại yếu tố, hoặc phạm vi quá rộng.
- Một hoạt động có giá trị nhưng không đáp ứng ô đang hỏi phải được giải thích theo giới hạn ấy; không hạ thấp ý nghĩa lịch sử của hoạt động.
- Nếu nguồn cho phép nhiều cách hợp lý, thêm tất cả vào danh sách chấp nhận. Nếu không thể phân biệt rõ, viết lại nhiệm vụ hoặc thẻ; không ép một đáp án cho dễ code.
- Không chọn thẻ gây nhiễu vô lý chỉ để người chơi loại ngay, hoặc cố tạo nhầm lẫn bằng câu chữ đánh đố.
- Không dùng biểu tượng, màu thẻ, đường viền, độ dài tên hoặc thứ tự để mã hóa đáp án.
- Tư liệu dài có thể nhắc đúng thuật ngữ lịch sử; quy tắc không gọi “sai” áp dụng lời đánh giá người chơi, không bóp méo trích dẫn lịch sử trong hồ sơ.

### 6.2. Nguồn và quy trình kiểm tra nội dung

1. Đọc ba tài liệu Word, `docs/noi-dung-goc.md` và dữ liệu hiện tại. Ghi nơi xuất hiện thông tin theo file, tiêu đề mục, đoạn hoặc trang thật nếu xác định được.
2. Không tự bịa số trang. Không coi code cũ là chứng cứ lịch sử độc lập.
3. Tạo `docs/content-matrix-v2.md`: 9 màn × 2 ô × 4 thẻ = 72 cặp cần được đánh giá và có lý do.
4. Mỗi cặp có: phù hợp/chưa phù hợp, giải thích ngắn, giải thích sâu, căn cứ nguồn, mức độ đã kiểm chứng.
5. Các thông tin mâu thuẫn phải có ghi chú cụ thể trong `docs/content-review-v2.md`; ưu tiên viết lại màn chỉ dựa trên điều chắc chắn hơn.
6. Trong lúc chờ giải quyết nội dung, AI vẫn dựng engine, giao diện và bản mẫu với nhãn draft trong dữ liệu; không giả vờ đã kiểm chứng.
7. Trước dùng chính thức: tất cả 72 cặp và các giải thích phải có căn cứ hoặc đã được viết lại để tránh kết luận không chứng minh được. Người phụ trách môn học của nhóm duyệt nội dung cuối.

### 6.3. Khung chín màn — bản thiết kế nội dung để biên tập

Các thẻ dưới đây là bản đề xuất dựa trên khung hiện có, chưa thay cho ma trận kiểm chứng 72 cặp. Không đưa thẳng vào sản phẩm với nhãn đã xác minh. Tên thẻ và nhiệm vụ có thể sửa sau đối chiếu nguồn, nhưng giữ mục tiêu học tập và hợp đồng gameplay.

#### Màn 01 — Những điểm đầu tiên | 1930–1931

- Bối cảnh ngắn: “Các cuộc đấu tranh cần được kết nối và tổ chức.”
- Cảnh: khu công nhân, làng và một điểm tổ chức; tuyến quan hệ chỉ xuất hiện khi có kết quả.
- Ô A: “Kết nối công–nông”. Ô B: “Phối hợp hoạt động”.
- Thẻ đề xuất: Liên hệ công–nông; Xây dựng đầu mối; Hỗ trợ đời sống; Chuẩn bị khởi nghĩa toàn quốc.
- Cặp dự kiến: A ← Liên hệ công–nông; B ← Xây dựng đầu mối.
- Điểm cần biên tập: Hỗ trợ đời sống có thể góp phần tập hợp lực lượng, không được phủ nhận. Nếu nhiệm vụ A vẫn đủ rộng để chấp nhận thẻ này, chấp nhận thêm hoặc làm rõ hoạt động cần thực hiện.
- Kết quả thị giác: các nhóm người nối với nhau; đầu mối bắt đầu chuyển thông tin. Không hiện chiến thắng lịch sử giả định.
- Thông điệp sau màn: tổ chức giúp các hoạt động phối hợp với nhau.

#### Màn 02 — Giữ mạch nối | 1932–1935

- Bối cảnh: “Nhiều cơ sở bị phá vỡ, liên lạc bị gián đoạn.”
- Ô A: “Nối lại đầu mối”. Ô B: “Bồi dưỡng cán bộ”.
- Thẻ: Khôi phục liên lạc; Duy trì học tập; Vận động quần chúng; Mở rộng báo chí công khai.
- Cặp dự kiến: A ← Khôi phục liên lạc; B ← Duy trì học tập.
- Giải thích cần có: vận động quần chúng có ý nghĩa nhưng không trực tiếp thay công việc nối liên lạc hoặc bồi dưỡng đang được hỏi. Báo chí công khai cần được đặt trong điều kiện hoạt động cụ thể; không nói cả giai đoạn tuyệt đối không có hình thức công khai nào.
- Kết quả: những đoạn liên lạc đứt được nối; điểm học tập chuyển sang có người sinh hoạt.
- Đây là màn dựng mẫu đầu tiên vì có quan hệ nhiệm vụ–hoạt động và phản hồi hình ảnh rõ.

#### Màn 03 — Một cánh cửa mở | 1936

- Bối cảnh: “Điều kiện mở rộng hoạt động công khai thuận lợi hơn.”
- Ô A: “Tập hợp nguyện vọng”. Ô B: “Lan truyền thông tin”.
- Thẻ: Thu thập dân nguyện; Báo chí công khai; Duy trì cơ sở bí mật; Tổ chức lực lượng vũ trang.
- Cặp dự kiến: A ← Thu thập dân nguyện; B ← Báo chí công khai.
- Điểm cần giải thích: cơ sở bí mật hỗ trợ phong trào nhưng không trực tiếp thay hai nhiệm vụ ở màn. Tránh ngụ ý hoạt động công khai đã thay hoàn toàn hoạt động bí mật.
- Kết quả: các tờ dân nguyện hội tụ; bản tin đi đến nhiều nhóm người.

#### Màn 04 — Mở rộng sự tham gia | 1937–1939

- Bối cảnh: “Phong trào mở rộng qua nhiều hình thức vận động.”
- Ô A: “Kết nối nhiều tầng lớp”. Ô B: “Mở rộng việc học chữ”.
- Thẻ: Các hội quần chúng; Hoạt động truyền bá chữ; Củng cố liên lạc nội bộ; Chuẩn bị khởi nghĩa toàn quốc.
- Cặp dự kiến: A ← Các hội quần chúng; B ← Hoạt động truyền bá chữ.
- Điểm cần kiểm tra: nguồn về hoạt động truyền bá chữ, tránh bổ sung mốc năm đang nghi vấn trong README.
- Kết quả: nhóm người đa dạng tham gia; lớp học có hoạt động. Tránh dùng trang phục hoặc icon khuôn mẫu gây hiểu nhầm tầng lớp.

#### Màn 05 — Nhiệm vụ cấp thiết | 1939–1941

- Bối cảnh: “Hoàn cảnh chiến tranh làm nhiệm vụ dân tộc thêm cấp thiết.”
- Ô A: “Tập hợp lực lượng cứu quốc”. Ô B: “Giữ mạng lưới hoạt động”.
- Thẻ: Tập hợp cứu quốc; Chuyển hoạt động bí mật; Duy trì nguyên cách công khai; Tổng khởi nghĩa ngay.
- Cặp dự kiến: A ← Tập hợp cứu quốc; B ← Chuyển hoạt động bí mật.
- Giải thích: phương pháp cần thích ứng hoàn cảnh; hành động tổng khởi nghĩa cần chuẩn bị và điều kiện thích hợp. Tránh thể hiện chuyển hướng là một quyết định duy nhất xảy ra tức thời.
- Kết quả: các nhóm kết nối với điểm cứu quốc; tuyến liên lạc chuyển sang ký hiệu hoạt động bí mật, có nhãn để người chơi hiểu.

#### Màn 06 — Chuẩn bị bền bỉ | 1941–1944

- Bối cảnh: “Lực lượng và căn cứ cần được chuẩn bị đồng bộ.”
- Ô A: “Phát triển lực lượng chính trị”. Ô B: “Củng cố địa bàn hoạt động”.
- Thẻ: Phát triển hội cứu quốc; Xây dựng căn cứ; Xây dựng lực lượng vũ trang; Chờ biến chuyển quốc tế.
- Cặp dự kiến: A ← Phát triển hội cứu quốc; B ← Xây dựng căn cứ.
- Giải thích bắt buộc: xây dựng lực lượng vũ trang là thành phần quan trọng của chuẩn bị, nhưng không thay trực tiếp việc xây lực lượng chính trị/căn cứ đang hỏi. Cảnh có thể cho thấy lực lượng vũ trang là nền cảnh được chú thích trong hồ sơ, không dùng làm thẻ “xấu”.
- Kết quả: nhóm quần chúng và địa bàn hoạt động được bổ sung. Không tạo ấn tượng hai ô là toàn bộ sự chuẩn bị lịch sử.

#### Màn 07 — Chuẩn bị trực tiếp | Tháng 3–7/1945

- Bối cảnh: “Khủng hoảng xuất hiện, cần thúc đẩy cao trào kháng Nhật.”
- Ô A: “Gắn cứu đói với đấu tranh”. Ô B: “Hành động nơi có điều kiện”.
- Thẻ: Phá kho thóc cứu đói; Khởi nghĩa từng phần; Tổng khởi nghĩa đồng loạt ngay; Chỉ chờ tình hình quốc tế.
- Cặp dự kiến: A ← Phá kho thóc cứu đói; B ← Khởi nghĩa từng phần.
- Giải thích: phân biệt hoạt động từng phần với tổng khởi nghĩa; không xem biến cố đơn lẻ là đủ điều kiện cho mọi nơi.
- Kết quả: lương thực đến các hộ dân bằng biểu tượng trung tính; các điểm hoạt động sáng lên. Không dùng hình ảnh đau khổ làm phần thưởng hoặc cảnh trang trí.

#### Màn 08 — Hai điều kiện cùng hội tụ | Tháng 8/1945

- Bối cảnh: “Thời cơ cần được kết hợp với sự chuẩn bị trong nước.”
- Ô A: “Điều kiện khách quan”. Ô B: “Sự chuẩn bị chủ quan”.
- Thẻ: Nhật đầu hàng Đồng minh; Tổ chức và lực lượng sẵn sàng; Chỉ cần Nhật đầu hàng; Chờ mọi điều kiện hoàn hảo.
- Cặp dự kiến: A ← Nhật đầu hàng Đồng minh; B ← Tổ chức và lực lượng sẵn sàng.
- Giải thích bắt buộc: thẻ “Chỉ cần…” là nhận định về tính đủ của điều kiện, khác thẻ nêu sự kiện. Nếu người chơi khó nhận ra do cách viết thì sửa copy, không dùng sự giống nhau này làm bẫy đọc chữ.
- Kết quả: hai phần điều kiện hội tụ, kế hoạch chuyển sang sẵn sàng. Không biến đây thành đồng hồ đếm ngược hoặc bài kiểm tra tốc độ.

#### Màn 09 — Phối hợp hành động | Tháng 8–9/1945

- Bối cảnh: “Hoạt động cần được phối hợp tập trung và kịp thời.”
- Ô A: “Thống nhất hành động”. Ô B: “Phát huy lực lượng quần chúng”.
- Thẻ: Truyền đạt và phối hợp; Huy động quần chúng; Lực lượng vũ trang hỗ trợ; Mỗi nơi tự chọn thời điểm.
- Cặp dự kiến: A ← Truyền đạt và phối hợp; B ← Huy động quần chúng.
- Giải thích: vai trò hỗ trợ của lực lượng vũ trang không bị phủ nhận; nhưng không thay việc huy động lực lượng quần chúng mà ô B yêu cầu.
- Kết quả: các nhóm đã hiện diện ở cảnh phối hợp hoạt động. Kết thúc lịch sử được trình bày đúng nguồn, không tùy theo điểm của người chơi.

### 6.4. Kiểm tra tính giải được

Với mỗi màn, tìm tất cả phép gán hai thẻ khác nhau vào hai ô. Ít nhất phải có một phép gán mà cả hai cặp đều phù hợp.

Nếu hỗ trợ nhiều đáp án, phải kiểm tra thêm: mọi thẻ phù hợp bị khóa tại một ô đều để lại ít nhất một thẻ khác phù hợp cho ô còn lại. Nếu không, thay ma trận/thẻ trước khi phát hành; không để lựa chọn đã được chấm phù hợp làm màn còn lại không thể giải.

Không chỉ kiểm tra `acceptedCardIds` riêng rẽ rồi bỏ qua ràng buộc một thẻ dùng một lần.

## 7. Phản hồi và giải thích

### 7.1. Ba lớp thông tin

1. Trên cảnh: trạng thái + một câu lý do ngắn, không che nơi vừa thả.
2. Nút “Vì sao?”: bảng giải thích 60–100 từ mục tiêu, có thể dài hơn khi cần diễn đạt chính xác.
3. “Đọc tư liệu”: mở hồ sơ liên quan và nguồn, không làm mất bố trí.

Phản hồi phù hợp cũng có lý do, giúp người chơi hiểu quan hệ thay vì chỉ săn điểm.

### 7.2. Cấu trúc giải thích cho cặp chưa phù hợp

- Bối cảnh đang xét.
- Nhiệm vụ của ô.
- Bạn đã đặt thẻ gì.
- Vì sao thẻ đó chưa đáp ứng nhiệm vụ/điều kiện.
- Một hoặc nhiều cách phù hợp hơn, kèm lý do.
- Nguồn nội dung mở theo yêu cầu.

Ví dụ copy dự thảo:

> Chưa phù hợp với nhiệm vụ này. Vận động quần chúng góp phần gây dựng phong trào, nhưng ô này yêu cầu nối lại các đầu mối liên lạc đang bị gián đoạn. “Khôi phục liên lạc” đáp ứng trực tiếp nhiệm vụ đó.

Không sinh giải thích bằng cách nối tên thẻ vào một câu chung. Không dùng lời giải thiếu căn cứ như “Vì lịch sử chọn khác”.

### 7.3. Trạng thái âm thanh và hình ảnh

- Phù hợp: dấu kiểm có nhãn, màu trạng thái, chuyển động hoạt động liên quan, một âm báo nhẹ nếu bật âm.
- Chưa phù hợp: dấu hỏi trong hình tròn có nhãn, màu hổ phách, không rung màn hình hoặc còi báo lỗi.
- Đã điều chỉnh: có nhãn riêng, điểm 5, không giả thành “phù hợp ngay”.
- Âm thanh không phải cách duy nhất truyền tải kết quả. Không tự bật nhạc hoặc âm khi tải trang.

## 8. Các màn hình và luồng điều hướng

### 8.1. Landing

- Tên game, một câu hứa hẹn trải nghiệm, cảnh minh họa đại diện.
- CTA chính “Bắt đầu hành trình”; nếu có lượt trong phiên: “Tiếp tục hành trình”.
- CTA phụ “Cách chơi”; “Hồ sơ lịch sử” ở vị trí dễ tìm nhưng không tranh sự chú ý.
- Giới thiệu “3 chương · 9 chặng”; chỉ hiển thị thời lượng như ước tính nếu chưa đo.
- Intro ngắn, có thể bỏ qua, không khóa CTA chờ animation. Kiểm tra animation ảnh bay cũ, giữ chỉ khi còn phù hợp bố cục mới.
- Landing và game dùng cùng hệ màu, kiểu icon và hình minh họa.

### 8.2. Hướng dẫn lần đầu

- Một thao tác mẫu không tính điểm, có thể bỏ qua; không tự lộ đáp án màn được chấm.
- Hướng dẫn “Kéo thẻ đến vị trí có viền”; sau khi đặt, giới thiệu “Triển khai”.
- Thẻ mẫu dùng nhiệm vụ trung tính như “Đưa tư liệu vào tủ hồ sơ”, tách khỏi 18 ô có điểm.
- Hiện cách thay thế: “Bạn cũng có thể chọn thẻ rồi chọn nơi đặt”.
- Có nút “Cách chơi” để xem lại bất kỳ lúc nào.

### 8.3. Mở chương

- Tên chương, giai đoạn, một câu mục tiêu, cảnh đại diện.
- Không bắt đọc đoạn giới thiệu dài hoặc trả lời câu hỏi mới để tiếp tục.
- Chuyển tiếp cuối chương chỉ gồm điểm chương, một câu rút ra và nút tiếp tục/xem lại. Bỏ checkpoint trắc nghiệm cũ.

### 8.4. Màn chơi desktop

```text
[Tên game]              [Cách chơi] [Hồ sơ] [Âm thanh]
Chương / giai đoạn              Chặng 3/9 · Điểm: 25
Một câu bối cảnh                              [Tìm hiểu]
┌────────────────────────────────────────────────────┐
│ Khung cảnh minh họa                                 │
│   [Nhiệm vụ A / vùng thả]  [Nhiệm vụ B / vùng thả]    │
│   Phản hồi gắn với nơi vừa đặt thẻ                   │
└────────────────────────────────────────────────────┘
[Thẻ 1]          [Thẻ 2]          [Thẻ 3]          [Thẻ 4]
Bố trí 2/2                                    [Triển khai]
```

- Một điểm tập trung chính là cảnh và vùng thả; điểm số không lớn hơn nhiệm vụ.
- Không giữ đồng thời dải bốn chỉ số cũ, la bàn thời cơ, thanh áp lực và điểm mới. Các hệ cũ không còn luật chơi thì gỡ khỏi giao diện mới.
- Không lặp ba thanh tiến độ truyền cùng thông tin. Chọn một dòng “Chặng x/9”; tiến trình chi tiết mở khi cần.

### 8.5. Màn chơi mobile

- Cảnh giữ hai vùng thả đủ lớn, các chi tiết nền giảm bớt; khay thẻ 2×2.
- Cho phép cuộn dọc tự nhiên. Không ép mọi thứ vào một màn hình bằng chữ nhỏ.
- Vùng hành động cuối màn có thể sticky nhưng không che thẻ, phản hồi, bàn phím hoặc safe area.
- Nếu người chơi khó kéo vì màn hình thấp, chọn thẻ rồi chọn ô phải hoàn thành được toàn bộ màn.
- Nội dung dài mở thành bottom sheet/dialog có vùng cuộn riêng, nút đóng rõ.

### 8.6. Tổng kết cuối

- Tiêu đề trung tính: “Hành trình của bạn”.
- Điểm tổng x/180, số phù hợp ngay/đã điều chỉnh/chưa hoàn thành.
- Ba chương có điểm x/y và số nội dung cần ôn.
- CTA chính khi còn nội dung cần ôn: “Xem lựa chọn cần ôn lại”. Khi tất cả phù hợp ngay: “Xem lại hành trình”.
- CTA phụ: “Chơi lượt mới”, “Đọc hồ sơ”.
- Một phần lịch sử kết thúc ngắn; chi tiết các mốc/ý nghĩa nằm trong hồ sơ. Không biến màn tổng kết thành trang giáo trình mới.
- Không dùng bảng sao hoặc huy chương nếu chưa có quy tắc và ý nghĩa rõ. V2 ưu tiên điểm và phản hồi đủ minh bạch.

### 8.7. Xem lại

- Bộ lọc: “Cần ôn từ lượt đầu”, “Chưa hoàn thành”, “Tất cả”. Có số lượng thật.
- Mỗi mục gồm chương/màn, nhiệm vụ, thẻ ban đầu, trạng thái cuối, điểm; bấm mở lý do và cách phù hợp hơn.
- Nếu thử nhiều lần, mặc định hiện lần đầu và lần cuối; nút “Xem các lần thử” cho toàn bộ lịch sử.
- Phải dùng đúng giải thích của cặp người chơi đã chọn, không thay bằng lời giải của một cặp khác cùng màn.
- “Luyện lại tình huống” và “Đọc tư liệu” mở đúng màn/hồ sơ; quay về giữ bộ lọc và vị trí đọc.
- Trường hợp không có mục cần ôn: thông báo tích cực ngắn và nút xem toàn bộ, không để bảng trống khó hiểu.

## 9. Art direction và hệ thống thiết kế

### 9.1. Hướng thị giác

“Bản đồ mô hình giấy nhiều lớp”: minh họa 2D nhìn chéo nhẹ, giấy sáng, màu đất nung, xanh ngọc, xanh lá và vàng ấm. Vật thể có khối đơn giản, nét rõ, mức chi tiết đồng đều.

- Cảnh là sơ đồ địa bàn giả định, không tự xưng bản đồ lịch sử/địa lý chính xác. Ghi ngắn trong cách chơi và thông tin cảnh; không cần watermark dày đặc.
- Dùng SVG cho sơ đồ, tuyến và icon; dùng ảnh minh họa nền khi thật sự cần. Vùng tương tác và chữ là DOM thật, không in vào bitmap.
- Ảnh tư liệu là một lớp nội dung riêng với nguồn/chú thích. Không đưa ảnh minh họa vào khung “Ảnh tư liệu”.
- Quy định tài liệu hiện có về ảnh tư liệu vẫn áp dụng cho ảnh tư liệu; minh họa gameplay mới phải được gọi đúng là minh họa và có nguồn gốc tài sản được ghi lại.
- Không kéo toàn bộ game vào sepia. Chất giấy là nền phụ, không giảm tương phản hoặc phủ nhiễu lên chữ.

### 9.2. Token đề xuất ban đầu

Các màu sau là điểm khởi đầu để dựng mẫu, chưa phải chứng nhận đạt độ tương phản:

| Vai trò | Giá trị khởi đầu | Cách dùng |
|---|---|---|
| Nền chung | `#F5F1E7` | Không gian ngoài bàn chơi |
| Bề mặt thẻ | `#FFFDF7` | Thẻ, panel, vùng đọc |
| Chữ chính | `#263731` | Nhãn và nội dung |
| Chữ phụ | `#53635D` | Thông tin hỗ trợ |
| Hành động chính | `#A63D32` | CTA, không dùng như màu báo lỗi |
| Focus/thao tác | `#245E96` | Focus bàn phím, trạng thái đang chọn |
| Phù hợp | `#21644C` | Trạng thái, luôn có icon và nhãn |
| Cần xem lại | `#8A570F` | Trạng thái hổ phách, luôn có nhãn |
| Màu cảnh | Các sắc xanh/vàng/đất nung nhẹ | Theo vật thể, không mã hóa đáp án |

- Giới hạn hai font cho UI mới: Be Vietnam Pro cho thao tác/nội dung; Newsreader cho tiêu đề lớn. Số điểm ưu tiên tabular numerals; không cần font thứ ba chỉ để trang trí.
- Chữ nội dung mục tiêu 16px; nhãn phụ thường không dưới 14px. Tránh chữ in hoa dài và tracking rộng trên tiếng Việt.
- Nhịp khoảng cách 4/8/12/16/24/32/48px, khai báo trong tokens.
- Bo góc thẻ khoảng 12px, panel khoảng 16px; không làm mọi vật thể thành pill.
- Đổ bóng biểu thị độ nổi và trạng thái đang cầm, không phủ glow lên mọi nút.
- Các component dùng token theo vai trò, không rải mã màu cứng hoặc thêm lớp CSS override thứ ba.

### 9.3. Danh mục tài sản cần làm

- 3 bộ cảnh nền theo ba chương, phối lại thành 9 bố cục; mỗi màn có ít nhất một thay đổi trực quan gắn với nhiệm vụ.
- Bộ icon thao tác: thông tin, âm thanh bật/tắt, đóng, quay lại, mở giải thích, đặt lại, phù hợp, cần xem lại.
- Bộ vật thể: khu công nhân, làng, nhà in, điểm liên lạc, điểm học tập, điểm tập hợp, căn cứ, kho lương thực; chỉ làm vật thể được dùng trong màn đã duyệt.
- Minh họa thẻ theo nhóm hành động; có thể dùng lại cùng biểu tượng cho cùng ý nghĩa, không đổi hình tùy tiện giữa màn.
- 2–3 biến thể nhóm người cần cho cảnh, mức cách điệu phù hợp; không tạo nhân vật có tiểu sử lịch sử hư cấu.
- Hiệu ứng kết quả: nối liên lạc, truyền thông tin, tập hợp người, hoàn thiện kế hoạch.
- `docs/asset-manifest-v2.md`: đường dẫn, nơi dùng, mục đích, alt/caption, nguồn gốc, giấy phép khi áp dụng.

## 10. Kiểm kê ý nghĩa của mọi chi tiết UI

AI phải tạo `docs/ui-semantics-v2.md` với bảng `thành phần → ý nghĩa → trạng thái → hành vi → cách tiếp cận`. Không dùng lý do “cho đẹp” để biện minh cho chi tiết gây nhiễu.

| Chi tiết | Ý nghĩa bắt buộc | Điều tránh |
|---|---|---|
| Viền vùng nhận | Nơi có thể đặt thẻ | Không làm sáng riêng đáp án phù hợp |
| Thẻ nâng lên | Đang cầm/chọn để đặt | Không dùng cùng hiệu ứng cho kết quả |
| Đường nối | Quan hệ/liên lạc giữa các điểm | Không vẽ đường ngẫu nhiên như dữ liệu thật |
| Chấm chạy trên đường | Thông tin đang được truyền sau triển khai | Không chạy liên tục chỉ để làm nền sống động |
| Dấu kiểm và nhãn | Cặp đã được đánh giá phù hợp | Không xuất hiện trước chấm |
| Dấu hỏi và nhãn | Cần xem lại lựa chọn | Không dùng dấu X đỏ mang tính phán xét |
| Số điểm tăng | Điểm mới được chốt | Không bay nhiều con số không truy nguyên được |
| Texture giấy | Vật liệu và bối cảnh | Không phủ lên chữ hoặc giả thành dấu trạng thái |
| Icon âm thanh | Trạng thái âm hiện tại và nút đổi | Không chỉ biểu thị khả năng có âm |
| Mũi tên CTA | Có bước tiếp theo | Không thêm vào mọi dòng chữ |

Cho phép yếu tố phục vụ cảm xúc/bối cảnh thay vì thao tác, nhưng phải có vai trò cụ thể, không giống nút bấm hoặc trạng thái. Các icon có chức năng đều có accessible name; phần thuần nền không bị đọc bởi screen reader.

Nếu giữ chấm tiến trình, mỗi chấm phải tương ứng một màn, có nhãn trạng thái và khả năng xem thông tin; nếu dòng “Chặng x/9” đã đủ, bỏ chấm. Không buộc thêm chấm để chứng minh yêu cầu của người dùng.

## 11. Chuyển động, âm thanh và chất lượng tương tác

- Nhấc thẻ: khoảng 120–180ms; đáp xuống: 160–220ms; chuyển trạng thái: 180–300ms; diễn biến kết quả: tối đa khoảng 600–900ms.
- Dùng transform/opacity cho chuyển động chủ đạo. Không gắn tính điểm hay điều hướng bắt buộc vào `animationend`.
- Người chơi luôn có thể tiếp tục sau khi trạng thái logic đã chốt; animation có thể được rút ngắn hoặc hủy an toàn.
- Không lắc thẻ, rung cả màn, confetti mỗi lượt, đồng hồ giả, la bàn xoay không có dữ liệu hoặc nhân vật đi vô mục đích.
- `prefers-reduced-motion`: thay diễn biến bằng trạng thái cuối và fade ngắn hoặc tức thì; không mất thông tin.
- Âm mặc định tắt; bật bằng thao tác người dùng. Trạng thái âm đồng bộ landing/game trong phiên.
- Âm đặt thẻ, triển khai và kết quả có ý nghĩa khác nhau nhưng nhỏ, ngắn; không tạo âm báo lỗi gây áp lực.
- Hiệu ứng phải hủy khi đổi màn/đóng game, không chạy chồng hoặc tiếp tục phát âm sau khi tắt.

## 12. Khả năng truy cập và responsive

- Mục tiêu thiết kế tương phản: chữ thường ít nhất 4.5:1, chữ lớn và ranh giới điều khiển quan trọng ít nhất 3:1. Đo thực tế từng cặp màu; đây là tiêu chí dự án, không tự gắn nhãn đạt chuẩn toàn bộ chỉ vì qua vài phép đo.
- Vùng bấm tối thiểu mục tiêu 44×44 CSS px; vùng thả trên mobile lớn hơn thẻ icon và dễ nhận biết.
- Bàn phím: Tab tới thẻ → Enter/Space chọn → Tab tới ô → Enter/Space đặt; Escape hủy chọn. Có nút đưa về khay cho thẻ đã đặt.
- Thao tác click/chạm để chọn rồi đặt là chức năng chính thức, không chỉ là chế độ debug.
- Dùng button/heading/dialog đúng vai trò. Cảnh SVG nền không thay thế các button/thẻ tương tác trong DOM.
- Announce ngắn bằng `aria-live`: tên thẻ đã đặt, ô nhận, kết quả và điểm. Không đọc lại cả màn sau mỗi render.
- Dialog: focus vào tiêu đề/nút phù hợp, trap focus, Escape đóng, trả focus về nút mở; không mở nhiều modal chồng nhau.
- Thẻ có nút thông tin không được tạo button lồng button. Nút thông tin không kích hoạt kéo/chọn thẻ.
- Không dùng `touch-action: none` trên toàn trang. Chỉ giới hạn ở vùng kéo thực tế; bảo toàn cuộn và phóng to.
- Khi pointer bị hủy, người dùng cuộn, đổi kích thước hay chuyển tab giữa lúc kéo: phục hồi bố trí trước kéo, không chấm hay mất thẻ.
- Không tràn ngang tại 360, 390, 768, 1280, 1440px; kiểm tra zoom 200%, màn hình thấp và landscape.
- Nút sticky không che nội dung; xét safe-area trên thiết bị di động.

## 13. Kiến trúc triển khai đề xuất

### 13.1. Giữ nền tảng gọn

Giữ HTML/CSS/JavaScript thuần và server tĩnh hiện tại. GSAP đã có, dùng khi thực sự giúp chuyển động; không cài framework/engine kéo thả chỉ để làm hai ô nhận thẻ. Đích chạy chính thức là `npm start` qua HTTP; sửa README để không hứa mở trực tiếp file nếu module/asset cần HTTP.

Giữ hai URL chính. Có thể chuyển game sang ES modules để tách trách nhiệm; khi làm phải cập nhật script, test và tài liệu trong cùng giai đoạn. Không để vừa global cũ vừa module mới cùng xử lý một nút.

### 13.2. Cấu trúc đích

```text
index.html
hanh-trinh.html
src/js/
  content.js                 # dữ liệu màn, chương, hồ sơ v2
  game.js                    # khởi động và điều phối luồng
  ui.js                      # dựng màn và component
  landing.js                 # landing thích ứng thiết kế mới
  core/
    matching.js              # đánh giá cặp và kiểm tra phép gán
    scoring.js               # điểm suy ra từ kết quả
    state.js                 # trạng thái và chuyển trạng thái
    session.js               # lưu/đọc phiên, validate schema
  interactions/
    placement.js             # lệnh đặt/đổi/trả thẻ dùng chung
    drag-drop.js             # pointer chỉ gọi lệnh placement
    keyboard.js              # bàn phím gọi cùng lệnh
  views/
    scene.js                 # cảnh, vùng nhận, khay
    feedback.js              # phản hồi và bảng giải thích
    results.js               # tổng kết và xem lại
  motion.js                  # hiệu ứng có thể hủy
  audio.js                   # âm thanh tùy chọn
src/css/
  tokens.css
  base.css
  components.css
  game.css
  results.css
  landing.css
assets/
  scenes/                    # minh họa gameplay
  icons/
  audio/                     # chỉ tạo nếu có âm dạng file
  img/                       # ảnh tư liệu đã có
test/
  content-validation.cjs
  matching.test.cjs
  scoring.test.cjs
  session.test.cjs
  check.cjs
docs/
  content-matrix-v2.md
  content-review-v2.md
  ui-semantics-v2.md
  asset-manifest-v2.md
  qa-v2.md
```

Có thể gộp module nhỏ nếu ranh giới vẫn rõ. Không tạo cấu trúc này bằng loạt file rỗng rồi tuyên bố đã triển khai. Xóa import cũ trước khi gỡ CSS/code không dùng; không xóa `archive/` hoặc tài liệu người dùng.

### 13.3. Pointer và tọa độ

- Pointer Events cho mouse/touch/pen; capture pointer khi bắt đầu kéo thật, không ngay khi bấm nút thông tin.
- Phân biệt click và kéo bằng ngưỡng chuyển động; kiểm tra bằng thao tác thật để không vô tình bắt scroll trên mobile.
- Ghost kéo dùng tọa độ viewport và `pointer-events: none`; hit-test các ô theo cùng hệ tọa độ, cập nhật sau scroll/resize.
- Preview vùng nhận chỉ dựa vào có nhận được thẻ về mặt thao tác; không gọi hàm chấm nội dung.
- Mọi đường tương tác gọi cùng `placeCard(cardId, targetId)` và `returnCard(cardId)`, không có ba bản logic cho chuột/chạm/bàn phím.
- Khi khởi tạo màn mới, gỡ listener/timer/animation màn trước bằng cơ chế cleanup rõ ràng.

## 14. Hợp đồng dữ liệu

### 14.1. Nội dung một màn

```js
{
  id: 's02',
  chapterId: 'c1',
  period: '1932–1935',
  title: 'Giữ mạch nối',
  contextShort: 'Nhiều cơ sở bị phá vỡ, liên lạc bị gián đoạn.',
  learningObjective: 'Vai trò của khôi phục tổ chức và bồi dưỡng cán bộ.',
  recordId: 'r02',
  sceneAssetId: 'network-recovery',
  contentStatus: 'draft',
  cards: [
    { id: 'restore-links', label: 'Khôi phục liên lạc',
      visualId: 'messenger-route', detail: '...', sourceIds: ['source-02'] }
    // đủ 4 thẻ, ID ổn định; không dùng index mảng làm ID
  ],
  targets: [
    { id: 'reconnect', label: 'Nối lại đầu mối', visualAnchor: 'hub' },
    { id: 'train', label: 'Bồi dưỡng cán bộ', visualAnchor: 'learning-room' }
  ],
  evaluations: {
    reconnect: {
      'restore-links': {
        outcome: 'suitable',
        reasonShort: 'Hoạt động này nối lại các đầu mối bị gián đoạn.',
        reasonDetail: '...',
        sourceIds: ['source-02'],
        effectId: 'restore-network'
      }
      // đủ 4 thẻ; cặp needs-review có reasonType và suggestedCardIds
    }
    // đủ 2 ô × 4 thẻ
  }
}
```

- `evaluations` là nguồn duy nhất để chấm. Nếu cần danh sách accepted thì suy ra từ đây, không duy trì hai danh sách có thể lệch nhau.
- `outcome`: `suitable` hoặc `needs-review`; nhãn UI là tiếng Việt được quy định.
- `reasonType` nội bộ: `task-mismatch`, `timing`, `missing-condition`, `category-mismatch`, `scope`.
- Mọi cặp needs-review có `suggestedCardIds` thuộc những phương án thực sự suitable cho ô đó.
- `sources`: file/link, tên tài liệu, locator thật, ghi chú kiểm chứng. Không có giá trị “nguồn: Internet” chung chung.
- Các chuỗi nội dung mới ưu tiên render textContent; nếu có nội dung rich text thì dùng cấu trúc hạn chế, không đưa thẳng chuỗi storage vào innerHTML.

### 14.2. Trạng thái lượt chơi

```js
{
  schemaVersion: 2,
  contentVersion: 'v2-draft-01',
  runId: '...',
  mode: 'scored',
  status: 'in-progress',
  currentSceneId: 's02',
  createdAt: '...',
  scenes: {
    s02: {
      phase: 'arranging',
      cardOrder: ['...', '...', '...', '...'],
      placements: { reconnect: null, train: null },
      submissions: [],
      slots: {
        reconnect: {
          firstCardId: null,
          firstOutcome: null,
          finalCardId: null,
          finalOutcome: null,
          resolvedOnAttempt: null
        }
        // train tương tự
      },
      completed: false
    }
  }
}
```

Mỗi submission có ID, số thứ tự, snapshot placements và outcome/reason key của từng ô được chấm. `firstCardId/firstOutcome` chỉ ghi một lần. Điểm là derived, không tin một số tổng lưu sẵn.

Không lưu tọa độ kéo, DOM, timer hay trạng thái giữa animation. Lưu trạng thái nghiệp vụ sau lệnh đặt/trả và sau transaction chấm; dữ liệu nhỏ nên không cần backend.

### 14.3. Phiên và khôi phục

- Quyết định mới: dùng `sessionStorage` để giữ lượt trong cùng tab khi tải lại/chuyển landing; không tự thêm lưu dài hạn localStorage.
- Key riêng cho v2, ví dụ `august-game:v2:session`; không diễn giải dữ liệu v1 thành điểm v2.
- State trong memory là chính; storage lỗi thì game vẫn chơi được, có thông báo ngắn rằng tải lại có thể mất tiến độ.
- Validate schema, ID, cardOrder, placement không trùng, kết quả và phiên bản nội dung. Không để JSON hỏng làm trắng màn.
- Khi contentVersion khác và không có migration tin cậy, đề nghị bắt đầu lượt mới; không gán lý do mới vào lựa chọn cũ.
- Không có API đồng bộ giữa thiết bị hoặc lưu nhiều tháng trong phạm vi này. README phải nêu đúng thời hạn phiên thực tế.
- Phiên kết thúc vẫn mở lại tổng kết được trong cùng tab. Practice là state riêng, không ghi đè run gốc.

## 15. Máy trạng thái và thứ tự xử lý

```text
landing → tutorial (tùy chọn) → chapter-intro
→ arranging → submitting → feedback
→ arranging-unresolved → submitting → feedback
→ scene-complete → màn tiếp / chapter-summary / final-results
final-results ↔ review → practice → review
mọi màn phù hợp ↔ context / help / archive / explanation dialog
```

- `submitting` là khóa transaction logic ngắn, không phải chờ animation. Double click chỉ tạo một submission.
- Chấm snapshot bố trí → cập nhật first/final outcome → lưu phiên → render → chạy hiệu ứng. Reload giữa hiệu ứng phải phục hồi kết quả đã chấm, không cộng lần nữa.
- Chuyển màn chỉ khi người chơi yêu cầu sau feedback. Mỗi màn chỉ được đánh dấu hoàn thành một lần.
- Mở/đóng dialog không tăng attempt, đổi điểm, xáo thẻ hay mất bố trí.
- Sau update cục bộ, giữ focus hợp lý; không dựng lại toàn app ở mỗi pointermove.
- Lựa chọn “ôn lại sau” đóng các ô chưa giải quyết bằng trạng thái unresolved để tính thống kê cuối; không ghi một đáp án thay người chơi.

## 16. Ngân sách chữ, hiệu năng và chất lượng

### 16.1. Ngân sách chữ

- Tên màn: mục tiêu tối đa 7 từ.
- Bối cảnh trên màn: mục tiêu tối đa 20 từ, tối đa 2 dòng desktop thông thường.
- Nhãn ô: khoảng 3–7 từ; thẻ: khoảng 2–6 từ, tối đa 2 dòng ở kích thước nhỏ.
- Trước chấm, chữ nội dung chính mục tiêu khoảng 60–80 từ, không tính navigation hệ thống.
- Phản hồi ngắn: một câu, mục tiêu không quá 20 từ. Giải thích sâu mở qua nút.
- Ngân sách là mục tiêu biên tập, không cắt bằng ellipsis làm mất ý nghĩa hay giấu điều kiện quyết định đáp án.

### 16.2. Hiệu năng

- Gameplay phải dùng được khi font ngoài tải thất bại; font fallback không gây mất nút hoặc chữ tiếng Việt lỗi.
- Tải tài sản chương đầu trước; phần còn lại tải khi cần. Không yêu cầu tải toàn bộ ảnh tư liệu trước khi chơi.
- Mục tiêu payload khởi đầu khoảng dưới 2 MB sau nén, không tính tư liệu mở tự chọn; đo và báo thực tế thay vì hứa suông.
- Kéo thẻ mượt trên thiết bị thử nghiệm, không layout toàn scene mỗi frame; chỉ cập nhật ghost và trạng thái hover cần thiết.
- Ảnh có kích thước định trước; không layout shift làm ô thả di chuyển khi người chơi đang kéo.
- Khi asset minh họa lỗi, thẻ và ô vẫn có nhãn/biểu tượng dự phòng để chơi được.

## 17. Các đợt triển khai và điều kiện qua từng đợt

### Đợt 0 — Kiểm kê và khóa hợp đồng

Việc làm: đọc code mới nhất, ghi lại thay đổi người dùng đang có; đọc ba Word và nguồn; tạo bản đồ chức năng cũ → giữ/thay/bỏ; xác định chạy/test Windows; dựng khung dữ liệu và liệt kê mâu thuẫn nội dung.

Đầu ra: `docs/content-review-v2.md`, danh sách module tác động, ma trận nội dung nháp, cập nhật kế hoạch thực thi nếu repo khác.

Đạt khi: không nhầm đường dẫn cũ, không ghi đè file người dùng, biết rõ hành vi lưu phiên và các test cũ cần thay theo yêu cầu mới.

### Đợt 1 — Một màn mẫu hoàn chỉnh

Việc làm: dựng màn 02 với 4 thẻ, 2 vùng thả, cảnh có màu, mouse/touch/keyboard, chấm 10/5/0, giải thích, ô khóa, điều chỉnh và phản hồi hình ảnh. Có desktop và mobile ngay từ đầu.

Đầu ra: màn mẫu chạy qua entry preview dành cho dev; không có màn trắng hoặc component giả. `ui-semantics-v2.md` và các token đầu tiên.

Đạt khi: người chưa đọc tài liệu biết cách đặt hai thẻ; đặt nhầm vị trí cho ra giải thích cụ thể; không lộ đáp án trước chấm; sửa xong điểm đúng; animation tắt vẫn chơi được.

Nếu thao tác vẫn bị cảm nhận như bài trắc nghiệm kéo thả, sửa tương tác/cảnh/phản hồi ở đây. Không nhân chín màn trước khi giải quyết điều đó.

### Đợt 2 — Engine, state, điểm và phiên

Việc làm: tách hàm chấm, scoring, placement, state machine, session; viết test nghiệp vụ; bổ sung xem lịch sử thử, practice tách biệt.

Đạt khi: test điểm, chấm trùng, đổi thẻ, khôi phục phiên, nhiều đáp án, khóa ô và chế độ practice đều qua. Logic không phụ thuộc animation hoặc DOM.

### Đợt 3 — Biên soạn và triển khai đủ 9 màn

Việc làm: hoàn thiện 72 cặp, nguồn và lý do; làm ba bộ cảnh cùng biến thể; nối chín màn theo chương 2/2/5; bỏ checklist/trắc nghiệm cũ khỏi luồng mới.

Đạt khi: mọi màn giải được, mọi lựa chọn chưa phù hợp có giải thích riêng đúng cặp, không có placeholder trong luồng người chơi. Nội dung còn cần xác minh phải được báo chính xác, không bị che bởi tuyên bố hoàn thành.

### Đợt 4 — Tổng kết và vòng ôn tập

Việc làm: tổng kết chương, tổng 180, breakdown 18 ô, bộ lọc, lời giải, nguồn, practice và lượt mới; test dữ liệu biên all-180/all-unresolved/mixed.

Đạt khi: người chơi tìm được lựa chọn nào cần ôn và hiểu vì sao; tổng điểm khớp chi tiết; luyện lại không đổi kết quả cũ.

### Đợt 5 — Landing, hồ sơ và hoàn thiện mỹ thuật

Việc làm: đồng bộ landing/game, hướng dẫn, các dialog, token, icon, nguồn tài sản, chuyển động, âm thanh, trạng thái trống và lỗi asset.

Đạt khi: mỗi chi tiết trên màn có ý nghĩa trong bảng semantics; không có cơ chế cũ hiển thị nhưng không hoạt động; ảnh tư liệu không nhầm giai đoạn; không có animation khóa thao tác.

### Đợt 6 — Kiểm tra và chơi thử

Việc làm: chạy bộ test mới, browser checks phù hợp Windows, kiểm tra drag thật và screenshot các trạng thái, chơi thử với 5 người nếu nhóm có điều kiện, chỉnh các vấn đề đã quan sát; cập nhật README và `qa-v2.md`.

Đạt khi: các tiêu chí bắt buộc ở phần 19 đạt; ghi rõ test nào chạy, test nào chưa chạy và vấn đề còn lại. Không thay test bằng click giả rồi khẳng định đã xác minh kéo thả trên thiết bị thật.

## 18. Ma trận kiểm tra

### 18.1. Nội dung

- Đủ 3 chương, 9 màn, 18 ô, 36 thẻ theo màn, 72 cặp đánh giá.
- ID không trùng trong phạm vi cần duy nhất; mọi tham chiếu nguồn/hồ sơ/icon tồn tại.
- Mỗi cặp có outcome, reasonShort, reasonDetail; cặp cần ôn có gợi ý hợp lệ.
- Tất cả phép gán chấp nhận đều không tạo bế tắc sau khi khóa ô.
- Không có từ ngữ đánh giá người chơi bị cấm trong UI mới. Không áp dụng tìm kiếm máy móc để xóa trích dẫn lịch sử hợp lệ trong tư liệu.

### 18.2. Nghiệp vụ

1. Hai ô phù hợp ngay → 20.
2. Một ô phù hợp, một ô điều chỉnh → 15.
3. Hai ô điều chỉnh → 10.
4. Một ô phù hợp, một ô chưa hoàn thành → 10.
5. Hai ô chưa hoàn thành → 0, vẫn có hai mục xem lại.
6. Bấm triển khai liên tục hoặc reload sau chấm → không cộng trùng.
7. Mở hồ sơ trước/sau chấm → không mất bố trí, không tăng attempt.
8. Thả hụt/Escape/pointercancel → không thay điểm hoặc mất thẻ.
9. Đổi chỗ hai thẻ, thay thẻ từ khay, trả thẻ → đúng quy tắc duy nhất một thẻ/một ô.
10. Cặp có nhiều phương án phù hợp → đều được chấp nhận đúng.
11. Xáo thẻ → chấm bằng ID, không bằng vị trí mảng.
12. 18 lượt phù hợp ngay → 180; 18 lượt điều chỉnh → 90; tất cả unresolved → 0.
13. Case 12/5/1 → 145; có 6 mục cần ôn ban đầu.
14. Practice/lượt mới → không sửa run cũ.
15. JSON hỏng/storage bị chặn/contentVersion thay đổi → có xử lý rõ, không crash.

### 18.3. Trình duyệt và hình ảnh

- Chơi trọn bằng chuột kéo thật, bằng chạm hoặc emulation phù hợp, và bàn phím.
- Xác minh ít nhất một đường kéo hụt, một hoán đổi, một lần pointercancel.
- Screenshot ở 390px và 1440px: landing, màn chưa đặt, đang chọn/kéo, đã đặt, kết quả hỗn hợp, giải thích mở, tổng kết, xem lại.
- Kiểm tra các viewport phần 12, zoom 200%, reduced motion, font/asset lỗi.
- Không có runtime exception, request asset 404 hoặc focus rơi mất khi đổi màn.
- Kiểm tra độ tương phản thực tế của token, nhãn trạng thái, focus và nút disabled.
- Nếu không có thiết bị cảm ứng thật, ghi rõ chỉ test emulation; không tuyên bố đã test điện thoại thật.

### 18.4. Chơi thử với người dùng

Mẫu nhỏ 5 người nhằm phát hiện vấn đề, không để khẳng định hiệu quả giáo dục đại diện cho mọi người.

Ghi nhận: thời gian hiểu thao tác đầu, số lần thả hụt, vị trí bị hiểu nhầm là nút, số lần mở giải thích, nguyên nhân bỏ cuộc, thời lượng 9 màn.

Mục tiêu định hướng:

- Ít nhất 4/5 người hoàn thành màn đầu mà không cần người hướng dẫn nói đáp án hoặc chỉ thao tác liên tục.
- Ít nhất 4/5 người tìm được phần xem lại và giải thích được một lựa chọn của chính mình.
- Người chơi nhận ra sự thay đổi trong cảnh sau khi triển khai và liên hệ được với nhiệm vụ.
- Nếu đa số nhận xét vẫn là trắc nghiệm đổi cách bấm: xem lại độ rõ của nhiệm vụ, tác động thị giác và biến thể thao tác; không chỉ thêm hiệu ứng.

## 19. Definition of Done

- [ ] Cả 9 màn dùng gameplay mới, không lẫn màn chọn thẻ/trắc nghiệm cũ.
- [ ] Kéo thả, chọn–đặt và bàn phím dùng cùng luật; có bản mobile hoàn chỉnh.
- [ ] Điểm 10/5/0 và tổng 180 đúng trong mọi case đã quy định.
- [ ] Có thể chỉ ra từng lựa chọn ban đầu chưa phù hợp và lý do tương ứng sau khi kết thúc.
- [ ] Đọc thêm, điều chỉnh, ôn sau, luyện lại và lượt mới có hành vi đúng đặc tả.
- [ ] Không đánh giá thẻ hữu ích là không phù hợp chỉ để ép một đáp án định sẵn.
- [ ] Ma trận 72 cặp được kiểm tra; không còn kết luận chưa có căn cứ trong nội dung phát hành.
- [ ] Mọi icon/dấu/màu/chuyển động có ý nghĩa được ghi trong semantics.
- [ ] Không dùng màu đơn độc, text quá nhỏ, animation bắt buộc hoặc vùng kéo khó thao tác.
- [ ] Luồng chính không bị che bởi văn bản dài; giải thích vẫn đầy đủ và dễ mở.
- [ ] Nguồn ảnh, minh họa và tài liệu được ghi đúng, không nhầm ảnh minh họa thành ảnh tư liệu.
- [ ] Test logic và kiểm tra browser phù hợp môi trường chạy được; bằng chứng trong `qa-v2.md`.
- [ ] README mô tả đúng đường dẫn, cách chạy, lưu phiên và giới hạn thực tế.
- [ ] Không xóa/ghi đè tài liệu người dùng hoặc thay đổi ngoài phạm vi.
- [ ] Tách rõ phần đã kiểm chứng, chưa kiểm chứng và phản hồi chơi thử thực sự thu được.

## 20. Các điều AI không được tự diễn giải lệch

1. “Ít chữ” không phải bỏ nhãn cho người chơi đoán icon.
2. “Nhiều màu” không phải gradient, glow hoặc confetti ở mọi nơi.
3. “Matching” không phải làm hai cột văn bản rồi nối đáp án bằng màu.
4. “Tinh tế” không phải chữ li ti, tương phản yếu và nút không có nhãn.
5. “Chưa phù hợp” không phải thay từ “sai” nhưng vẫn dùng dấu X đỏ và lời phán xét.
6. “Có điểm” không phải cộng lại mỗi lần bấm hoặc giấu quy tắc tính điểm.
7. “Giải thích” không phải một đoạn lịch sử chung cho cả màn mà không nhắc lựa chọn cụ thể.
8. “Hoàn thiện” không phải dựng một màn đẹp rồi lặp nguyên ảnh và câu chữ cho tám màn khác.
9. “Luyện lại” không được âm thầm sửa thành tích của lượt đầu.
10. “Đúng lịch sử” không được suy từ việc code cũ đã có nội dung đó.

## 21. Thứ tự ưu tiên khi có xung đột

1. Nội dung và đánh giá có căn cứ, người chơi được đối xử công bằng.
2. Hoàn thành được thao tác và hiểu được phản hồi.
3. Điểm và lịch sử lựa chọn chính xác.
4. Phân cấp thị giác, khả năng truy cập và lượng chữ hợp lý.
5. Mỹ thuật và chuyển động hoàn thiện.

Nếu thời gian hạn chế, giảm số biến thể minh họa hoặc hiệu ứng; không bỏ giải thích, xem lại, kiểm tra điểm hay hỗ trợ mobile. Bản mẫu đầu vẫn phải đủ đẹp và có phản hồi cảnh để đánh giá đúng hướng sản phẩm.

## 22. Bàn giao sau đợt 0

Đợt kiểm kê và đối chiếu nội dung đã thực hiện. Gameplay hiện tại chưa được thay trong đợt này.

- Đọc `docs/content-review-v2.md` để biết các phát hiện về nguồn, phạm vi kiểm chứng, code thật và kiểm tra trên Windows.
- Dùng `docs/content-model-v2.json` và `docs/content-matrix-v2.md` làm dữ liệu nhiệm vụ–thẻ mới. Các thay đổi biên tập trong hai tệp này thay thế phần đề xuất tương ứng ở mục 6.3; không ghi đè bằng các thẻ gây nhiễu ban đầu.
- Bản mới có 72 cặp: 25 cặp phù hợp và 47 cặp cần xem lại; có năm màn chấp nhận nhiều cách hoàn thành. Tổng điểm và luật 10/5/0 vẫn giữ nguyên.
- Màn s02 “Giữ mạch nối” có ô “Khôi phục cơ sở bí mật” và “Học tập trong tù”; thẻ được ghi rõ trong model. Không quay lại bốn thẻ cũ khi dựng mẫu.
- Mọi cặp có nguồn nội bộ hỗ trợ và lý do biên tập; trạng thái chuyên môn vẫn chờ nhóm duyệt, không phải xác minh độc lập.
- Đợt tiếp theo là một màn mẫu đủ tương tác và mỹ thuật trên desktop/mobile. Chưa có bằng chứng chơi thử hoặc kiểm tra kéo thả vì chưa triển khai UI mới.
