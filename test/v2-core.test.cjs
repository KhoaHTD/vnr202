'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const core = require('../src/js/v2-core.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/content-model-v2.json'), 'utf8'));

const match = (scene, targetId, cardId) => scene.evaluations.find(e => e.targetId === targetId && e.cardId === cardId);
const clone = value => JSON.parse(JSON.stringify(value));
const sceneOf = run => data.scenes.find(scene => scene.id === run.currentSceneId);
const restored = run => core.restore(data, JSON.stringify(run));

function assignment(scene, outcomes, locked = {}) {
  const answer = {};
  function search(index, used) {
    if (index === scene.targets.length) return true;
    const target = scene.targets[index];
    for (const card of scene.cards) {
      if (used.has(card.id) || (locked[target.id] && locked[target.id] !== card.id)) continue;
      if (match(scene, target.id, card.id).outcome !== outcomes[index]) continue;
      answer[target.id] = card.id;
      if (search(index + 1, new Set([...used, card.id]))) return true;
    }
    return false;
  }
  assert.ok(search(0, new Set()), `No ${outcomes} assignment for ${scene.id}`);
  return answer;
}

function placeAssignment(run, cards) {
  const state = core.getSceneState(data, run);
  for (const [targetId, cardId] of Object.entries(cards)) {
    if (state.slots[targetId].finalOutcome === 'suitable') {
      assert.equal(state.placements[targetId], cardId);
    } else assert.equal(core.place(data, run, cardId, targetId).ok, true);
  }
  assert.deepEqual(state.placements, cards);
}

function finishRun(outcomesForScene) {
  let run = core.createRun(data);
  for (const [index, scene] of data.scenes.entries()) {
    const plan = outcomesForScene(index);
    const initial = plan.map(outcome => outcome === 'first' ? 'suitable' : 'needs-review');
    placeAssignment(run, assignment(scene, initial));
    assert.equal(core.submit(data, run).ok, true);
    if (plan.includes('corrected')) {
      const state = core.getSceneState(data, run);
      const locked = Object.fromEntries(scene.targets.filter(t => state.slots[t.id].finalOutcome === 'suitable').map(t => [t.id, state.placements[t.id]]));
      placeAssignment(run, assignment(scene, plan.map(value => value === 'unresolved' ? 'needs-review' : 'suitable'), locked));
      assert.equal(core.submit(data, run).ok, true);
    }
    const before = JSON.stringify(run);
    run = restored(run);
    assert.ok(run, `Could not restore ${scene.id}`);
    assert.equal(JSON.stringify(run), before);
    const advanced = core.next(data, run);
    assert.equal(advanced.ok, true);
    assert.equal(advanced.finished, index === data.scenes.length - 1);
    assert.equal(advanced.chapterEnded, [1, 3, 8].includes(index));
    assert.ok(restored(run));
  }
  assert.equal(run.finished, true);
  assert.equal(core.next(data, run).reason, 'run-finished');
  return run;
}

test('exports the same API without browser DOM access', () => {
  const context = { Math, Date, Set };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/js/v2-core.js'), 'utf8'), context);
  assert.equal(typeof context.V2Core.submit, 'function');
});

test('new run has no awarded points or fabricated unresolved tasks', () => {
  const run = core.createRun(data);
  assert.equal(run.currentSceneId, 's01');
  assert.deepEqual(run.scenes, {});
  assert.equal(core.score(data, run), 0);
  const totals = core.summary(data, run);
  assert.equal(totals.max, 180);
  assert.equal(totals.totalSlots, 18);
  assert.equal(totals.unresolved, 0);
  assert.deepEqual(Object.values(totals.byChapter).map(c => c.max), [40, 40, 100]);
  assert.equal(core.next(data, run).reason, 'not-submitted');
  assert.equal(core.submit(data, run).reason, 'incomplete');
  assert.ok(restored(core.createRun(data)));
  assert.throws(() => core.createRun(data, { mode: 'unknown' }));
  assert.throws(() => core.createRun(data, { mode: 'practice', sceneId: 'unknown' }));
});

