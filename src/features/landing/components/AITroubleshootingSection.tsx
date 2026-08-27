import { Reveal } from "./Reveal";

const ANSWER_ITEMS = ["Check intake filter", "Inspect suction line", "Verify valve condition"];
const BENEFITS = ["Equipment-specific", "Source-backed", "Available on the floor"];

export function AITroubleshootingSection() {
  return (
    <section id="ai-troubleshooting" className="landing-ai">
      <div className="landing-container relative landing-ai-split">
        <Reveal className="landing-ai-copy">
          <span className="landing-ai-eyebrow">AI Troubleshooting</span>
          <h2 className="landing-ai-heading mt-5">
            Ask the manual.
            <br />
            Without opening the manual.
          </h2>
          <p className="landing-ai-subcopy mt-5">
            Get equipment-specific guidance from the reference documents your team already uses.
          </p>
          <div className="landing-ai-benefits">
            {BENEFITS.map((benefit) => (
              <span key={benefit}>{benefit}</span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="landing-ai-visual">
          <svg className="landing-ai-schematic" viewBox="0 0 200 160" fill="none" aria-hidden="true">
            <rect x="60" y="40" width="80" height="90" rx="10" stroke="currentColor" strokeWidth="1.5" />
            <line x1="80" y1="40" x2="80" y2="20" stroke="currentColor" strokeWidth="1.5" />
            <line x1="120" y1="40" x2="120" y2="20" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="80" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="120" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
            <line x1="60" y1="150" x2="140" y2="150" stroke="currentColor" strokeWidth="1.5" />
          </svg>

          <div className="landing-ai-question">
            <span className="landing-ai-visual-label">Technician Question</span>
            <p className="landing-ai-question-text">
              &ldquo;Compressor C-201 is losing pressure. What should I check first?&rdquo;
            </p>
          </div>

          <div className="landing-ai-connector" aria-hidden="true">
            <span className="landing-ai-connector-line" />
            <span className="landing-ai-connector-node" />
          </div>

          <div className="landing-ai-manuals" aria-hidden="true">
            <span className="landing-ai-manual-sheet landing-ai-manual-sheet-back-1" />
            <span className="landing-ai-manual-sheet landing-ai-manual-sheet-back-2" />
            <div className="landing-ai-manual-sheet landing-ai-manual-sheet-main">
              <div className="landing-ai-manual-head">
                <span className="landing-ai-manual-title">Manual</span>
                <span className="landing-ai-manual-meta">C-201 &middot; Page 14</span>
              </div>
              <div className="landing-ai-manual-lines">
                <span />
                <span />
                <span className="landing-ai-manual-line-accent" />
                <span />
              </div>
            </div>
          </div>

          <div className="landing-ai-connector" aria-hidden="true">
            <span className="landing-ai-connector-line" />
            <span className="landing-ai-connector-node" />
          </div>

          <div className="landing-ai-answer">
            <span className="landing-ai-visual-label">VoxLogiX Answer</span>
            <ol className="landing-ai-answer-list">
              {ANSWER_ITEMS.map((item, index) => (
                <li key={item}>
                  <span className="landing-ai-answer-index">{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ol>
            <span className="landing-ai-citation">Source &middot; Manual p.14</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
