import type { Metadata } from "next";

import { LegalDocumentPage } from "@/features/landing/components/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Terms of Service | VoxLogiX",
  description: "Terms governing authorized business use of the VoxLogiX platform.",
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      title="Terms of Service"
      summary="These terms govern access to and use of VoxLogiX by organizations and their authorized users."
      lastUpdated="September 26, 2026"
    >
      <section className="legal-section">
        <h2>1. Agreement and business use</h2>
        <p>
          VoxLogiX is provided for authorized business and workplace operations. By accessing the service, you agree to
          use it only on behalf of an organization that has permitted your access and in accordance with these terms, the
          organization&apos;s policies, and any applicable commercial agreement. If a signed customer agreement conflicts with
          these terms, the signed agreement controls for that customer.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Accounts and access</h2>
        <p>
          Users must provide accurate account information, protect their credentials, and promptly report suspected
          unauthorized access. Accounts and permissions are assigned by authorized administrators. Users may not share
          credentials, impersonate another user, bypass role or company restrictions, or access records outside their
          authorized scope.
        </p>
      </section>

      <section className="legal-section">
        <h2>3. Operational data</h2>
        <p>
          Users and their organizations are responsible for the accuracy, completeness, legality, and appropriate use of
          information entered into VoxLogiX, including equipment logs, safety records, readings, schedules, attachments,
          locations, manuals, and master data. The service does not independently verify that submitted operational data is
          correct.
        </p>
      </section>

      <section className="legal-section">
        <h2>4. AI-assisted features</h2>
        <p>
          AI-generated field extraction, summaries, troubleshooting guidance, and answers are assistive outputs. They may
          be incomplete, inaccurate, or unsuitable for a particular situation. Authorized personnel must review AI output
          before relying on it, recording it as final, or using it to direct work.
        </p>
      </section>

      <section className="legal-section legal-callout">
        <h2>5. Equipment and safety responsibility</h2>
        <p>
          VoxLogiX is not a substitute for inspections, engineering judgment, safety procedures, manufacturer guidance, or
          legal and regulatory obligations. Equipment operation, maintenance, shutdown, incident response, and workplace
          safety decisions remain the responsibility of the organization and its qualified, authorized personnel.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Acceptable use</h2>
        <p>Users must not:</p>
        <ul>
          <li>Use the service unlawfully or to violate another person&apos;s rights.</li>
          <li>Upload malicious code, unlawful material, or content they are not authorized to use.</li>
          <li>Interfere with service operation, probe security, evade limits, or attempt unauthorized access.</li>
          <li>Use automated means to overload, scrape, or extract the service except through approved interfaces.</li>
          <li>Reverse engineer or misuse the service except where applicable law expressly permits it.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>7. Service availability and changes</h2>
        <p>
          VoxLogiX may be updated, maintained, limited, or temporarily unavailable. Features may depend on network access,
          device capabilities, configured third-party services, and organization settings. No uninterrupted or error-free
          operation is promised unless expressly stated in a signed agreement.
        </p>
      </section>

      <section className="legal-section">
        <h2>8. Intellectual property</h2>
        <p>
          VoxLogiX and its software, branding, interfaces, and platform materials are protected by applicable intellectual
          property laws. Organizations retain their rights in the business information and content they submit. Users grant
          the permissions necessary to host, process, display, and transmit that content solely to provide and support the
          service.
        </p>
      </section>

      <section className="legal-section">
        <h2>9. Suspension and termination</h2>
        <p>
          Access may be suspended or terminated by an organization administrator or by the service when required by the
          applicable agreement, for security reasons, for non-payment, for material misuse, or to comply with law. After
          access ends, availability and retention of organization data are governed by the applicable agreement and
          operational retention practices.
        </p>
      </section>

      <section className="legal-section">
        <h2>10. Disclaimers and limitation</h2>
        <p>
          To the extent permitted by law and subject to any signed agreement, the service is provided on an available basis
          without implied guarantees that exceed those expressly agreed. VoxLogiX is not responsible for decisions made
          without appropriate human review or for indirect, incidental, special, or consequential loss arising from use of
          the service. Any applicable liability allocation or financial cap is governed by the customer&apos;s signed agreement
          and applicable law.
        </p>
      </section>

      <section className="legal-section">
        <h2>11. Contact and changes</h2>
        <p>
          Questions about these terms should be directed to your organization&apos;s VoxLogiX administrator or the existing
          VoxLogiX/Frontail representative through whom your organization receives the service. Updated terms will show a
          revised publication date.
        </p>
      </section>
    </LegalDocumentPage>
  );
}