test('placing, replacing, swapping and returning obey one-card-per-target', () => {
  const run = core.createRun(data);
  const scene = sceneOf(run), [a, b] = scene.targets.map(t => t.id), cards = scene.cards.map(c => c.id);
  const state = core.getSceneState(data, run);
  const order = state.cardOrder.slice();
  assert.deepEqual(new Set(order), new Set(cards));
  assert.deepEqual(core.getSceneState(data, run).cardOrder, order);
  assert.equal(core.place(data, run, 'unknown', a).reason, 'invalid-card');
  assert.equal(core.place(data, run, cards[0], 'unknown').reason, 'invalid-target');
  assert.equal(core.place(data, run, cards[0], a).ok, true);
  assert.equal(core.place(data, run, cards[1], b).ok, true);
  assert.equal(core.place(data, run, cards[0], b).ok, true);
  assert.deepEqual(state.placements, { [a]: cards[1], [b]: cards[0] });
  assert.equal(core.place(data, run, cards[2], b).ok, true);
  assert.deepEqual(state.placements, { [a]: cards[1], [b]: cards[2] });
  assert.equal(core.place(data, run, cards[2], b).changed, false);
  assert.equal(core.returnCard(data, run, cards[2]).changed, true);
  assert.equal(core.returnCard(data, run, cards[2]).changed, false);
  assert.equal(core.returnCard(data, run, 'unknown').reason, 'invalid-card');
  assert.equal(core.place(data, run, cards[1], b).ok, true);
  assert.deepEqual(state.placements, { [a]: null, [b]: cards[1] });
  assert.equal(state.submissions.length, 0);
  assert.equal(core.score(data, run), 0);
  assert.deepEqual(restored(run).scenes[scene.id].cardOrder, order);
});

test('first result is immutable, suitable tasks lock, duplicate submits do not award points', () => {
  const run = core.createRun(data, { mode: 'practice', sceneId: 's02' });
  const scene = sceneOf(run), [a, b] = scene.targets.map(t => t.id);
  placeAssignment(run, assignment(scene, ['suitable', 'needs-review']));
  const result = core.submit(data, run);
  assert.deepEqual(result.results.map(r => r.points), [10, 0]);
  const state = core.getSceneState(data, run), firstB = state.slots[b].firstCardId;
  const lockedCard = state.placements[a];
  assert.equal(core.submit(data, run).reason, 'unchanged');
  assert.equal(state.submissions.length, 1);
  assert.equal(core.returnCard(data, run, lockedCard).reason, 'card-locked');
  assert.equal(core.place(data, run, lockedCard, b).reason, 'card-locked');
  const unused = scene.cards.find(card => !Object.values(state.placements).includes(card.id)).id;
  assert.equal(core.place(data, run, unused, a).reason, 'target-locked');
  const correct = assignment(scene, ['suitable', 'suitable'], { [a]: lockedCard });
  assert.equal(core.place(data, run, correct[b], b).ok, true);
  assert.equal(core.score(data, run), 10, 'pending placement is not already evaluated');
  assert.equal(state.slots[b].finalCardId, firstB);
  assert.ok(restored(run), 'pending correction may differ from submitted card');
  const correction = core.submit(data, run);
  assert.equal(correction.results.length, 1);
  assert.equal(correction.results[0].points, 5);
  assert.equal(state.slots[b].firstCardId, firstB);
  assert.equal(state.slots[b].resolvedOnAttempt, 2);
  assert.equal(core.score(data, run), 15);
  assert.equal(core.submit(data, run).reason, 'resolved');
  assert.equal(state.submissions.length, 2);
  const rows = core.review(data, run);
  assert.deepEqual(rows.map(r => r.attempts), [1, 2]);
  assert.deepEqual(rows.map(r => r.needsReview), [false, true]);
  assert.equal(rows[1].allAttempts[0].cardId, firstB);
  assert.equal(core.next(data, run).finished, true);
});

