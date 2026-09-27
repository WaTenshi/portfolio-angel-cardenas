import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampSpotlightRect,
  positionTourCard,
  tacticalCopy,
  tacticalDialogue,
  tacticalTourSteps,
} from '../src/components/tour/tourContent.js';

const languages = ['es', 'en'];

test('tactical codec dialogue is complete, bilingual and alternates speakers', () => {
  assert(tacticalDialogue.length >= 4, 'the briefing needs a meaningful conversation');
  assert.equal(tacticalDialogue[0].speaker, 'angel');
  assert.equal(tacticalDialogue.at(-1).speaker, 'chimuelo');

  const speakers = new Set();
  tacticalDialogue.forEach((line, index) => {
    assert(['angel', 'chimuelo'].includes(line.speaker), `line ${index + 1}: invalid speaker`);
    speakers.add(line.speaker);
    for (const language of languages) {
      assert.equal(typeof line.text[language], 'string', `line ${index + 1}: missing ${language} text`);
      assert(line.text[language].trim().length > 0, `line ${index + 1}: empty ${language} text`);
    }
    if (index > 0) {
      assert.notEqual(line.speaker, tacticalDialogue[index - 1].speaker, `line ${index + 1}: speakers must alternate`);
    }
  });

  assert.deepEqual([...speakers].sort(), ['angel', 'chimuelo']);
});

test('guided route contains fourteen unique, fully translated targets', () => {
  assert.equal(tacticalTourSteps.length, 14);
  const ids = tacticalTourSteps.map(({ id }) => id);
  const targets = tacticalTourSteps.map(({ target }) => target);
  assert.equal(new Set(ids).size, tacticalTourSteps.length, 'tour step ids must be unique');
  assert.equal(new Set(targets).size, tacticalTourSteps.length, 'tour targets must be unique');

  for (const [index, step] of tacticalTourSteps.entries()) {
    assert.match(step.id, /^[a-z][a-z0-9-]*$/, `step ${index + 1}: invalid id`);
    assert.match(step.target, /^[a-z][a-z0-9-]*$/, `step ${index + 1}: invalid target`);
    assert.equal(typeof step.code, 'string');
    assert(step.code.trim().length > 0, `step ${index + 1}: missing tactical code`);
    for (const language of languages) {
      assert(step.title[language]?.trim(), `step ${step.id}: missing ${language} title`);
      assert(step.body[language]?.trim(), `step ${step.id}: missing ${language} body`);
    }
  }

  assert.equal(tacticalTourSteps.some((step) => /moodle/i.test(`${step.title.es} ${step.body.es} ${step.title.en} ${step.body.en}`)), false);
});

test('tour interface copy has the same complete contract in Spanish and English', () => {
  const spanishKeys = Object.keys(tacticalCopy.es).sort();
  const englishKeys = Object.keys(tacticalCopy.en).sort();
  assert.deepEqual(spanishKeys, englishKeys);
  assert(spanishKeys.length > 0);

  for (const language of languages) {
    for (const key of spanishKeys) {
      assert.equal(typeof tacticalCopy[language][key], 'string', `${language}.${key} must be text`);
      assert(tacticalCopy[language][key].trim().length > 0, `${language}.${key} must not be empty`);
    }
  }
});

test('spotlight rectangles are clamped to the padded viewport', () => {
  const viewport = { width: 1000, height: 800 };
  assert.deepEqual(
    clampSpotlightRect({ left: 120, top: 90, right: 420, bottom: 290 }, viewport),
    { left: 120, top: 90, width: 300, height: 200 },
  );
  assert.deepEqual(
    clampSpotlightRect({ left: 950, top: 760, right: 1100, bottom: 900 }, viewport),
    { left: 950, top: 760, width: 38, height: 28 },
  );
  assert.deepEqual(
    clampSpotlightRect({ left: -200, top: -100, right: -20, bottom: -10 }, viewport),
    { left: 12, top: 12, width: 1, height: 1 },
  );
});

test('tour card prefers available space and remains inside horizontal viewport edges', () => {
  const viewport = { width: 1000, height: 800 };
  const card = { width: 390, height: 270 };

  assert.deepEqual(
    positionTourCard({ left: 100, top: 100, width: 240, height: 100 }, viewport, card),
    { left: 100, top: 218 },
    'card should appear below a target when enough room is available',
  );
  assert.deepEqual(
    positionTourCard({ left: 250, top: 600, width: 240, height: 100 }, viewport, card),
    { left: 250, top: 312 },
    'card should move above a target near the bottom edge',
  );
  assert.deepEqual(
    positionTourCard({ left: 900, top: 100, width: 80, height: 80 }, viewport, card),
    { left: 594, top: 198 },
    'card should clamp against the right edge',
  );
  assert.deepEqual(
    positionTourCard({ left: -40, top: 100, width: 80, height: 80 }, viewport, card),
    { left: 16, top: 198 },
    'card should clamp against the left edge',
  );

  const mobileViewport = { width: 320, height: 800 };
  const mobileCard = { width: 288, height: 270 };
  const mobilePosition = positionTourCard({ left: 250, top: 150, width: 60, height: 80 }, mobileViewport, mobileCard);
  assert.equal(mobilePosition.left, 16);
  assert(mobilePosition.top >= 16);
  assert(mobilePosition.left + mobileCard.width <= mobileViewport.width - 16);
});
