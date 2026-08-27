import { Reveal } from "./Reveal";

export function SolutionsSection() {
  return (
    <section id="solutions" className="landing-solutions">
      <div className="landing-container relative">
        <Reveal>
          <span className="landing-eyebrow">From The Floor</span>
          <h2 className="landing-section-heading mt-5">
            See it.
            <br />
            Say it.
            <br />
            Improve it.
          </h2>
          <p className="landing-solutions-subcopy mt-4">
            Make it easier to surface risks and improvement ideas while they are still fresh.
          </p>
        </Reveal>

        <div className="landing-solutions-split">
          <Reveal className="landing-solutions-half">
            <div className="landing-solutions-flow">
              <svg viewBox="0 0 120 72" fill="none" aria-hidden="true" className="landing-solutions-node">
                <path d="M60 8 L104 64 H16 Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                <line x1="60" y1="30" x2="60" y2="46" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                <circle cx="60" cy="54" r="1.6" fill="currentColor" />
              </svg>
              <span className="landing-solutions-flow-line" aria-hidden="true" />

              <div className="landing-solutions-waveform" aria-hidden="true">
                {[8, 14, 20, 15, 22, 12, 18, 9].map((h, i) => (
                  <span key={i} style={{ height: `${h}px` }} />
                ))}
              </div>
              <span className="landing-solutions-flow-line" aria-hidden="true" />

              <div className="landing-solutions-report">
                <div>
                  <span className="landing-solutions-report-label">Incident</span>
                  <span className="landing-solutions-report-value">Guard rail loose</span>
                </div>
                <div>
                  <span className="landing-solutions-report-label">Location</span>
                  <span className="landing-solutions-report-value">Line 3</span>
                </div>
                <div>
                  <span className="landing-solutions-report-label">Severity</span>
                  <span className="landing-solutions-report-value landing-solutions-report-value-accent">High</span>
                </div>
              </div>
              <span className="landing-solutions-flow-line" aria-hidden="true" />

              <span className="landing-solutions-visible">
                <span className="landing-solutions-visible-dot" />
                Visible to team
              </span>
            </div>
            <h3 className="landing-solutions-title">Safety Reporting</h3>
            <p className="landing-solutions-copy">
              Surface incidents, near misses and unsafe conditions before they disappear.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="landing-solutions-half">
            <div className="landing-solutions-flow">
              <svg viewBox="0 0 120 72" fill="none" aria-hidden="true" className="landing-solutions-node">
                <rect x="30" y="16" width="60" height="40" rx="6" stroke="currentColor" strokeWidth="2" />
                <circle cx="46" cy="36" r="6" stroke="currentColor" strokeWidth="2" />
                <circle cx="46" cy="36" r="1.6" fill="currentColor" />
                <line x1="60" y1="30" x2="78" y2="30" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
                <line x1="60" y1="40" x2="72" y2="40" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
              </svg>
              <span className="landing-solutions-flow-line" aria-hidden="true" />

              <svg viewBox="0 0 120 72" fill="none" aria-hidden="true" className="landing-solutions-node landing-solutions-node-accent">
                <circle cx="60" cy="30" r="16" stroke="currentColor" strokeWidth="2.2" />
                <path d="M52 46 H68 M55 53 H65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M60 12 V17 M42 24 L38 21 M78 24 L82 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="landing-solutions-flow-line" aria-hidden="true" />

              <svg viewBox="0 0 120 72" fill="none" aria-hidden="true" className="landing-solutions-node">
                <circle cx="60" cy="36" r="18" stroke="currentColor" strokeWidth="2.2" />
                <path d="M50 36 L57 43 L72 26" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="landing-solutions-flow-line" aria-hidden="true" />

              <svg viewBox="0 0 120 72" fill="none" aria-hidden="true" className="landing-solutions-node landing-solutions-trend">
                <path d="M14 58 L38 42 L56 50 L76 24 L104 12" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="104" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>
            <h3 className="landing-solutions-title">Kaizen</h3>
            <p className="landing-solutions-copy">
              Capture improvement ideas when they happen and keep follow-up visible.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
