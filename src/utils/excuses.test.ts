import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHAOS_LEVELS,
  SITUATIONS,
  TARGETS,
  buildGeminiPrompt,
  clampChaosLevel,
  formatExcuseForCopy,
  generateFallbackExcuse,
  getChaosMeta,
  isValidSituation,
  isValidTarget,
  pickNextLoadingMessage,
} from './excuses';

test('validates all target and situation options accurately', () => {
  for (const target of TARGETS) {
    assert.equal(isValidTarget(target), true);
  }
  for (const situation of SITUATIONS) {
    assert.equal(isValidSituation(situation), true);
  }
  assert.equal(isValidTarget('Random Stranger'), false);
  assert.equal(isValidSituation('Slept through 2027'), false);
});

test('clampChaosLevel clamps out-of-range and invalid values safely', () => {
  assert.equal(clampChaosLevel(1), 1);
  assert.equal(clampChaosLevel(5), 5);
  assert.equal(clampChaosLevel(0), 1);
  assert.equal(clampChaosLevel(-4), 1);
  assert.equal(clampChaosLevel(99), 5);
  assert.equal(clampChaosLevel(3.4), 3);
  assert.equal(clampChaosLevel('4'), 4);
  assert.equal(clampChaosLevel(Number.NaN), 3);
});

test('getChaosMeta returns matching label for every level 1-5', () => {
  assert.equal(CHAOS_LEVELS.length, 5);
  assert.equal(getChaosMeta(1).label, 'Plausible & Believable');
  assert.equal(getChaosMeta(5).label, 'Sci-Fi / Aliens Involved');
});

test('generateFallbackExcuse creates distinct tailored excuses across every target, situation, and chaos level', () => {
  const results = new Set<string>();

  for (const target of TARGETS) {
    for (const situation of SITUATIONS) {
      for (const chaos of [1, 2, 3, 4, 5] as const) {
        const excuse = generateFallbackExcuse(target, situation, chaos, 0);
        assert.ok(excuse.length > 40, `Expected substantial excuse for ${target} / ${situation} / ${chaos}`);
        results.add(excuse);
      }
    }
  }

  // 5 targets * 5 situations * 5 chaos levels = 125 unique combinations
  assert.equal(results.size, 125);
});

test('level 5 excuses bring sci-fi or extraterrestrial energy while level 1 stays grounded', () => {
  const level1 = generateFallbackExcuse('Boss/Client', 'Late to class/meeting', 1, 0);
  const level5 = generateFallbackExcuse('Boss/Client', 'Late to class/meeting', 5, 0);

  assert.notEqual(level1, level5);
  assert.match(level5.toLowerCase(), /alien|extraterrestrial|quantum|ufo|wormhole|time-dilation|tractor beam|satellite|mothership/);
  assert.doesNotMatch(level1.toLowerCase(), /extraterrestrial|tractor beam|mothership/);
});

test('pickNextLoadingMessage never repeats the same index consecutively', () => {
  for (let prev = 0; prev < 7; prev += 1) {
    const next = pickNextLoadingMessage(prev);
    assert.ok(next.message.length > 0);
    assert.notEqual(next.index, prev);
  }
});

test('buildGeminiPrompt embeds target, situation, and chaos details cleanly', () => {
  const prompt = buildGeminiPrompt('Best Friend', 'Ghosted for 3 days', 5);
  assert.match(prompt, /Best Friend/);
  assert.match(prompt, /Ghosted for 3 days/);
  assert.match(prompt, /5\/5/);
  assert.match(prompt, /Sci-Fi \/ Aliens Involved/);
});

test('formatExcuseForCopy trims leading and trailing whitespace', () => {
  assert.equal(formatExcuseForCopy('  My router caught cosmic flu.  \n'), 'My router caught cosmic flu.');
});
