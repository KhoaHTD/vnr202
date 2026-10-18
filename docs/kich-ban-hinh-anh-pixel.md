# Kịch bản hình ảnh pixel — ba chương dẫn tới độc lập

## Phạm vi

Chỉ đặc tả bối cảnh, khung hình, nhân vật, đạo cụ, cử động và chuyển cảnh. Không khóa gameplay, điểm, điều kiện thắng, thao tác chuột hay số nhiệm vụ. “Trước / đang / sau” dưới đây là các nhịp kể bằng hình ảnh, không mặc định là ba trạng thái đúng/sai.

Đọc cùng [khung nội dung](noi-dung-va-danh-muc-canh-pixel.md) và [định hướng học phần](dinh-huong-hoc-phan-lich-su-dang.md). Các mã C1, C2, C3.01–09 được giữ để nhóm đối chiếu. Gọi là “đoạn hình ảnh” ở giai đoạn này; một đoạn có thể chứa nhiều góc máy mà chưa cần tách thành nhiều màn chơi.

## 1. Ngôn ngữ mỹ thuật chung

### Giữ điều người dùng đã thích

- Pixel có mảng rõ, mái ngói, đất, cây và dáng người dễ đọc như bản nháp. Tăng chi tiết có chức năng và độ sâu, không phủ hiệu ứng bóng sáng lên mọi vật.
- Dùng góc nhìn ngang hơi từ trên xuống để thấy tay người, sân, lối đi và vật được trao; chưa cần isometric. Ở cảnh lễ/hội nghị có thể dùng góc thấp hoặc gần hơn.
- Cảnh dân cư có màu đất nung, vôi cũ, xanh lá và màu vải đa dạng. Không để cả game chỉ có xanh rêu–nâu nhạt; không dùng màu rực làm mọi cảnh giống lễ hội.
- Nét mặt ở cự ly xa không cần nhiều pixel; cảm xúc chủ yếu qua dáng đứng, hướng thân, khoảng cách và nhịp cử động. Nạn đói, đàn áp, hội nghị, ngày độc lập phải có nhịp khác nhau.

### Tỷ lệ và cấu trúc hình đề xuất

- Khung bố cục cơ sở 16:9. Có thể phác 480×270, sau đó vẽ asset trên cùng một lưới và phóng theo bội số nguyên. Đây là lựa chọn sản xuất, chưa phải độ phân giải bắt buộc.
- Người dân thường khoảng 24–32 pixel chiều cao ở cự ly trung cảnh; một nhân vật không thay đổi tỷ lệ cơ thể giữa hai cảnh chỉ vì copy rồi kéo giãn.
- Tách nền thành: xa cảnh / công trình / mặt đất và vật cản / nhân vật và đạo cụ động / tiền cảnh. Mỗi lớp phải phục vụ chiều sâu hoặc khả năng đọc hành động.
- Đặt hành động chính ở nửa giữa và phần dưới khung, chừa góc trên cho nhãn địa điểm nhỏ. Không vẽ nội dung quan trọng ở vị trí chắc chắn bị nút bóng đèn/hướng dẫn che.
- Chuẩn bị bố cục dọc riêng cho điện thoại: xếp nhân vật sâu vào sân, chuyển góc máy hoặc mở vùng camera. Không bóp ngang cả tranh hoặc cắt mất người nhận thóc/cửa kho/lễ đài.

### Cách dẫn mắt

Một khung chỉ có một hành động chính. Dùng tương phản sáng–tối vừa đủ, hướng nhìn của nhân vật, khoảng trống và luồng di chuyển để chỉ ra nó. Không dùng một chấm sáng hoặc vòng tròn nhấp nháy trên mọi người.

Màu đỏ thuộc về cờ, vải, biển/đạo cụ có căn cứ; không mặc định là màu báo chưa phù hợp. Ánh sáng vàng có thể làm nổi đèn hoặc tín hiệu quy ước đã chọn. Các vật lịch sử thông thường không tự phát sáng như đồ phép.

### Phân biệt ba mức hình ảnh

1. **Tổng hợp có căn cứ:** làng, phố, cơ sở sinh hoạt, kho thóc không đặt tên. Được biên tập bố cục để dễ hiểu, ghi rõ minh họa trong hồ sơ.
2. **Địa điểm/sự kiện có tên:** Khuổi Nậm, lễ thành lập đội quân 1944, Tân Trào, Nhà hát Lớn, Ba Đình. Phải có hồ sơ ảnh/kiến trúc đúng thời điểm trước khi khóa bản vẽ.
3. **Biểu tượng giao diện:** bóng đèn, tín hiệu thời cơ. Tách khỏi đạo cụ được khẳng định có thật trong lịch sử. Không biến biểu tượng thành hiện vật lịch sử giả.

