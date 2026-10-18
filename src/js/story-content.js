(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.StoryData=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 // References belong to the authoring model; the player sees historical explanations only.
 const chapters=[
  {id:'1930-1935',period:'1930–1935',title:'Giữ lấy ngọn lửa',scene:0,closing:'Phong trào bị đàn áp, nhưng kinh nghiệm đấu tranh và những cơ sở được khôi phục tiếp tục nối dài hành trình.'},
  {id:'1936-1939',period:'1936–1939',title:'Tiếng nói thành sức mạnh',scene:1,closing:'Những cuộc vận động dân chủ mở rộng hàng ngũ và rèn luyện lực lượng chính trị cho chặng đường tiếp theo.'},
  {id:'1939-1945',period:'1939–1945',title:'Đường đến độc lập',scene:8,closing:'Cách mạng tháng Tám thắng lợi. Ngày 2/9/1945, nước Việt Nam Dân chủ Cộng hòa ra đời.'}
 ];
 const questions=[];
 function q(chapter,id,scene,title,story,prompt,choices,refs){
  const options=choices.map(([text,why],i)=>({id:String(i),text,why}));
  // Stable shuffled positions keep reloads consistent without a repeating A/B/C/D pattern.
  let seed=[...id].reduce((n,c)=>Math.imul(n^c.charCodeAt(0),16777619)>>>0,2166136261);
  for(let i=options.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=Math.floor(seed/4294967296*(i+1));[options[i],options[j]]=[options[j],options[i]];}
  questions.push({chapter,id,scene,title,story,prompt,options,answer:'0',refs});
 }
 q(0,'c1-demands',0,'Từ cổng xưởng đến đường làng',
  'Tiếng phản đối vang lên từ xưởng máy rồi lan ra làng quê. Những người xuống đường cần cải thiện đời sống, nhưng điều họ đòi hỏi không dừng ở bữa ăn.',
  'Nhóm yêu sách nào thể hiện đúng sự kết hợp trong phong trào đầu năm 1930?',[
   ['Tăng lương, giảm giờ làm, giảm sưu thuế; đồng thời xuất hiện khẩu hiệu chống đế quốc, phong kiến.','Phong trào kết hợp yêu sách kinh tế thiết thân với khẩu hiệu chính trị; không tách đời sống công–nông khỏi sự áp bức đế quốc, phong kiến.'],
   ['Tự do, dân chủ, cơm áo, hòa bình; tập hợp lực lượng qua những hình thức công khai, hợp pháp.','Đây là nét nổi bật của phong trào dân chủ 1936–1939. Đầu năm 1930 đã có yêu sách kinh tế đi cùng khẩu hiệu chống đế quốc, phong kiến.'],
   ['Tạm gác cách mạng ruộng đất; tập trung lực lượng vào nhiệm vụ trực tiếp giải phóng dân tộc.','Đây là hướng điều chỉnh được mở đầu tháng 11/1939 và hoàn chỉnh năm 1941, không phải nhóm yêu sách đang xét của đầu năm 1930.'],
   ['Đánh đuổi phát xít Nhật; phát động cao trào cứu nước để chuẩn bị cho tổng khởi nghĩa.','Đây là nhiệm vụ sau cuộc đảo chính Nhật–Pháp tháng 3/1945. Bối cảnh và đối tượng trước mắt khác với phong trào 1930.']
  ],['D1:P013','D2:P018','D3:P009','D3:P055']);
 q(0,'c1-xoviet',0,'Khi người dân tự quản',
  'Ở một số làng xã, bộ máy cai trị cũ tê liệt. Trước mắt quần chúng giờ đây còn là chuyện điều hành cuộc sống: ruộng công, thuế khóa, lớp học và trật tự làng xóm.',
  'Dấu hiệu nào phân biệt Xô viết Nghệ–Tĩnh với một cuộc vận động đòi cải cách dân chủ?',[
   ['Quần chúng tổ chức tự quản địa phương, thực hiện các biện pháp chính trị, kinh tế và văn hóa–xã hội.','Xô viết làm chức năng chính quyền cách mạng ở một số địa phương, thể hiện quyền làm chủ qua nhiều mặt đời sống.'],
   ['Các ủy ban hành động thu thập dân nguyện để chuẩn bị một đại hội đại biểu nhân dân.','Thu thập dân nguyện qua các ủy ban hành động là hoạt động tiêu biểu năm 1936; nó không phải dấu hiệu đặc trưng của chính quyền Xô viết.'],
   ['Các hội cứu quốc vận động nhiều tầng lớp tham gia một mặt trận lấy độc lập dân tộc làm mục tiêu.','Đây là cách xây dựng lực lượng chính trị trong Việt Minh từ năm 1941, khác với việc quần chúng tự quản ở Nghệ–Tĩnh.'],
   ['Các lực lượng du kích phát triển địa bàn đứng chân và nối những tuyến liên lạc xuống miền xuôi.','Đây là công tác xây dựng lực lượng và căn cứ trong giai đoạn chuẩn bị khởi nghĩa, không phải nội dung tự quản của Xô viết.']
  ],['D1:P019','D1:P020','D1:P038','D1:P039','D1:P040','D2:P034','D3:P041','D3:P045']);
 q(0,'c1-thesis',0,'Một giới hạn cần nhận ra',
  'Phong trào để lại sức cổ vũ lớn, nhưng kinh nghiệm thực tiễn cũng đặt ra câu hỏi khó: nhận diện mâu thuẫn nào để tập hợp được lực lượng rộng hơn?',
  'Nhận xét nào phân biệt đúng hạn chế của Luận cương tháng 10/1930 với chủ trương được hoàn chỉnh năm 1941?',[
   ['Luận cương còn nặng về giai cấp và ruộng đất; năm 1941 nhấn mạnh giải phóng dân tộc, mở rộng đoàn kết yêu nước.','Hạn chế nằm ở nhận thức mâu thuẫn chủ yếu và chiến lược liên minh rộng rãi. Năm 1941 đặt quyền lợi dân tộc lên trên quyền lợi bộ phận.'],
   ['Luận cương lấy dân sinh, dân chủ làm nhiệm vụ trước mắt; năm 1941 chuyển sang kết hợp đấu tranh hợp pháp với bí mật.','Hai nét này gần với chủ trương 1936–1939. Chúng không mô tả đúng hạn chế của Luận cương hoặc điểm hoàn chỉnh năm 1941.'],
   ['Luận cương đặt giải phóng dân tộc lên trước; năm 1941 đưa cách mạng ruộng đất trở lại vị trí nhiệm vụ trung tâm.','Phương án đảo chiều chuyển biến: Luận cương còn nặng về ruộng đất; năm 1941 tiếp tục tạm gác khẩu hiệu cách mạng ruộng đất để tập trung giải phóng dân tộc.'],
   ['Luận cương chưa đặt vấn đề tổ chức lãnh đạo; năm 1941 mới xác định vai trò của một đảng có kỷ luật và đường lối.','Luận cương đã xác định vai trò cốt yếu của Đảng. Hạn chế cần phân tích là quan hệ giai cấp–dân tộc và khả năng tập hợp lực lượng.']
  ],['D1:P052','D1:P054','D1:P061','D3:P032','D3:P033']);
 q(0,'c1-restore',0,'Nối lại những cơ sở',
  'Sau đàn áp, những đầu mối bị đứt phải được gây dựng lại. Đến Đại hội lần thứ nhất, câu hỏi cấp thiết là đưa tổ chức và phong trào đứng dậy bằng những nhiệm vụ nào.',
  'Bộ nhiệm vụ nào thuộc Đại hội lần thứ nhất tháng 3/1935?',[
   ['Củng cố, phát triển Đảng; tập hợp quần chúng; tuyên truyền chống đế quốc và chống chiến tranh.','Đây là ba nhóm nhiệm vụ trước mắt được nêu ở Đại hội lần thứ nhất, trong bối cảnh khôi phục tổ chức và phong trào.'],
   ['Chống phản động thuộc địa; đòi tự do, dân chủ, cơm áo, hòa bình; mở rộng hoạt động công khai.','Bộ nhiệm vụ này thuộc cao trào dân chủ 1936–1939, sau giai đoạn khôi phục đang xét.'],
   ['Tạm gác cách mạng ruộng đất; lập Việt Minh; chuẩn bị từ khởi nghĩa từng phần lên tổng khởi nghĩa.','Đây là những nội dung gắn với việc hoàn chỉnh chủ trương giải phóng dân tộc tại Hội nghị Trung ương VIII năm 1941.'],
   ['Thống nhất lực lượng vũ trang; xây dựng chiến khu; đào tạo cán bộ quân sự và chính trị.','Đây là nội dung của Hội nghị Quân sự cách mạng Bắc Kỳ tháng 4/1945, không phải Đại hội tháng 3/1935.']
  ],['D1:P086','D1:P088','D2:P018','D3:P035','D3:P036','D3:P062']);

 q(1,'c2-immediate',1,'Một khoảng mở trên phố',
  'Một khoảng hoạt động công khai xuất hiện. Trước những nguyện vọng đang dồn lại từ nhà máy và phố xá, cách mạng phải lựa chọn nhiệm vụ trước mắt mà vẫn giữ mục tiêu lâu dài.',
  'Chủ trương nào phù hợp với giai đoạn 1936–1939?',[
   ['Chống phát xít, chiến tranh và phản động thuộc địa; đòi tự do, dân chủ, cơm áo, hòa bình.','Đây là nhiệm vụ trước mắt của phong trào dân chủ, được lựa chọn theo tình hình mới và nguyện vọng quần chúng.'],
   ['Đặt cách mạng thổ địa ở vị trí cốt lõi, gắn chặt đánh đổ đế quốc với xóa bỏ tàn tích phong kiến.','Đây là cách nhấn mạnh trong Luận cương tháng 10/1930, không phải nhiệm vụ trước mắt của phong trào 1936–1939.'],
   ['Tập trung đánh đổ đế quốc và tay sai, chuyển sang trực tiếp vận động giành độc lập dân tộc.','Đây là bước chuyển từ tháng 11/1939 khi chiến tranh và đàn áp làm thay đổi điều kiện hoạt động.'],
   ['Phát động cao trào kháng Nhật cứu nước để tạo tiền đề và sẵn sàng chuyển sang tổng khởi nghĩa.','Đây là nhiệm vụ sau cuộc đảo chính tháng 3/1945; áp dụng vào 1936–1939 sẽ lẫn bối cảnh và đối tượng đấu tranh.']
  ],['D2:P018','D1:P052','D3:P008','D3:P055']);
 q(1,'c2-method',1,'Giữa công khai và bí mật',
  'Tờ báo có thể đến tay nhiều người, cuộc vận động có thể bước ra nơi công cộng. Nhưng phía sau khoảng mở ấy, cơ sở tổ chức vẫn phải được giữ gìn.',
  'Cách tổ chức nào thể hiện đúng sự thích ứng của phong trào dân chủ?',[
   ['Phối hợp công khai, nửa công khai, hợp pháp, nửa hợp pháp với hoạt động bí mật, bất hợp pháp.','Chủ trương tận dụng điều kiện công khai nhưng kết hợp với bí mật; không thay toàn bộ một hình thức bằng hình thức kia.'],
   ['Lấy xây dựng Đảng bí mật với kỷ luật sắt làm trọng tâm khôi phục sau một đợt khủng bố.','Đây là trọng tâm của Chương trình hành động năm 1932. Nó không thể hiện đầy đủ khả năng kết hợp hình thức của 1936–1939.'],
   ['Chuyển từ hợp pháp, nửa hợp pháp sang bí mật, bất hợp pháp để trực tiếp giành độc lập.','Đây là chuyển biến từ tháng 11/1939, khi điều kiện công khai của phong trào dân chủ không còn như trước.'],
   ['Phát triển tự vệ, du kích và căn cứ để chuẩn bị khởi nghĩa vũ trang thành nhiệm vụ trung tâm.','Nét này thuộc thời kỳ chuẩn bị khởi nghĩa sau chuyển hướng 1939–1941, khác với phương thức hoạt động đang hỏi.']
  ],['D2:P020','D2:P057','D1:P082','D3:P010','D3:P036','D3:P043']);
 q(1,'c2-policy',1,'Chọn đúng trọng tâm',
  'Không phải cứ đặt nhiều nhiệm vụ ngang nhau là tập hợp được nhiều người hơn. Trong tranh luận về chiến sách, việc xác định kẻ thù chính có thể làm thay đổi cách kết hợp nhiệm vụ.',
  'Văn kiện “Chung quanh vấn đề chiến sách mới” tháng 10/1936 điều chỉnh nhận thức theo hướng nào?',[
   ['Giải phóng dân tộc không nhất thiết kết chặt với cách mạng điền địa; cần tập trung vào kẻ thù chính, nguy hiểm nhất.','Văn kiện xử lý linh hoạt quan hệ giữa nhiệm vụ dân tộc và ruộng đất, bước đầu khắc phục hạn chế tả khuynh trước đó.'],
   ['Cách mạng điền địa giữ vị trí cốt lõi; nhiệm vụ phản đế và ruộng đất phải gắn chặt trong mọi bước đấu tranh.','Đây gần với cách đặt vấn đề của Luận cương tháng 10/1930; không phản ánh điểm phát triển của văn kiện tháng 10/1936.'],
   ['Chuẩn bị khởi nghĩa vũ trang là nhiệm vụ trung tâm; dự kiến tiến từ khởi nghĩa từng phần lên tổng khởi nghĩa.','Nội dung này gắn với Hội nghị Trung ương VIII tháng 5/1941, không phải điểm điều chỉnh lý luận đang xét.'],
   ['Phát xít Nhật là kẻ thù cụ thể, trước mắt và duy nhất; cần phát động cao trào kháng Nhật cứu nước.','Đây là nhận định và nhiệm vụ tháng 3/1945, sau khi Nhật đảo chính Pháp.']
  ],['D2:P027','D2:P028','D2:P029','D2:P030','D1:P052','D3:P036','D3:P055']);
 q(1,'c2-legacy',1,'Điều còn lại sau cao trào',
  'Chiến tranh bùng nổ, những lối hoạt động công khai bị thu hẹp. Tờ báo có thể ngừng phát hành, nhưng con người, quan hệ và kinh nghiệm được gây dựng không biến mất cùng nó.',
  'Vì sao phong trào 1936–1939 được xem là một bước chuẩn bị cho Cách mạng tháng Tám?',[
   ['Tập hợp lực lượng chính trị rộng lớn, mở rộng trận địa và rèn kinh nghiệm tổ chức, vận động quần chúng.','Giá trị chuẩn bị nằm ở lực lượng chính trị và kinh nghiệm hoạt động; đó là một cuộc tập dượt, chưa phải cuộc giành chính quyền toàn quốc.'],
   ['Thống nhất Cứu quốc quân với Việt Nam Tuyên truyền Giải phóng quân, tạo lực lượng vũ trang cho tổng khởi nghĩa.','Sự thống nhất này diễn ra ngày 15/5/1945. Gán nó cho phong trào dân chủ sẽ chuyển nhầm một thành quả của giai đoạn sau.'],
   ['Lập khu giải phóng với Tân Trào làm trung tâm, tạo địa bàn thực hiện những chính sách của Việt Minh.','Khu giải phóng Việt Bắc được thành lập ngày 4/6/1945, không phải kết quả trực tiếp của cao trào 1936–1939.'],
   ['Tạo ra chính quyền tự quản ở nhiều làng xã, thực hiện các chính sách ruộng công, thuế khóa và văn hóa.','Đây là đặc điểm của Xô viết Nghệ–Tĩnh trong phong trào 1930–1931, khác với đóng góp chủ yếu của phong trào dân chủ.']
  ],['D2:P048','D2:P051','D2:P053','D3:P063','D1:P038','D1:P039','D1:P040']);

 q(2,'c3-turn-date',2,'Cánh cửa công khai khép lại',
  'Chiến tranh lan rộng, đàn áp gia tăng. Những phương thức từng phát huy tác dụng trong cao trào dân chủ cần được xem xét lại trước yêu cầu độc lập ngày càng cấp bách.',
  'Hội nghị nào mở đầu chuyển hướng chỉ đạo chiến lược, trước khi chủ trương được hoàn chỉnh năm 1941?',[
   ['Hội nghị Trung ương tháng 11/1939.','Hội nghị tháng 11/1939 mở đầu chuyển hướng sang trực tiếp vận động giải phóng dân tộc; Hội nghị VIII tháng 5/1941 hoàn chỉnh chủ trương.'],
   ['Hội nghị Trung ương tháng 11/1940.','Hội nghị tháng 11/1940 tiếp tục xử lý tình hình và vấn đề lực lượng, nhưng không phải mốc mở đầu; tài liệu còn nêu sự chưa dứt khoát của hội nghị này.'],
   ['Hội nghị Trung ương tháng 5/1941.','Tháng 5/1941 là mốc hoàn chỉnh, không phải mở đầu. Phân biệt hai vai trò giúp nhận ra chuyển hướng là một quá trình.'],
   ['Hội nghị Trung ương tháng 3/1938.','Hội nghị tháng 3/1938 nhấn mạnh Mặt trận Dân chủ thống nhất trong thời kỳ dân chủ, trước bước chuyển do chiến tranh đặt ra.']
  ],['D3:P008','D3:P011','D3:P029','D3:P038','D2:P024']);
 q(2,'c3-turn-process',2,'Ba hội nghị, một quá trình',
  'Trên bàn họp là những vấn đề chưa thể giải quyết bằng một quyết định duy nhất. Qua các bước chuyển, cách xác định nhiệm vụ dân tộc và phương thức tập hợp lực lượng dần rõ hơn.',
  'Chuỗi nhận định nào phản ánh đúng quá trình 1939–1941?',[
   ['11/1939 mở đầu chuyển hướng → 11/1940 chưa thật dứt khoát → 5/1941 hoàn chỉnh nhiệm vụ giải phóng dân tộc.','Tài liệu phân biệt rõ mức độ phát triển ở ba hội nghị; không đồng nhất mở đầu với hoàn chỉnh.'],
   ['11/1939 hoàn chỉnh chuyển hướng → 11/1940 lập Việt Minh → 5/1941 phát động tổng khởi nghĩa toàn quốc.','Việt Minh ra đời tháng 5/1941; Hội nghị VIII xác định chuẩn bị khởi nghĩa, chưa phát động Tổng khởi nghĩa tháng Tám.'],
   ['11/1939 giữ trọng tâm dân chủ → 11/1940 mở đầu chuyển hướng → 5/1941 tập trung trở lại cách mạng điền địa.','Chuyển hướng đã mở đầu năm 1939; năm 1941 tiếp tục tạm gác khẩu hiệu cách mạng ruộng đất để ưu tiên giải phóng dân tộc.'],
   ['11/1939 mở đầu chuyển hướng → 11/1940 hoàn chỉnh → 5/1941 chuyển nhiệm vụ trung tâm sang đấu tranh nghị trường.','Hội nghị năm 1940 chưa hoàn chỉnh chủ trương. Đấu tranh nghị trường gợi phương thức thời dân chủ, không phải nhiệm vụ trung tâm năm 1941.']
  ],['D3:P008','D3:P029','D3:P033','D3:P035','D3:P036','D3:P038','D2:P046']);
 q(2,'c3-front',3,'Ai có thể cùng đứng trong hàng ngũ?',
  'Công nhân, người làm ruộng, thanh niên và trí thức cùng có mặt. Muốn nối những người khác nhau vào một mục tiêu chung, tên gọi và phạm vi mặt trận phải phù hợp với chủ trương mới.',
  'Phương án nào phù hợp với cách giải quyết vấn đề dân tộc tại Hội nghị Trung ương VIII?',[
   ['Lập Việt Minh ở Việt Nam; giải quyết vấn đề dân tộc trong từng nước và đoàn kết ba dân tộc chống kẻ thù chung.','Hội nghị VIII giải quyết vấn đề dân tộc trong phạm vi từng nước Việt Nam, Lào, Campuchia, đồng thời giữ đoàn kết chống kẻ thù chung.'],
   ['Lập Mặt trận Dân chủ thống nhất; tập hợp lực lượng quanh các yêu sách tự do, dân chủ, cơm áo và hòa bình.','Đây là định hướng tiêu biểu của phong trào 1936–1939, không phải cách tổ chức mặt trận giải phóng dân tộc năm 1941.'],
   ['Lập Mặt trận Thống nhất Dân tộc Phản đế Đông Dương; đặt vấn đề giải phóng trong khuôn khổ Đông Dương.','Đây là chủ trương của Hội nghị tháng 11/1939. Năm 1941 phát triển cách giải quyết trong phạm vi từng nước và thành lập Việt Minh.'],
   ['Lập Hội phản đế Đồng minh; lấy chủ trương mặt trận ban hành cuối năm 1930 làm hình thức tổ chức trước mắt.','Hội phản đế Đồng minh là chủ trương tháng 11/1930. Không thể thay tổ chức Việt Minh năm 1941 bằng một hình thức của thời kỳ trước.']
  ],['D3:P009','D3:P034','D3:P035','D3:P038','D2:P024','D1:P064']);
 q(2,'c3-political-force',3,'Từ người tham gia đến lực lượng',
  'Một cuộc gặp chưa tạo thành lực lượng bền vững. Những hội cứu quốc, tờ báo và hoạt động văn hóa đang nối lòng yêu nước với công việc cụ thể.',
  'Đâu là cách lý giải đầy đủ vai trò xây dựng lực lượng chính trị giai đoạn 1941–1944?',[
   ['Tổ chức nhiều tầng lớp qua các hội cứu quốc và hoạt động tuyên truyền, tạo nền tảng quần chúng trực tiếp tham gia khởi nghĩa.','Lực lượng chính trị được xây dựng rộng rãi; nhân dân vừa được tổ chức, vận động, vừa trở thành lực lượng trực tiếp giành chính quyền.'],
   ['Tập trung thu thập dân nguyện và tranh cử nghị trường, lấy mở rộng quyền hợp pháp làm nhiệm vụ trực tiếp của mặt trận.','Các hình thức này gắn với thời kỳ dân chủ. Giai đoạn 1941–1944 đặt trong mục tiêu chuẩn bị khởi nghĩa giải phóng dân tộc.'],
   ['Xây dựng mạng lưới tiếp tế cho các đơn vị vũ trang, lấy phục vụ chiến đấu làm vai trò chủ yếu của quần chúng.','Tiếp tế có vai trò, nhưng phương án thu hẹp lực lượng chính trị thành hậu cần. Quần chúng còn trực tiếp đấu tranh và giành chính quyền.'],
   ['Khôi phục các đầu mối bí mật sau khủng bố, lấy củng cố hệ thống tổ chức bị phá vỡ làm nội dung trung tâm.','Đây là trọng tâm tiêu biểu của thời kỳ khôi phục 1932–1935; chưa phản ánh đầy đủ việc mở rộng lực lượng cứu quốc sau năm 1941.']
  ],['D3:P040','D3:P041','D3:P042','D3:P097','D2:P034','D2:P046','D1:P082']);
 q(2,'c3-army-date',4,'Một đơn vị ra đời giữa núi rừng',
  'Lực lượng vũ trang được gây dựng cùng cơ sở chính trị và căn cứ. Nhiều mốc tổ chức gần nhau dễ bị ghép nhầm, dù mỗi mốc đánh dấu một bước phát triển khác nhau.',
  'Ngày thành lập Đội Việt Nam Tuyên truyền Giải phóng quân là mốc nào?',[
   ['22/12/1944.','Ngày 22/12/1944 là mốc thành lập Đội Việt Nam Tuyên truyền Giải phóng quân. Ngay sau đó có các trận Phai Khắt, Nà Ngần.'],
   ['15/5/1945.','Đây là ngày Cứu quốc quân và Việt Nam Tuyên truyền Giải phóng quân thống nhất thành Việt Nam Giải phóng quân.'],
   ['4/6/1945.','Đây là mốc thành lập Khu giải phóng Việt Bắc, với Tân Trào là trung tâm.'],
   ['19/5/1941.','Đây là ngày Mặt trận Việt Minh ra đời, một mốc xây dựng mặt trận cứu nước, không phải ngày thành lập đơn vị vũ trang đang hỏi.']
  ],['D3:P038','D3:P044','D3:P063']);
 q(2,'c3-preparation',4,'Chuẩn bị không nằm ở một phía',
  'Một căn cứ cần người bảo vệ, nguồn tiếp tế và những tuyến liên lạc. Một đội vũ trang muốn đứng chân cũng cần cơ sở trong dân. Những phần việc ấy đang dựa vào nhau.',
  'Mô hình nào phản ánh đúng sự chuẩn bị toàn diện trước năm 1945?',[
   ['Lực lượng chính trị, lực lượng vũ trang và căn cứ phát triển gắn bó; quân sự kết hợp tuyên truyền, vận động và xây dựng cơ sở.','Ba mặt chuẩn bị bổ sung cho nhau. Lực lượng vũ trang bảo vệ, hỗ trợ phong trào; nền tảng chính trị và địa bàn giúp lực lượng tồn tại, phát triển.'],
   ['Lực lượng vũ trang phát triển trước; lực lượng chính trị được chuyển thành mạng lưới hậu cần khi chuẩn bị đã hoàn tất.','Cách mô tả này đặt thứ tự cứng và thu hẹp vai trò quần chúng. Tài liệu nêu chuẩn bị đồng thời nhiều mặt, chính trị gắn với vũ trang và căn cứ.'],
   ['Căn cứ được xây dựng để tách hoạt động quân sự khỏi các cơ sở chính trị ở miền xuôi, giảm nhu cầu vận động quần chúng.','Các tuyến liên lạc được xây để kết nối và phát triển phong trào xuống miền xuôi; căn cứ không nhằm tách lực lượng vũ trang khỏi cơ sở trong dân.'],
   ['Các quyền công khai và nghị trường là nền tảng chính; chuẩn bị vũ trang giữ vai trò dự phòng cho vận động dân chủ.','Phương án mang cách đặt trọng tâm của thời dân chủ sang thời kỳ chuẩn bị khởi nghĩa, khi điều kiện công khai đã thay đổi sâu sắc.']
  ],['D3:P040','D3:P043','D3:P044','D3:P045','D3:P047','D3:P096']);
 q(2,'c3-directive-date',5,'Tin đảo chính đến cơ sở',
  'Bộ máy thống trị vừa biến động dữ dội. Tin tức và chỉ đạo không phải cùng một sự kiện: nhận diện đúng khoảng cách giữa chúng giúp hiểu cách cách mạng đáp lại tình hình.',
  'Chỉ thị “Nhật – Pháp bắn nhau và hành động của chúng ta” được ban hành khi nào?',[
   ['12/3/1945.','Chỉ thị được ban hành ngày 12/3/1945, sau cuộc đảo chính ngày 9/3; nó nhận định tình hình và xác định nhiệm vụ mới.'],
   ['9/3/1945.','Đây là ngày Nhật đảo chính Pháp, tạo biến động để Ban Thường vụ Trung ương ban hành chỉ thị ngày 12/3.'],
   ['13/8/1945.','Đây là ngày thành lập Ủy ban Khởi nghĩa toàn quốc và ban hành Quân lệnh số 1, thuộc thời điểm phát lệnh tổng khởi nghĩa.'],
   ['16/8/1945.','Đây là ngày khai mạc Đại hội Quốc dân ở Tân Trào, không phải ngày ban hành chỉ thị sau đảo chính.']
  ],['D3:P053','D3:P054','D3:P071','D3:P073']);
 q(2,'c3-march-response',5,'Biến động lớn, đã đến lúc chưa?',
  'Tin Nhật lật đổ Pháp khiến cơ sở đứng trước một quyết định khó. Đối phương khủng hoảng là cơ hội, nhưng cơ hội ấy đã đủ cho một cuộc nổi dậy toàn quốc hay chưa?',
  'Cặp nhận định – hành động nào phù hợp với chỉ thị tháng 3/1945?',[
   ['Nhật là kẻ thù trước mắt; phát động cao trào kháng Nhật, chuẩn bị tổng khởi nghĩa khi điều kiện chín muồi.','Chỉ thị xác định điều kiện tổng khởi nghĩa chưa chín muồi. Cao trào kháng Nhật vừa thúc đẩy phong trào, vừa tạo tiền đề cho bước chuyển tiếp.'],
   ['Nhật–Pháp vẫn cùng điều hành Đông Dương; duy trì khẩu hiệu đánh đuổi cả hai và chờ bộ máy cũ ổn định lại.','Sau đảo chính, Nhật độc chiếm Đông Dương. Chỉ thị điều chỉnh kẻ thù cụ thể, trước mắt và duy nhất là phát xít Nhật.'],
   ['Khủng hoảng chính trị đã tạo đủ điều kiện; phát lệnh tổng khởi nghĩa trên toàn quốc ngay sau đảo chính.','Khủng hoảng sâu sắc chưa đồng nghĩa điều kiện tổng khởi nghĩa đã chín muồi. Phát lệnh toàn quốc ngay sẽ lẫn bước đi tháng 3 với tháng 8.'],
   ['Khoảng mở dân chủ tiếp tục thuận lợi; mở rộng dân nguyện, báo công khai và đấu tranh nghị trường làm trọng tâm.','Phương án mang phương thức tiêu biểu 1936–1939 vào hoàn cảnh Nhật độc chiếm Đông Dương và cao trào kháng Nhật năm 1945.']
  ],['D3:P053','D3:P054','D3:P055','D3:P056','D2:P034','D2:P038','D2:P046']);
 q(2,'c3-rice-purpose',6,'Từ kho thóc đến bữa ăn',
  'Trước kho thóc là những người đang đói. Mở kho và đưa lương thực tới dân đáp ứng một nhu cầu sống còn; tác động của phong trào còn đi xa hơn việc phân chia thóc.',
  'Vì sao phá kho thóc, giải quyết nạn đói có ý nghĩa trong cao trào kháng Nhật?',[
   ['Gắn nhu cầu cấp bách của nhân dân với đấu tranh chống Nhật; qua tham gia, quần chúng được tổ chức và rèn luyện.','Phong trào vừa cứu đói vừa thúc đẩy sự tham gia, tổ chức và nhận thức sức mạnh của quần chúng trong cao trào kháng Nhật.'],
   ['Chuyển trọng tâm cao trào sang hoàn thành cách mạng ruộng đất, lấy phân chia quyền sở hữu đất làm kết quả trực tiếp.','Lấy thóc cứu đói không đồng nhất với hoàn thành cách mạng ruộng đất. Nhiệm vụ giải phóng dân tộc vẫn là trọng tâm.'],
   ['Bảo đảm nguồn lương thực dự trữ cho quân đội, lấy việc giảm hoạt động chính trị của dân đói làm mục tiêu trước mắt.','Tài liệu nhấn mạnh cứu đói và cuốn hút quần chúng tham gia đấu tranh; không mô tả nhân dân như đối tượng cần rút khỏi hoạt động chính trị.'],
   ['Khôi phục khuôn khổ vận động dân nguyện, lấy yêu cầu chính quyền thuộc địa cải cách phân phối làm hình thức chủ yếu.','Phương án đưa hình thức vận động thời dân chủ vào phong trào trực tiếp phá kho thóc trong cao trào kháng Nhật năm 1945.']
  ],['D3:P055','D3:P057','D3:P058','D3:P059','D2:P034']);
 q(2,'c3-rice-people',6,'Ai làm nên sức mạnh của phong trào?',
  'Bao thóc phải có người lấy, người chuyển và người phân chia. Chính trong những công việc ấy, lòng yêu nước và nhu cầu sống của người dân đi vào hành động có tổ chức.',
  'Nhận định nào nối đúng phong trào cứu đói với vai trò quần chúng trong thắng lợi sau đó?',[
   ['Nhân dân tham gia giải quyết nhu cầu thiết thân, được rèn trong đấu tranh và trở thành lực lượng trực tiếp giành chính quyền.','Sức dân được tổ chức qua công việc cụ thể, không chỉ là sự ủng hộ bên ngoài. Đây là một mắt xích chuẩn bị lực lượng cho tổng khởi nghĩa.'],
   ['Cứu đói tạo sự đồng tình của dân, còn việc giành chính quyền được chuyển dần thành nhiệm vụ riêng của các đơn vị vũ trang.','Phương án giảm quần chúng xuống vai trò đồng tình. Tài liệu nêu đông đảo quần chúng là lực lượng trực tiếp, có vũ trang hỗ trợ.'],
   ['Cứu đói hoàn tất nhiệm vụ kinh tế của cách mạng, vì thế việc mở rộng lực lượng chính trị có thể lùi sau hoạt động quân sự.','Giải quyết một nhu cầu cấp bách không có nghĩa hoàn tất nhiệm vụ kinh tế hoặc làm giảm vai trò xây dựng lực lượng chính trị.'],
   ['Cứu đói là kết quả của khoảng mở hợp pháp, cho phép các hội tương tế thay thế những hình thức đấu tranh kháng Nhật.','Phong trào diễn ra trong cao trào kháng Nhật, gắn cứu đói với đấu tranh; không thay cao trào bằng một khuôn khổ hợp pháp của thời dân chủ.']
  ],['D3:P059','D3:P064','D3:P093','D3:P097','D2:P047']);
 q(2,'c3-preparation-dates',7,'Những bước chuẩn bị nối tiếp',
  'Lực lượng vũ trang được tổ chức lại, vùng giải phóng mở rộng. Hai dấu mốc chỉ cách nhau vài tuần, nhưng một mốc thuộc tổ chức lực lượng, mốc kia thuộc địa bàn cách mạng.',
  'Cặp sự kiện – thời gian nào được ghép phù hợp?',[
   ['Việt Nam Giải phóng quân: 15/5/1945; Khu giải phóng Việt Bắc: 4/6/1945.','Ngày 15/5 là thống nhất lực lượng vũ trang; ngày 4/6 là thành lập Khu giải phóng Việt Bắc với Tân Trào làm trung tâm.'],
   ['Việt Nam Giải phóng quân: 4/6/1945; Khu giải phóng Việt Bắc: 15/5/1945.','Hai ngày bị đảo cho nhau: thống nhất lực lượng ngày 15/5, thành lập Khu giải phóng ngày 4/6.'],
   ['Việt Nam Giải phóng quân: 22/12/1944; Khu giải phóng Việt Bắc: 4/6/1945.','22/12/1944 là thành lập Đội Việt Nam Tuyên truyền Giải phóng quân; cần phân biệt đơn vị này với lực lượng thống nhất ngày 15/5/1945.'],
   ['Việt Nam Giải phóng quân: 15/5/1945; Khu giải phóng Việt Bắc: 19/5/1941.','19/5/1941 là ngày Việt Minh ra đời; Khu giải phóng Việt Bắc thuộc giai đoạn chuẩn bị trực tiếp giữa năm 1945.']
  ],['D3:P038','D3:P044','D3:P063']);
 q(2,'c3-partial',7,'Từng phần chưa phải toàn quốc',
  'Một địa phương chuyển biến, vùng giải phóng lớn dần, người dân bắt đầu thực hiện chính sách mới. Nhưng những thắng lợi ấy chưa tự động làm cả nước đổi trạng thái.',
  'Quan hệ nào phản ánh đúng khởi nghĩa từng phần với tổng khởi nghĩa?',[
   ['Thắng lợi từng phần mở rộng địa bàn, rèn lực lượng và làm suy yếu đối phương, tạo chuẩn bị trực tiếp cho tổng khởi nghĩa.','Khởi nghĩa từng phần là bước phát triển và chuẩn bị thực tiễn. Tổng khởi nghĩa vẫn đòi hỏi thời cơ và quyết định hành động phù hợp.'],
   ['Thắng lợi từng phần chứng tỏ điều kiện toàn quốc đã chín muồi từ tháng 3, nên tổng khởi nghĩa là việc mở rộng một lệnh sẵn có.','Tháng 3/1945 được nhận định chưa chín muồi cho tổng khởi nghĩa. Không thể suy từ thắng lợi địa phương ra điều kiện toàn quốc.'],
   ['Khởi nghĩa từng phần đảm nhiệm mục tiêu địa phương, còn tổng khởi nghĩa là bước tách khỏi cơ sở quần chúng để tập trung quân sự.','Hai bước không tách khỏi quần chúng; tổng khởi nghĩa dựa vào sức mạnh đông đảo nhân dân với lực lượng vũ trang hỗ trợ.'],
   ['Khởi nghĩa từng phần chủ yếu giữ lực lượng chờ quân Đồng minh, sau đó mới chuyển sang vận động giành quyền tự quản.','Cao trào chủ động phát triển lực lượng và tạo điều kiện. Quyết định tháng Tám là giành chính quyền trước khi quân Đồng minh vào Đông Dương.']
  ],['D3:P036','D3:P054','D3:P063','D3:P064','D3:P069','D3:P093']);
 q(2,'c3-window',8,'Một khoảng thời gian không chờ đợi',
  'Tin chiến tranh dồn về. Bộ máy thống trị khủng hoảng trong lúc lực lượng trong nước đã trải qua nhiều năm chuẩn bị. Thời điểm hành động giờ phải được cân nhắc theo cả hai phía.',
  'Cách đánh giá nào xác định đúng thời cơ tổng khởi nghĩa tháng Tám?',[
   ['Nhật đi đến đầu hàng, lực lượng trong nước sẵn sàng; cần giành chính quyền trước khi quân Đồng minh vào giải giáp Nhật.','Điều kiện khách quan và sự sẵn sàng chủ quan kết hợp, trong một khoảng thời gian ngắn trước khi quân Đồng minh vào Đông Dương.'],
   ['Nhật đảo chính Pháp, lực lượng đã đủ trên toàn quốc; cần phát lệnh tổng khởi nghĩa ngay trong tháng 3/1945.','Đảo chính tạo khủng hoảng nhưng tháng 3 được nhận định chưa chín muồi. Phương án lẫn hai thời điểm có mức độ chuẩn bị và điều kiện khác nhau.'],
   ['Nhật đầu hàng, cần chờ quân Đồng minh vào để ổn định tình hình rồi mới vận động xác lập chính quyền cách mạng.','Chờ quân Đồng minh vào sẽ bỏ qua khoảng thời cơ mà chủ trương tháng Tám yêu cầu tận dụng để chủ động giành chính quyền.'],
   ['Nhật suy yếu, cần duy trì khởi nghĩa từng phần cho tới khi quân Nhật rút hết mới chuyển sang hành động trên cả nước.','Chủ trương là hành động kịp thời trong khủng hoảng của đối phương, không chờ toàn bộ quân Nhật rút khỏi Đông Dương.']
  ],['D3:P054','D3:P067','D3:P068','D3:P069','D3:P072']);
 q(2,'c3-tantrao',8,'Những quyết định ở Tân Trào',
  'Lệnh khởi nghĩa, hội nghị của Đảng và Đại hội Quốc dân nối nhau trong những ngày gấp gáp. Chúng cùng hướng tới giành chính quyền, nhưng mỗi cơ quan có một quyết định riêng.',
  'Phương án nào ghép đúng cơ quan với quyết định trong tháng 8/1945?',[
   ['Ủy ban Khởi nghĩa toàn quốc ban hành Quân lệnh số 1 ngày 13/8; Đại hội Quốc dân cử Ủy ban Dân tộc giải phóng Việt Nam.','Đêm 13/8, Ủy ban Khởi nghĩa toàn quốc ban hành Quân lệnh số 1. Đại hội Quốc dân khai mạc 16/8 tán thành tổng khởi nghĩa và cử Ủy ban Dân tộc giải phóng.'],
   ['Hội nghị toàn quốc của Đảng ban hành Quân lệnh số 1 ngày 13/8; Đại hội Quốc dân thành lập Ủy ban Khởi nghĩa toàn quốc.','Quân lệnh thuộc Ủy ban Khởi nghĩa toàn quốc; ủy ban này được Trung ương Đảng và Tổng bộ Việt Minh thành lập ngày 13/8, trước Đại hội Quốc dân.'],
   ['Đại hội Quốc dân ban hành Quân lệnh số 1 ngày 16/8; Hội nghị toàn quốc của Đảng cử Ủy ban Dân tộc giải phóng Việt Nam.','Phương án hoán đổi vai trò: Đại hội Quốc dân cử Ủy ban Dân tộc giải phóng; Quân lệnh số 1 đã được ban hành ngày 13/8.'],
   ['Ủy ban Dân tộc giải phóng ban hành Quân lệnh số 1 ngày 13/8; Hội nghị toàn quốc của Đảng lập Khu giải phóng Việt Bắc.','Ủy ban Dân tộc giải phóng được cử tại Đại hội Quốc dân sau ngày 13/8. Khu giải phóng Việt Bắc đã thành lập từ ngày 4/6/1945.']
  ],['D3:P063','D3:P071','D3:P072','D3:P073']);
 q(2,'c3-cities',9,'Thắng lợi lan qua các đô thị',
  'Đoàn người tiến về những trung tâm chính quyền. Tin thắng lợi từ một nơi tiếp sức cho nơi khác; ba đô thị lớn trở thành những mốc nổi bật giữa phong trào cả nước.',
  'Chuỗi địa phương – ngày giành chính quyền nào phù hợp?',[
   ['Hà Nội 19/8 → Huế 23/8 → Sài Gòn 25/8/1945.','Ba mốc tiêu biểu lần lượt là 19/8 ở Hà Nội, 23/8 ở Huế và 25/8 ở Sài Gòn.'],
   ['Hà Nội 18/8 → Huế 23/8 → Sài Gòn 25/8/1945.','18/8 là mốc các tỉnh lỵ Bắc Giang, Hải Dương, Hà Tĩnh, Quảng Nam. Hà Nội thắng lợi ngày 19/8.'],
   ['Hà Nội 19/8 → Huế 25/8 → Sài Gòn 23/8/1945.','Hai ngày của Huế và Sài Gòn bị hoán đổi: Huế 23/8, Sài Gòn 25/8.'],
   ['Hà Nội 19/8 → Huế 23/8 → Sài Gòn 28/8/1945.','Sài Gòn giành chính quyền ngày 25/8. Ngày 28/8 gắn với Đồng Nai Thượng, Hà Tiên và việc tổng khởi nghĩa về cơ bản thắng lợi cả nước.']
  ],['D3:P079','D3:P080','D3:P081','D3:P082','D3:P083','D3:P084','D3:P085','D3:P086','D3:P087','D3:P088']);
 q(2,'c3-uprising-force',9,'Người dân ở giữa cuộc khởi nghĩa',
  'Trong đoàn người có nhiều tầng lớp, nhiều công việc và những cơ sở đã gây dựng từ trước. Lệnh chung có sức mạnh khi được biến thành hành động ở từng địa phương.',
  'Nhận định nào phản ánh đúng phương thức và lực lượng của Tổng khởi nghĩa?',[
   ['Đông đảo quần chúng trực tiếp giành chính quyền, kết hợp đấu tranh chính trị với vũ trang hỗ trợ và sự chủ động địa phương.','Thắng lợi dựa vào sức mạnh quần chúng có tổ chức; lực lượng vũ trang hỗ trợ, địa phương chủ động vận dụng chủ trương vào điều kiện cụ thể.'],
   ['Các đơn vị vũ trang trực tiếp giành chính quyền, quần chúng chủ yếu tiếp tế và chờ bộ máy mới được thiết lập.','Phương án đảo vị trí quần chúng và thu hẹp vai trò chính trị của nhân dân; tài liệu nhấn mạnh đông đảo quần chúng trực tiếp giành chính quyền.'],
   ['Phong trào phát triển qua dân nguyện, tranh cử và báo hợp pháp, lấy thỏa thuận cải cách làm bước chuyển chính quyền.','Đây là những phương thức gợi thời dân chủ, không mô tả tổng khởi nghĩa giành chính quyền tháng Tám.'],
   ['Các địa phương lần lượt thi hành cùng một kịch bản, lấy thời điểm nhận đủ lệnh chi tiết làm điều kiện quyết định hành động.','Chỉ đạo thống nhất đi cùng sự chủ động địa phương. Nhiều nơi hành động theo tình hình thực tế và chủ trương đã được quán triệt.']
  ],['D3:P078','D3:P093','D3:P097','D3:P098','D2:P034','D2:P038','D2:P046']);
 q(2,'c3-outcome',10,'Từ giành chính quyền đến nhà nước mới',
  'Quyền lực cũ sụp đổ qua những bước khác nhau. Thắng lợi khởi nghĩa, sự thoái vị và lời tuyên bố độc lập nối tiếp nhau, nhưng không nên gộp thành một sự kiện.',
  'Chuỗi kết quả nào giữ đúng cả thời điểm lẫn ý nghĩa?',[
   ['28/8: tổng khởi nghĩa về cơ bản thắng lợi → 30/8: Bảo Đại thoái vị → 2/9: tuyên bố nước Việt Nam Dân chủ Cộng hòa ra đời.','Ba mốc thuộc các bước khác nhau: thắng lợi giành chính quyền trên cả nước, chấm dứt chế độ quân chủ và tuyên bố sự ra đời của nhà nước mới.'],
   ['28/8: Bảo Đại thoái vị → 30/8: tổng khởi nghĩa về cơ bản thắng lợi → 2/9: tuyên bố nước Việt Nam Dân chủ Cộng hòa ra đời.','Hai kết quả ngày 28 và 30/8 bị đảo nhau. Bảo Đại thoái vị ngày 30/8, sau mốc tổng khởi nghĩa về cơ bản thắng lợi.'],
   ['25/8: tổng khởi nghĩa hoàn tất cả nước → 28/8: Bảo Đại thoái vị → 2/9: tuyên bố nước Việt Nam Dân chủ Cộng hòa ra đời.','25/8 là mốc Sài Gòn; tài liệu đặt thắng lợi về cơ bản trên cả nước ở 28/8 và sự thoái vị ở 30/8.'],
   ['28/8: tổng khởi nghĩa về cơ bản thắng lợi → 2/9: Bảo Đại thoái vị → 30/8: tuyên bố nước Việt Nam Dân chủ Cộng hòa ra đời.','Ngày thoái vị và ngày tuyên bố nhà nước mới bị hoán đổi; trình tự cũng không còn theo tiến trình lịch sử.']
  ],['D3:P085','D3:P086','D3:P087','D3:P088','D3:P089','D3:P090','D3:P091','D3:P092']);
 q(2,'c3-causes',10,'Vì sao thời cơ trở thành thắng lợi?',
  'Lá cờ trên lễ đài là điểm đến của nhiều năm chuẩn bị và những ngày hành động gấp gáp. Nhìn lại hành trình, cần phân biệt điều kiện thuận lợi với sức mạnh biến nó thành kết quả.',
  'Nhận định nào giải thích đầy đủ quan hệ khách quan – chủ quan của thắng lợi tháng Tám?',[
   ['Nhật đầu hàng tạo điều kiện khách quan; chuẩn bị lâu dài, sức dân, tổ chức và quyết định kịp thời giúp biến điều kiện ấy thành thắng lợi.','Thời cơ quốc tế rất quan trọng, nhưng khả năng tận dụng bắt nguồn từ lực lượng, tổ chức, sự tham gia của nhân dân và lãnh đạo linh hoạt trong nước.'],
   ['Sự chuẩn bị trong nước tạo ra việc Nhật đầu hàng; thời cơ quốc tế là kết quả trực tiếp của cao trào kháng Nhật ở Việt Nam.','Nhật đầu hàng gắn với thắng lợi của Đồng minh. Không thể coi điều kiện quốc tế ấy là kết quả trực tiếp do lực lượng trong nước tạo ra.'],
   ['Nhật đầu hàng quyết định khả năng giành chính quyền; chuẩn bị trong nước chủ yếu giúp tiếp nhận bộ máy sau khi quyền lực được chuyển giao.','Phương án biến quần chúng và tổ chức thành bên tiếp nhận thụ động. Tài liệu nêu lực lượng trong nước chủ động chớp thời cơ và trực tiếp giành chính quyền.'],
   ['Sức mạnh trong nước quyết định thắng lợi, nên việc chọn thời điểm trước khi quân Đồng minh vào không làm thay đổi yêu cầu hành động.','Chuẩn bị chủ quan phải kết hợp đúng điều kiện và thời điểm khách quan. Khoảng thời cơ ngắn là lý do phải hành động tập trung, thống nhất và kịp thời.']
  ],['D3:P069','D3:P095','D3:P096','D3:P097','D3:P098','D3:P099','D3:P100']);
 const readings=[
  ['Phong trào và khôi phục tổ chức','Phong trào 1930–1931 kết hợp yêu sách cải thiện đời sống với khẩu hiệu chính trị, thể hiện sự gắn bó công–nông. Ở một số địa phương Nghệ An, Hà Tĩnh, quần chúng tổ chức tự quản và thực hiện những biện pháp về chính trị, kinh tế, văn hóa–xã hội.','Sau đàn áp, tổ chức và phong trào từng bước được khôi phục. Luận cương tháng 10/1930 có những nội dung cơ bản nhưng còn nặng về đấu tranh giai cấp và ruộng đất, chưa đề ra chiến lược liên minh rộng rãi. Đại hội tháng 3/1935 đề ra củng cố Đảng, tập hợp quần chúng, tuyên truyền chống đế quốc và chiến tranh.'],
  ['Phong trào dân chủ','Giai đoạn 1936–1939 đặt nhiệm vụ trước mắt là chống phát xít, chống chiến tranh, chống phản động thuộc địa và tay sai; đòi tự do, dân chủ, cơm áo, hòa bình. Hoạt động công khai, hợp pháp được kết hợp với bí mật, bất hợp pháp.','Dân nguyện, báo chí, hoạt động văn hóa, giáo dục và nghị trường giúp mở rộng lực lượng. Phong trào rèn luyện đội ngũ chính trị và kinh nghiệm tổ chức; tháng 9/1939, chiến tranh và đàn áp dẫn đến chuyển sang điều kiện hoạt động mới.'],
  ['Chuyển hướng 1939–1941','Hội nghị tháng 11/1939 mở đầu chuyển hướng sang trực tiếp vận động giải phóng dân tộc, tạm gác khẩu hiệu cách mạng ruộng đất. Hội nghị tháng 11/1940 xử lý vấn đề lực lượng và khởi nghĩa, nhưng chưa thật dứt khoát trong việc đặt giải phóng dân tộc lên hàng đầu.','Hội nghị Trung ương VIII tháng 5/1941 tại Pác Bó hoàn chỉnh chủ trương: đặt giải phóng dân tộc lên hàng đầu, lập Việt Minh, chuẩn bị khởi nghĩa vũ trang và dự kiến từ khởi nghĩa từng phần lên tổng khởi nghĩa.'],
  ['Việt Minh và sức dân','Việt Minh ra đời ngày 19/5/1941, tập hợp rộng rãi các lực lượng yêu nước. Vấn đề dân tộc được giải quyết trong phạm vi từng nước Việt Nam, Lào, Campuchia, đi cùng đoàn kết ba dân tộc chống kẻ thù chung.','Các hội cứu quốc, báo chí và hoạt động văn hóa vận động công nhân, nông dân, thanh niên, phụ nữ, học sinh, trí thức cùng nhiều tầng lớp. Quần chúng được tổ chức thành lực lượng chính trị, trực tiếp tham gia giành chính quyền.'],
  ['Chuẩn bị lực lượng và căn cứ','Lực lượng chính trị, lực lượng vũ trang và căn cứ địa được xây dựng gắn bó. Cơ sở trong dân, địa bàn đứng chân và các tuyến liên lạc giúp bảo toàn, phát triển lực lượng.','Ngày 22/12/1944, Đội Việt Nam Tuyên truyền Giải phóng quân thành lập. Hoạt động quân sự được kết hợp với tuyên truyền, vận động và xây dựng cơ sở chính trị. Ngày 15/5/1945, đội và Cứu quốc quân thống nhất thành Việt Nam Giải phóng quân.'],
  ['Bước chuyển tháng 3/1945','Ngày 9/3/1945, Nhật đảo chính Pháp. Ngày 12/3, Ban Thường vụ Trung ương ban hành Chỉ thị “Nhật – Pháp bắn nhau và hành động của chúng ta”, nhận định điều kiện tổng khởi nghĩa chưa chín muồi.','Phát xít Nhật được xác định là kẻ thù cụ thể, trước mắt và duy nhất. Cao trào kháng Nhật cứu nước được phát động để tạo tiền đề, sẵn sàng chuyển sang tổng khởi nghĩa khi đủ điều kiện.'],
  ['Phá kho thóc, giải quyết nạn đói','Trong cao trào kháng Nhật, phong trào phá kho thóc gắn yêu cầu cứu đói với đấu tranh. Việt Minh, các lực lượng và nhân dân tham gia tổ chức, vận chuyển, phân chia lương thực.','Qua hành động cụ thể, quần chúng được tổ chức, rèn luyện và nhận thức sức mạnh của mình. Mục tiêu là lấy thóc cứu đói, không hủy lương thực; hoạt động này không đồng nhất với hoàn thành cách mạng ruộng đất.'],
  ['Khởi nghĩa từng phần','Cao trào kháng Nhật mở rộng vùng giải phóng, làm suy yếu chính quyền thân Nhật và rèn luyện lực lượng trong thực tiễn. Khởi nghĩa từng phần là bước chuẩn bị trực tiếp cho tổng khởi nghĩa.','Ngày 15/5/1945, Việt Nam Giải phóng quân được thành lập trên cơ sở thống nhất lực lượng. Ngày 4/6/1945, Khu giải phóng Việt Bắc ra đời, với Tân Trào làm trung tâm. Thắng lợi địa phương chưa đồng nghĩa độc lập trên cả nước.'],
  ['Thời cơ và những quyết định tháng Tám','Nhật đi đến đầu hàng Đồng minh trong lúc lực lượng cách mạng trong nước đã được chuẩn bị. Khoảng thời cơ đòi hỏi chủ động giành chính quyền trước khi quân Đồng minh vào Đông Dương giải giáp Nhật.','Ngày 13/8/1945, Ủy ban Khởi nghĩa toàn quốc được thành lập và ban hành Quân lệnh số 1. Hội nghị toàn quốc của Đảng ngày 14–15/8 quyết định tổng khởi nghĩa. Đại hội Quốc dân khai mạc ngày 16/8 tán thành chủ trương và cử Ủy ban Dân tộc giải phóng Việt Nam.'],
  ['Nhân dân giành chính quyền','Khởi nghĩa thắng lợi tại Hà Nội ngày 19/8, Huế ngày 23/8, Sài Gòn ngày 25/8/1945, cùng phong trào trên cả nước. Nhiều địa phương chủ động hành động theo tình hình thực tế và chủ trương đã được quán triệt.','Đông đảo quần chúng trực tiếp giành chính quyền, kết hợp đấu tranh chính trị với lực lượng vũ trang hỗ trợ. Sự thống nhất trong chỉ đạo đi cùng khả năng chủ động của địa phương.'],
  ['Thắng lợi và ngày độc lập','Ngày 28/8/1945, tổng khởi nghĩa về cơ bản thắng lợi trên cả nước. Ngày 30/8, Bảo Đại thoái vị. Ngày 2/9 tại Ba Đình, Hồ Chí Minh đọc Tuyên ngôn Độc lập, tuyên bố nước Việt Nam Dân chủ Cộng hòa ra đời.','Thắng lợi kết hợp đường lối phù hợp, chuẩn bị lâu dài, đoàn kết và sự tham gia của nhân dân, tổ chức và lãnh đạo linh hoạt với điều kiện quốc tế thuận lợi. Nhật đầu hàng tạo thời cơ; khả năng tận dụng bắt nguồn từ sức mạnh và quá trình chuẩn bị trong nước.']
 ];
 const forChapter=id=>questions.filter(q=>q.chapter===id);
 return {version:'story-choice-1',chapters,questions,readings,forChapter,points:100,opportunityAfter:'c3-tantrao',opportunityPoints:100};
});
