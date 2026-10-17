#!/usr/bin/env node
'use strict';

// Keep the reviewed matching matrix in docs as the single source of gameplay truth.
// The browser payload is generated, so it can run without fetching local JSON.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const modelPath = path.join(root, 'docs/content-model-v2.json');
const outputPath = path.join(root, 'src/js/v2-content.js');
const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));

const chapters = [
  {
    id: 'c1', name: 'Gây dựng & khôi phục', years: '1930–1935',
    caption: 'Từ những yêu cầu đời sống đến những mạch nối bền bỉ.',
    lesson: 'Những yêu cầu thiết thực góp phần tập hợp công nhân và nông dân. Khi phong trào gặp đàn áp, khôi phục tổ chức và duy trì học tập giúp bảo toàn nền tảng cho những bước tiếp theo.',
    sourceRefs: ['D1:P013', 'D1:P031', 'D1:P078', 'D1:P082'],
  },
  {
    id: 'c2', name: 'Mở rộng phong trào', years: '1936–1939',
    caption: 'Đưa nguyện vọng đến gần nhau, mở rộng những hình thức vận động.',
    lesson: 'Dân nguyện, báo chí, hội tương trợ và học chữ là những hình thức vận động khác nhau. Khả năng mở rộng phong trào gắn với việc vận dụng linh hoạt điều kiện công khai và duy trì cơ sở bí mật.',
    sourceRefs: ['D2:P020', 'D2:P034', 'D2:P038', 'D2:P045', 'D2:P047', 'D2:P057'],
  },
  {
    id: 'c3', name: 'Chuẩn bị & chớp thời cơ', years: '1939–1945',
    caption: 'Đoàn kết, chuẩn bị lực lượng và phối hợp hành động kịp thời.',
    lesson: 'Thời cơ thuận lợi kết hợp với sự chuẩn bị lâu dài, sự tham gia của nhân dân và khả năng tổ chức hành động. Các hoạt động hỗ trợ nhau; hai ô ghép trong mỗi màn chỉ làm rõ một phần của quá trình lịch sử.',
    sourceRefs: ['D3:P096', 'D3:P097', 'D3:P098', 'D3:P100', 'D3:P104'],
  },
];

