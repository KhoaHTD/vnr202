/* Gameplay rules shared by mouse, touch and keyboard. No DOM or storage access.
 * Browser: V2Core. Node: require('./v2-core.js').
 * placements[targetId] is a card ID or null. Slots record evaluated selections;
 * editing a pending placement never rewrites an earlier evaluated selection.
 * Every successful submit stores an immutable-by-convention full snapshot and
 * evaluates only unresolved slots. score/summary are derived, never accumulated.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.V2Core = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var suitable = 'suitable';
  var needsReview = 'needs-review';
  var slotKeys = ['firstCardId', 'firstOutcome', 'finalCardId', 'finalOutcome', 'resolvedOnAttempt'];
  var own = function (object, key) { return Object.prototype.hasOwnProperty.call(object, key); };
  var object = function (value) { return value !== null && typeof value === 'object' && !Array.isArray(value); };
  var findScene = function (data, id) { return data.scenes.find(function (scene) { return scene.id === id; }); };
  var failure = function (reason) { return { ok: false, reason: reason }; };

  function evaluation(scene, targetId, cardId) {
    if (Array.isArray(scene.evaluations)) {
      return scene.evaluations.find(function (item) { return item.targetId === targetId && item.cardId === cardId; });
    }
    return scene.evaluations[targetId] && scene.evaluations[targetId][cardId];
  }

  function shuffle(values) {
    var result = values.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var previous = result[i]; result[i] = result[j]; result[j] = previous;
    }
    return result;
  }

  function newSceneState(scene, cardOrder) {
    var state = { cardOrder: cardOrder || shuffle(scene.cards.map(function (card) { return card.id; })), placements: {}, slots: {}, submissions: [], completed: false };
    scene.targets.forEach(function (target) {
      state.placements[target.id] = null;
      state.slots[target.id] = { firstCardId: null, firstOutcome: null, finalCardId: null, finalOutcome: null, resolvedOnAttempt: null };
    });
    return state;
  }

  function createRun(data, options) {
    options = options || {};
    var mode = options.mode || 'scored';
    if (mode !== 'scored' && mode !== 'practice') throw new Error('Unsupported run mode');
    var sceneId = mode === 'practice' ? (options.sceneId || data.scenes[0].id) : data.scenes[0].id;
    if (!findScene(data, sceneId)) throw new Error('Unknown practice scene');
    return {
      schemaVersion: 2,
      contentVersion: data.contentVersion,
      runId: 'v2-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12),
      mode: mode,
      currentSceneId: sceneId,
      finished: false,
      scenes: {}
    };
  }

  function getSceneState(data, run, sceneId) {
    sceneId = sceneId || run.currentSceneId;
    var scene = findScene(data, sceneId);
    if (!scene) return null;
    if (!own(run.scenes, sceneId)) run.scenes[sceneId] = newSceneState(scene);
    return run.scenes[sceneId];
  }

  function active(data, run) {
    if (run.finished) return failure('run-finished');
    var scene = findScene(data, run.currentSceneId);
    if (!scene) return failure('invalid-scene');
    var state = getSceneState(data, run);
    if (state.completed) return failure('scene-completed');
    return { ok: true, scene: scene, state: state };
  }

  function cardTarget(scene, state, cardId) {
    return scene.targets.find(function (target) { return state.placements[target.id] === cardId; });
  }

  function place(data, run, cardId, targetId) {
    var context = active(data, run);
    if (!context.ok) return context;
    var scene = context.scene, state = context.state;
    if (!scene.cards.some(function (card) { return card.id === cardId; })) return failure('invalid-card');
    if (!scene.targets.some(function (target) { return target.id === targetId; })) return failure('invalid-target');
    if (state.slots[targetId].finalOutcome === suitable) return failure('target-locked');
    var origin = cardTarget(scene, state, cardId);
    if (origin && state.slots[origin.id].finalOutcome === suitable) return failure('card-locked');
    if (origin && origin.id === targetId) return { ok: true, changed: false };
    var displaced = state.placements[targetId];
    if (origin) state.placements[origin.id] = displaced;
    state.placements[targetId] = cardId;
    return { ok: true, changed: true };
  }

  function returnCard(data, run, cardId) {
    var context = active(data, run);
    if (!context.ok) return context;
    if (!context.scene.cards.some(function (card) { return card.id === cardId; })) return failure('invalid-card');
    var origin = cardTarget(context.scene, context.state, cardId);
    if (!origin) return { ok: true, changed: false };
    if (context.state.slots[origin.id].finalOutcome === suitable) return failure('card-locked');
    context.state.placements[origin.id] = null;
    return { ok: true, changed: true };
  }

  function slotPoints(slot) {
    if (slot.firstOutcome === suitable) return 10;
    return slot.firstOutcome === needsReview && slot.finalOutcome === suitable ? 5 : 0;
  }

  function submit(data, run) {
    var context = active(data, run);
    if (!context.ok) return Object.assign(context, { results: [] });
    var scene = context.scene, state = context.state;
    if (scene.targets.some(function (target) { return !state.placements[target.id]; })) return { ok: false, reason: 'incomplete', results: [] };
    var unresolved = scene.targets.filter(function (target) { return state.slots[target.id].finalOutcome !== suitable; });
    if (!unresolved.length) return { ok: false, reason: 'resolved', results: [] };
    var last = state.submissions[state.submissions.length - 1];
    if (last && unresolved.every(function (target) { return last.placements[target.id] === state.placements[target.id]; })) {
      return { ok: false, reason: 'unchanged', results: [] };
    }
    // Validate the entire transaction before changing any slot.
    var checked = unresolved.map(function (target) {
      return { target: target, cardId: state.placements[target.id], match: evaluation(scene, target.id, state.placements[target.id]) };
    });
    if (checked.some(function (item) { return !item.match || (item.match.outcome !== suitable && item.match.outcome !== needsReview); })) {
      return { ok: false, reason: 'invalid-evaluation', results: [] };
    }
    var attempt = state.submissions.length + 1;
    var results = checked.map(function (item) {
      var slot = state.slots[item.target.id];
      if (slot.firstCardId === null) { slot.firstCardId = item.cardId; slot.firstOutcome = item.match.outcome; }
      slot.finalCardId = item.cardId;
      slot.finalOutcome = item.match.outcome;
      if (item.match.outcome === suitable) slot.resolvedOnAttempt = attempt;
      return { targetId: item.target.id, cardId: item.cardId, outcome: item.match.outcome, points: slotPoints(slot) };
    });
    state.submissions.push({ id: scene.id + ':' + attempt, attempt: attempt, placements: Object.assign({}, state.placements), results: results });
    // Return copies so a presentation layer cannot accidentally rewrite history.
    return { ok: true, results: results.map(function (item) { return Object.assign({}, item); }) };
  }

  function next(data, run) {
    var context = active(data, run);
    if (!context.ok) return context;
    if (!context.state.submissions.length) return failure('not-submitted');
    var index = data.scenes.indexOf(context.scene);
    var following = data.scenes[index + 1];
    var finished = run.mode === 'practice' || !following;
    var chapterEnded = finished || following.chapterId !== context.scene.chapterId;
    context.state.completed = true;
    if (finished) run.finished = true;
    else { run.currentSceneId = following.id; getSceneState(data, run); }
    return { ok: true, chapterEnded: chapterEnded, finished: finished };
  }

  function review(data, run) {
    var rows = [];
    data.scenes.forEach(function (scene) {
      var state = run.scenes[scene.id];
      if (!state) return;
      scene.targets.forEach(function (target) {
        var slot = state.slots[target.id];
        if (!slot || slot.firstOutcome === null) return;
        var allAttempts = state.submissions.reduce(function (items, submission) {
          submission.results.forEach(function (result) {
            if (result.targetId === target.id) items.push(Object.assign({ attempt: submission.attempt }, result));
          });
          return items;
        }, []);
        rows.push({
          sceneId: scene.id, targetId: target.id,
          firstCardId: slot.firstCardId, finalCardId: slot.finalCardId,
          firstOutcome: slot.firstOutcome, finalOutcome: slot.finalOutcome,
          points: slotPoints(slot), attempts: allAttempts.length, allAttempts: allAttempts,
          needsReview: slot.firstOutcome === needsReview
        });
      });
    });
    return rows;
  }

  function score(data, run) {
    return review(data, run).reduce(function (total, row) { return total + row.points; }, 0);
  }

  function emptySummary() {
    return { score: 0, max: 0, totalSlots: 0, firstSuitable: 0, corrected: 0, unresolved: 0, reviewCount: 0 };
  }

  function addRow(totals, row) {
    totals.score += row.points;
    if (row.firstOutcome === suitable) totals.firstSuitable++;
    else if (row.finalOutcome === suitable) totals.corrected++;
    else totals.unresolved++;
    if (row.needsReview) totals.reviewCount++;
  }

  function summary(data, run) {
    var totals = emptySummary();
    totals.byChapter = {};
    data.scenes.forEach(function (scene) {
      if (run.mode === 'practice' && scene.id !== run.currentSceneId) return;
      var chapter = totals.byChapter[scene.chapterId] || (totals.byChapter[scene.chapterId] = emptySummary());
      var count = scene.targets.length;
      chapter.max += count * 10; chapter.totalSlots += count;
      totals.max += count * 10; totals.totalSlots += count;
    });
    review(data, run).forEach(function (row) {
      addRow(totals, row);
      addRow(totals.byChapter[findScene(data, row.sceneId).chapterId], row);
    });
    return totals;
  }

  function exactKeys(value, keys) {
    return object(value) && Object.keys(value).length === keys.length && keys.every(function (key) { return own(value, key); });
  }

  function validPlacements(scene, placements, allowNull) {
    var targetIds = scene.targets.map(function (target) { return target.id; });
    if (!exactKeys(placements, targetIds)) return false;
    var used = [];
    return targetIds.every(function (id) {
      var cardId = placements[id];
      if (cardId === null) return allowNull;
      if (typeof cardId !== 'string' || used.indexOf(cardId) !== -1 || !scene.cards.some(function (card) { return card.id === cardId; })) return false;
      used.push(cardId); return true;
    });
  }

  function sameResult(actual, expected) {
    return object(actual) && ['targetId', 'cardId', 'outcome', 'points'].every(function (key) { return actual[key] === expected[key]; });
  }

  /* Replaying makes results and points accountable to the current content.
   * This validates accidental/malformed edits; client-only storage is not an
   * authenticated leaderboard and cannot prove a person's actual play history.
   */
  function restore(data, rawString) {
    try {
      if (typeof rawString !== 'string' || rawString.length > 1500000) return null;
      var raw = JSON.parse(rawString);
      if (!object(raw) || raw.schemaVersion !== 2 || raw.contentVersion !== data.contentVersion ||
          typeof raw.runId !== 'string' || !raw.runId || raw.runId.length > 200 ||
          (raw.mode !== 'scored' && raw.mode !== 'practice') || typeof raw.finished !== 'boolean' || !object(raw.scenes)) return null;
      var currentIndex = data.scenes.findIndex(function (scene) { return scene.id === raw.currentSceneId; });
      if (currentIndex < 0) return null;
      var restored = {
        schemaVersion: 2, contentVersion: data.contentVersion, runId: raw.runId,
        mode: raw.mode, currentSceneId: raw.currentSceneId, finished: raw.finished, scenes: {}
      };
      var sceneIds = Object.keys(raw.scenes);
      if (sceneIds.some(function (id) { return !findScene(data, id); })) return null;
      if (raw.mode === 'practice' && sceneIds.some(function (id) { return id !== raw.currentSceneId; })) return null;
      if (raw.finished && raw.mode === 'scored' && currentIndex !== data.scenes.length - 1) return null;

      for (var sceneIndex = 0; sceneIndex < data.scenes.length; sceneIndex++) {
        var scene = data.scenes[sceneIndex];
        var saved = raw.scenes[scene.id];
        var required = raw.mode === 'scored' && sceneIndex < currentIndex;
        if (raw.finished && sceneIndex === currentIndex) required = true;
        if (!saved) { if (required) return null; else continue; }
        if (!object(saved) || !Array.isArray(saved.cardOrder) || saved.cardOrder.length !== scene.cards.length ||
            new Set(saved.cardOrder).size !== scene.cards.length ||
            !scene.cards.every(function (card) { return saved.cardOrder.indexOf(card.id) !== -1; }) ||
            !validPlacements(scene, saved.placements, true) || !Array.isArray(saved.submissions) ||
            saved.submissions.length > 500 || typeof saved.completed !== 'boolean' ||
            !exactKeys(saved.slots, scene.targets.map(function (target) { return target.id; }))) return null;
        if (raw.mode === 'scored' && sceneIndex > currentIndex && (saved.submissions.length || saved.completed)) return null;
        var expectedCompleted = required;
        if (saved.completed !== expectedCompleted) return null;
        var replay = { finished: false, currentSceneId: scene.id, scenes: {} };
        var state = newSceneState(scene, saved.cardOrder.slice());
        replay.scenes[scene.id] = state;
        for (var i = 0; i < saved.submissions.length; i++) {
          var submission = saved.submissions[i];
          if (!object(submission) || submission.id !== scene.id + ':' + (i + 1) || submission.attempt !== i + 1 ||
              !validPlacements(scene, submission.placements, false) || !Array.isArray(submission.results)) return null;
          // An evaluated suitable card cannot later move or be replaced.
          if (scene.targets.some(function (target) {
            return state.slots[target.id].finalOutcome === suitable && submission.placements[target.id] !== state.slots[target.id].finalCardId;
          })) return null;
          state.placements = Object.assign({}, submission.placements);
          var result = submit(data, replay);
          if (!result.ok || result.results.length !== submission.results.length ||
              !result.results.every(function (item, index) { return sameResult(submission.results[index], item); })) return null;
        }
        if (expectedCompleted && !state.submissions.length) return null;
        if (scene.targets.some(function (target) {
          var previous = saved.slots[target.id], derived = state.slots[target.id];
          return !object(previous) || !slotKeys.every(function (key) { return previous[key] === derived[key]; }) ||
            (derived.finalOutcome === suitable && saved.placements[target.id] !== derived.finalCardId);
        })) return null;
        state.placements = Object.assign({}, saved.placements);
        state.completed = saved.completed;
        restored.scenes[scene.id] = state;
      }
      return restored;
    } catch (_) { return null; }
  }

  return { createRun: createRun, getSceneState: getSceneState, place: place, returnCard: returnCard, submit: submit, next: next, score: score, review: review, summary: summary, restore: restore };
}));
