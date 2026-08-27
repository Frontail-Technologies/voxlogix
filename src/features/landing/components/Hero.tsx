import Link from "next/link";
import { AppIcon } from "@/components/common/app-icon";
import { Reveal } from "./Reveal";
import { VoiceCaptureVisual } from "./VoiceCaptureVisual";
import { StructuredLogVisual } from "./StructuredLogVisual";

export function Hero() {
  return (
    <section id="hero" className="landing-hero overflow-hidden">
      <div className="landing-hero-grid" aria-hidden="true" />
      <div className="landing-frame-line landing-frame-line-left" aria-hidden="true" />
      <div className="landing-frame-line landing-frame-line-right" aria-hidden="true" />

      <div className="landing-container relative grid gap-10 lg:grid-cols-[1.08fr_1fr] lg:items-center">
        <Reveal>
          <span className="landing-eyebrow">AI-Powered Operations</span>

          <h1 className="landing-hero-heading mt-5">
            Turn frontline <span className="landing-hero-highlight">voice</span>
            <br />
            into operational intelligence.
          </h1>

          <p className="landing-hero-subcopy mt-6">
            Speak naturally. VoxLogiX turns shop-floor updates into structured logs, searchable operational
            knowledge and actionable data &mdash; without slowing technicians down with manual entry.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-6">
            <Link href="#demo" className="landing-btn-primary landing-btn-lg">
              Request a Demo
            </Link>
            <Link href="#how-it-works" className="landing-hero-secondary-link">
              See How It Works
              <AppIcon name="arrow-right" size={16} weight="bold" />
            </Link>
          </div>
        </Reveal>

        <Reveal from="right" delay={0.1} className="relative">
          <div className="relative flex flex-col items-stretch">
            <VoiceCaptureVisual />

            <div className="landing-extraction" aria-hidden="true">
              <span className="landing-extraction-line" />
              <span className="landing-extraction-node" />
              <span className="landing-extraction-badge">
                <AppIcon name="ai" size={12} weight="fill" />
                AI Extracts
              </span>
              <span className="landing-extraction-node" />
              <span className="landing-extraction-line" />
            </div>

            <StructuredLogVisual />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