test('changing a returned result cannot rewrite stored submission', () => {
  const run = core.createRun(data);
  const scene = sceneOf(run);
  placeAssignment(run, assignment(scene, ['suitable', 'suitable']));
  const result = core.submit(data, run);
  result.results[0].outcome = 'needs-review';
  assert.equal(core.getSceneState(data, run).submissions[0].results[0].outcome, 'suitable');
  assert.ok(restored(run));
});

test('all 9 scenes first suitable yield 180; chapters retain 2/2/5 distribution', () => {
  const run = finishRun(() => ['first', 'first']);
  assert.equal(core.score(data, run), 180);
  const totals = core.summary(data, run);
  assert.equal(totals.firstSuitable, 18);
  assert.equal(totals.corrected, 0);
  assert.equal(totals.unresolved, 0);
  assert.equal(totals.reviewCount, 0);
  assert.deepEqual(Object.values(totals.byChapter).map(c => c.score), [40, 40, 100]);
});

test('all adjusted yield 90; all initially unresolved remain available for review', () => {
  const run = finishRun(() => ['corrected', 'corrected']);
  const totals = core.summary(data, run);
  assert.equal(core.score(data, run), 90);
  assert.equal(totals.corrected, 18);
  assert.equal(totals.reviewCount, 18);
  assert.equal(totals.unresolved, 0);
  assert.ok(core.review(data, run).every(row => row.points === 5 && row.attempts === 2));
});

test('all unresolved yield 0, can advance and produce 18 explanations', () => {
  const run = finishRun(() => ['unresolved', 'unresolved']);
  const totals = core.summary(data, run);
  assert.equal(core.score(data, run), 0);
  assert.equal(totals.unresolved, 18);
  assert.equal(totals.reviewCount, 18);
  assert.equal(core.review(data, run).length, 18);
});

test('12 first suitable + 5 adjusted + 1 unresolved =145 with 6 review items', () => {
  const run = finishRun(index => index < 6 ? ['first', 'first'] : index < 8 ? ['corrected', 'corrected'] : ['corrected', 'unresolved']);
  const totals = core.summary(data, run);
  assert.equal(totals.score, 145);
  assert.equal(totals.firstSuitable, 12);
  assert.equal(totals.corrected, 5);
  assert.equal(totals.unresolved, 1);
  assert.equal(totals.reviewCount, 6);
  assert.equal(core.review(data, run).filter(row => row.needsReview).length, 6);
  assert.equal(Object.values(totals.byChapter).reduce((sum, c) => sum + c.score, 0), 145);
});

test('all accepted alternatives get full credit and suitable lock cannot cause a dead end', () => {
  let alternatives = 0;
  for (const scene of data.scenes) {
    for (const accepted of scene.acceptedAssignments) {
      const run = core.createRun(data, { mode: 'practice', sceneId: scene.id });
      placeAssignment(run, accepted);
      assert.equal(core.submit(data, run).ok, true);
      assert.equal(core.score(data, run), 20);
      alternatives++;
    }
    for (const target of scene.targets) {
      for (const card of scene.cards.filter(c => match(scene, target.id, c.id).outcome === 'suitable')) {
        const solution = assignment(scene, ['suitable', 'suitable'], { [target.id]: card.id });
        assert.equal(solution[target.id], card.id);
        assert.equal(new Set(Object.values(solution)).size, 2);
      }
    }
  }
  assert.equal(alternatives, 18);
});

test('practice has a separate run and finishes after its single scene', () => {
  const original = core.createRun(data);
  placeAssignment(original, assignment(sceneOf(original), ['needs-review', 'needs-review']));
  core.submit(data, original);
  const snapshot = JSON.stringify(original);
  const practice = core.createRun(data, { mode: 'practice', sceneId: 's08' });
  placeAssignment(practice, assignment(sceneOf(practice), ['suitable', 'suitable']));
  core.submit(data, practice);
  const totals = core.summary(data, practice);
  assert.equal(totals.max, 20);
  assert.equal(totals.totalSlots, 2);
  assert.equal(totals.score, 20);
  assert.equal(core.next(data, practice).finished, true);
  assert.equal(practice.currentSceneId, 's08');
  assert.ok(restored(practice));
  assert.equal(JSON.stringify(original), snapshot);
  assert.notEqual(original.runId, practice.runId);
});

