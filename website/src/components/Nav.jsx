import { REPO_URL } from '../data/content.js';
import { useScrolled } from '../hooks.js';
import { Button, Container, GithubIcon } from './ui.jsx';

const LINKS = [
  ['How it works', '#how'],
  ['Styles', '#styles'],
  ['Providers', '#providers'],
  ['Privacy', '#privacy'],
  ['FAQ', '#faq'],
];

export default function Nav() {
  const scrolled = useScrolled();
  return (
    <header
      id="top"
      className={`sticky top-0 z-50 border-b bg-bg/80 backdrop-blur-md backdrop-saturate-150 transition-colors ${
        scrolled ? 'border-line' : 'border-transparent'
      }`}
    >
      <Container className="flex h-16 items-center gap-8">
        <a
          href="#top"
          className="inline-flex items-center gap-2.5 font-bold tracking-tight"
          aria-label="AI Text Refiner home"
        >
          <img src="logo.svg" alt="" width="28" height="28" />
          <span>AI Text Refiner</span>
        </a>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex gap-6.5 text-[0.93rem]">
            {LINKS.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="text-muted transition-colors hover:text-ink">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex gap-2.5">
          <Button variant="ghost" href={REPO_URL} rel="noopener" className="max-sm:hidden">
            <GithubIcon />
            GitHub
          </Button>
          <Button href="#install">Get the extension</Button>
        </div>
      </Container>
    </header>
  );
}
