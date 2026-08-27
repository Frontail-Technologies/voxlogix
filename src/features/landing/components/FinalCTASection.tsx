import Link from "next/link";
import { Reveal } from "./Reveal";

export function FinalCTASection() {
  return (
    <section id="demo" className="landing-final-cta">
      <div className="landing-container relative landing-final-cta-split">
        <Reveal className="landing-final-cta-inner">
          <h2 className="landing-final-cta-heading">
            Give every voice
            <br />
            on your shop floor a second life.
          </h2>
          <p className="landing-final-cta-subcopy mt-5">
            Turn everyday operational updates into structured, searchable knowledge.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="#demo" className="landing-final-cta-btn-primary">
              Request a Demo
            </Link>
            <Link href="#demo" className="landing-final-cta-btn-secondary">
              Contact Us
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="landing-final-cta-visual">
          <svg viewBox="0 0 320 260" fill="none" aria-hidden="true" className="landing-final-cta-illust">
            <rect x="18" y="128" width="66" height="100" stroke="currentColor" strokeWidth="1.8" />
            <rect x="96" y="86" width="80" height="142" stroke="currentColor" strokeWidth="1.8" />
            <line x1="112" y1="60" x2="112" y2="86" stroke="currentColor" strokeWidth="1.8" />
            <line x1="152" y1="60" x2="152" y2="86" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="112" cy="52" r="8" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="152" cy="52" r="8" stroke="currentColor" strokeWidth="1.8" />
            <rect x="188" y="146" width="56" height="82" stroke="currentColor" strokeWidth="1.8" />
            <line x1="10" y1="228" x2="252" y2="228" stroke="currentColor" strokeWidth="1.8" />

            <path
              d="M40 178 L52 178 L57 158 L63 196 L69 168 L74 182 L82 178 L110 178"
              stroke="currentColor"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="landing-final-cta-illust-accent"
            />
            <path d="M110 178 H150" className="landing-final-cta-illust-accent" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="156" cy="178" r="3.2" className="landing-final-cta-illust-accent" fill="currentColor" />

            <rect x="188" y="40" width="98" height="76" rx="8" stroke="currentColor" strokeWidth="1.8" />
            <line x1="202" y1="60" x2="250" y2="60" className="landing-final-cta-illust-accent" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="202" y1="74" x2="266" y2="74" stroke="currentColor" strokeWidth="1.6" opacity="0.6" strokeLinecap="round" />
            <line x1="202" y1="88" x2="238" y2="88" stroke="currentColor" strokeWidth="1.6" opacity="0.6" strokeLinecap="round" />
            <line x1="156" y1="90" x2="188" y2="78" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
          </svg>
        </Reveal>
      </div>
    </section>
  );
}