test('skipping after editing an unresolved selection records evaluated card, not an unsubmitted guess', () => {
  const run = core.createRun(data);
  const scene = sceneOf(run);
  placeAssignment(run, assignment(scene, ['needs-review', 'needs-review']));
  core.submit(data, run);
  const first = clone(core.review(data, run));
  for (const cardId of Object.values(core.getSceneState(data, run).placements)) core.returnCard(data, run, cardId);
  assert.equal(core.next(data, run).ok, true);
  assert.deepEqual(core.review(data, run), first);
  assert.ok(restored(run));
});

test('restore rejects corrupt IDs, mismatched versions, duplicated cards and invented outcomes', () => {
  const run = core.createRun(data);
  const scene = sceneOf(run);
  placeAssignment(run, assignment(scene, ['needs-review', 'needs-review']));
  core.submit(data, run);
  assert.equal(core.restore(data, '{bad json'), null);
  assert.equal(core.restore(data, null), null);
  const mutations = [
    r => { r.schemaVersion = 1; },
    r => { r.contentVersion = 'different'; },
    r => { r.mode = 'cheat'; },
    r => { r.finished = 'false'; },
    r => { r.currentSceneId = 'unknown'; },
    r => { r.scenes.unknown = clone(r.scenes.s01); },
    r => { r.scenes.s01.cardOrder[1] = r.scenes.s01.cardOrder[0]; },
    r => { r.scenes.s01.cardOrder[0] = 'unknown'; },
    r => { r.scenes.s01.placements[scene.targets[1].id] = r.scenes.s01.placements[scene.targets[0].id]; },
    r => { r.scenes.s01.placements[scene.targets[0].id] = 'unknown'; },
    r => { delete r.scenes.s01.slots[scene.targets[0].id]; },
    r => { r.scenes.s01.slots[scene.targets[0].id].firstOutcome = 'suitable'; },
    r => { r.scenes.s01.submissions[0].results[0].outcome = 'suitable'; },
    r => { r.scenes.s01.submissions[0].results[0].points = 10; },
    r => { r.scenes.s01.submissions[0].results.pop(); },
    r => { r.scenes.s01.submissions[0].id = 's01:4'; },
    r => { r.scenes.s01.submissions[0].attempt = 4; },
    r => { r.scenes.s01.submissions.push(clone(r.scenes.s01.submissions[0])); },
    r => { r.scenes.s01.completed = true; },
    r => { r.currentSceneId = 's03'; },
    r => { r.finished = true; }
  ];
  for (const mutate of mutations) {
    const broken = clone(run); mutate(broken);
    assert.equal(restored(broken), null, mutate.toString());
  }
  const misleadingScore = clone(run);
  misleadingScore.score = 9999;
  assert.equal(core.score(data, restored(misleadingScore)), 0);
  assert.equal(restored(misleadingScore).score, undefined);
});

test('restore rejects moving a locked card and replaying identical unresolved layouts', () => {
  const run = core.createRun(data, { mode: 'practice', sceneId: 's02' });
  const scene = sceneOf(run), [a, b] = scene.targets.map(t => t.id);
  placeAssignment(run, assignment(scene, ['suitable', 'needs-review']));
  core.submit(data, run);
  const broken = clone(run);
  const state = broken.scenes.s02;
  [state.placements[a], state.placements[b]] = [state.placements[b], state.placements[a]];
  assert.equal(restored(broken), null);
  const duplicate = clone(run);
  const extra = clone(duplicate.scenes.s02.submissions[0]);
  extra.id = 's02:2'; extra.attempt = 2;
  duplicate.scenes.s02.submissions.push(extra);
  assert.equal(restored(duplicate), null);
});