## 2. Chương 1 — 1930–1935: hai lát cắt gọn

### C1-A · Từ xưởng tới đường làng

**Không gian:** một bố cục tổng hợp, bên trái là cổng xưởng và dấu hiệu công việc, bên phải đường làng/ruộng. Hai nhóm có xuất phát điểm rõ, gặp nhau ở trung tâm. Không vẽ công trường với máy xúc, nhà xưởng kính thép hoặc đường nhựa hiện đại.

**Nhân vật:** công nhân, nông dân, cán bộ vận động; có người dẫn đầu nhưng không một người đứng trên bệ trong khi tất cả bất động. Khác biệt nghề thể hiện bằng quần áo, dụng cụ mang theo, không bằng một màu da hay chỉ số giá trị.

**Ba nhịp hình:**

1. Người lao động ở hai không gian riêng; dáng mệt, dụng cụ đặt xuống, nhóm nhỏ trao đổi.
2. Người từ xưởng ra, người từ đường làng vào; nhìn về cùng một hướng, bước chân dần cùng nhịp.
3. Khung rộng hơn cho thấy phong trào; cắt ngắn tới cảnh sinh hoạt cộng đồng ở Xô viết Nghệ–Tĩnh, ví dụ lớp học hoặc tương trợ. Nhãn địa điểm chỉ xuất hiện ở lát cắt có tên, không phủ lên toàn bộ bố cục tổng hợp.

**Động tác cần đọc được:** rời chỗ làm, dừng công việc, trao đổi, cùng di chuyển. Mỗi động tác phải có khởi đầu và kết thúc, tránh người dân trượt ngang như quân cờ.

**Đạo cụ:** đồ lao động phù hợp tham chiếu, tờ yêu cầu, cấu kiện xưởng/làng. Cờ và khẩu hiệu phải duyệt theo giai đoạn; không sao chép nguyên bộ cờ/nghi lễ của 1945.

**Tông:** đất nung, xám công nghiệp, vải chàm/nâu; tăng sức sống bằng chuyển động và con người, không phải pháo hoa.

**Ý được nhìn thấy:** công–nông cùng tham gia phong trào. Nguồn: D1:P011–P040.

### C1-B · Hoạt động được gây dựng lại

**Không gian:** góc nhà kín và một lối làng; có thể chuyển tới lát cắt học tập trong tù bằng ô cửa riêng, nhưng không gộp nhà dân và nhà tù thành cùng địa điểm.

**Ba nhịp hình:** địa điểm sinh hoạt trống/vắng sau đàn áp → nhóm nhỏ trở lại học tập, trao tài liệu → người rời đi để tiếp tục gây dựng cơ sở.

**Động tác:** khép cửa, mở tập giấy, ngồi trao đổi, cất tài liệu, chào nhau rồi rời cảnh. Chỉ cần vài cử chỉ kiên trì, không cần cảnh tra tấn để giải thích khó khăn.

**Ánh sáng:** ngoài trời âm hơn, trong nhà có vùng sáng thật từ cửa/đèn. Không phải toàn màn đen, cũng không dùng đèn sáng lên như “thắng một màn”.

**Chuyển cảnh:** giữ hình tờ giấy/bàn học, hòa sang tờ báo hoặc bàn dân nguyện ở chương 2. Nhãn 1935 có thể khép đoạn; Đại hội I đặt trong hồ sơ hoặc một khung ngắn, không cần thêm cảnh họp dài.

**Ý được nhìn thấy:** phong trào chịu tổn thất nhưng tổ chức, con người và kinh nghiệm tiếp tục được phục hồi. Nguồn: D1:P067–P089.

## 3. Chương 2 — 1936–1939: từ góc phố tới phong trào rộng hơn

### C2-A · Nguyện vọng của người dân

**Không gian:** phố có góc báo và bàn nhận dân nguyện; lối đi đủ rộng để nhiều nhóm vào/ra. Phông kiến trúc phải phù hợp thời thuộc địa, biển hiệu tối giản và đúng loại vật liệu. Không dùng loa cầm tay nhựa hoặc màn hình điện tử.