// Optional reading only: no unsupported archive photographs or disputed precise dates.
const records = [
  {
    id: 'r01', title: 'Từ yêu cầu đời sống đến phong trào công–nông',
    body: 'Trong phong trào 1930–1931, những yêu cầu cải thiện đời sống được đặt ra cùng với các khẩu hiệu chính trị. Tư liệu của nhóm nêu công nhân đòi tăng lương, giảm giờ làm; nông dân đòi giảm sưu, giảm thuế. Đây là những ví dụ tiêu biểu trong đoạn nguồn, không phải ranh giới tuyệt đối giữa quyền lợi của các nhóm xã hội.\n\nViệc kết hợp phong trào công nhân với phong trào nông dân là một kinh nghiệm được tư liệu nhấn mạnh. Trong màn chơi, mỗi ô chỉ cần một ví dụ phù hợp với nhóm đang hỏi. Tăng lương và giảm giờ làm đều được chấp nhận cho ô công nhân; giảm sưu và giảm thuế đều được chấp nhận cho ô nông dân.',
    sourceRefs: ['D1:P013', 'D1:P031'],
  },
  {
    id: 'r02', title: 'Giữ tổ chức, giữ việc học',
    body: 'Trong quá trình khôi phục phong trào, công việc củng cố cơ sở bí mật giúp duy trì và xây dựng lại tổ chức. Tư liệu đồng thời ghi lại hoạt động của các chi bộ bí mật trong nhà tù. Những chiến sĩ bị giam vẫn tổ chức học lý luận, dịch sách báo và trao đổi kiến thức.\n\nHai hoạt động trong màn chơi liên quan nhưng có nhiệm vụ trực tiếp khác nhau: củng cố cơ sở phục vụ việc khôi phục tổ chức; học và dịch sách phục vụ việc bồi dưỡng, truyền đạt kiến thức. Tập hợp quần chúng và tuyên truyền chống chiến tranh cũng là những công việc có giá trị được nguồn nêu. Khi một thẻ chưa phù hợp với ô, điều đó chỉ nói về nhiệm vụ cụ thể đang hỏi, không phủ nhận ý nghĩa của hoạt động ấy.',
    sourceRefs: ['D1:P077', 'D1:P078', 'D1:P082', 'D1:P085', 'D1:P088'],
  },
  {
    id: 'r03', title: 'Dân nguyện và tiếng nói công khai',
    body: 'Trong giai đoạn 1936–1939, phong trào sử dụng nhiều hình thức vận động. Dân nguyện là những nguyện vọng của nhân dân được tập hợp và chuyển đến các đầu mối. Tư liệu mô tả việc lập các ủy ban hành động cùng hoạt động thu thập dân nguyện. Báo chí công khai bằng tiếng Việt và tiếng Pháp giúp mở rộng tuyên truyền.\n\nMàn chơi chấp nhận cả thu thập dân nguyện và lập ủy ban làm đầu mối tiếp nhận cho nhiệm vụ gom nguyện vọng. Báo chí đáp ứng trực tiếp nhiệm vụ truyền đạt qua ấn phẩm. Điều kiện công khai vẫn có giới hạn: phong trào kết hợp nhiều phương thức hoạt động với cơ sở bí mật. Vì vậy, một thẻ chưa khớp nhiệm vụ không có nghĩa hoạt động ấy không có vai trò trong giai đoạn.',
    sourceRefs: ['D2:P020', 'D2:P034', 'D2:P035', 'D2:P036', 'D2:P038', 'D2:P057'],
  },
  {
    id: 'r04', title: 'Những hình thức tập hợp gần gũi',
    body: 'Các hoạt động vận động quần chúng trong giai đoạn 1936–1939 không chỉ diễn ra qua báo chí hoặc dân nguyện. Tư liệu còn nêu hội ái hữu, hội tương tế, hoạt động truyền bá quốc ngữ và đấu tranh nghị trường. Những hình thức khác nhau góp phần mở rộng sự tham gia của nhiều tầng lớp.\n\nMàn chơi tách hai công việc cụ thể: lập hội tương trợ và mở lớp học chữ. Cả hội ái hữu lẫn hội tương tế đều được chấp nhận ở ô tương trợ. Dạy và học chữ trực tiếp đáp ứng ô còn lại. Sự phân biệt này giúp nhận biết chức năng hoạt động, không xếp các hình thức thành quan trọng hoặc kém giá trị hơn. Phần mô phỏng dùng khung cả giai đoạn, không khẳng định mọi hoạt động bắt đầu đồng thời.',
    sourceRefs: ['D2:P044', 'D2:P045', 'D2:P046', 'D2:P047', 'D2:P051', 'D2:P056'],
  },
  {
    id: 'r05', title: 'Chuyển hướng để tập trung cho độc lập',
    body: 'Trong những biến chuyển của giai đoạn 1939–1941, nhiệm vụ giải phóng dân tộc được đặt lên hàng đầu qua một quá trình điều chỉnh chủ trương. Tư liệu phân biệt bước mở đầu chuyển hướng với việc hoàn chỉnh tại Hội nghị Trung ương lần thứ tám. Việc tập hợp lực lượng yêu nước gắn với các hình thức mặt trận theo từng thời điểm.\n\nMặt trận Thống nhất Dân tộc Phản đế Đông Dương được nêu ở bước chuyển hướng ban đầu; Việt Minh gắn với bước hoàn chỉnh sau đó. Màn chơi không đồng nhất hai tổ chức này. Lập mặt trận đoàn kết là công việc tổ chức lực lượng; chuyển sang bí mật là đổi phương thức hoạt động. Giảm tô, giảm tức và xây dựng du kích vẫn có ý nghĩa, nhưng không thay trực tiếp hai nhiệm vụ ấy.',
    sourceRefs: ['D3:P009', 'D3:P010', 'D3:P029', 'D3:P032', 'D3:P033', 'D3:P035', 'D3:P038'],
  },
  {
    id: 'r06', title: 'Lực lượng và địa bàn hỗ trợ nhau',
    body: 'Các hội cứu quốc vận động nhiều tầng lớp tham gia Việt Minh. Báo chí cách mạng tuyên truyền mục tiêu độc lập và góp phần phát triển lực lượng chính trị. Các đội tự vệ, du kích bảo vệ cơ sở, hỗ trợ phong trào; căn cứ và tuyến liên lạc giúp bảo toàn, phát triển lực lượng, kết nối các vùng hoạt động.\n\nMàn chơi chấp nhận hội cứu quốc hoặc báo chí vận động cho ô lực lượng chính trị. Ô mở địa bàn, nối liên lạc hỏi trực tiếp việc kết nối các vùng. Phân biệt này không tạo ranh giới tuyệt đối giữa chính trị và vũ trang: tư liệu cũng nêu hoạt động quân sự kết hợp tuyên truyền, vận động. Các yếu tố hỗ trợ lẫn nhau, không yếu tố nào một mình giải thích toàn bộ quá trình chuẩn bị.',
    sourceRefs: ['D3:P041', 'D3:P042', 'D3:P043', 'D3:P044', 'D3:P045'],
  },
  {
    id: 'r07', title: 'Cao trào kháng Nhật: dân sinh gắn với đấu tranh',
    body: 'Sau cuộc đảo chính tháng 3/1945, tình hình chính trị biến động sâu sắc, nhưng tư liệu nhận định điều kiện tổng khởi nghĩa chưa chín muồi ngay lúc đó. Nhiệm vụ trước mắt là phát động cao trào kháng Nhật cứu nước, làm tiền đề và sẵn sàng chuyển sang tổng khởi nghĩa khi đủ điều kiện.\n\nTrong cao trào, phong trào phá kho thóc gắn việc giải quyết nạn đói với nhiệm vụ chống Nhật. Đây còn là hoạt động thu hút, tổ chức và rèn luyện quần chúng trong phong trào do Đảng và Việt Minh vận động. Vì vậy, màn chơi dùng nhiệm vụ cứu đói gắn chống Nhật, không thu hẹp thành phát gạo. Khởi nghĩa từng phần và chuẩn bị trực tiếp cũng cần được phân biệt với tổng khởi nghĩa ngay trong tháng 3.',
    sourceRefs: ['D3:P041', 'D3:P054', 'D3:P055', 'D3:P059'],
  },
  {
    id: 'r08', title: 'Thời cơ cần sự chuẩn bị',
    body: 'Tháng 8/1945, Nhật Bản đi đến đầu hàng; quân Nhật ở Đông Dương hoang mang và chính quyền thân Nhật khủng hoảng. Đây là hoàn cảnh khách quan thuận lợi. Đồng thời, lực lượng cách mạng đã có quá trình xây dựng tổ chức, phát triển lực lượng và rèn luyện qua cao trào kháng Nhật. Sự sẵn sàng ấy thuộc phía chuẩn bị chủ quan.\n\nMàn chơi yêu cầu phân biệt hai nhóm yếu tố, không sắp xếp thành một niên biểu hoặc liệt kê đầy đủ nguyên nhân thắng lợi. Các yếu tố khách quan liên quan chặt chẽ với nhau. Tư liệu nêu quyết định hành động đã được đưa ra khi nhận tin Nhật sắp đầu hàng. Bởi vậy, không nên hiểu rằng phải chờ sau tuyên bố đầu hàng chính thức mới bắt đầu quyết định tổng khởi nghĩa.',
    sourceRefs: ['D3:P067', 'D3:P068', 'D3:P069', 'D3:P071', 'D3:P096', 'D3:P099', 'D3:P100'],
  },
  {
    id: 'r09', title: 'Phối hợp hành động và ý nghĩa thắng lợi',
    body: 'Tổng khởi nghĩa phát huy sức mạnh của đông đảo quần chúng, kết hợp đấu tranh chính trị với lực lượng vũ trang hỗ trợ. Chỉ đạo tập trung, thống nhất, kịp thời đi cùng sự chủ động vận dụng của địa phương theo hoàn cảnh cụ thể. Truyền đạt, phối hợp và huy động nhân dân là những công việc khác nhau nhưng gắn bó.\n\nCách mạng tháng Tám lật đổ ách thống trị thực dân, phát xít, chấm dứt chế độ quân chủ và đưa đến sự ra đời của nước Việt Nam Dân chủ Cộng hòa; thắng lợi còn cổ vũ phong trào giải phóng dân tộc. Cần phân biệt kết quả ấy với việc giải quyết hoàn toàn quan hệ ruộng đất. Điểm trong game phản ánh mức độ hiểu nhiệm vụ, không thay đổi diễn biến hoặc ý nghĩa lịch sử.',
    sourceRefs: ['D3:P072', 'D3:P093', 'D3:P097', 'D3:P098', 'D3:P102', 'D3:P103', 'D3:P104'],
  },
].map(record => ({
  ...record,
  evidenceStatus: 'source-supported',
  reviewStatus: 'pending',
  subjectReviewStatus: 'pending',
}));

