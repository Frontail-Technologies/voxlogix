import { cn } from "@/lib/utils";
import { ModuleIllustration } from "./ModuleIllustration";
import { Reveal } from "./Reveal";

type Module = {
  key: "equipment" | "safety" | "shift" | "kaizen" | "measuring" | "meter";
  title: string;
  copy: string;
  feature?: boolean;
};

const MODULES: Module[] = [
  {
    key: "equipment",
    title: "Equipment Log",
    copy: "Capture failures, root causes, actions and downtime as work happens.",
    feature: true,
  },
  {
    key: "safety",
    title: "Safety Reporting",
    copy: "Record incidents, near misses and unsafe conditions quickly.",
  },
  {
    key: "shift",
    title: "Shift Log",
    copy: "Keep shift activities and handovers structured and visible.",
  },
  {
    key: "kaizen",
    title: "Kaizen",
    copy: "Capture improvement ideas and follow their progress.",
  },
  {
    key: "measuring",
    title: "Measuring Points",
    copy: "Record readings against limits and build a useful history.",
  },
  {
    key: "meter",
    title: "Meter Counters",
    copy: "Track runtime and consumption readings over time.",
  },
];

export function ModulesSection() {
  return (
    <section id="features" className="landing-modules">
      <div className="landing-container relative">
        <Reveal>
          <span className="landing-eyebrow">Built For The Shop Floor</span>
          <h2 className="landing-section-heading mt-5">
            One platform.
            <br />
            Every operational activity.
          </h2>
          <p className="landing-modules-subcopy mt-4">
            Six activity types, one structured operational record.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="landing-modules-grid">
          {MODULES.map((module) => (
            <div key={module.key} className={cn("landing-module-cell", module.feature && "landing-module-cell-feature")}>
              <h3 className="landing-module-title">{module.title}</h3>
              <p className="landing-module-copy">{module.copy}</p>
              <div className="landing-module-illust-wrap">
                <ModuleIllustration type={module.key} />
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
