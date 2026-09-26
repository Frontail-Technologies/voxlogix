import { Bebas_Neue } from "next/font/google";
import type { ReactNode } from "react";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

type LegalDocumentPageProps = {
  title: string;
  summary: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalDocumentPage({
  title,
  summary,
  lastUpdated,
  children,
}: LegalDocumentPageProps) {
  return (
    <div className={`landing-root legal-page ${bebasNeue.variable}`}>
      <Navbar />
      <main className="legal-main">
        <header className="legal-hero">
          <div className="landing-container">
            <div className="legal-hero-inner">
              <span className="landing-eyebrow">VoxLogiX Legal</span>
              <h1 className="legal-title">{title}</h1>
              <p className="legal-summary">{summary}</p>
              <p className="legal-updated">Last updated: {lastUpdated}</p>
            </div>
          </div>
        </header>

        <div className="landing-container">
          <article className="legal-document">{children}</article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
