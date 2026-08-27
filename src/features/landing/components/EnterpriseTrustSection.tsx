import { Reveal } from "./Reveal";

const TRUST_ITEMS = [
  {
    label: "Company Isolation",
    phrase: "Data stays separated",
    icon: (
      <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <rect x="18" y="14" width="36" height="44" rx="4" stroke="currentColor" strokeWidth="2" />
        <line x1="26" y1="26" x2="34" y2="26" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
        <line x1="26" y1="34" x2="46" y2="34" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
        <line x1="26" y1="42" x2="40" y2="42" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
        <rect x="30" y="50" width="12" height="8" className="landing-trust-icon-accent" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Role Access",
    phrase: "Master · Admin · Planner · Execution",
    icon: (
      <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <circle cx="36" cy="26" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M18 58 C18 46 26 40 36 40 C46 40 54 46 54 58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="36" cy="26" r="2" className="landing-trust-icon-accent" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Permissions",
    phrase: "Configure by company",
    icon: (
      <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <rect x="22" y="32" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M27 32 V24 a9 9 0 0 1 18 0 v8" stroke="currentColor" strokeWidth="2" />
        <circle cx="36" cy="42" r="2.4" className="landing-trust-icon-accent" fill="currentColor" />
        <line x1="36" y1="44" x2="36" y2="48" className="landing-trust-icon-accent" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Activity Trail",
    phrase: "Timestamped & attributable",
    icon: (
      <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <circle cx="36" cy="36" r="20" stroke="currentColor" strokeWidth="2" />
        <path d="M36 24 V36 L46 42" className="landing-trust-icon-accent" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function EnterpriseTrustSection() {
  return (
    <section id="trust" className="landing-trust">
      <div className="landing-container relative">
        <Reveal>
          <span className="landing-eyebrow">Built For Operations</span>
          <h2 className="landing-trust-heading mt-4">Control where it matters.</h2>
        </Reveal>

        <Reveal delay={0.1} className="landing-trust-rail">
          {TRUST_ITEMS.map((item, index) => (
            <div key={item.label} className="landing-trust-item">
              <span className="landing-trust-icon">{item.icon}</span>
              <span className="landing-trust-label">{item.label}</span>
              <span className="landing-trust-phrase">{item.phrase}</span>
              {index < TRUST_ITEMS.length - 1 ? <span className="landing-trust-connector" aria-hidden="true" /> : null}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
