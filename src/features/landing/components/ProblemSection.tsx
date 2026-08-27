import { ProblemIllustration } from "./ProblemIllustration";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

const PROBLEMS = [
  {
    index: "01",
    icon: "people" as const,
    title: "Knowledge Stays With People",
    copy: "Experienced technicians know what worked last time, but that experience is often difficult for the rest of the team to access.",
  },
  {
    index: "02",
    icon: "paper" as const,
    title: "Manual Logging Creates Friction",
    copy: "Paper forms and manual data entry slow technicians down, especially during busy or urgent maintenance work.",
  },
  {
    index: "03",
    icon: "history" as const,
    title: "History Is Hard To Use",
    copy: "When past issues, actions and equipment context are difficult to search, troubleshooting starts from scratch.",
  },
];

export function ProblemSection() {
  return (
    <section id="the-knowledge-gap" className="landing-problem">
      <div className="landing-frame-line landing-frame-line-left" aria-hidden="true" />
      <div className="landing-frame-line landing-frame-line-right" aria-hidden="true" />

      <div className="landing-container relative">
        <Reveal className="landing-problem-intro">
          <span className="landing-eyebrow">The Knowledge Gap</span>
          <h2 className="landing-problem-heading mt-5">
            Critical knowledge
            <br />
            shouldn&rsquo;t leave with the shift.
          </h2>
          <p className="landing-problem-subcopy mt-5">
            Your technicians solve problems every day. But when those fixes live in memory, paper notes or
            scattered conversations, the next person has to solve the same problem again.
          </p>
        </Reveal>

        <Stagger className="landing-problem-grid" stagger={0.1}>
          {PROBLEMS.map((problem) => (
            <StaggerItem key={problem.index} className="landing-problem-block">
              <ProblemIllustration type={problem.icon} />
              <span className="landing-problem-mark" aria-hidden="true" />
              <span className="landing-problem-index">{problem.index}</span>
              <h3 className="landing-problem-title">{problem.title}</h3>
              <p className="landing-problem-copy">{problem.copy}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
