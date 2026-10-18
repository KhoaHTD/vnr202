/* Documentation build only. Does not load or change the running game. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const read = name => JSON.parse(fs.readFileSync(path.join(DOCS, name), 'utf8').replace(/^\uFEFF/, ''));
const catalog = read('source-extracts-v2/catalog.json');
const sourceFiles = ['GiaiDoan1930Den1935', 'GiaiDoan1936Den1939', 'GiaiDoan1939Den1945'];
const sources = sourceFiles.map((stem, i) => ({
  id: `D${i + 1}`, file: `docs/${stem}.docx`, extract: `docs/source-extracts-v2/${stem}.md`,
  sha256: catalog.find(item => item.file === `${stem}.docx`).sha256,
  extractSha256: catalog.find(item => item.file === `${stem}.docx`).extractSha256,
  locator: 'OOXML paragraph Pxxx, not a page number', status: 'internal-source',
  independentlyVerified: false
}));
const paragraphIds = new Map();
for (const source of sources) {
  const sourcePath = path.join(ROOT, source.file);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex');
  assert.equal(hash, source.sha256, `Source changed: ${source.id}; regenerate extracts and review content.`);
  const extractBytes = fs.readFileSync(path.join(ROOT, source.extract));
  const extractHash = crypto.createHash('sha256').update(extractBytes).digest('hex');
  assert.equal(extractHash, source.extractSha256, `Extract changed: ${source.id}; regenerate from source and review.`);
  const extract = extractBytes.toString('utf8');
  paragraphIds.set(source.id, new Set([...extract.matchAll(/^## (P\d{3})$/gm)].map(m => m[1])));
}
const drafts = ['c1', 'c2', 'c3'].map(id => read(`content-drafts-v2/${id}.json`));
const scenes = drafts.flatMap(d => d.scenes).sort((a, b) => a.id.localeCompare(b.id));
assert.equal(scenes.length, 9, 'Nine scenes required.');
assert.equal(new Set(scenes.map(s => s.id)).size, 9, 'Scene IDs must be unique.');
const chapterCounts = [2, 2, 5];
['c1', 'c2', 'c3'].forEach((id, i) => assert.equal(scenes.filter(s => s.chapterId === id).length, chapterCounts[i]));
const validTypes = new Set(['task-mismatch', 'timing', 'missing-condition', 'category-mismatch', 'scope']);
const validStatuses = new Set(['suitable', 'needs-review']);
let evaluationCount = 0, suitableCount = 0, needsReviewCount = 0;
const solutionCounts = {};
const warnings = [];
function checkRefs(refs, where) {
  assert.ok(Array.isArray(refs) && refs.length, `${where}: sourceRefs required.`);
  for (const ref of refs) {
    const match = /^(D[123]):(P\d{3})$/.exec(ref);
    assert.ok(match && paragraphIds.get(match[1]).has(match[2]), `${where}: invalid source locator ${ref}`);
  }
}
function words(value) { return value.trim().split(/\s+/u).length; }
for (const scene of scenes) {
  assert.equal(scene.targets.length, 2, `${scene.id}: two targets required.`);
  assert.equal(scene.cards.length, 4, `${scene.id}: four cards required.`);
  assert.equal(scene.evaluations.length, 8, `${scene.id}: eight evaluations required.`);
  const targetIds = new Set(scene.targets.map(t => t.id));
  const cardIds = new Set(scene.cards.map(c => c.id));
  assert.equal(targetIds.size, 2); assert.equal(cardIds.size, 4);
  for (const item of [...scene.targets, ...scene.cards]) {
    assert.ok(item.id.startsWith(scene.id + '-'), `${scene.id}: namespaced ID required.`);
    assert.ok(item.label && item.detail, `${item.id}: label and detail required.`);
    if (words(item.label) > 7) warnings.push(`${item.id}: label over 7 words (${words(item.label)}).`);
  }
  assert.ok(scene.contextShort && scene.learningObjective && scene.title);
  if (words(scene.contextShort) > 20) warnings.push(`${scene.id}: context over 20 words (${words(scene.contextShort)}).`);
  checkRefs(scene.sourceRefs, scene.id);
  const matrix = new Map();
  for (const evaluation of scene.evaluations) {
    const key = `${evaluation.targetId}/${evaluation.cardId}`;
    assert.ok(targetIds.has(evaluation.targetId) && cardIds.has(evaluation.cardId), `Unknown IDs in ${key}`);
    assert.ok(!matrix.has(key), `Duplicate ${key}`);
    assert.ok(validStatuses.has(evaluation.outcome), `Invalid outcome in ${key}`);
    assert.ok(evaluation.reasonShort && evaluation.reasonDetail, `Missing explanation in ${key}`);
    checkRefs(evaluation.sourceRefs, key);
    assert.ok(Array.isArray(evaluation.suggestedCardIds));
    if (evaluation.outcome === 'suitable') {
      suitableCount++;
      assert.equal(evaluation.reasonType, null);
      assert.equal(evaluation.suggestedCardIds.length, 0);
    } else {
      needsReviewCount++;
      assert.ok(validTypes.has(evaluation.reasonType));
      assert.ok(evaluation.suggestedCardIds.length);
    }
    evaluation.evidenceStatus = 'source-supported';
    evaluation.evaluationNature = 'editorial-match';
    evaluation.subjectReviewStatus = 'pending';
    matrix.set(key, evaluation);
    evaluationCount++;
  }
  for (const target of scene.targets) for (const card of scene.cards) {
    assert.ok(matrix.has(`${target.id}/${card.id}`), `Missing ${target.id}/${card.id}`);
  }
  for (const evaluation of scene.evaluations) for (const suggested of evaluation.suggestedCardIds) {
    assert.equal(matrix.get(`${evaluation.targetId}/${suggested}`)?.outcome, 'suitable', `Invalid suggestion in ${scene.id}`);
  }
  const accepted = targetId => scene.cards.filter(card => matrix.get(`${targetId}/${card.id}`).outcome === 'suitable');
  const [a, b] = scene.targets;
  const solutions = [];
  for (const ca of accepted(a.id)) for (const cb of accepted(b.id)) if (ca.id !== cb.id) solutions.push([ca.id, cb.id]);
  assert.ok(solutions.length, `${scene.id}: no two-card solution.`);
  for (const target of scene.targets) {
    const other = scene.targets.find(t => t.id !== target.id);
    for (const card of accepted(target.id)) {
      assert.ok(accepted(other.id).some(c => c.id !== card.id), `${scene.id}: locking ${card.id} causes a dead end.`);
    }
  }
  scene.recordId = 'r' + scene.id.slice(1);
  scene.contentStatus = 'source-supported-pending-subject-review';
  scene.acceptedAssignments = solutions.map(([ca, cb]) => ({[a.id]: ca, [b.id]: cb}));
  solutionCounts[scene.id] = solutions.length;
}
assert.equal(evaluationCount, 72);
const model = {
  schemaVersion: 2,
  contentVersion: 'v2-source-review-01',
  artifactPurpose: 'Documentation handoff; not imported by the current game.',
  evidenceScope: 'Compared with supplied internal documents, not independently verified or subject-approved.',
  scoring: {firstSuitable: 10, corrected: 5, unresolved: 0, targetCount: 18, maxScore: 180, chapterMaxScores: {c1: 40, c2: 40, c3: 100}},
  sources, scenes,
  findings: drafts.flatMap(d => d.findings),
  structuralValidation: {scenes: scenes.length, targets: 18, cards: 36, evaluations: evaluationCount, suitable: suitableCount, needsReview: needsReviewCount, solutionCounts, lockDeadEnds: 0, warnings}
};
const outJson = path.join(DOCS, 'content-model-v2.json');
const outMd = path.join(DOCS, 'content-matrix-v2.md');
const lines = [
  '# Ma trận nội dung và đánh giá v2', '',
  'Đợt 0 — bản bàn giao cho AI triển khai. Nguồn dữ liệu có cấu trúc: `docs/content-model-v2.json`. Game hiện tại chưa nạp dữ liệu này.', '',
  '## Phạm vi kiểm chứng', '',
  'Đã đối chiếu nội dung với ba tài liệu Word do nhóm cung cấp, gồm cả ghi chú. `source-supported` nghĩa là có đoạn nguồn nội bộ hỗ trợ; `editorial-match` nghĩa là việc ghép theo phạm vi nhiệm vụ do thiết kế biên tập. Không phải xác minh độc lập hoặc phê duyệt chuyên môn. Cả 72 cặp còn trạng thái `subjectReviewStatus: pending`.', '',
  'D1/D2/D3 lần lượt là tài liệu giai đoạn 1930–1935, 1936–1939, 1939–1945. Pxxx là đoạn OOXML theo thứ tự tài liệu, kể cả đoạn trống và ô bảng; không phải trang. Bản trích có anchor Pxxx trong `docs/source-extracts-v2/`. Nguồn nguyên gốc không được sửa.', '',
  'Tất cả lý do dưới đây được biên soạn lại, không phải trích dẫn nguyên văn. Dòng “chưa phù hợp” giới hạn vào nhiệm vụ ở ô, không phủ nhận giá trị lịch sử của hoạt động đó.', '',
  '## Quy tắc để triển khai', '',
  '- Dùng ID để chấm; không dùng thứ tự thẻ. Một thẻ chỉ có ở một ô.',
  '- Chấm lúc bấm Triển khai. Highlight vùng thả không sử dụng kết quả đánh giá.',
  '- Mọi cặp suitable có điểm như nhau, kể cả phương án thay thế.',
  '- Phù hợp ngay: 10; điều chỉnh phù hợp: 5; chưa hoàn thành: 0. Tổng 180; chương 40/40/100.',
  '- Ghi lựa chọn đầu và mọi lần thử; luyện lại không thay run ban đầu.',
  '- Cặp needs-review dùng đúng reasonShort/reasonDetail và suggestedCardIds của chính cặp đó.',
  '- Kết quả kiểm tra cấu trúc không chứng minh độ thú vị hoặc độ chính xác lịch sử độc lập.', '',
  '## Danh mục nguồn', '',
  '| ID | Tệp gốc | Bản trích | Định vị |', '|---|---|---|---|'
];
for (const source of sources) {
  lines.push(`| ${source.id} | [${path.basename(source.file)}](../${source.file}) | [Bản trích](source-extracts-v2/${path.basename(source.extract)}) | Pxxx, SHA256 trong catalog |`);
}
const inline = value => value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
for (const scene of scenes) {
  const tLabel = id => scene.targets.find(t => t.id === id).label;
  const cLabel = id => scene.cards.find(c => c.id === id).label;
  lines.push('', `## ${scene.id.toUpperCase()} — ${scene.title}`, '', `**Chương:** ${scene.chapterId}. **Giai đoạn:** ${scene.period}. **Tối đa:** 20 điểm.`, '', `**Bối cảnh hiện trên màn:** ${scene.contextShort}`, '', `**Mục tiêu học tập:** ${scene.learningObjective}`, '', `**Hồ sơ mở thêm:** ${scene.recordId}. **Nguồn nền:** ${scene.sourceRefs.join(', ')}.`, '', '### Hai nhiệm vụ', '');
  for (const target of scene.targets) lines.push(`- **${target.label}** (${target.id}): ${target.detail}`);
  lines.push('', '### Bốn thẻ', '', '| ID | Tên trên màn | Nội dung mở bằng nút thông tin |', '|---|---|---|');
  for (const card of scene.cards) lines.push(`| ${card.id} | ${inline(card.label)} | ${inline(card.detail)} |`);
  lines.push('', '### Ma trận tám cặp', '', '| Mã cặp | Ô nhiệm vụ | Thẻ | Đánh giá | Lý do ngắn | Nguồn |', '|---|---|---|---|---|---|');
  scene.evaluations.forEach((e, i) => lines.push(`| ${scene.id}-e${i + 1} | ${inline(tLabel(e.targetId))} | ${inline(cLabel(e.cardId))} | ${e.outcome === 'suitable' ? 'Phù hợp' : 'Chưa phù hợp với ô này'} | ${inline(e.reasonShort)} | ${e.sourceRefs.join(', ')} |`));
  lines.push('', '### Giải thích theo từng lựa chọn', '');
  scene.evaluations.forEach((e, i) => {
    lines.push(`#### ${scene.id}-e${i + 1} — ${cLabel(e.cardId)} → ${tLabel(e.targetId)}`, '', e.reasonDetail, '', `Nguồn: ${e.sourceRefs.join(', ')}. Cơ sở: source-supported / editorial-match; chờ duyệt chuyên môn.`);
    if (e.suggestedCardIds.length) lines.push('', `Phương án đáp ứng ô: ${e.suggestedCardIds.map(cLabel).join('; ')}. Loại phân biệt: ${e.reasonType}.`);
    lines.push('');
  });
  lines.push('### Các cách hoàn thành được chấp nhận', '');
  for (const solution of scene.acceptedAssignments) lines.push('- ' + scene.targets.map(t => `${t.label}: **${cLabel(solution[t.id])}**`).join(' + '));
  lines.push('', 'Mọi lựa chọn phù hợp đã được kiểm tra không gây bế tắc sau khi khóa ô.');
}
lines.push('', '## Các quyết định biên tập và nội dung cần chú ý', '');
for (const finding of model.findings) lines.push(`### ${finding.id}`, '', `**Vấn đề:** ${finding.issue}`, '', `**Chứng cứ:** ${finding.evidence}`, '', `**Quyết định:** ${finding.decision}`, '');
lines.push('## Kiểm tra cấu trúc', '', `- ${scenes.length} màn, 18 ô, 36 thẻ theo màn, ${evaluationCount} cặp đánh giá.`, `- ${suitableCount} cặp phù hợp, ${needsReviewCount} cặp cần xem lại.`, '- Tất cả nguồn tham chiếu trỏ tới đoạn có thật; hash ba Word khớp bản trích.', '- Mỗi màn có nghiệm dùng hai thẻ khác nhau; không có bế tắc do khóa phương án phù hợp.', `- Số cách giải theo màn: ${Object.entries(solutionCounts).map(([id, n]) => `${id}: ${n}`).join('; ')}.`, '- Tất cả gợi ý dẫn tới một cặp được chấp nhận ở đúng ô.', '- Chưa chạy kiểm tra engine v2, UI kéo thả hoặc người chơi thật vì chưa triển khai gameplay trong đợt này.', '', 'Tái tạo và kiểm tra: `node tools/build-content-spec-v2.cjs`. Lệnh đọc các bản biên tập trong `docs/content-drafts-v2/`, kiểm tra, rồi ghi lại model và tài liệu này. Khi sửa nội dung, sửa bản biên tập tương ứng và tái tạo; không sửa riêng một bản output.', '');
if (warnings.length) lines.push('### Lưu ý độ dài copy', '', ...warnings.map(w => '- ' + w), '');
if (process.argv.includes('--check')) {
  assert.equal(fs.readFileSync(outJson, 'utf8'), JSON.stringify(model, null, 2) + '\n', 'Model differs: rebuild documentation.');
  assert.equal(fs.readFileSync(outMd, 'utf8'), lines.join('\n'), 'Matrix differs: rebuild documentation.');
} else {
  fs.writeFileSync(outJson, JSON.stringify(model, null, 2) + '\n');
  fs.writeFileSync(outMd, lines.join('\n'));
}
console.log(JSON.stringify({status: 'PASS', ...model.structuralValidation}, null, 2));
