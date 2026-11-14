import { useEffect, useState } from 'react';

/** True on Apple platforms, so shortcuts can show ⌘ instead of Ctrl. */
export function useIsMac() {
  // Client-only site, so the platform can be read during the first render.
  const [isMac] = useState(() =>
    /mac|iphone|ipad/i.test(navigator.userAgentData?.platform ?? navigator.platform ?? navigator.userAgent),
  );
  return isMac;
}

/** True once the page has scrolled past `offset` pixels. */
export function useScrolled(offset = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);
  return scrolled;
}
