import type { AppIconName } from "@/components/common/app-icon";
import { AppIcon } from "@/components/common/app-icon";
import { ProcessIllustration } from "./ProcessIllustration";
import { Reveal } from "./Reveal";

type Step = {
  number: string;
  kicker: string;
  icon: AppIconName;
  illust: "speak" | "extract" | "review" | "captured";
  label: string;
  copy: string;
  chips?: string[];
};

const STEPS: Step[] = [
  {
    number: "01",
    kicker: "Voice Input",
    icon: "voice",
    illust: "speak",
    label: "Speak",
    copy: "Record a short voice update directly from the shop floor.",
  },
  {
    number: "02",
    kicker: "Structure",
    icon: "ai",
    illust: "extract",
    label: "AI Extracts",
    copy: "VoxLogiX converts the recording into structured operational fields.",
    chips: ["Equipment", "Issue", "Root Cause", "Action"],
  },
  {
    number: "03",
    kicker: "Verify",
    icon: "status",
    illust: "review",
    label: "Review & Submit",
    copy: "Confirm the extracted details, make any correction, add a photo if needed, and submit.",
  },
  {
    number: "04",
    kicker: "Archive",
    icon: "logs",
    illust: "captured",
    label: "Knowledge Captured",
    copy: "The record joins your searchable operational history for future reference.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="landing-how-it-works">
      <div className="landing-container relative">
        <Reveal>
          <div className="landing-how-intro-row">
            <div>
              <span className="landing-how-eyebrow">How It Works</span>
              <h2 className="landing-how-heading mt-5">
                From spoken update
                <br />
                to structured record.
              </h2>
              <p className="landing-how-subcopy mt-5">
                Capture what happened while it&rsquo;s still fresh. VoxLogiX structures the update, lets the
                technician verify it, and turns it into usable operational history.
              </p>
            </div>
            <span className="landing-how-meta">Flow &middot; 04 Steps</span>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="landing-how-rail">
          {STEPS.map((step, index) => (
            <div key={step.number} className="landing-how-step">
              <div className="landing-how-node-col">
                <span className="landing-how-node">
                  <ProcessIllustration type={step.illust} />
                  <span className="landing-how-node-number">{step.number}</span>
                </span>
                {index < STEPS.length - 1 ? <span className="landing-how-connector" aria-hidden="true" /> : null}
              </div>

              <div className="landing-how-content">
                <div className="landing-how-kicker-row">
                  <span className="landing-how-icon">
                    <AppIcon name={step.icon} size={14} weight="bold" />
                  </span>
                  <span className="landing-how-kicker">{step.kicker}</span>
                </div>
                <h3 className="landing-how-step-label">{step.label}</h3>
                <p className="landing-how-step-copy">{step.copy}</p>
                {step.chips ? (
                  <div className="landing-how-chips">
                    {step.chips.map((chip) => (
                      <span key={chip} className="landing-how-chip">
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
