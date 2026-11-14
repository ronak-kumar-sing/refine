import { Container, Mod, Reveal, SectionHead } from './ui.jsx';

const Line = ({ short }) => <span className={`block h-[7px] rounded bg-ink/12 ${short ? 'w-3/5' : ''}`} />;

const card =
  'rounded-[22px] border border-line bg-surface p-4.5 pb-6 transition duration-300 hover:-translate-y-[3px] hover:shadow-soft';
const visual =
  'grid h-[150px] place-items-center overflow-hidden rounded-[14px] bg-surface-2 bg-[radial-gradient(circle_at_30%_20%,var(--accent-soft),transparent_60%)]';

export default function HowItWorks({ isMac }) {
  const ways = [
    {
      title: 'Click the sparkle',
      body: 'A small icon appears inside inputs, textareas, and rich-text editors, including ones a page adds later.',
      visual: (
        <div className="relative grid w-[78%] gap-2 rounded-[10px] border border-line bg-surface py-4 pr-10 pl-3.5 shadow-sm">
          <Line />
          <Line short />
          <span className="absolute top-1/2 right-2.5 grid size-6 -translate-y-1/2 place-items-center rounded-[7px] border border-line bg-surface text-[0.8rem] text-accent shadow-[0_4px_12px_-3px_rgb(99_102_241/0.5)]">
            ✦
          </span>
        </div>
      ),
    },
    {
      title: 'Use the shortcut',
      body: (
        <>
          <Mod isMac={isMac} /> <kbd>K</kbd> refines the focused field. On sites that already use it, try{' '}
          <Mod isMac={isMac} /> <kbd>Shift</kbd> <kbd>R</kbd>.
        </>
      ),
      visual: (
        <div className="flex items-center gap-2 font-semibold text-muted [&_kbd]:min-w-[52px] [&_kbd]:rounded-[10px] [&_kbd]:border-b-[3px] [&_kbd]:px-3 [&_kbd]:py-2.5 [&_kbd]:text-base [&_kbd]:shadow-sm">
          <Mod isMac={isMac} />
          <span>+</span>
          <kbd>K</kbd>
        </div>
      ),
    },
    {
      title: 'Right-click',
      body: 'Pick a style for this one refinement from the context menu, without changing your default.',
      visual: (
        <div className="w-[82%] text-[0.74rem]">
          <div className="flex justify-between rounded-lg border border-line bg-surface px-2.5 py-1.5 font-semibold text-ink-2 shadow-sm">
            ✦ Refine text with AI <span>›</span>
          </div>
          <div className="mt-1 ml-auto w-[64%] rounded-lg border border-line bg-surface p-1 shadow-soft">
            {['Professional', 'Concise', 'Academic'].map((s) => (
              <div
                key={s}
                className={`rounded-[5px] px-2.5 py-1.5 ${s === 'Concise' ? 'bg-accent text-white' : 'text-ink-2'}`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Quick Refine',
      body: 'Paste any text into the toolbar popup, refine it, and copy the result to use anywhere.',
      visual: (
        <div className="w-[74%] rounded-[10px] border border-line bg-surface p-2.5 shadow-soft">
          <div className="mb-2 text-[0.72rem] font-bold">Quick Refine</div>
          <div className="grid gap-1.5 rounded-md bg-surface-2 p-2.5">
            <Line />
            <Line short />
          </div>
          <div className="mt-2 flex gap-1.5 text-center text-[0.66rem] font-semibold">
            <span className="bg-gradient-brand flex-1 rounded-[5px] p-1 text-white">Refine</span>
            <span className="flex-1 rounded-[5px] border border-line p-1 text-ink-2">Copy</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how" className="py-20 lg:py-28">
      <Container>
        <SectionHead
          kicker="How it works"
          title="Four ways to refine. No copy-pasting."
          lede="No switching to a chatbot tab and back. The refined text goes straight back into the field you're typing in, and you can always undo."
        />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ways.map((way, i) => (
            <Reveal as="li" key={way.title} delay={i * 0.06} className={card}>
              <div className={visual} aria-hidden="true">
                {way.visual}
              </div>
              <h3 className="mx-1 mt-5 mb-1.5 text-[1.08rem] font-semibold tracking-tight">{way.title}</h3>
              <p className="mx-1 text-[0.93rem] text-muted">{way.body}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
