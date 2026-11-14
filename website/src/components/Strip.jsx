import { SITES } from '../data/content.js';
import { Container } from './ui.jsx';

export default function Strip() {
  return (
    <section aria-label="Works wherever you type" className="border-y border-line bg-surface">
      <Container className="flex flex-col items-start gap-3.5 py-5.5 lg:flex-row lg:items-center lg:gap-10">
        <span className="shrink-0 text-[0.8rem] font-semibold tracking-[0.08em] text-muted uppercase">
          Works wherever you type
        </span>
        <ul className="flex flex-1 flex-wrap gap-x-8 lg:justify-between gap-y-3 font-serif text-[1.22rem] text-ink-2 opacity-75">
          {SITES.map((site) => (
            <li key={site}>{site}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
