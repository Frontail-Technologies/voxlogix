type ProblemIllustrationType = "people" | "paper" | "history";

export function ProblemIllustration({ type }: { type: ProblemIllustrationType }) {
  if (type === "people") {
    return (
      <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className="landing-problem-illust">
        <circle cx="42" cy="34" r="20" stroke="currentColor" strokeWidth="1.6" />
        <path d="M20 80 C20 60 29 50 42 50 C55 50 64 60 64 80" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="36" cy="30" r="1.8" fill="currentColor" opacity="0.55" />
        <path d="M42 26 L50 26" stroke="currentColor" strokeWidth="1.4" opacity="0.55" strokeLinecap="round" />
        <path d="M38 40 L46 40" stroke="currentColor" strokeWidth="1.4" opacity="0.55" strokeLinecap="round" />
        <g className="landing-problem-illust-accent">
          <rect x="70" y="56" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M73.5 56 V51 a5 5 0 0 1 10 0 V56" stroke="currentColor" strokeWidth="1.8" />
        </g>
      </svg>
    );
  }

  if (type === "paper") {
    return (
      <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className="landing-problem-illust">
        <rect x="16" y="12" width="52" height="68" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <line x1="26" y1="28" x2="58" y2="28" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
        <line x1="26" y1="40" x2="58" y2="40" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
        <line x1="26" y1="52" x2="46" y2="52" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
        <rect x="26" y="62" width="8" height="8" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
        <path d="M60 70 L86 44" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M81 39 L91 49" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <g className="landing-problem-illust-accent">
          <path d="M78 16 L88 33 H68 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <line x1="78" y1="22" x2="78" y2="27" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="78" cy="29.5" r="0.9" fill="currentColor" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className="landing-problem-illust">
      <path d="M12 38 H36 L40 44 H66 V70 H12 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M20 30 H40 L44 36 H70" stroke="currentColor" strokeWidth="1.4" opacity="0.5" strokeLinejoin="round" />
      <line x1="20" y1="54" x2="38" y2="54" stroke="currentColor" strokeWidth="1.3" opacity="0.55" />
      <line x1="20" y1="61" x2="32" y2="61" stroke="currentColor" strokeWidth="1.3" opacity="0.55" />
      <g className="landing-problem-illust-accent">
        <circle cx="74" cy="58" r="12" stroke="currentColor" strokeWidth="1.8" />
        <line x1="83" y1="67" x2="91" y2="75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}