**Nhân vật:** người lao động, phụ nữ, thanh niên, người làm báo/ghi chép, người nhận dân nguyện. Một số người đến cùng gia đình, một số đến một mình; không tạo hình tất cả như đội quân xếp hàng.

**Ba nhịp hình:** một người mang giấy tới → người nhận lắng nghe/ghi, những người khác đọc chung báo → nhiều nhóm cùng trao đổi, sinh hoạt hội đoàn.

**Động tác cận cảnh cần có:** tay trao giấy và tay nhận khớp nhau; người đọc xoay tờ báo để người cạnh bên cùng thấy; người ghi dừng lại nghe rồi mới viết. Một tờ giấy có hành trình dễ theo dõi hơn hàng chục biểu tượng bay vào một thanh thống kê.

**Màu:** sáng hơn C1-B, vôi vàng cũ, giấy ngà và vải xanh/nâu. Mức sáng diễn tả không gian công khai có giới hạn, không tuyên bố xã hội đã hoàn toàn tự do.

**Ý được nhìn thấy:** mong muốn đời sống và tham gia chính trị được tập hợp qua hoạt động có tổ chức. Nguồn: D2:P018–P020, P033–P047.

### C2-B · Mở rộng hàng ngũ

**Không gian:** góc rộng của một cuộc mít tinh. Nếu chọn Đấu Xảo ngày 1/5/1938, phải vẽ theo tham chiếu địa điểm thời đó; không lấy công trình hiện tại ở cùng khu đất.

**Ba nhịp hình:** từng nhóm đi vào từ các lối → tập hợp thành nhiều cụm hướng về diễn đàn → khung rộng cho thấy thành phần đa dạng. Nhóm ở xa ít chi tiết hơn nhưng vẫn có dáng người, không thay toàn bộ bằng những chấm màu.

**Cuối chương:** thời gian chuyển sang 1939; điểm báo và bàn làm việc hoạt động kín hơn. Tách nhịp thời gian bằng ánh sáng/mốc năm, không khiến người xem tưởng cuộc mít tinh vừa kết thúc thì chiến tranh bùng nổ ngay tại chỗ.

**Ý được nhìn thấy:** lực lượng và kinh nghiệm vận động đã được mở rộng. Không vẽ Việt Minh trong giai đoạn này. Nguồn: D2:P048–P058; W2 trong khung nội dung.

## 4. Chương 3 — chín đoạn chính

### C3.01 · Chuyển hướng và Hội nghị VIII

**Không gian:** mở ngắn bằng một cơ sở phải thu hẹp hoạt động, rồi chuyển tới lán Khuổi Nậm ở Pác Bó. Không vẽ một hội trường lớn có bục phát biểu, cờ phông sân khấu và hàng ghế như hội nghị hiện đại.

**Khung chính:** trung cảnh nhìn chéo vào lán, thấy mái/cột gỗ, nhóm dự họp và khoảng làm việc. Tiền cảnh lá/cột chỉ che viền, không che tay hoặc khuôn mặt người đang trao đổi.

**Chuỗi hành động:** một người đưa thông tin → người dự họp nghe, xem giấy và trao đổi → tài liệu được thu xếp → người truyền đạt ra khỏi lán. Các vị trí ngồi và nhân vật có danh tính chỉ chốt khi có tham chiếu; không tự gán chân dung cho mọi người.

**Cử động cần vẽ:** ngẩng đầu lắng nghe, chỉ vào tài liệu, đổi hướng nhìn, gật đầu hoặc ghi chép có chừng mực. Tránh cả nhóm đồng loạt gật theo vòng lặp hoặc một nhân vật nói không ngừng.

**Chuyển cảnh:** người mang tài liệu rời mép phải; cắt sang cơ sở vận động ở C3.02 để thấy chủ trương được triển khai. Không vẽ một luồng sáng từ bàn họp tạo ra nhân dân.

**Ý được nhìn thấy:** đánh giá tình hình và xác định nhiệm vụ dẫn tới công việc tổ chức thực tế. Nguồn: D3:P007–P038; W3.

### C3.02 · Việt Minh trong nhân dân

**Không gian:** thôn bản/cơ sở tổng hợp, có sân chung, hiên nhà, lối đi và chỗ đọc tài liệu. Nếu muốn đặt ở Cao Bằng, cần bộ nhà ở/trang phục riêng, không lấy nguyên dãy phố đồng bằng rồi đổi địa danh.