assert.equal(model.schemaVersion, 2, 'Expected source model schema 2.');
assert.equal(model.scenes.length, 9, 'Expected nine reviewed scenes.');
assert.deepEqual(model.scenes.map(scene => scene.id), records.map((_, i) => `s${String(i + 1).padStart(2, '0')}`));
assert.equal(model.scenes.reduce((total, scene) => total + scene.evaluations.length, 0), 72);

const sourceIndex = new Map(model.sources.map(source => [source.id, fs.readFileSync(path.join(root, source.extract), 'utf8')]));
for (const item of [...chapters, ...records]) {
  for (const ref of item.sourceRefs) {
    const match = /^(D[123]):(P\d{3})$/.exec(ref);
    assert.ok(match && new RegExp(`^## ${match[2]}\\r?$`, 'm').test(sourceIndex.get(match[1]) || ''), `${item.id}: missing source ${ref}`);
  }
}
for (const record of records) {
  const count = record.body.trim().split(/\s+/u).length;
  assert.ok(count >= 90 && count <= 150, `${record.id}: optional reading should be 90–150 words; got ${count}`);
}
for (const scene of model.scenes) {
  assert.ok(chapters.some(chapter => chapter.id === scene.chapterId), `Unknown chapter in ${scene.id}`);
  assert.ok(records.some(record => record.id === scene.recordId), `Missing record for ${scene.id}`);
}

const data = {
  schemaVersion: model.schemaVersion,
  contentVersion: `${model.contentVersion}-runtime-01`,
  evidenceScope: model.evidenceScope,
  reviewStatus: 'source-supported-pending-subject-review',
  scoring: model.scoring,
  sources: model.sources,
  chapters,
  scenes: model.scenes,
  records,
};
const generated = `// Generated by tools/build-runtime-content-v2.cjs; edit the source model or generator.\n(() => {\n  'use strict';\n  const data = ${JSON.stringify(data, null, 2)};\n  if (typeof module !== 'undefined' && module.exports) module.exports = data;\n  else window.V2_DATA = data;\n})();\n`;

if (process.argv.includes('--check')) {
  assert.ok(fs.existsSync(outputPath), 'Runtime payload does not exist. Run the generator first.');
  assert.equal(fs.readFileSync(outputPath, 'utf8'), generated, 'Runtime payload is stale. Run the generator again.');
  console.log('PASS: v2 runtime content matches its sources (9 scenes, 72 evaluations, 9 records).');
} else {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, generated, 'utf8');
  console.log('Generated src/js/v2-content.js (9 scenes, 72 evaluations, 9 records).');
}
