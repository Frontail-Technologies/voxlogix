import { Reveal } from "./Reveal";

const HISTORY_ENTRIES = [
  { date: "Aug 21", detail: "Bearing inspection" },
  { date: "Aug 22", detail: "68.4" },
  { date: "Aug 23", detail: "70.1" },
  { date: "Aug 24", detail: "Bearing replaced" },
];

export function PredictiveMaintenanceSection() {
  return (
    <section id="predictive-maintenance" className="landing-predictive">
      <div className="landing-container relative">
        <Reveal>
          <span className="landing-eyebrow">Data Foundation</span>
          <h2 className="landing-section-heading mt-5">
            Better maintenance starts
            <br />
            with better history.
          </h2>
          <p className="landing-predictive-subcopy mt-4">
            Consistent equipment logs and routine readings create the structured history condition-based and
            predictive strategies depend on.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="landing-predictive-composition">
          <div className="landing-predictive-stage">
            <span className="landing-predictive-stage-label">Capture</span>
            <div className="landing-predictive-capture-card">
              <span className="landing-predictive-capture-kicker">Voice Log</span>
              <span className="landing-predictive-capture-value">Bearing noise</span>
            </div>
            <div className="landing-predictive-capture-card landing-predictive-capture-card-alt">
              <span className="landing-predictive-capture-kicker">MP-204</span>
              <span className="landing-predictive-capture-value">68.4</span>
            </div>
          </div>

          <div className="landing-predictive-arrow" aria-hidden="true">
            <span />
          </div>

          <div className="landing-predictive-stage">
            <span className="landing-predictive-stage-label">Build History</span>
            <ul className="landing-predictive-history">
              {HISTORY_ENTRIES.map((entry) => (
                <li key={entry.date}>
                  <span className="landing-predictive-history-date">{entry.date}</span>
                  <span className="landing-predictive-history-detail">{entry.detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="landing-predictive-arrow" aria-hidden="true">
            <span />
          </div>

          <div className="landing-predictive-stage landing-predictive-stage-trend">
            <span className="landing-predictive-stage-label">Understand Trends</span>
            <svg viewBox="0 0 220 110" fill="none" aria-hidden="true" className="landing-predictive-chart">
              <path
                d="M8 78 L38 66 L64 70 L92 48 L118 56 L146 30 L172 38 L212 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="118" cy="56" r="3.5" className="landing-predictive-chart-marker" fill="currentColor" />
              <line x1="118" y1="56" x2="118" y2="96" className="landing-predictive-chart-marker" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" />
              <text x="106" y="106" className="landing-predictive-chart-label" fontFamily="var(--font-mono)" fontSize="7">
                Downtime
              </text>
              <circle cx="172" cy="38" r="3.5" className="landing-predictive-chart-accent" fill="currentColor" />
              <line x1="172" y1="38" x2="172" y2="96" className="landing-predictive-chart-accent" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" />
              <text x="158" y="106" className="landing-predictive-chart-label" fontFamily="var(--font-mono)" fontSize="7">
                Maintenance
              </text>
            </svg>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="landing-predictive-annotation">Better maintenance decisions</p>
        </Reveal>
      </div>
    </section>
  );
}
