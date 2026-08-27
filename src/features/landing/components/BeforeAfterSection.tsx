import { Reveal } from "./Reveal";

const BEFORE_ITEMS = ["Paper logs", "Scattered updates", "Knowledge in memory", "Hard to search"];
const AFTER_ITEMS = ["Structured records", "Searchable history", "Voice + attachments", "Manual-backed guidance"];

export function BeforeAfterSection() {
  return (
    <section id="the-shift" className="landing-shift">
      <div className="landing-container relative">
        <Reveal>
          <span className="landing-eyebrow">The Shift</span>
          <h2 className="landing-section-heading mt-5">
            Less chasing.
            <br />
            More usable history.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="landing-shift-compare">
          <div className="landing-shift-side">
            <span className="landing-shift-label">Before</span>
            <svg viewBox="0 0 260 200" fill="none" aria-hidden="true" className="landing-shift-illust landing-shift-illust-muted">
              <rect x="20" y="30" width="90" height="112" rx="4" stroke="currentColor" strokeWidth="1.6" transform="rotate(-7 65 86)" />
              <rect x="46" y="42" width="90" height="112" rx="4" stroke="currentColor" strokeWidth="1.6" transform="rotate(5 91 98)" />
              <path d="M150 44 H222" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
              <path d="M150 62 H206" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
              <path d="M150 80 H228" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
              <path d="M146 106 L162 122 M162 106 L146 122" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
              <circle cx="200 " cy="120" r="16" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
              <line x1="211" y1="131" x2="222" y2="142" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
              <path d="M40 168 H110 M130 168 H240" stroke="currentColor" strokeWidth="1.3" opacity="0.35" strokeDasharray="1 6" strokeLinecap="round" />
            </svg>
            <ul className="landing-shift-list">
              {BEFORE_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="landing-shift-divider" aria-hidden="true" />

          <div className="landing-shift-side">
            <span className="landing-shift-label landing-shift-label-accent">With VoxLogiX</span>
            <svg viewBox="0 0 260 200" fill="none" aria-hidden="true" className="landing-shift-illust">
              <rect x="18" y="80" width="10" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 90 a11 11 0 0 0 22 0" stroke="currentColor" strokeWidth="1.8" />
              <path d="M40 90 H64" className="landing-shift-illust-accent" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="70" cy="90" r="3" className="landing-shift-illust-accent" fill="currentColor" />

              <rect x="86" y="46" width="78" height="90" rx="8" stroke="currentColor" strokeWidth="1.8" />
              <line x1="100" y1="66" x2="140" y2="66" className="landing-shift-illust-accent" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="100" y1="80" x2="150" y2="80" stroke="currentColor" strokeWidth="1.6" opacity="0.55" strokeLinecap="round" />
              <line x1="100" y1="94" x2="134" y2="94" stroke="currentColor" strokeWidth="1.6" opacity="0.55" strokeLinecap="round" />
              <line x1="100" y1="108" x2="144" y2="108" stroke="currentColor" strokeWidth="1.6" opacity="0.55" strokeLinecap="round" />

              <path d="M172 90 H196" className="landing-shift-illust-accent" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="202" cy="90" r="3" className="landing-shift-illust-accent" fill="currentColor" />

              <circle cx="228" cy="90" r="26" stroke="currentColor" strokeWidth="1.8" />
              <path d="M216 90 L224 98 L242 78" className="landing-shift-illust-accent" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <ul className="landing-shift-list">
              {AFTER_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