**Khung chính:** sân ở giữa, nhóm gặp gỡ lệch một bên; đường vào/ra nhìn thấy được. Để khoảng trống cho những nhóm mới bước vào. Không xếp sẵn toàn bộ người vào các hàng đều tăm tắp.

**Chuỗi hành động:** cán bộ và người dân trao đổi → người dân gọi thêm người, cùng đọc/nghe → các nhóm chia công việc và đi theo những hướng khác nhau: vận động, tiếp tế, sinh hoạt. Có người quay lại với vật dụng hoặc người mới, tạo sự tiếp nối.

**Hành động cụ thể:** người trao tài liệu đưa tay tới đúng người nhận; người nghe quay thân lại; người chuẩn bị gói đồ buộc xong rồi mới mang đi; người dẫn nhóm nhìn lại để chờ người phía sau. Phụ nữ/người lớn tuổi có công việc chủ động, không chỉ đứng xem.

**Màu và dáng người:** đa dạng vải chàm, nâu, ngà, xanh xám, không rập khuôn “ai cùng phe mặc cùng màu”. Tránh lấy một bộ đồ làm đại diện cho tất cả dân tộc.

**Ý được nhìn thấy:** đoàn kết được xây bằng con người có hành động và đóng góp. Nguồn: D3:P035–P045; W4.

### C3.03 · Chuẩn bị lực lượng và căn cứ

**Không gian A — sinh hoạt chuẩn bị:** nền rừng có sân nhỏ, chỗ trú và khu tiếp tế. Tách người luyện tập, người chuyển nhu yếu phẩm và người học tập thành các cụm dễ đọc; không vẽ thành một trại quân đội hiện đại với hàng rào thép/cột điện.

**Chuỗi hành động A:** gói đồ được mang tới và nhận → người học tập/luyện tập thực hiện công việc → người dân và cán bộ tiếp tục hoạt động. Không phải mọi công việc đều biến thành súng hoặc đạn.

**Không gian B — lễ thành lập đội quân năm 1944:** lát cắt riêng trong rừng, bố cục trang trọng và có cờ theo tham chiếu. Nếu ghi đúng sự kiện 22/12/1944, hồ sơ và đội hình phải tôn trọng quy mô 34 cán bộ, chiến sĩ; không để người dân/người chỉ huy được đếm nhầm vào một con số tùy tiện.

**Cử động:** bước chân có trọng lượng, nâng/hạ dụng cụ, học một động tác rồi dừng; khi tuyên thệ không có tất cả giơ tay theo tư thế hiện đại không được kiểm chứng. Vũ khí và cách mang phải dựa mẫu, không dùng trang bị chiến tranh giai đoạn sau.

**Chuyển cảnh:** từ nhiều nhịp sinh hoạt tới một khung lễ đứng yên hơn, rồi trở lại quá trình chuẩn bị. Không để lễ thành lập xóa vai trò của lực lượng chính trị và nhân dân vừa được kể.

**Ý được nhìn thấy:** sự chuẩn bị có thời gian, nhiều phương diện và có nhân dân hỗ trợ. Nguồn: D3:P039–P047; W5.

### C3.04 · Tháng 3/1945: tình hình thay đổi

**Không gian:** phố/cơ quan có lực lượng kiểm soát, rồi một cơ sở tiếp nhận thông tin. Đây là đoạn chuyển; không đầu tư thành một cảnh chiến trận kéo dài.

**Khung trước:** nhịp phố thận trọng, sinh hoạt bị kiểm soát. **Khung chuyển:** người qua đường dừng, cửa khép, người đưa tin đi vội; nếu cần mô tả Nhật đảo chính Pháp, dùng lực lượng/trang phục và diễn biến có nguồn, không chỉ đổi màu một lá cờ như thể việc chuyển quyền không có xung đột. **Khung sau:** cơ sở trao đổi và bắt tay vào hoạt động trong cao trào kháng Nhật.

**Cử động:** bước nhanh khác với đi bình thường; người cầm tài liệu giữ chặt, nhìn người nhận; nhóm nghe tin thay đổi tư thế và hướng nhìn. Không phóng to một thông báo dài ở giữa cảnh.

**Không khí:** tương phản mạnh hơn, đường phố ít đông vui; không dùng đỏ phủ toàn màn để giả lập căng thẳng. Giữ vật thể chính đọc được.

**Ý được nhìn thấy:** hoàn cảnh và công việc thay đổi; chưa phải thời điểm Tổng khởi nghĩa trên cả nước. Nguồn: D3:P053–P056.

