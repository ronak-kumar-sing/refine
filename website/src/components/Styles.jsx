import { STYLES } from '../data/content.js';
import { Container, Reveal, SectionHead } from './ui.jsx';

export default function Styles() {
  return (
    <section id="styles" className="border-y border-line bg-surface-2 py-20 lg:py-28">
      <Container>
        <SectionHead kicker="Styles" title="The same message, in the voice the moment needs." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STYLES.map(([name, description], i) => (
            <Reveal key={name} delay={(i % 4) * 0.06} className="rounded-[22px] border border-line bg-surface p-6">
              <h3 className="font-serif text-[1.4rem] font-medium">{name}</h3>
              <p className="mt-2 text-[0.93rem] text-muted">{description}</p>
            </Reveal>
          ))}
          <Reveal delay={0.12} className="bg-gradient-brand rounded-[22px] p-6 text-white sm:col-span-2">
            <h3 className="font-serif text-[1.4rem] font-medium">Custom</h3>
            <p className="mt-2 text-[0.93rem] text-white/85">
              Write your own instructions, like{' '}
              <q className="text-white italic">Translate to Spanish and keep it formal</q> or{' '}
              <q className="text-white italic">Fix grammar but keep my slang.</q>
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
