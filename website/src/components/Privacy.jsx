import { Container, Reveal, SectionHead } from './ui.jsx';

const POINTS = [
  ['No analytics, no telemetry.', "The extension doesn't phone home, and neither does this website."],
  ['Keys stay in Chrome.', "They're never sent to web pages and never included in settings exports."],
  ['Open source, MIT licensed.', 'Every line is on GitHub for you to check.'],
];

function Node({ icon, title, sub }) {
  return (
    <div className="grid justify-items-center gap-1 rounded-[14px] border border-line bg-surface px-3 py-5.5 text-center">
      <span
        className="bg-gradient-brand mb-1.5 grid size-10 place-items-center rounded-xl text-[1.1rem] text-white"
        aria-hidden="true"
      >
        {icon}
      </span>
      <strong className="text-[0.95rem]">{title}</strong>
      <span className="text-[0.78rem] text-muted">{sub}</span>
    </div>
  );
}

export default function Privacy() {
  return (
    <section
      id="privacy"
      className="theme-dark bg-[#0f0e17] bg-[radial-gradient(900px_400px_at_85%_0%,rgb(99_102_241/0.28),transparent_60%),radial-gradient(600px_300px_at_0%_100%,rgb(139_92_246/0.18),transparent_60%)] py-20 text-ink lg:py-28"
    >
      <Container className="grid items-center gap-x-[72px] gap-y-10 lg:grid-cols-2">
        <SectionHead
          align="left"
          kicker="Privacy by design"
          title={"There's no “our server”. It doesn't exist."}
          lede="Your text goes straight from your browser to the provider you picked, and only when you ask it to. Nothing goes through a middleman."
        />

        <Reveal className="relative grid items-center gap-3 rounded-[22px] border border-line bg-white/[0.03] px-7 pt-9 pb-[72px] sm:grid-cols-[1fr_auto_1fr]">
          <div
            aria-label="Data flow: your browser sends text directly to your chosen AI provider"
            role="img"
            className="contents"
          >
            <Node icon="⌨" title="Your browser" sub="Key stored in Chrome" />
            <div
              aria-hidden="true"
              className="relative mx-auto h-10 w-0.5 animate-flow bg-[linear-gradient(180deg,transparent,#8b5cf6,transparent)] bg-[length:100%_200%] sm:h-0.5 sm:w-20 sm:bg-[linear-gradient(90deg,transparent,#8b5cf6,transparent)] sm:bg-[length:200%_100%]"
            >
              <span className="absolute bottom-1/2 left-3 translate-y-1/2 text-[0.68rem] font-bold tracking-[0.08em] text-muted sm:bottom-2 sm:left-1/2 sm:-translate-x-1/2 sm:translate-y-0">
                HTTPS
              </span>
            </div>
            <Node icon="✦" title="Your AI provider" sub="OpenRouter, Gemini, OpenAI, Claude, or local" />
          </div>
          <div
            aria-hidden="true"
            className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-dashed border-line px-3.5 py-1.5 text-[0.8rem] whitespace-nowrap text-muted"
          >
            <s>Our servers</s>
            <span className="font-bold text-emerald-300">none</span>
          </div>
        </Reveal>

        <ul className="grid gap-5 sm:grid-cols-3 lg:col-span-2">
          {POINTS.map(([title, body], i) => (
            <Reveal
              as="li"
              key={title}
              delay={i * 0.06}
              className="border-t border-line pt-4.5 text-[0.95rem] text-muted"
            >
              <strong className="mb-1 block text-ink">{title}</strong>
              {body}
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