### C3.05 · Phá kho thóc, cứu đói

**Không gian:** địa điểm tổng hợp ở Bắc Bộ/Bắc Trung Bộ; cửa kho, chỗ chứa thóc, lối vận chuyển và nơi người dân nhận lương thực cùng hiện trong một bố cục. Nếu đặt tên kho cụ thể thì phải làm hồ sơ khác, không tự gắn tên lịch sử vào thiết kế tổng hợp.

**Khung chính:** kho ở một phía, người nhận thóc ở phía còn lại; khoảng trống giữa tạo thành chuỗi hành động. Đừng để cửa kho ở giữa che hết cảnh chia thóc phía sau.

**Ba nhịp hình:**

1. Kho đóng, người dân chờ; dáng người thể hiện thiếu thốn nhưng không biến người đói thành hình biếm họa.
2. Người cùng mở/phá cửa, những người khác đỡ và chuyển bao thóc. Không ai đứng dưới cửa đang đổ; vật có khối lượng và điểm tựa.
3. Bao thóc tới nơi chia; có động tác mở, đong/nhận hoặc chuyển bằng đồ đựng có tham chiếu. Người nhận đem lương thực đi, người khác tiếp tục vào, cho thấy việc cứu trợ thực sự diễn ra.

**Hoạt ảnh cần tách:** cúi lấy → nâng → mang → đặt/trao → buông tay; người nhận đỡ trước khi người trao buông. Đòn gánh/xe nếu dùng phải có khả năng chịu và chuyển trọng lượng phù hợp.

**Màu/ánh sáng:** vải bao, gỗ cửa, nền đất và quần áo khác sắc độ để không hòa thành một mảng nâu. Sự chuyển biến nằm ở người và lương thực được đưa ra, không phải cảnh tự nhiên bỗng hết đói hoặc trời đổi màu sau một hành động.

**Không vẽ:** đốt kho/đốt thóc, tiền vàng bay ra, pháo sáng ăn mừng trên người thiếu đói. Giữ vai trò tổ chức của cán bộ và sự tham gia trực tiếp của dân trong cùng khung.

**Ý được nhìn thấy:** nhu cầu sống còn, công tác tổ chức và hoạt động quần chúng gắn với nhau. Nguồn: D3:P057–P060; W7.

### C3.06 · Khởi nghĩa từng phần và vùng giải phóng

**Không gian A:** một địa phương tổng hợp đủ điều kiện hành động, có lối vào, điểm hành chính và sân dân cư. **Không gian B:** sinh hoạt trong vùng giải phóng, tách bằng nhãn thời gian/địa điểm nếu có tên.

**Chuỗi hình:** người dân và lực lượng hỗ trợ tập hợp → cùng tiến vào/tiếp quản điểm hành chính theo diễn biến được chọn → người dân tiếp tục tổ chức sinh hoạt, canh gác, tiếp tế và chuẩn bị.

**Cử động:** đội hình không như diễu binh hiện đại; có người điều phối, người đứng quan sát/bảo vệ, nhóm dân di chuyển. Một nơi được giải phóng không biến toàn bộ thế giới ngoài cảnh sang cùng một trạng thái.

**Sự thay đổi có thể thấy:** cửa nơi sinh hoạt mở, người dân ra/vào và tham gia quản lý công việc; lực lượng bảo vệ vẫn hiện diện. Chỉ kéo cờ rồi kết thúc sẽ thiếu phần đời sống và tổ chức mới.

**Chuyển cảnh:** từ một địa phương sang vùng giải phóng bằng cắt cảnh có mốc; không kéo camera trên bản đồ. Nếu nhắc Ba Tơ và Việt Bắc, không dùng cùng một biển địa danh hoặc ngụ ý hai nơi nằm cạnh nhau.

**Ý được nhìn thấy:** phát triển lực lượng và tổ chức qua hành động thực tiễn, chưa phải độc lập toàn quốc. Nguồn: D3:P058–P064.

### C3.07 · Tân Trào, tin tức và thời cơ

**Không gian A — quyết định/tập hợp đại biểu:** cảnh Quốc dân Đại hội tại đình Tân Trào có kiến trúc và người dự phù hợp tham chiếu. Hội nghị toàn quốc của Đảng là một sự kiện khác, cần khung và nhãn riêng nếu dựng. Không lấy lại lán Khuổi Nậm và chỉ đổi tên.

