import { useState } from 'react';

import { RELEASE_URL, REPO_URL } from '../data/content.js';
import { Button, Container, Reveal, SectionHead } from './ui.jsx';

const CLONE = `git clone ${REPO_URL}.git`;

const Code = ({ children }) => (
  <code className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.88em] whitespace-nowrap">
    {children}
  </code>
);

function CopyBlock({ text }) {
  const [label, setLabel] = useState('Copy');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setLabel('Copied');
    } catch {
      setLabel('Select & copy');
    }
    setTimeout(() => setLabel('Copy'), 1600);
  };
  return (
    <div className="mt-3.5 flex items-center gap-3 overflow-x-auto rounded-[10px] bg-[#17161f] py-2.5 pr-2.5 pl-4 text-[#e4e2f0]">
      <code className="flex-1 font-mono text-[0.88em] whitespace-nowrap">{text}</code>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 cursor-pointer rounded-[7px] bg-white/10 px-3 py-1.5 text-[0.78rem] font-semibold hover:bg-white/20"
      >
        {label}
      </button>
    </div>
  );
}

export default function Install() {
  const steps = [
    {
      title: 'Download',
      body: (
        <>
          Get the latest{' '}
          <a href={RELEASE_URL} className="text-accent-ink underline underline-offset-3">
            release zip
          </a>{' '}
          and unzip it, or clone the repository.
        </>
      ),
      extra: <CopyBlock text={CLONE} />,
    },
    {
      title: 'Load it in Chrome',
      body: (
        <>
          Open <Code>chrome://extensions</Code>, turn on <strong>Developer mode</strong>, click{' '}
          <strong>Load unpacked</strong>, and select the folder that contains <Code>manifest.json</Code>.
        </>
      ),
    },
    {
      title: 'Add your key',
      body: (
        <>
          Click the extension icon, choose a provider, paste your API key, and hit <strong>Test API Key</strong>. For
          the most natural writing, use{' '}
          <a href="https://openrouter.ai/keys" className="text-accent-ink underline underline-offset-3">
            OpenRouter
          </a>{' '}
          with Claude Opus. For a free key, try{' '}
          <a href="https://aistudio.google.com/app/apikey" className="text-accent-ink underline underline-offset-3">
            Google AI Studio
          </a>
          .
        </>
      ),
    },
  ];

  return (
    <section id="install" className="py-20 lg:py-28">
      <Container className="max-w-[860px]">
        <SectionHead kicker="Get started" title="Installed and refining in two minutes." />
        <ol className="grid gap-4">
          {steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 0.06}
              className="grid gap-3 rounded-[22px] border border-line bg-surface p-5 sm:grid-cols-[auto_1fr] sm:gap-5 sm:px-7 sm:py-6"
            >
              <span
                className="bg-gradient-brand grid size-9 place-items-center rounded-full font-serif text-[1.15rem] text-white"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="mt-1.5 mb-1.5 text-[1.08rem] font-semibold tracking-tight">{step.title}</h3>
                <p className="text-muted">{step.body}</p>
                {step.extra}
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button size="lg" href={RELEASE_URL}>
            Download latest release
          </Button>
          <Button size="lg" variant="ghost" href={REPO_URL}>
            View source on GitHub
          </Button>
        </div>
      </Container>
    </section>
  );
}
