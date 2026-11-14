import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { FAQ } from '../data/content.js';
import { Container, SectionHead } from './ui.jsx';

function Item({ question, answer, id }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-[14px] border border-line bg-surface transition-shadow ${open ? 'shadow-soft' : ''}`}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 px-5.5 py-4.5 text-left font-semibold"
        >
          {question}
          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-[1.3rem] leading-none font-normal text-muted"
          >
            +
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5.5 pb-5 text-muted">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="border-y border-line bg-surface-2 py-20 lg:py-28">
      <Container className="max-w-[820px]">
        <SectionHead kicker="FAQ" title="Questions, answered." />
        <div className="grid gap-2.5">
          {FAQ.map(([q, a], i) => (
            <Item key={q} id={`faq-${i}`} question={q} answer={a} />
          ))}
        </div>
      </Container>
    </section>
  );
}