**Không gian B — cơ sở đang sẵn sàng:** người đã được vận động, tự vệ và người liên lạc hiện diện. Đây là nơi hình ảnh thời cơ gắn với khả năng hành động trong nước.

**Chuỗi hình:** tin từ bối cảnh quốc tế được tiếp nhận → nhận định, quyết định và truyền đạt → nhóm tại cơ sở nhận tin và chuẩn bị bước đi. Không gian quốc tế có thể được kể bằng một cận cảnh bản tin ngắn, không cần thêm một trận chiến thế giới để người chơi hiểu.

**Vật thể thời cơ về mặt mỹ thuật:** giữ phong thư/tín hiệu pixel màu ngà–vàng đã thử, vùng sáng mềm quanh vật chứ không cả cảnh; trôi ngang và nhấp nhô nhẹ, không giật như quái vật bay. Nền phía sau đường bay ít chi tiết; không che mặt người hoặc văn kiện lịch sử. Không vẽ đồng hồ, số đếm hoặc dấu chấm theo dõi thời gian. Hình bắt được có thể co ánh sáng ngắn và chuyển trọng tâm sang người nhận tin; hình vụt qua rời khỏi khung tự nhiên. Đây là biểu tượng quy ước, không khẳng định thư có phép hay thời cơ là một hiện vật lịch sử.

**Đám đông:** đã có tổ chức trước tín hiệu. Khi chuyển sang hành động, người dân đứng lên/nhận việc theo các nhóm hiện hữu, không xuất hiện một đoàn quân mới từ luồng sáng.

**Ý được nhìn thấy:** điều kiện bên ngoài, quá trình chuẩn bị và quyết định trong nước gặp nhau. Thứ tự lệnh 13/8, tuyên bố 15/8 và các sự kiện Tân Trào phải theo hồ sơ đã rà; không biên tập chỉ để khớp hiệu ứng. Nguồn: D3:P067–P073, P095–P100; W8–W9.

### C3.08 · Nhân dân giành chính quyền

**Không gian:** Hà Nội có khung chủ lực, sau đó các lát cắt Huế và Sài Gòn. Mỗi thành phố có mốc thời gian và kiến trúc riêng, cộng một nhịp hình gợi quy mô địa phương cả nước. Không dùng một tòa nhà cho cả ba rồi thay biển.

**Hà Nội:** Nhà hát Lớn là một điểm kể về mít tinh; nơi tiếp quản cơ quan chính quyền là không gian tiếp theo có tham chiếu. Cần phân biệt sự kiện ngày 17 và ngày 19 nếu sử dụng hình thuộc cả hai. Không lấy ảnh một cuộc mít tinh rồi chú thích thành một thời điểm khác vì chúng đều có đông người.

**Ba nhịp hình:** từng nhóm từ các ngõ/phố nhập vào → nhóm dân di chuyển có phối hợp tới địa điểm → cơ quan được tiếp quản, cờ thay đổi theo diễn biến, người dân tiếp tục hiện diện. Các lực lượng hỗ trợ có vị trí bảo vệ/điều phối, không chiếm toàn bộ khung.

**Cách vẽ quy mô:** tiền cảnh 6–10 dáng người rõ, trung cảnh nhiều nhóm biến thể, hậu cảnh khối đám đông với đầu/vai và cờ có nhịp. Số lượng để thể hiện quy mô, không là số đếm thống kê lịch sử. Để lối di chuyển và hướng nhìn đọc được; không phủ kín ảnh bằng rừng cờ.

**Huế/Sài Gòn:** chọn kiến trúc gắn đúng hoạt động đã xác minh; dùng đường nét địa phương, không chỉ một bảng tên. Nghi lễ thoái vị 30/8 nếu có là một lát cắt khác với thắng lợi tại Huế ngày 23/8.

**Động tác:** giơ tay/cờ có độ lệch giữa người, các nhóm nối vào nhau, người mang cờ cần giữ cán và bước chân có nhịp; tránh tất cả bật lên xuống như ăn mừng trong game thể thao.

**Ý được nhìn thấy:** quần chúng trực tiếp giành chính quyền với tổ chức và lực lượng hỗ trợ, thắng lợi có quy mô toàn quốc. Nguồn: D3:P077–P093; W10.

### C3.09 · Ngày độc lập

**Không gian:** Ba Đình ngày 2/9/1945, dựa ảnh lễ đài và hồ sơ kiến trúc lịch sử. Không có Lăng hoặc nền quảng trường hiện đại. Nếu có đoạn trước ở Huế ngày 30/8 phải chuyển ngày và địa điểm rõ.

