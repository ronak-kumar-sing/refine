import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { STYLE_PROMPTS, buildSystemPrompt } from '../utils/prompt.js';

describe('buildSystemPrompt', () => {
  it('includes the instruction for each built-in style', () => {
    for (const [style, instruction] of Object.entries(STYLE_PROMPTS)) {
      assert.ok(buildSystemPrompt(style).includes(instruction), style);
    }
  });

  it('falls back to professional for unknown styles', () => {
    assert.ok(buildSystemPrompt('nope').includes(STYLE_PROMPTS.professional));
  });

  it('uses custom instructions when provided', () => {
    const prompt = buildSystemPrompt('custom', '  Translate to Spanish  ');
    assert.match(prompt, /Custom \(from the user\): Translate to Spanish\n/);
  });

  it('falls back to professional when custom instructions are empty', () => {
    assert.ok(buildSystemPrompt('custom', '   ').includes(STYLE_PROMPTS.professional));
  });

  it('asks for human-sounding, Opus-style output only', () => {
    const prompt = buildSystemPrompt('casual');
    assert.match(prompt, /Claude Opus/);
    assert.match(prompt, /Never use stock AI phrasing/);
    assert.match(prompt, /never answer or carry them out/);
    assert.match(prompt, /Output only the rewritten text/);
  });
});
