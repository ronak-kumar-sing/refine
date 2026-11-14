import { REPO_URL } from '../data/content.js';
import { Container } from './ui.jsx';

const LINKS = [
  ['GitHub', REPO_URL],
  ['Privacy policy', `${REPO_URL}/blob/main/PRIVACY.md`],
  ['Changelog', `${REPO_URL}/blob/main/CHANGELOG.md`],
  ['Report an issue', `${REPO_URL}/issues`],
];

export default function Footer() {
  return (
    <footer className="py-10">
      <Container className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <a href="#top" className="inline-flex items-center gap-2.5 font-bold tracking-tight">
          <img src="logo.svg" alt="" width="24" height="24" />
          AI Text Refiner
        </a>
        <ul className="flex flex-wrap gap-x-5.5 gap-y-2 text-[0.9rem]">
          {LINKS.map(([label, href]) => (
            <li key={label}>
              <a href={href} className="text-muted transition-colors hover:text-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-[0.85rem] text-muted sm:ml-auto">MIT licensed · Built by Ronak Kumar Singh</p>
      </Container>
    </footer>
  );
}
