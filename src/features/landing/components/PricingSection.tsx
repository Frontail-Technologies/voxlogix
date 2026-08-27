import Link from "next/link";
import { Reveal } from "./Reveal";

export function PricingSection() {
  return (
    <section id="pricing" className="landing-pricing">
      <div className="landing-container relative landing-pricing-split">
        <Reveal>
          <span className="landing-eyebrow">Pricing</span>
          <h2 className="landing-section-heading mt-4">
            Built around
            <br />
            your operation.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="landing-pricing-panel">
          <span className="landing-pricing-panel-mark" aria-hidden="true" />
          <p className="landing-pricing-copy">Tell us about your team, modules and deployment needs.</p>
          <div className="landing-pricing-actions">
            <Link href="#demo" className="landing-btn-primary">
              Request Pricing
            </Link>
            <Link href="#demo" className="landing-pricing-secondary">
              Request a Demo
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