**Bố cục:** góc rộng đầu tiên để thấy nhân dân và lễ đài; tới trung cảnh phát biểu; trở lại toàn cảnh cờ và người. Phần trên khung có khoảng thở, không chèn bảng điểm vào tâm lễ đài.

**Lễ đài:** kết cấu tạm và vật liệu theo tham chiếu, không vẽ thành một công trình đá đồ sộ. Micro, cột cờ, trang phục và vị trí đại biểu cần chốt cùng một bộ tư liệu, không trộn ảnh nhiều năm.

**Nhân vật:** hình tượng Chủ tịch Hồ Chí Minh nhận diện bằng dáng, trang phục, cử chỉ tiết chế và ngữ cảnh; pixel không làm khuôn mặt thành nét cười quá mức. Đại biểu và quần chúng có dáng lắng nghe, ngẩng nhìn hoặc giữ cờ.

**Chuỗi hành động:** nhân dân hướng về lễ đài → phát biểu với cử chỉ nhỏ, trang nghiêm → toàn cảnh đón nhận ngày độc lập. Cờ/vải chuyển động nhẹ, không dùng rung camera hoặc hiệu ứng nổ che mất ý nghĩa.

**Nhịp kết:** tiêu đề ngắn hiện sau khi hình ảnh đã đủ thời gian được nhìn; giữ lại người dân trong khung để thành quả không chỉ thuộc một nhân vật. Nội dung kết xác nhận nước Việt Nam Dân chủ Cộng hòa ra đời, không diễn đạt mọi khó khăn về sau đều đã kết thúc.

**Ý được nhìn thấy:** thành quả của cả hành trình, nhân dân và dân tộc bước sang vị thế mới. Nguồn: D3:P091–P104; W11–W12.

## 5. Thư viện hành động để giao họa sĩ/animator

Khung hình gợi ý dưới đây dùng để ước lượng khối lượng vẽ, không phải tốc độ hoặc luật tương tác. Tư thế đặc thù lịch sử phải duyệt trước khi lên hoạt ảnh.

| Hành động | Các tư thế quan trọng | Chi tiết giúp trực quan |
|---|---|---|
| Đi bộ / đi nhanh | Chân tiếp đất → thân chuyển trọng tâm → chân sau rời đất | Tay/đồ mang theo cùng nhịp; đi nhanh khác tăng tốc toàn bộ một clip |
| Gặp gỡ, vận động | Tiến tới → dừng ở khoảng cách phù hợp → người kia quay lại → trao đổi | Hướng mặt và thân cho biết ai đang nói với ai |
| Trao/nhận giấy | Đưa tay → hai người cùng giữ → người nhận kéo về → người trao buông | Tờ giấy không biến mất ở tay này rồi xuất hiện ở tay khác |
| Đọc/nghe | Mở giấy → nghiêng/đưa cho người cạnh → nhìn theo | Có người chủ động đọc, có người cùng xem; không giả định mọi người đều biết chữ |
| Họp | Người nói chuyển cử chỉ → người khác nghe/xem → đổi lượt | Người nghe không là tượng; không tất cả dùng cùng một clip |
| Gói và tiếp tế | Đặt vật → buộc/thu xếp → nhấc → chuyển → đặt xuống | Đồ vật còn lại ở nơi nhận sau khi chuyển |
| Nâng/chuyển thóc | Cúi → đỡ → nâng → bước chịu lực → trao/đặt | Bao có trọng lượng; có người phối hợp, không nhấc như tờ giấy |
| Chia/nhận lương thực | Mở/đong → đưa → nhận → mang đi | Lượng thóc đi vào vật chứa của người nhận, không là hạt vàng bay vào UI |
| Học tập/luyện tập | Quan sát mẫu → thực hiện → dừng/chỉnh | Sinh hoạt tập thể, không mọi nhân vật tự tập một động tác giống hệt |
| Tập hợp | Người từ ngoài vào → tìm vị trí → quay về nhóm → chờ | Dòng người hình thành liên tục, không sinh tức thì |
| Phối hợp di chuyển | Người điều phối ra dấu → nhóm bắt đầu → nhóm khác nhập vào | Có khoảng cách và đường đi, không va/chồng xuyên nhau |
| Giương/kéo cờ | Tay giữ đúng vị trí → vải/cán chịu hướng lực → ổn định | Phân biệt cờ cầm tay và cờ trên cột; mẫu cờ đúng thời điểm |
| Phát biểu/lắng nghe | Cử chỉ nhỏ → dừng → người nghe phản ứng tiết chế | Nhịp trang trọng, không làm lịch sử thành hoạt cảnh hài |

