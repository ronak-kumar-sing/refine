import Faq from './components/Faq.jsx';
import Footer from './components/Footer.jsx';
import Hero from './components/Hero.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import HumanTouch from './components/HumanTouch.jsx';
import Install from './components/Install.jsx';
import Nav from './components/Nav.jsx';
import Privacy from './components/Privacy.jsx';
import Providers from './components/Providers.jsx';
import Strip from './components/Strip.jsx';
import Styles from './components/Styles.jsx';
import { useIsMac } from './hooks.js';

export default function App() {
  const isMac = useIsMac();
  return (
    <>
      <a href="#main" className="absolute -top-16 left-4 z-[100] rounded-lg bg-ink px-4 py-2.5 text-bg focus:top-3">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero isMac={isMac} />
        <Strip />
        <HowItWorks isMac={isMac} />
        <HumanTouch />
        <Styles />
        <Providers />
        <Privacy />
        <Install />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
