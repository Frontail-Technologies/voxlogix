type ProcessIllustrationType = "speak" | "extract" | "review" | "captured";

export function ProcessIllustration({ type }: { type: ProcessIllustrationType }) {
  if (type === "speak") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="landing-how-illust">
        <rect x="26" y="14" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1.8" />
        <path d="M20 30 a12 12 0 0 0 24 0" stroke="currentColor" strokeWidth="1.8" />
        <line x1="32" y1="42" x2="32" y2="48" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="26" y1="48" x2="38" y2="48" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <g className="landing-how-illust-accent">
          <line x1="9" y1="26" x2="9" y2="34" strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
          <line x1="15" y1="21" x2="15" y2="39" strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
          <line x1="49" y1="21" x2="49" y2="39" strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
          <line x1="55" y1="26" x2="55" y2="34" strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (type === "extract") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="landing-how-illust">
        <line x1="8" y1="30" x2="8" y2="34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="12" y1="26" x2="12" y2="38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="16" y1="30" x2="16" y2="34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M20 32 H26" stroke="currentColor" strokeWidth="1.6" />
        <g className="landing-how-illust-accent">
          <rect x="28" y="17" width="28" height="30" rx="4" stroke="currentColor" strokeWidth="1.8" />
          <line x1="34" y1="27" x2="50" y2="27" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="34" y1="34" x2="46" y2="34" stroke="currentColor" strokeWidth="1.6" opacity="0.6" strokeLinecap="round" />
          <line x1="34" y1="41" x2="42" y2="41" stroke="currentColor" strokeWidth="1.6" opacity="0.6" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (type === "review") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="landing-how-illust">
        <rect x="16" y="9" width="32" height="46" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M22 21 L25 24 L31 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="35" y1="21" x2="42" y2="21" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
        <path d="M22 33 L25 36 L31 29" className="landing-how-illust-accent" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="35" y1="33" x2="42" y2="33" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
        <rect x="22" y="42" width="8" height="8" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
        <line x1="35" y1="46" x2="42" y2="46" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="landing-how-illust">
      <path d="M9 21 H26 L30 26 H55 V47 H9 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="16" y1="35" x2="30" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <line x1="16" y1="41" x2="26" y2="41" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <g className="landing-how-illust-accent">
        <circle cx="46" cy="19" r="8" stroke="currentColor" strokeWidth="1.8" />
        <line x1="51.5" y1="24.5" x2="57" y2="30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}
