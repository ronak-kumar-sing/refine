import { motion } from 'motion/react';

const BUTTON_VARIANTS = {
  primary:
    'bg-gradient-brand text-white shadow-glow hover:-translate-y-px hover:shadow-[0_10px_24px_-8px_rgb(99_102_241/0.7)]',
  ghost: 'border border-line bg-surface text-ink hover:bg-surface-2',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const sizes = size === 'lg' ? 'px-[22px] py-[13px] text-base' : 'px-4 py-[9px] text-[0.92rem]';
  return (
    <a
      className={`inline-flex items-center gap-2 rounded-full font-semibold whitespace-nowrap transition duration-200 ${sizes} ${BUTTON_VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

export function Container({ className = '', children }) {
  return (
    <div className={`mx-auto w-[min(1160px,100%-32px)] sm:w-[min(1160px,100%-48px)] ${className}`}>{children}</div>
  );
}

/** Fades content up as it scrolls into view. */
export function Reveal({ delay = 0, className, children, as = 'div' }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

export function SectionHead({ kicker, title, lede, align = 'center' }) {
  const alignment = align === 'center' ? 'mx-auto mb-14 text-center' : '';
  return (
    <Reveal className={`max-w-[720px] ${alignment}`}>
      <p className="mb-3.5 text-[0.8rem] font-bold tracking-[0.1em] text-accent-ink uppercase">{kicker}</p>
      <h2 className="font-serif text-[clamp(2rem,1.4rem+2.4vw,3rem)] leading-[1.12] font-medium tracking-tight">
        {title}
      </h2>
      {lede && <p className="mt-4.5 text-[1.1rem] text-muted">{lede}</p>}
    </Reveal>
  );
}

export function Mod({ isMac }) {
  return <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>;
}

export function SparkIcon({ className = 'size-[18px]' }) {
  return (
    <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
      <path d="M10 2c.5 4.4 2.6 6.5 7 7-4.4.5-6.5 2.6-7 7-.5-4.4-2.6-6.5-7-7 4.4-.5 6.5-2.6 7-7Z" />
      <path d="M18 13c.3 2.2 1.3 3.2 3.5 3.5-2.2.3-3.2 1.3-3.5 3.5-.3-2.2-1.3-3.2-3.5-3.5 2.2-.3 3.2-1.3 3.5-3.5Z" />
    </svg>
  );
}

export function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 fill-current">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function Check() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 fill-success" aria-hidden="true">
      <path d="M6.2 11.6 2.6 8l1.1-1.1 2.5 2.5 6.1-6.1 1.1 1.1z" />
    </svg>
  );
}