Đề xuất mỗi động tác có 4–8 hình khóa ở mức pixel ban đầu; hành động trao vật hoặc nâng vật có thể cần nhiều hình hơn. Xem thử ở kích thước thật để quyết định, không tăng số khung chỉ để có con số cao.

## 6. Bối cảnh cần khác nhau ở điểm nào

| Loại cảnh | Bố cục chủ đạo | Trọng tâm chuyển động | Nhịp và cảm xúc |
|---|---|---|---|
| Công–nông đầu 1930 | Hai dòng người gặp nhau | Tham gia, đi cùng nhau | Bức bách rồi mạnh dần |
| Khôi phục | Không gian nhỏ và kín | Học, trao đổi, rời cơ sở | Kiên trì, tiết chế |
| Dân chủ 1936–1939 | Góc phố mở tới quảng trường | Trao giấy, đọc báo, tập hợp | Cởi mở hơn nhưng có giới hạn |
| Hội nghị | Nhóm nhỏ, rõ hướng trao đổi | Nghe, xem, ghi và truyền đạt | Tập trung |
| Cơ sở Việt Minh | Sân chung với nhiều đường hoạt động | Gặp gỡ và cùng nhận việc | Gắn bó, có sức sống |
| Căn cứ | Sinh hoạt, tiếp tế và chuẩn bị song song | Công việc bền bỉ | Sẵn sàng dần |
| Kho thóc | Luồng từ cửa kho tới người nhận | Nâng, chuyển, chia | Khẩn thiết và nhân văn |
| Thời cơ | Cơ sở sẵn sàng, khoảng thoáng trên cao | Tin đến rồi chuyển sang hành động | Chờ đợi → khẩn trương |
| Tổng khởi nghĩa | Nhiều dòng người thành một luồng lớn | Nhập đoàn, tiến tới, tiếp quản | Quy mô và quyết tâm |
| Độc lập | Toàn cảnh–trung cảnh–toàn cảnh | Phát biểu, lắng nghe, cờ | Trang nghiêm, giải tỏa cảm xúc |

## 7. Tiêu chí duyệt bản phác trước khi vẽ chi tiết

1. Khi che chữ và giao diện, người xem còn nhận ra ai đang làm gì, ở đâu, vật gì thay đổi không?
2. Hành động có hệ quả vật lý thấy được: giấy đã được nhận, bao thóc đã được đặt, người đã tham gia, cơ sở đã có hoạt động?
3. Vai trò nhân dân và tổ chức đọc được qua công việc; không chỉ dùng lời giải thích để gán ý nghĩa cho hình không thể hiện điều đó.
4. Cảnh kế tiếp khác cảnh trước ở bố cục, hoạt động hoặc tình hình, không chỉ đổi màu và nhãn năm.
5. Cảnh có tên lịch sử có thư mục tham chiếu: ảnh, ngày ảnh, chú thích, điểm chắc chắn và điểm biên tập. Không coi phác bố cục là bản tái dựng đã xác minh.
6. Có bản bố cục điện thoại; người và vật quan trọng không bị cắt mất hay thu nhỏ tới mức chỉ còn chấm.
7. Mỗi icon/chi tiết thường trực có vai trò: địa điểm, hành động, trạng thái hoặc ngữ cảnh. Không rải dấu, tia sáng, hạt bụi hoặc đạo cụ không có mục đích chỉ để ảnh trông “đầy”.

## 8. Đầu ra của một brief hình ảnh hoàn chỉnh

Mỗi đoạn cần: (a) một câu về điều phải nhìn thấy; (b) ba ảnh phác nhịp trước–đang–sau; (c) ảnh tham chiếu có chú thích; (d) sơ đồ lớp nền; (e) danh sách sprite và đạo cụ; (f) hình khóa của động tác trọng tâm; (g) bố cục ngang/dọc; (h) chi tiết lịch sử còn chờ xác minh. Các nút và luật chơi sẽ được thiết kế ở bước khác.

Các số người ở bản phác chỉ thể hiện quy mô/bố cục, trừ khi đã ghi rõ tái dựng một đội hình có quy mô lịch sử cụ thể. Không tạo ảnh tư liệu giả hoặc dùng phác pixel để chứng minh một chi tiết lịch sử.
