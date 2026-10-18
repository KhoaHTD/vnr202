window.GAME_DATA = {
chapters:[{name:'Gây dựng & khôi phục',years:'1930–1935',image:{src:'assets/img/1945-giai-phong-quan-duong-pho.webp',width:500,height:334,focus:'35% 50%',alt:'Đoàn người mang súng, đội mũ, diễu hành trên đường phố, người dân đứng hai bên',caption:'Ảnh mẫu cho ô ảnh chương 1, cần thay bằng ảnh tư liệu 1930–1935',date:'',source:'',license:''}},{name:'Mở rộng phong trào',years:'1936–1939',image:{src:'',alt:'',caption:'',date:'',source:'',license:''}},{name:'Chuẩn bị & chớp thời cơ',years:'1939–1945',image:{src:'assets/img/1945-giai-phong-quan-duong-pho.webp',width:500,height:334,focus:'35% 50%',alt:'Đoàn người mang súng, đội mũ, diễu hành trên đường phố, người dân đứng hai bên',caption:'Lực lượng vũ trang cách mạng trên đường phố, 1945',date:'1945',source:'',license:''}}],
// Ảnh tư liệu: src rỗng = khung giữ chỗ; xóa hẳn trường image = không hiện gì. Danh sách ô ảnh: docs/anh-tu-lieu.md
// width/height = kích thước thật của file; focus = object-position (điểm nhìn chính); composite = ảnh ghép.
// source, license: NHÓM PHẢI ĐIỀN và xác minh chú thích trước khi phát hành.
endingImage:{src:'assets/img/1945-09-02-ba-dinh.webp',width:500,height:260,focus:'75% 40%',portrait:'84% 40%',quote:'“Tất cả mọi người đều sinh ra có quyền bình đẳng. Tạo hóa cho họ những quyền không ai có thể xâm phạm được; trong những quyền ấy, có quyền được sống, quyền tự do và quyền mưu cầu hạnh phúc.”',composite:true,alt:'Ảnh ghép hai khung: bên trái là biển người cùng lá cờ đỏ sao vàng, bên phải là Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập',caption:'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, 2/9/1945 (ảnh ghép)',date:'2/9/1945',source:'',license:''},
// place.lat/lon = vĩ độ, kinh độ thật (bản đồ chiếu bằng MAP_DATA.project). off = ngoài lãnh thổ Việt Nam. x/y cũ chỉ còn là dự phòng.
// BẢN NHÁP NỘI DUNG: mọi năm, tên sự kiện, gợi ý cần nhóm đối chiếu giáo trình trước khi dùng thật.
// Mỗi chặng có kind: 'match' ghép thẻ vào 2 điểm nóng · 'order' xếp 4 thẻ theo thời gian · 'tf' 5 câu đúng/sai (sinh từ 4 thẻ) · 'boss' màn trùm chặng 9 (chọn 4 thẻ sưu tầm chứng minh chuẩn bị lâu dài). Mỗi chặng: 2 điểm nóng (slots) + 4 thẻ (2 thẻ đúng gắn slot, 2 thẻ nhiễu slot:null).
// t = số dùng để xếp thẻ trong album (năm + tháng/12). hint1 = gợi ý nấc 1 viết riêng cho từng thẻ nhiễu.
// slot.hint2 = gợi ý nội dung (nấc 2), slot.why = lời giải "Vì sao?" (nấc 3), slot.swap = gợi ý khi đặt thẻ đúng nhầm ô.
// slot.fx: 'light' (ánh sáng rọi vào điểm) | 'route' (đường liên lạc nối hai điểm) | 'seal' (con dấu năm); slot.caption = chú thích hiện ra khi đúng.
scenes:[
{chapter:0,date:'1930–1931',title:'Từ những tiếng nói riêng lẻ',record:0,motif:'flag',place:{name:'Nghệ–Tĩnh',lat:18.7,lon:105.7,x:53,y:68},kind:'match',
 news:'Khủng hoảng kinh tế 1929–1933 tác động đến Đông Dương. Pháp tăng bóc lột và đàn áp, đời sống nhân dân khó khăn.',
 image:{src:''},
 slots:[
  {id:'A',situation:'Các tổ chức cộng sản hoạt động rời rạc, phong trào cần một chính đảng thống nhất.',x:27,y:56,correct:'c1',fx:'seal',caption:'Một Đảng duy nhất ra đời',
   hint2:'Cần một sự kiện gộp các tổ chức cộng sản thành một đảng duy nhất.',
   why:'Hội nghị hợp nhất thống nhất các tổ chức cộng sản thành một Đảng, chấm dứt tình trạng chia rẽ và có Cương lĩnh chính trị đầu tiên.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần sự kiện thống nhất tổ chức.'},
  {id:'B',situation:'Thuế nặng, thất nghiệp, nông dân Nghệ–Tĩnh đứng lên và lập chính quyền của dân.',x:72,y:44,correct:'c2',fx:'light',caption:'Chính quyền của dân ở Nghệ–Tĩnh',
   hint2:'Cần phong trào quần chúng có chính quyền của dân ở một số địa phương.',
   why:'Xô viết Nghệ–Tĩnh là đỉnh cao của phong trào 1930–1931: dân tự quản lý đời sống, chia ruộng công, bãi bỏ thuế thân, thuế chợ, thuế đò, thuế muối, mở lớp chữ Quốc ngữ.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần phong trào quần chúng tự quản.'}],
 cards:[
  {id:'c1',name:'Hội nghị hợp nhất thành lập Đảng',year:'Tháng 2/1930',t:1930.1,slot:'A'},
  {id:'c2',name:'Xô viết Nghệ–Tĩnh',year:'1930–1931',t:1930.7,slot:'B'},
  {id:'c3',name:'Đại hội I của Đảng tại Ma Cao',year:'Tháng 3/1935',t:1935.2,slot:null,hint1:'Đại hội I diễn ra tháng 3/1935, muộn hơn tình huống này 5 năm. Hãy tìm sự kiện của năm 1930.'},
  {id:'c4',name:'Hội nghị Trung ương 8, thành lập Việt Minh',year:'Tháng 5/1941',t:1941.4,slot:null,hint1:'Hội nghị Trung ương 8 diễn ra năm 1941, muộn hơn tình huống này 11 năm. Hãy tìm sự kiện của năm 1930.'}],
 explain:'Phong trào 1930–1931 thể hiện sức mạnh công–nông và vai trò tổ chức, lãnh đạo của Đảng. Xô viết Nghệ–Tĩnh là đỉnh cao, với những hoạt động quản lý đời sống ở một số địa phương.',
 link:'Khủng hoảng và bóc lột → một chính đảng thống nhất → phong trào công–nông.'},
{chapter:0,date:'1932–1935',title:'Giữ những mạch nối',record:1,motif:'document',place:{name:'Ma Cao',lat:22.2,lon:113.55,x:92,y:20,off:true},kind:'match',
 news:'Sau cao trào, thực dân Pháp đàn áp khốc liệt. Nhiều cơ sở bị phá vỡ, cán bộ bị bắt, phong trào gặp khó khăn.',
 image:{src:''},
 slots:[
  {id:'A',situation:'Cơ sở bị phá vỡ, cán bộ bị bắt. Cần văn kiện vạch nhiệm vụ trước mắt, nhấn mạnh xây dựng một Đảng bí mật, kỷ luật sắt.',x:30,y:52,correct:'c1',fx:'route',caption:'Đường liên lạc được nối lại',
   hint2:'Cần một văn kiện đề ra nhiệm vụ để duy trì và khôi phục hoạt động.',
   why:'Chương trình hành động năm 1932 nêu nhiệm vụ trước mắt, giúp duy trì cơ sở và từng bước khôi phục phong trào sau đàn áp.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần văn kiện định hướng khôi phục.'},
  {id:'B',situation:'Các cơ sở đã nối lại. Cần đại hội đại biểu toàn quốc đầu tiên, bầu Ban Chấp hành Trung ương mới.',x:70,y:48,correct:'c2',fx:'seal',caption:'Hệ thống tổ chức của Đảng phục hồi',
   hint2:'Cần một kỳ đại hội của Đảng, diễn ra ở nước ngoài vì trong nước bị đàn áp.',
   why:'Đại hội I (3/1935, Ma Cao) đánh dấu sự phục hồi hệ thống tổ chức của Đảng, dù vẫn còn hạn chế về chiến lược.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần một đại hội củng cố tổ chức.'}],
 cards:[
  {id:'c1',name:'Chương trình hành động của Đảng',year:'15/6/1932',t:1932.45,slot:'A'},
  {id:'c2',name:'Đại hội I của Đảng tại Ma Cao',year:'Tháng 3/1935',t:1935.2,slot:'B'},
  {id:'c3',name:'Luận cương chính trị, Hội nghị Trung ương lần 1 tại Hương Cảng',year:'Tháng 10/1930',t:1930.8,slot:null,hint1:'Luận cương chính trị ra đời tháng 10/1930, sớm hơn giai đoạn này. Hãy tìm sự kiện trong khoảng 1932–1935.'},
  {id:'c4',name:'Ban Chỉ huy ở ngoài của Đảng được thành lập',year:'Đầu năm 1934',t:1934.1,slot:null,hint1:'Ban Chỉ huy ở ngoài thành lập đầu 1934, nằm trong giai đoạn nhưng không phải văn kiện khôi phục (1932) cũng không phải đại hội (1935).'}],
 explain:'Việc giữ vững tổ chức giúp phong trào tiếp tục sau đàn áp. Luận cương tháng 10/1930 có đóng góp nhưng còn hạn chế về nhiệm vụ dân tộc và tập hợp lực lượng; những vấn đề này cần được tiếp tục khắc phục.',
 link:'Đàn áp → khôi phục tổ chức → nền tảng cho cao trào tiếp theo.'},
{chapter:1,date:'1936',title:'Một cánh cửa mở ra',record:2,motif:'meeting',place:{name:'Thượng Hải',lat:31.2,lon:121.5,x:92,y:6,off:true},kind:'order',
 news:'Nguy cơ phát xít gia tăng. Đại hội VII Quốc tế Cộng sản chủ trương mặt trận rộng rãi; Chính phủ Mặt trận Nhân dân Pháp lên nắm quyền năm 1936.',
 image:{src:''},
 slots:[
  {id:'A',situation:'Mặt trận Nhân dân Pháp lên cầm quyền. Đảng cần đường lối mới cho điều kiện thuận lợi hơn.',x:28,y:54,correct:'c1',fx:'light',caption:'Đường lối mới: công khai kết hợp bí mật',
   hint2:'Cần một hội nghị của Trung ương định ra nhiệm vụ mới, lập mặt trận rộng rãi.',
   why:'Hội nghị Trung ương (26/7/1936) xác định nhiệm vụ trước mắt, chủ trương lập Mặt trận nhân dân phản đế và kết hợp hoạt động công khai với bí mật.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần hội nghị định đường lối.'},
  {id:'B',situation:'Quần chúng mong cải cách dân chủ, cần nơi thu thập nguyện vọng của dân.',x:72,y:46,correct:'c2',fx:'route',caption:'Dân nguyện được thu thập khắp nơi',
   hint2:'Cần một phong trào thu thập nguyện vọng của dân, có các ủy ban hành động ở cơ sở.',
   why:'Phong trào Đông Dương Đại hội (1936) thu thập “dân nguyện”, lập hàng loạt ủy ban hành động ở nhà máy, đồn điền, thôn xóm.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần phong trào thu thập dân nguyện.'}],
 cards:[
  {id:'c1',name:'Hội nghị Trung ương tại Thượng Hải',year:'26/7/1936',t:1936.55,slot:'A'},
  {id:'c2',name:'Phong trào Đông Dương Đại hội',year:'1936',t:1936.6,slot:'B'},
  {id:'c3',name:'Đại hội I của Đảng tại Ma Cao',year:'Tháng 3/1935',t:1935.2,slot:null,hint1:'Đại hội I diễn ra tháng 3/1935, sớm hơn 1936 khoảng một năm.'},
  {id:'c4',name:'Đại hội VII Quốc tế Cộng sản',year:'Tháng 7/1935',t:1935.55,slot:null,hint1:'Đại hội VII Quốc tế Cộng sản họp tháng 7/1935, sớm hơn hai sự kiện năm 1936 khoảng một năm.'}],
 explain:'Điều kiện quốc tế tạo cơ hội hoạt động mới. Đảng điều chỉnh nhiệm vụ trước mắt và hình thức đấu tranh, gắn phong trào với nhu cầu thiết thực của nhân dân.',
 link:'Điều kiện mới → đường lối mới → thu thập dân nguyện.'},
{chapter:1,date:'1936–1939',title:'Tập hợp thành sức mạnh chung',record:3,motif:'crowd',place:{name:'Hà Nội',lat:21.03,lon:105.85,x:45,y:28},kind:'order',
 news:'Phong trào phát triển qua dân nguyện, báo chí, bãi công, văn hóa, giáo dục và hoạt động nghị trường.',
 image:{src:''},
 slots:[
  {id:'A',situation:'Cần chọn kẻ thù chính, tránh gắn máy móc giải phóng dân tộc với cách mạng ruộng đất.',x:30,y:50,correct:'c1',fx:'light',caption:'Chọn đúng kẻ thù chính, tập hợp rộng rãi',
   hint2:'Cần một văn kiện lý luận bước đầu khắc phục hạn chế của Luận cương 1930.',
   why:'“Chung quanh vấn đề chiến sách mới” (10/1936) nêu cần chọn kẻ thù chính nguy hiểm nhất để tập trung lực lượng, bước đầu khắc phục hạn chế của Luận cương.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần văn kiện lý luận về chiến sách.'},
  {id:'B',situation:'Phái viên và Toàn quyền Pháp sang Đông Dương, dân muốn đưa đơn nguyện vọng.',x:70,y:50,correct:'c2',fx:'seal',caption:'Mít tinh, đưa đơn dân nguyện',
   hint2:'Cần hoạt động công khai đón phái viên Pháp để đưa dân nguyện.',
   why:'Đầu 1937, nhân phái viên và Toàn quyền sang Đông Dương, Đảng tổ chức mít tinh, biểu tình, đưa đơn “dân nguyện”, tận dụng điều kiện hợp pháp.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần hoạt động đón phái viên.'}],
 cards:[
  {id:'c1',name:'Văn kiện “Chung quanh vấn đề chiến sách mới”',year:'Tháng 10/1936',t:1936.8,slot:'A'},
  {id:'c2',name:'Đón phái viên và Toàn quyền Pháp',year:'Đầu năm 1937',t:1937.1,slot:'B'},
  {id:'c3',name:'Hội nghị Trung ương nhấn mạnh Mặt trận Dân chủ thống nhất',year:'Tháng 3/1938',t:1938.2,slot:null,hint1:'Hội nghị Trung ương tháng 3/1938 muộn hơn đón phái viên (đầu 1937) và sớm hơn các sự kiện 1939.'},
  {id:'c4',name:'Tác phẩm “Tự chỉ trích” của Nguyễn Văn Cừ',year:'1939',t:1939.5,slot:null,hint1:'Tác phẩm “Tự chỉ trích” ra đời năm 1939, muộn hơn các sự kiện 1936–1938 trong chặng này.'}],
 explain:'Phong trào dân chủ rèn luyện lực lượng chính trị rộng lớn. Văn kiện “Chung quanh vấn đề chiến sách mới” đặt vấn đề lựa chọn kẻ thù chính và tránh gắn máy móc giải phóng dân tộc với cách mạng ruộng đất.',
 link:'Mở rộng mặt trận → chọn đúng kẻ thù → rèn luyện quần chúng.'},
{chapter:2,date:'1939–1941',title:'Độc lập là nhiệm vụ cấp thiết',record:4,motif:'meeting',place:{name:'Pác Bó, Cao Bằng',lat:22.97,lon:106.05,x:46,y:6},kind:'tf',tfSeconds:40,
 tf:[ // Câu đúng/sai viết tay theo docs/noi-dung-goc.md (chú thích = dòng nguồn)
  {text:'Hội nghị Trung ương tháng 11/1939 họp tại Bà Điểm, Hóc Môn, Gia Định, do Tổng Bí thư Nguyễn Văn Cừ chủ trì.',answer:true,explain:'Đúng: Hội nghị họp ngày 6–8/11/1939 tại Bà Điểm, Hóc Môn, Gia Định, do Nguyễn Văn Cừ chủ trì.'}, // dòng 345
  {text:'Khởi nghĩa Nam Kỳ nổ ra trước Khởi nghĩa Bắc Sơn.',answer:false,explain:'Sai: Bắc Sơn nổ ra ngày 27/9/1940, Nam Kỳ ngày 23/11/1940, nên Bắc Sơn đi trước.'}, // dòng 361–362
  {text:'Hội nghị tháng 11/1939 chủ trương tạm gác khẩu hiệu cách mạng ruộng đất để tập trung cho nhiệm vụ giải phóng dân tộc.',answer:true,explain:'Đúng: Hội nghị thay bằng các yêu cầu như tịch thu ruộng đất của đế quốc và địa chủ phản bội dân tộc, chống tô cao, lãi nặng.'}, // dòng 347
  {text:'Hội nghị Trung ương tháng 11/1940 quyết định phát động khởi nghĩa Nam Kỳ.',answer:false,explain:'Sai: Hội nghị quyết định đình chỉ khởi nghĩa Nam Kỳ vì điều kiện chưa chín muồi, đồng thời duy trì du kích Bắc Sơn.'}, // dòng 355
  {text:'Mặt trận Việt Minh ra đời ngày 19/5/1941, sau Hội nghị Trung ương lần thứ tám do Nguyễn Ái Quốc chủ trì tại Pác Bó.',answer:true,explain:'Đúng: Hội nghị họp từ 10 đến 19/5/1941 tại Pác Bó, Cao Bằng, hoàn chỉnh chủ trương đã mở đầu từ tháng 11/1939.'}, // dòng 371, 381
 ],
 news:'Chiến tranh thế giới thứ hai bùng nổ. Pháp tăng đàn áp; Nhật vào Đông Dương, khiến tình hình dân tộc thêm gay gắt.',
 image:{src:''},
 slots:[
  {id:'A',situation:'Chiến tranh thế giới bùng nổ, Pháp đàn áp. Đảng phải chuyển hướng hoạt động.',x:28,y:55,correct:'c1',fx:'route',caption:'Chuyển vào bí mật, giữ mạch nối',
   hint2:'Cần hội nghị Trung ương mở đầu việc chuyển hướng chỉ đạo, đưa nhiệm vụ giải phóng dân tộc lên hàng đầu.',
   why:'Hội nghị Trung ương tháng 11/1939 mở đầu chuyển hướng: chuyển vào hoạt động bí mật, đặt nhiệm vụ giải phóng dân tộc lên hàng đầu.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần hội nghị mở đầu chuyển hướng.'},
  {id:'B',situation:'Nhật vào Đông Dương, cần mặt trận đoàn kết mọi người yêu nước để cứu nước.',x:72,y:46,correct:'c2',fx:'seal',caption:'Mặt trận Việt Minh ra đời',
   hint2:'Cần hội nghị hoàn chỉnh chủ trương giải phóng dân tộc và lập một mặt trận mới.',
   why:'Hội nghị Trung ương 8 (5/1941) hoàn chỉnh chuyển hướng, đặt lợi ích dân tộc lên trên hết; Việt Minh ra đời ngày 19/5/1941.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần hội nghị lập mặt trận cứu quốc.'}],
 cards:[
  {id:'c1',name:'Hội nghị Trung ương mở đầu chuyển hướng',year:'Tháng 11/1939',t:1939.85,slot:'A'},
  {id:'c2',name:'Hội nghị Trung ương 8, thành lập Việt Minh',year:'Tháng 5/1941',t:1941.4,slot:'B'},
  {id:'c3',name:'Đại hội I của Đảng tại Ma Cao',year:'Tháng 3/1935',t:1935.2,slot:null,hint1:'Đại hội I diễn ra năm 1935, sớm hơn giai đoạn này 4 năm trở lên. Hãy tìm sự kiện từ 1939 đến 1941.'},
  {id:'c4',name:'Quân lệnh số 1',year:'13/8/1945',t:1945.6,slot:null,hint1:'Quân lệnh số 1 ban hành năm 1945, muộn hơn giai đoạn này 4 năm trở lên. Hãy tìm sự kiện từ 1939 đến 1941.'}],
 explain:'Sự chuyển hướng là một quá trình. Hội nghị tháng 11/1940 chưa hoàn toàn dứt khoát; Hội nghị VIII hoàn chỉnh chủ trương, đặt lợi ích dân tộc lên trên quyền lợi bộ phận.',
 link:'Chiến tranh và áp bức → ưu tiên giải phóng dân tộc → Việt Minh.'},
{chapter:2,date:'1941–1944',title:'Chuẩn bị từ những việc bền bỉ',record:5,motif:'star',place:{name:'Cao Bằng',lat:22.67,lon:106.25,x:50,y:10},kind:'tf',tfSeconds:40,
 tf:[ // Câu đúng/sai viết tay theo docs/noi-dung-goc.md (chú thích = dòng nguồn)
  {text:'Lực lượng Cứu quốc quân hình thành từ lực lượng du kích Ba Tơ.',answer:false,explain:'Sai: Các đơn vị Cứu quốc quân hình thành từ lực lượng du kích Bắc Sơn. Du kích Ba Tơ ra đời sau khởi nghĩa Ba Tơ (11/3/1945).'}, // dòng 391, 415
  {text:'Cao Bằng là địa bàn thí điểm vận động nhân dân tham gia Việt Minh qua các hội cứu quốc.',answer:true,explain:'Đúng: Cao Bằng làm thí điểm, sau đó phong trào từng bước mở rộng.'}, // dòng 387
  {text:'Hội nghị Ban Thường vụ Trung ương tại Võng La (tháng 2/1943) đề ra các biện pháp chuẩn bị khởi nghĩa.',answer:true,explain:'Đúng: Hội nghị đề ra biện pháp phát triển phong trào quần chúng và chuẩn bị khởi nghĩa.'}, // dòng 397
  {text:'Đề cương về văn hóa Việt Nam ra đời sau khi Đội Việt Nam Tuyên truyền Giải phóng quân thành lập.',answer:false,explain:'Sai: Đề cương về văn hóa ra đời năm 1943, còn Đội Việt Nam Tuyên truyền Giải phóng quân thành lập ngày 22/12/1944.'}, // dòng 389, 393
  {text:'Ngay sau khi thành lập, Đội Việt Nam Tuyên truyền Giải phóng quân thắng trận Phai Khắt và Nà Ngần.',answer:true,explain:'Đúng: Thắng lợi này củng cố niềm tin và mở rộng ảnh hưởng của cách mạng.'}, // dòng 393
 ],
 news:'Phong trào Việt Minh phát triển. Công tác xây dựng lực lượng chính trị, vũ trang và căn cứ địa được đẩy mạnh.',
 image:{src:''},
 slots:[
  {id:'A',situation:'Trí thức, văn nghệ sĩ cần được vận động và định hướng nền văn hóa mới.',x:30,y:52,correct:'c1',fx:'light',caption:'Trí thức, văn nghệ sĩ ngả theo cách mạng',
   hint2:'Cần một văn kiện định hướng văn hóa, thu hút giới trí thức.',
   why:'Đề cương về văn hóa Việt Nam (1943) xác định phương hướng văn hóa cách mạng, góp phần mở rộng vận động trí thức.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần văn kiện về văn hóa.'},
  {id:'B',situation:'Các đội du kích đã phát triển, cần một lực lượng vũ trang tập trung đầu tiên.',x:70,y:50,correct:'c2',fx:'seal',caption:'Đội quân đầu tiên ra đời ở Cao Bằng',
   hint2:'Cần sự kiện thành lập một đội quân tuyên truyền kiêm chiến đấu.',
   why:'Ngày 22/12/1944, Đội Việt Nam Tuyên truyền Giải phóng quân thành lập, rồi thắng trận Phai Khắt, Nà Ngần.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần sự kiện lập đội quân.'}],
 cards:[
  {id:'c1',name:'Đề cương về văn hóa Việt Nam',year:'1943',t:1943.5,slot:'A'},
  {id:'c2',name:'Đội Việt Nam Tuyên truyền Giải phóng quân',year:'22/12/1944',t:1944.97,slot:'B'},
  {id:'c3',name:'Khởi nghĩa Nam Kỳ',year:'Tháng 11/1940',t:1940.9,slot:null,hint1:'Khởi nghĩa Nam Kỳ diễn ra cuối năm 1940, sớm hơn giai đoạn này. Hãy tìm sự kiện từ 1941 đến 1944.'},
  {id:'c4',name:'Khởi nghĩa Ba Tơ',year:'11/3/1945',t:1945.2,slot:null,hint1:'Khởi nghĩa Ba Tơ diễn ra tháng 3/1945, muộn hơn giai đoạn này. Hãy tìm sự kiện từ 1941 đến 1944.'}],
 explain:'Ngày 22/12/1944, Đội Việt Nam Tuyên truyền Giải phóng quân được thành lập. Lực lượng vũ trang, chính trị và căn cứ bổ trợ nhau; không yếu tố nào tự mình giải thích được thắng lợi.',
 link:'Chuẩn bị lâu dài → khả năng hành động khi thời cơ đến.'},
{chapter:2,date:'THÁNG 3–7/1945',title:'Cao trào kháng Nhật',record:6,motif:'rice',place:{name:'Bắc Bộ',lat:21.1,lon:106.3,x:53,y:36},kind:'tf',tfSeconds:50,
 tf:[ // Câu đúng/sai viết tay theo docs/noi-dung-goc.md (chú thích = dòng nguồn)
  {text:'Chỉ thị ngày 12/3/1945 nhận định điều kiện tổng khởi nghĩa đã chín muồi sau cuộc đảo chính.',answer:false,explain:'Sai: Chỉ thị nhận định đảo chính tạo khủng hoảng chính trị sâu sắc nhưng điều kiện tổng khởi nghĩa chưa chín muồi.'}, // dòng 407
  {text:'Đảng thay khẩu hiệu “đánh đuổi Nhật – Pháp” bằng khẩu hiệu “đánh đuổi phát xít Nhật”.',answer:true,explain:'Đúng: Phát xít Nhật được xác định là kẻ thù cụ thể, trước mắt và duy nhất của nhân dân Đông Dương.'}, // dòng 409
  {text:'Phong trào phá kho thóc cứu đói phát triển mạnh ở Nam Bộ.',answer:false,explain:'Sai: Phong trào phát triển mạnh ở Bắc Bộ và Bắc Trung Bộ.'}, // dòng 417
  {text:'Ngày 15/5/1945, Cứu quốc quân và Việt Nam Tuyên truyền Giải phóng quân thống nhất thành Việt Nam Giải phóng quân.',answer:true,explain:'Đúng: Đây là một bước hoàn thiện điều kiện trực tiếp cho tổng khởi nghĩa.'}, // dòng 425
  {text:'Khu giải phóng Việt Bắc (4/6/1945) lấy Pác Bó làm trung tâm.',answer:false,explain:'Sai: Trung tâm của Khu giải phóng Việt Bắc là Tân Trào.'}, // dòng 425
 ],
 news:'Ngày 9/3/1945, Nhật đảo chính Pháp. Cuộc khủng hoảng chính trị sâu sắc xuất hiện nhưng điều kiện tổng khởi nghĩa chưa chín muồi.',
 image:{src:'assets/img/1945-giai-phong-quan-duong-pho.webp',width:500,height:334,focus:'35% 50%',alt:'Đoàn người mang súng, đội mũ, diễu hành trên đường phố, người dân đứng hai bên',caption:'Lực lượng vũ trang cách mạng trên đường phố, 1945',date:'1945',source:'',license:''},
 slots:[
  {id:'A',situation:'Nhật đảo chính Pháp. Đảng cần xác định kẻ thù trước mắt và hướng hành động.',x:30,y:56,correct:'c1',fx:'route',caption:'Kẻ thù trước mắt đã rõ',
   hint2:'Cần một chỉ thị xác định kẻ thù trước mắt, phát động cao trào kháng Nhật.',
   why:'Chỉ thị ngày 12/3/1945 xác định Nhật là kẻ thù trước mắt, phát động cao trào kháng Nhật cứu nước làm tiền đề cho tổng khởi nghĩa.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần chỉ thị xác định kẻ thù.'},
  {id:'B',situation:'Nạn đói 1945, dân cần lương thực.',x:72,y:46,correct:'c2',fx:'light',caption:'Kho thóc mở, dân được cứu đói',
   hint2:'Cần một hành động giải quyết trực tiếp việc thiếu lương thực.',
   why:'Phá kho thóc cứu đói gắn nhu cầu sống còn của dân với đấu tranh chống Nhật, kéo hàng triệu người vào phong trào.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần hành động cứu đói.'}],
 cards:[
  {id:'c1',name:'Chỉ thị “Nhật–Pháp bắn nhau và hành động của chúng ta”',year:'12/3/1945',t:1945.2,slot:'A'},
  {id:'c2',name:'Phá kho thóc cứu đói',year:'1945',t:1945.3,slot:'B'},
  {id:'c3',name:'Hội nghị Trung ương 8, thành lập Việt Minh',year:'Tháng 5/1941',t:1941.4,slot:null,hint1:'Hội nghị TW 8 diễn ra năm 1941, sớm hơn tình huống này 4 năm. Hãy tìm sự kiện của năm 1945.'},
  {id:'c4',name:'Quân lệnh số 1',year:'13/8/1945',t:1945.6,slot:null,hint1:'Quân lệnh số 1 ban hành tháng 8/1945, muộn hơn tình huống này vài tháng. Hãy tìm sự kiện từ tháng 3 đến tháng 7/1945.'}],
 explain:'Khởi nghĩa từng phần, phong trào phá kho thóc và phát triển vùng giải phóng rèn luyện quần chúng, chuẩn bị trực tiếp cho tổng khởi nghĩa. Không phát động tổng khởi nghĩa chỉ vì một biến cố đơn lẻ.',
 link:'Nhật đảo chính → cao trào kháng Nhật → chuẩn bị trực tiếp.'},
{chapter:2,date:'THÁNG 8/1945',title:'Nhận ra thời cơ',record:7,motif:'document',place:{name:'Tân Trào, Tuyên Quang',lat:21.77,lon:105.5,x:38,y:17},kind:'tf',tfSeconds:50,
 tf:[ // Câu đúng/sai viết tay theo docs/noi-dung-goc.md (chú thích = dòng nguồn)
  {text:'Hội nghị toàn quốc của Đảng họp sau khi Đại hội Quốc dân khai mạc.',answer:false,explain:'Sai: Hội nghị toàn quốc họp ngày 14–15/8, còn Đại hội Quốc dân khai mạc ngày 16/8/1945.'}, // dòng 443–445
  {text:'Quân lệnh số 1 được ban hành trước khi Nhật hoàng tuyên bố đầu hàng Đồng minh.',answer:true,explain:'Đúng: Quân lệnh số 1 đêm 13/8, còn Nhật hoàng tuyên bố đầu hàng ngày 15/8/1945.'}, // dòng 433, 441
  {text:'Thời cơ tổng khởi nghĩa chỉ tồn tại trong khoảng thời gian ngắn, trước khi quân Đồng minh vào Đông Dương giải giáp quân Nhật.',answer:true,explain:'Đúng: Vì vậy phải hành động nhanh chóng, giành chính quyền và xác lập vị thế độc lập.'}, // dòng 437
  {text:'Thắng lợi tháng Tám chủ yếu nhờ Nhật đầu hàng, sự chuẩn bị của cách mạng chỉ là yếu tố phụ.',answer:false,explain:'Sai: Nhật đầu hàng là điều kiện khách quan quan trọng, nhưng khả năng tận dụng bắt nguồn từ quá trình chuẩn bị và tổ chức đấu tranh của cách mạng.'}, // dòng 474
  {text:'Đại hội Quốc dân tại Tân Trào cử Ủy ban Dân tộc giải phóng Việt Nam do Hồ Chí Minh làm Chủ tịch.',answer:true,explain:'Đúng: Đại hội cũng tán thành chủ trương tổng khởi nghĩa và thông qua các chính sách lớn của Việt Minh.'}, // dòng 445
 ],
 news:'Nhật đi đến đầu hàng Đồng minh. Chính quyền thân Nhật khủng hoảng; quân Đồng minh chưa vào Đông Dương giải giáp quân Nhật.',
 image:{src:''},
 slots:[
  {id:'A',situation:'Nhật sắp đầu hàng, cần ra lệnh khởi nghĩa trên cả nước.',x:28,y:54,correct:'c1',fx:'route',caption:'Lệnh khởi nghĩa truyền đi',
   hint2:'Cần một mệnh lệnh của Ủy ban Khởi nghĩa toàn quốc.',
   why:'Ngày 13/8/1945, khi nhận tin Nhật sắp đầu hàng, Ủy ban Khởi nghĩa toàn quốc được thành lập và ban hành Quân lệnh số 1.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần mệnh lệnh khởi nghĩa.'},
  {id:'B',situation:'Cần sự đồng thuận của đại biểu cả nước và một bộ máy lãnh đạo mới.',x:72,y:48,correct:'c2',fx:'seal',caption:'Đại biểu cả nước nhất trí tổng khởi nghĩa',
   hint2:'Cần một đại hội đại biểu các tầng lớp nhân dân họp ở Tân Trào.',
   why:'Đại hội Quốc dân (khai mạc 16/8/1945, Tân Trào) tán thành chủ trương tổng khởi nghĩa, thông qua các chính sách lớn của Việt Minh và cử Ủy ban Dân tộc giải phóng Việt Nam do Hồ Chí Minh làm Chủ tịch.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần đại hội đại biểu quốc dân.'}],
 cards:[
  {id:'c1',name:'Quân lệnh số 1, Ủy ban Khởi nghĩa toàn quốc',year:'13/8/1945',t:1945.6,slot:'A'},
  {id:'c2',name:'Đại hội Quốc dân tại Tân Trào',year:'16/8/1945',t:1945.62,slot:'B'},
  {id:'c3',name:'Hội nghị hợp nhất thành lập Đảng',year:'Tháng 2/1930',t:1930.1,slot:null,hint1:'Hội nghị thành lập Đảng diễn ra năm 1930, sớm hơn tình huống này 15 năm. Hãy tìm sự kiện của tháng 8/1945.'},
  {id:'c4',name:'Nhật đảo chính Pháp',year:'9/3/1945',t:1945.2,slot:null,hint1:'Nhật đảo chính Pháp diễn ra ngày 9/3/1945, sớm hơn tình huống này 5 tháng. Hãy tìm sự kiện của tháng 8/1945.'}],
 explain:'Nhật đầu hàng là điều kiện khách quan quan trọng. Thắng lợi còn bắt nguồn từ sự chuẩn bị chủ động, sức mạnh nhân dân và quyết định chớp thời cơ; không tự động xảy ra chỉ vì Nhật thất bại.',
 link:'Thời cơ khách quan + chuẩn bị chủ quan → quyết định tổng khởi nghĩa.'},
{chapter:2,date:'THÁNG 8–9/1945',title:'Những mạch nối cùng chuyển động',record:8,motif:'flag',place:{name:'Ba Đình, Hà Nội',lat:21.04,lon:105.84,x:47,y:31},kind:'boss',
 news:'Quân lệnh số 1 được ban hành đêm 13/8. Hội nghị toàn quốc của Đảng và Đại hội Quốc dân tại Tân Trào thông qua các quyết định quan trọng.',
 image:{src:'assets/img/1945-08-19-nha-hat-lon.webp',width:500,height:329,focus:'50% 35%',alt:'Đông đảo quần chúng mít tinh trước Nhà hát lớn Hà Nội, lá cờ đỏ sao vàng lớn treo giữa mặt tiền',caption:'Mít tinh tại quảng trường Nhà hát lớn Hà Nội, 19/8/1945',date:'19/8/1945',source:'',license:''},
 slots:[
  {id:'A',situation:'Thủ đô còn trong tay chính quyền thân Nhật, quần chúng đã sẵn sàng xuống đường.',x:30,y:60,correct:'c1',fx:'light',caption:'Biển người trước Nhà hát lớn',
   hint2:'Cần cuộc khởi nghĩa giành chính quyền ở Hà Nội.',
   why:'Ngày 19/8/1945, quần chúng Hà Nội mít tinh rồi giành chính quyền, tạo sức lan tỏa cho cả nước (Huế 23/8, Sài Gòn 25/8).',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần cuộc giành chính quyền ở thủ đô.'},
  {id:'B',situation:'Chính quyền đã về tay nhân dân, cần tuyên bố với thế giới nước Việt Nam độc lập.',x:72,y:42,correct:'c2',fx:'seal',caption:'Nước Việt Nam Dân chủ Cộng hòa ra đời',
   hint2:'Cần một văn kiện lịch sử đọc tại Quảng trường Ba Đình.',
   why:'Ngày 2/9/1945, Hồ Chí Minh đọc Tuyên ngôn Độc lập, tuyên bố thành lập nước Việt Nam Dân chủ Cộng hòa.',
   swap:'Sự kiện này có thật nhưng đang giải quyết việc khác. Ô này cần văn kiện tuyên bố độc lập.'}],
 cards:[
  {id:'c1',name:'Giành chính quyền ở Hà Nội',year:'19/8/1945',t:1945.63,slot:'A'},
  {id:'c2',name:'Tuyên ngôn Độc lập',year:'2/9/1945',t:1945.67,slot:'B'},
  {id:'c3',name:'Khu giải phóng Việt Bắc',year:'Tháng 6/1945',t:1945.45,slot:null,hint1:'Khu giải phóng Việt Bắc thành lập tháng 6/1945, sớm hơn tình huống này khoảng hai tháng. Hãy tìm sự kiện từ 19/8 đến 2/9/1945.'},
  {id:'c4',name:'Hội nghị Trung ương 8, thành lập Việt Minh',year:'Tháng 5/1941',t:1941.4,slot:null,hint1:'Hội nghị TW 8 diễn ra năm 1941, sớm hơn tình huống này 4 năm. Hãy tìm sự kiện của năm 1945.'}],
 explain:'Hà Nội giành chính quyền ngày 19/8, Huế 23/8, Sài Gòn 25/8. Ngày 2/9/1945, Hồ Chí Minh đọc Tuyên ngôn Độc lập, tuyên bố thành lập nước Việt Nam Dân chủ Cộng hòa.',
 link:'Lãnh đạo phù hợp + nhân dân + chuẩn bị + chớp thời cơ → thắng lợi.',
 bonus:'Cách mạng Tháng Tám có phải “ăn may” không? Hãy lập luận trong 1 phút.'}
],
records:[
['Phong trào 1930–1931 và Xô viết Nghệ–Tĩnh','Từ đấu tranh đòi đời sống, phong trào phát triển với khẩu hiệu chính trị. Xô viết ra đời ở một số địa phương Nghệ An, Hà Tĩnh, thực hiện quyền làm chủ, chia ruộng công, bãi bỏ một số thuế, mở lớp chữ Quốc ngữ và giữ trật tự. Phong trào bị đàn áp nhưng khẳng định vai trò lãnh đạo của Đảng và sức mạnh liên minh công–nông.'],
['Luận cương, khôi phục và Đại hội I','Luận cương tháng 10/1930 nêu nhiều vấn đề chiến lược, xác định công–nông là động lực và Đảng là lực lượng lãnh đạo. Hạn chế: chưa nhấn mạnh đúng mức giải phóng dân tộc, nặng về giai cấp và ruộng đất, chưa tập hợp rộng rãi. Trong tù, các chiến sĩ duy trì đấu tranh và học tập. Chương trình hành động năm 1932, Ban Chỉ huy ở ngoài năm 1934 và Đại hội I tại Ma Cao tháng 3/1935 gắn với khôi phục tổ chức. Đại hội vẫn có hạn chế về chiến lược và tập hợp lực lượng.'],
['Bối cảnh và chủ trương 1936–1939','Nguy cơ phát xít, Đại hội VII Quốc tế Cộng sản và Chính phủ Mặt trận Nhân dân Pháp tạo bối cảnh mới. Đảng đề ra nhiệm vụ trước mắt chống phản động thuộc địa, phát xít, chiến tranh; đòi tự do, dân chủ, cơm áo, hòa bình. Kết hợp hoạt động công khai, nửa công khai, hợp pháp, nửa hợp pháp với bí mật.'],
['Phong trào dân chủ và nhận thức mới','Tiêu biểu: Đông Dương Đại hội, đón phái viên và đưa dân nguyện, báo chí, bãi công, hoạt động văn hóa, giáo dục, nghị trường. Các tác phẩm được nhóm nêu gồm Vấn đề dân cày, Chủ nghĩa Các Mác và Tự chỉ trích. Văn kiện Chung quanh vấn đề chiến sách mới (10/1936) thể hiện nhận thức mới về nhiệm vụ dân tộc và ruộng đất. Phong trào mở rộng và rèn luyện lực lượng chính trị. Tháng 9/1939, hoàn cảnh thay đổi, Đảng chuyển vào bí mật.'],
['Chuyển hướng 1939–1941','Hội nghị tháng 11/1939 mở đầu chuyển hướng. Hội nghị tháng 11/1940 chủ trương duy trì du kích Bắc Sơn và đình chỉ khởi nghĩa Nam Kỳ vì điều kiện chưa chín muồi. Bắc Sơn (27/9/1940), Nam Kỳ (23/11/1940), Đô Lương (13/1/1941) để lại bài học về chuẩn bị, phối hợp và thời cơ. Nguyễn Ái Quốc về nước ngày 28/1/1941. Hội nghị VIII tháng 5/1941 hoàn chỉnh chủ trương giải phóng dân tộc, giải quyết vấn đề dân tộc trong từng nước Đông Dương, chuẩn bị khởi nghĩa. Việt Minh ra đời ngày 19/5/1941.'],
['Lực lượng và căn cứ 1941–1944','Các hội cứu quốc phát triển lực lượng chính trị. Đề cương về văn hóa Việt Nam năm 1943 góp phần mở rộng vận động trí thức. Du kích Bắc Sơn, Cứu quốc quân và các đội tự vệ phát triển; Đội Việt Nam Tuyên truyền Giải phóng quân thành lập ngày 22/12/1944, thắng ở Phai Khắt và Nà Ngần. Bắc Sơn–Võ Nhai, Cao Bằng là những địa bàn căn cứ quan trọng.'],
['Cao trào kháng Nhật và khởi nghĩa từng phần','Sau đảo chính 9/3, Chỉ thị Nhật–Pháp bắn nhau và hành động của chúng ta (12/3/1945) điều chỉnh kẻ thù và khẩu hiệu. Phá kho thóc cứu đói phát triển ở Bắc Bộ, Bắc Trung Bộ. Khởi nghĩa Ba Tơ ngày 11/3 dẫn đến Đội du kích Ba Tơ. Ngày 15/5, các lực lượng thống nhất thành Việt Nam Giải phóng quân; ngày 4/6 thành lập Khu giải phóng Việt Bắc, trung tâm Tân Trào.'],
['Thời cơ và quyết định tổng khởi nghĩa','Nhật hoàng tuyên bố đầu hàng ngày 15/8/1945. Ngày 13/8, khi nhận tin Nhật sắp đầu hàng, Ủy ban Khởi nghĩa toàn quốc được thành lập và ban hành Quân lệnh số 1. Hội nghị toàn quốc của Đảng ngày 14–15/8 và Đại hội Quốc dân khai mạc 16/8 tại Tân Trào đưa ra những quyết định quan trọng. Thời cơ cần được nắm bắt trước khi quân Đồng minh vào giải giáp.'],
['Thắng lợi, ý nghĩa và bài học','Các mốc: 18/8 Bắc Giang, Hải Dương, Hà Tĩnh, Quảng Nam; 19/8 Hà Nội; 23/8 Huế; 25/8 Sài Gòn; 28/8 Đồng Nai Thượng, Hà Tiên; 30/8 Bảo Đại thoái vị; 2/9 Tuyên ngôn Độc lập. Cách mạng lật đổ ách thống trị thực dân, phát xít và chấm dứt quân chủ, lập nước Việt Nam Dân chủ Cộng hòa, cổ vũ giải phóng dân tộc. Chưa giải quyết hoàn toàn quan hệ ruộng đất phong kiến. Bài học: đường lối đúng, đoàn kết, chuẩn bị lực lượng, kết hợp chính trị với vũ trang và hành động kịp thời.',{src:'assets/img/1945-09-02-ba-dinh.webp',width:500,height:260,focus:'75% 40%',composite:true,alt:'Ảnh ghép hai khung: bên trái là biển người cùng lá cờ đỏ sao vàng, bên phải là Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập',caption:'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, 2/9/1945 (ảnh ghép)',date:'2/9/1945',source:'',license:''}]
]};

