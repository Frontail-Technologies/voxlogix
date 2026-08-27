import { Reveal } from "./Reveal";

const FILTERS = ["Equipment", "Safety", "Shift", "Kaizen", "Measuring", "Counters"];
const BAR_HEIGHTS = [26, 42, 34, 54, 30, 46, 38];
const KPIS = [
  { label: "Logs Filed", value: "1,284" },
  { label: "Downtime", value: "18.2h" },
  { label: "Repeat Failures", value: "6" },
  { label: "Safety Events", value: "3" },
];

export function ReportingSection() {
  return (
    <section id="reporting" className="landing-reporting">
      <div className="landing-container relative">
        <Reveal>
          <span className="landing-reporting-eyebrow">Reporting</span>
          <h2 className="landing-reporting-heading mt-5">
            Turn operational history
            <br />
            into decisions.
          </h2>
          <p className="landing-reporting-subcopy mt-5">
            See activity, equipment history and operational trends without rebuilding the story manually.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="landing-reporting-workspace">
          <div className="landing-reporting-filters">
            {FILTERS.map((filter, index) => (
              <span key={filter} className={index === 0 ? "landing-reporting-filter landing-reporting-filter-active" : "landing-reporting-filter"}>
                {filter}
              </span>
            ))}
          </div>

          <div className="landing-reporting-chart">
            <svg viewBox="0 0 200 90" fill="none" aria-hidden="true" className="landing-reporting-bars">
              {BAR_HEIGHTS.map((h, i) => (
                <rect
                  key={i}
                  x={8 + i * 27}
                  y={80 - h}
                  width="16"
                  height={h}
                  rx="2"
                  className={i === 3 ? "landing-reporting-bar-accent" : "landing-reporting-bar"}
                  fill="currentColor"
                />
              ))}
              <line x1="4" y1="80" x2="196" y2="80" className="landing-reporting-bar" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            </svg>
            <span className="landing-reporting-illustrative">Illustrative data</span>
          </div>

          <div className="landing-reporting-kpis">
            {KPIS.map((kpi) => (
              <div key={kpi.label} className="landing-reporting-kpi">
                <span className="landing-reporting-kpi-label">{kpi.label}</span>
                <span className="landing-reporting-kpi-value">{kpi.value}</span>
              </div>
            ))}
            <span className="landing-reporting-export">Export Excel &middot; PDF</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
