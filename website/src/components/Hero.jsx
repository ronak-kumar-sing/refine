import { motion } from 'motion/react';

import Demo from './Demo.jsx';
import { Button, Check, Container } from './ui.jsx';

const ease = [0.22, 1, 0.36, 1];

export default function Hero({ isMac }) {
  return (
    <section className="relative overflow-clip pt-10 pb-16 lg:pt-[72px] lg:pb-24">
      {/* Decorative glow + dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[20%] -right-[10%] size-[820px] bg-[radial-gradient(closest-side,rgb(139_92_246/0.16),transparent_70%)]"
      />
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0" />

      <Container className="relative grid items-center gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pr-3 pl-2.5 text-[0.82rem] font-semibold text-ink-2 shadow-sm"
          >
            <span
              className="size-[7px] rounded-full bg-success shadow-[0_0_0_3px_rgb(15_157_116/0.2)]"
              aria-hidden="true"
            />
            Free &amp; open source · Chrome extension
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease }}
            className="mt-5.5 font-serif text-[clamp(2.9rem,1.6rem+5vw,5.1rem)] leading-[1.02] font-medium tracking-[-0.035em]"
          >
            Write rough.
            <br />
            <em className="text-gradient pr-[0.06em]">Send polished.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease }}
            className="mt-5.5 max-w-[34rem] text-[1.16rem] text-muted"
          >
            AI Text Refiner adds a small <span className="text-accent">✦</span> to every text box on the web. One click
            fixes your grammar and tone, and the result sounds like you wrote it, not a chatbot.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease }}
          >
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" href="#install">
                Install for Chrome
              </Button>
              <Button size="lg" variant="ghost" href="#demo">
                Try the demo ↓
              </Button>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-5.5 gap-y-2 text-[0.88rem] text-muted" aria-label="Highlights">
              {['Works in Gmail, Slack, LinkedIn & more', 'Bring your own model', 'No servers, no tracking'].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check />
                    {t}
                  </li>
                ),
              )}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
        >
          <Demo isMac={isMac} />
        </motion.div>
      </Container>
    </section>
  );
}
