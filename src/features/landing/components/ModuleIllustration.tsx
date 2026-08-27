type ModuleIllustrationType = "equipment" | "safety" | "shift" | "kaizen" | "measuring" | "meter";

const WAVEFORM_BARS = [10, 18, 26, 34, 24, 14];

export function ModuleIllustration({ type }: { type: ModuleIllustrationType }) {
  if (type === "equipment") {
    return (
      <svg viewBox="0 0 140 64" fill="none" aria-hidden="true" className="landing-module-illust">
        <g className="landing-module-illust-muted">
          {WAVEFORM_BARS.map((h, i) => (
            <rect key={i} x={4 + i * 8} y={32 - h / 2} width="4" height={h} rx="2" fill="currentColor" />
          ))}
        </g>
        <line x1="52" y1="32" x2="60" y2="32" className="landing-module-illust-muted" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="49" cy="32" r="2" className="landing-module-illust-accent" fill="currentColor" />
        <rect x="62" y="10" width="72" height="44" rx="6" className="landing-module-illust-muted" stroke="currentColor" strokeWidth="1.5" />
        <line x1="72" y1="24" x2="112" y2="24" className="landing-module-illust-accent" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="72" y1="34" x2="104" y2="34" className="landing-module-illust-muted" stroke="currentColor" strokeWidth="1.5" opacity="0.55" strokeLinecap="round" />
        <line x1="72" y1="44" x2="98" y2="44" className="landing-module-illust-muted" stroke="currentColor" strokeWidth="1.5" opacity="0.55" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "safety") {
    return (
      <svg viewBox="0 0 140 64" fill="none" aria-hidden="true" className="landing-module-illust">
        <path
          d="M70 6 L104 16 V34 C104 50 88 58 70 62 C52 58 36 50 36 34 V16 Z"
          className="landing-module-illust-muted"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M70 24 V38" className="landing-module-illust-accent" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="70" cy="46" r="1.8" className="landing-module-illust-accent" fill="currentColor" />
      </svg>
    );
  }

  if (type === "shift") {
    return (
      <svg viewBox="0 0 140 64" fill="none" aria-hidden="true" className="landing-module-illust">
        <line x1="22" y1="32" x2="118" y2="32" className="landing-module-illust-muted" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
        <circle cx="22" cy="32" r="5" className="landing-module-illust-muted" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
        <circle cx="70" cy="32" r="6.5" className="landing-module-illust-accent" fill="currentColor" />
        <circle cx="118" cy="32" r="5" className="landing-module-illust-muted" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
      </svg>
    );
  }

  if (type === "kaizen") {
    return (
      <svg viewBox="0 0 140 64" fill="none" aria-hidden="true" className="landing-module-illust">
        <circle cx="28" cy="26" r="14" className="landing-module-illust-muted" stroke="currentColor" strokeWidth="1.5" />
        <path d="M22 40 H34 M24 46 H32" className="landing-module-illust-muted" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M28 10 V14 M17 21 L14.5 18.5 M39 21 L41.5 18.5"
          className="landing-module-illust-accent"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M56 50 L76 36 L92 42 L120 14" className="landing-module-illust-muted" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="120" cy="14" r="2.6" className="landing-module-illust-accent" fill="currentColor" />
      </svg>
    );
  }

  if (type === "measuring") {
    return (
      <svg viewBox="0 0 140 80" fill="none" aria-hidden="true" className="landing-module-illust">
        <rect x="6" y="6" width="128" height="40" rx="4" className="landing-module-illust-muted" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M14 34 L32 24 L48 30 L66 17 L84 26 L102 15 L126 22"
          className="landing-module-illust-muted"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="126" cy="22" r="2.8" className="landing-module-illust-accent" fill="currentColor" />
        <text x="14" y="66" className="landing-module-illust-label" fontFamily="var(--font-mono)" fontSize="7" letterSpacing="0.5">
          CURRENT
        </text>
        <text x="14" y="77" className="landing-module-illust-value landing-module-illust-accent" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700">
          68.4
        </text>
        <text x="78" y="66" className="landing-module-illust-label" fontFamily="var(--font-mono)" fontSize="7" letterSpacing="0.5">
          LIMIT
        </text>
        <text x="78" y="77" className="landing-module-illust-value" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700">
          40&ndash;72
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 172 80" fill="none" aria-hidden="true" className="landing-module-illust">
      <path d="M14 62 A34 34 0 0 1 82 62" className="landing-module-illust-muted" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M14 62 A34 34 0 0 1 56 29" className="landing-module-illust-accent" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="48" y1="62" x2="61" y2="37" className="landing-module-illust-muted" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="48" cy="62" r="2.8" className="landing-module-illust-muted" fill="currentColor" />
      <text x="96" y="52" className="landing-module-illust-value" fontFamily="var(--font-mono)" fontSize="15" fontWeight="700">
        18,420
      </text>
      <text x="96" y="66" className="landing-module-illust-value landing-module-illust-accent" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700">
        +3.2%
      </text>
    </svg>
  );
}
