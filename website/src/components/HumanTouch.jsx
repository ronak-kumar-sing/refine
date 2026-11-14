import { motion } from 'motion/react';

import { AI_TELLS } from '../data/content.js';
import { Container, Reveal, SectionHead } from './ui.jsx';

const POINTS = [
  [
    'Sounds like you',
    'Keeps your meaning, your point of view, and your personality. It edits your voice instead of replacing it.',
  ],
  [
    'Opus-grade editing, any model',
    'Every provider gets the same carefully written instructions, aiming for the clarity and judgment of Claude Opus even on smaller models.',
  ],
  [
    'Never goes rogue',
    'If your draft contains a question or a request, it gets rewritten, not answered. Facts, names, numbers, and links stay exactly as you wrote them.',
  ],
];

export default function HumanTouch() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="human-heading">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-[72px]">
        <div>
          <SectionHead
            align="left"
            kicker="Human, not robotic"
            title={<span id="human-heading">Polished writing that doesn't read like AI.</span>}
            lede="Plain words, natural rhythm, and contractions where they fit. None of the stock phrases that make readers think a bot wrote it."
          />
          <ul className="mt-10 grid gap-6">
            {POINTS.map(([title, body], i) => (
              <Reveal as="li" key={title} delay={i * 0.06} className="border-t border-line pt-5">
                <h3 className="text-[1.08rem] font-semibold tracking-tight">{title}</h3>
                <p className="mt-1 text-[0.95rem] text-muted">{body}</p>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="rounded-[22px] border border-line bg-surface p-7 shadow-soft">
          <p className="text-[0.8rem] font-bold tracking-[0.08em] text-muted uppercase">Phrases it avoids</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Examples of AI phrases the refiner avoids">
            {AI_TELLS.map((phrase, i) => (
              <motion.li
                key={phrase}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.35 }}
                className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[0.88rem] text-muted line-through decoration-accent/70 decoration-2"
              >
                {phrase}
              </motion.li>
            ))}
          </ul>
          <div className="mt-7 rounded-[14px] border border-line bg-bg p-4.5">
            <p className="text-[0.78rem] font-semibold text-muted">Instead, you get</p>
            <p className="mt-1.5 font-serif text-[1.15rem] leading-snug text-ink-2">
              “Sorry for the slow reply. The proposal looks good, but the timeline is tight. Could we move the launch
              back two weeks?”
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
