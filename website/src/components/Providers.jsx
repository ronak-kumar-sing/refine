import { PROVIDERS, REPO_URL } from '../data/content.js';
import { Container, Reveal, SectionHead } from './ui.jsx';

export default function Providers() {
  return (
    <section id="providers" className="border-y border-line bg-surface-2 py-20 lg:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-[72px]">
        <div>
          <SectionHead
            align="left"
            kicker="Bring your own model"
            title="Your key, your provider, your choice."
            lede="Use one OpenRouter key to reach Claude Opus, GPT, Llama, and hundreds more, or go direct to the provider you already pay for. Running a model locally? Point it at any OpenAI-compatible endpoint."
          />
          <a
            href={`${REPO_URL}/blob/main/docs/PROVIDERS.md`}
            className="mt-5 inline-block font-semibold text-accent-ink hover:underline"
          >
            Provider setup guide →
          </a>
        </div>

        <Reveal as="ul" className="overflow-hidden rounded-[22px] border border-line bg-surface">
          {PROVIDERS.map(({ name, detail, tag, quiet }) => (
            <li
              key={name}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-0.5 border-line px-6 py-5 transition-colors not-first:border-t hover:bg-surface-2"
            >
              <span className="font-semibold">{name}</span>
              {tag ? (
                <span
                  className={`row-span-2 rounded-full px-2.5 py-1 text-[0.74rem] font-semibold ${
                    quiet ? 'bg-success/12 text-success' : 'bg-accent-soft text-accent-ink'
                  }`}
                >
                  {tag}
                </span>
              ) : (
                <span className="row-span-2" />
              )}
              <span className="text-[0.88rem] text-muted">{detail}</span>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
