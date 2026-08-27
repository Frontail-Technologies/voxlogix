"use client";

import { useState } from "react";
import { AppIcon } from "@/components/common/app-icon";
import { Reveal } from "./Reveal";

const FAQS = [
  {
    question: "How does voice logging work?",
    answer:
      "Technicians record a short update, VoxLogiX structures the relevant fields, and they review the information before submitting it.",
  },
  {
    question: "Which modules use voice?",
    answer:
      "Equipment Log, Safety, Shift Log and Kaizen use the voice workflow. Measuring Points and Meter Counters use direct ID/QR and numeric entry.",
  },
  {
    question: "Can I attach photos?",
    answer: "Yes. Attachments can be added to supported operational logs.",
  },
  {
    question: "What does the AI assistant use?",
    answer:
      "The equipment AI assistant uses uploaded equipment manuals/reference documents to answer relevant troubleshooting questions.",
  },
  {
    question: "Can reports be exported?",
    answer: "Yes. Structured output reports can be exported to Excel or PDF.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="landing-faq">
      <div className="landing-container relative landing-faq-split">
        <Reveal>
          <span className="landing-eyebrow">FAQ</span>
          <h2 className="landing-section-heading mt-4">Common questions.</h2>
        </Reveal>

        <Reveal delay={0.1} className="landing-faq-list">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="landing-faq-item">
                <button
                  type="button"
                  className="landing-faq-question"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {faq.question}
                  <AppIcon name="caret-down" size={16} className={isOpen ? "landing-faq-caret landing-faq-caret-open" : "landing-faq-caret"} />
                </button>
                {isOpen ? <p className="landing-faq-answer">{faq.answer}</p> : null}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
