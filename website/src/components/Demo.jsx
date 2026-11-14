import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { DEMO_STYLES, SCENARIOS } from '../data/content.js';
import { Mod, SparkIcon } from './ui.jsx';

const SCENARIO_IDS = Object.keys(SCENARIOS);
const TOAST_MS = 5000;

/**
 * Replays the extension's real UX (spinner → blur → swap → glow → undo toast)
 * with pre-written sample outputs. No network requests.
 */
export default function Demo({ isMac }) {
  const reduceMotion = useReducedMotion();
  const [scenarioId, setScenarioId] = useState('email');
  const [style, setStyle] = useState('professional');
  const [text, setText] = useState(SCENARIOS.email.draft);
  const [refined, setRefined] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | loading | blurring
  const [glow, setGlow] = useState(false);
  const [toast, setToast] = useState(false);

  const runId = useRef(0); // invalidates in-flight sequences when the user switches context
  const toastTimer = useRef();
  const glowTimer = useRef();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);

  const sleep = useCallback(
    (ms) => new Promise((resolve) => setTimeout(resolve, reduceMotion ? 0 : ms)),
    [reduceMotion],
  );
  const scenario = SCENARIOS[scenarioId];

  const showToast = useCallback(() => {
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), TOAST_MS);
  }, []);

  const swap = useCallback(
    async (id, nextText, withGlow) => {
      setPhase('blurring');
      await sleep(300);
      if (runId.current !== id) return false;
      setText(nextText);
      setPhase('idle');
      clearTimeout(glowTimer.current);
      setGlow(withGlow);
      if (withGlow) glowTimer.current = setTimeout(() => setGlow(false), reduceMotion ? 0 : 900);
      return true;
    },
    [sleep, reduceMotion],
  );

  const refine = useCallback(
    async (nextStyle = style) => {
      const id = ++runId.current;
      setToast(false);
      setPhase('loading');
      await sleep(850); // the model "thinking"
      if (runId.current !== id) return;
      if (await swap(id, scenario.refined[nextStyle], true)) {
        setRefined(true);
        showToast();
      }
    },
    [scenario, style, sleep, swap, showToast],
  );

  const undo = useCallback(async () => {
    const id = ++runId.current;
    setToast(false);
    if (await swap(id, scenario.draft, false)) {
      setRefined(false);
      buttonRef.current?.focus({ preventScroll: true });
    }
  }, [scenario, swap]);

  const selectScenario = (id) => {
    runId.current++;
    setScenarioId(id);
    setText(SCENARIOS[id].draft);
    setRefined(false);
    setPhase('idle');
    setGlow(false);
    setToast(false);
  };

  const selectStyle = (id) => {
    setStyle(id);
    // Already refined? Re-run in the new style so the difference is visible.
    if (refined || phase !== 'idle') refine(id);
  };

  // ⌘K / Ctrl+K anywhere on the page triggers the demo, like the real extension
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      e.preventDefault();
      const rect = rootRef.current?.getBoundingClientRect();
      if (rect && (rect.bottom < 0 || rect.top > window.innerHeight)) {
        rootRef.current.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }
      refine();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [refine, reduceMotion]);

  useEffect(() => () => [toastTimer, glowTimer].forEach((t) => clearTimeout(t.current)), []);

  const loading = phase === 'loading';

  return (
    <div id="demo" ref={rootRef} className="relative" aria-label="Interactive demo">
      <SegmentedTabs value={scenarioId} onChange={selectScenario} />

      {/* Browser window */}
      <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-float">
        <div className="flex h-[42px] items-center gap-[7px] border-b border-line bg-surface-2 px-4" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-[11px] rounded-full bg-ink/15" />
          ))}
          <span className="mx-auto -translate-x-5 rounded-[7px] border border-line bg-surface px-3.5 py-0.5 text-[0.76rem] text-muted">
            {scenario.url}
          </span>
        </div>

        <div className="p-3.5 sm:px-[22px] sm:pt-[18px] sm:pb-[22px]">
          <dl className="mb-3.5 text-[0.88rem]">
            {scenario.meta.map(([label, value]) => (
              <div key={label} className="flex gap-2.5 border-b border-line py-2">
                <dt className="min-w-[58px] text-muted">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <div
            className={`relative min-h-[240px] rounded-[14px] border bg-bg py-4 pr-14 pl-[18px] transition-[border-color,box-shadow] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] sm:min-h-[210px] ${
              glow
                ? 'border-accent/55 shadow-[0_0_0_4px_var(--accent-soft),0_0_28px_-4px_rgb(99_102_241/0.45)]'
                : 'border-line'
            }`}
          >
            <motion.p
              aria-live="polite"
              className={`text-[0.99rem] leading-[1.65] whitespace-pre-line ${refined ? 'text-ink-2' : 'text-muted'}`}
              animate={{
                filter: phase === 'blurring' ? 'blur(6px)' : 'blur(0px)',
                opacity: phase === 'blurring' ? 0.35 : 1,
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {text}
            </motion.p>

            <motion.button
              ref={buttonRef}
              type="button"
              onClick={() => refine()}
              aria-label="Refine this text"
              aria-busy={loading}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute top-3 right-3 grid size-[34px] cursor-pointer place-items-center rounded-[10px] border border-line bg-surface text-accent shadow-sm transition-shadow hover:shadow-[0_6px_16px_-4px_rgb(99_102_241/0.45)] ${
                !refined && !loading ? 'animate-nudge' : ''
              }`}
            >
              {loading ? (
                <span
                  className="size-4 animate-spin-fast rounded-full border-2 border-accent-soft border-t-accent"
                  aria-hidden="true"
                />
              ) : (
                <SparkIcon />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <StyleChips value={style} onChange={selectStyle} />
        <p className="text-[0.84rem] text-muted">
          Click <SparkIcon className="inline size-3.5 -translate-y-px text-accent" />
          <span className="max-sm:hidden">
            {' '}
            or press <Mod isMac={isMac} /> <kbd>K</kbd>
          </span>
        </p>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 6, x: '-50%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[74px] left-1/2 flex items-center gap-2.5 rounded-xl bg-[#1d1b29] py-[9px] pr-2.5 pl-3.5 text-[0.88rem] font-semibold text-white shadow-[0_16px_36px_-10px_rgb(0_0_0/0.45)]"
          >
            <span className="grid size-5 place-items-center rounded-full bg-success text-[0.72rem]" aria-hidden="true">
              ✓
            </span>
            Text refined
            <button
              type="button"
              onClick={undo}
              className="cursor-pointer rounded-lg bg-white/10 px-2.5 py-1 text-[0.82rem] text-indigo-200 hover:bg-white/15"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-3.5 text-[0.78rem] text-muted">
        Demo uses sample outputs. The extension sends your text to the model you choose.
      </p>
    </div>
  );
}

/** Keyboard support for tablists / radio groups: arrow keys move and select. */
function arrowNav(e, ids, current, onChange) {
  const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (!delta) return;
  e.preventDefault();
  const next = ids[(ids.indexOf(current) + delta + ids.length) % ids.length];
  onChange(next);
  e.currentTarget.parentElement.querySelector(`[data-id="${next}"]`)?.focus();
}

function SegmentedTabs({ value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Demo scenario"
      className="mb-3.5 inline-flex gap-1 rounded-full border border-line bg-surface-2 p-1"
    >
      {SCENARIO_IDS.map((id) => {
        const selected = id === value;
        return (
          <button
            key={id}
            data-id={id}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(id)}
            onKeyDown={(e) => arrowNav(e, SCENARIO_IDS, value, onChange)}
            className={`relative cursor-pointer rounded-full px-3.5 py-1.5 text-[0.84rem] font-semibold transition-colors ${
              selected ? 'text-ink' : 'text-muted hover:text-ink'
            }`}
          >
            {selected && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-surface shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
              />
            )}
            <span className="relative">{SCENARIOS[id].label}</span>
          </button>
        );
      })}
    </div>
  );
}

function StyleChips({ value, onChange }) {
  const ids = DEMO_STYLES.map((s) => s.id);
  return (
    <div role="radiogroup" aria-label="Refinement style" className="flex flex-wrap gap-1.5">
      {DEMO_STYLES.map(({ id, label }) => {
        const checked = id === value;
        return (
          <button
            key={id}
            data-id={id}
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(id)}
            onKeyDown={(e) => arrowNav(e, ids, value, onChange)}
            className={`cursor-pointer rounded-full border px-[13px] py-1.5 text-[0.82rem] font-semibold transition-colors ${
              checked
                ? 'border-accent/45 bg-accent-soft text-accent-ink'
                : 'border-line bg-surface text-ink-2 hover:border-accent/40'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
