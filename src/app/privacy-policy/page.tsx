import type { Metadata } from "next";

import { LegalDocumentPage } from "@/features/landing/components/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Privacy Policy | VoxLogiX",
  description: "How VoxLogiX handles account, workplace, operational, voice, and diagnostic data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      title="Privacy Policy"
      summary="This policy explains how information is handled when organizations and their authorized users use VoxLogiX."
      lastUpdated="September 26, 2026"
    >
      <section className="legal-section">
        <h2>1. Scope</h2>
        <p>
          VoxLogiX is a business operations platform used by organizations to capture, structure, review, and report
          workplace information. The organization that provides your account controls how its users access and use the
          service. This policy describes the information handled by the VoxLogiX platform and the purposes for which it
          is used.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Information handled by VoxLogiX</h2>
        <p>The platform may handle the following information when supplied by an organization or its users:</p>
        <ul>
          <li>Account and profile details, including name, username, email, phone number, role, company, and profile image.</li>
          <li>Authentication and session information used to sign users in, refresh sessions, and protect access.</li>
          <li>Company and workplace master data, including equipment, locations, sections, shifts, categories, users, and roles.</li>
          <li>Operational logs, status updates, remarks, assignments, schedules, and related activity history.</li>
          <li>Measuring Point values, Meter Counter readings, timestamps, limits, calculated deltas, and alert status.</li>
          <li>Voice recordings and transcripts submitted through voice-enabled modules.</li>
          <li>Photos, captured location coordinates, equipment manuals, and reference documents uploaded by authorized users.</li>
          <li>Technical diagnostics such as errors, device or app context, and request metadata when monitoring is enabled.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. How information is used</h2>
        <p>Information is used to provide the functions requested by the organization and its authorized users, including:</p>
        <ul>
          <li>Authenticating users and applying company, role, module, and feature access controls.</li>
          <li>Creating, reviewing, assigning, updating, and reporting operational records.</li>
          <li>Maintaining equipment history, reading history, alerts, and audit activity.</li>
          <li>Converting voice input into transcripts and structured log fields.</li>
          <li>Using uploaded manuals and approved operational context to support search and AI-assisted answers.</li>
          <li>Operating, securing, troubleshooting, and improving the reliability of the service.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. Voice and AI processing</h2>
        <p>
          For voice-enabled modules, speech may be transcribed on the user&apos;s device and the resulting transcript may be
          sent for configured AI processing. VoxLogiX uses AI to propose structured fields or assist with operational
          questions. Depending on platform configuration, transcripts, prompts, relevant log context, or manual excerpts
          may be processed by an AI service provider solely to produce the requested result. Users should avoid including
          unrelated personal or confidential information in voice logs and prompts.
        </p>
      </section>

      <section className="legal-section">
        <h2>5. Service providers and disclosures</h2>
        <p>
          Information may be processed by infrastructure, storage, AI, email, or diagnostic providers configured to run
          the service. Access may also be provided when required by law, to protect the service or its users, or as part of
          an organizational transition subject to appropriate safeguards. VoxLogiX does not expose one company&apos;s
          operational records to another company through normal application access.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Company-scoped access</h2>
        <p>
          Application access is scoped by company and user role. Company administrators and other authorized personnel may
          view, manage, export, correct, or remove information according to the permissions enabled for their organization.
          Users must not attempt to access another organization&apos;s records or use credentials that were not assigned to them.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Retention and security</h2>
        <p>
          Information is retained according to the organization&apos;s account, operational requirements, enabled features,
          and applicable agreements. Records may remain in backups or logs for a limited period after deletion or account
          closure. VoxLogiX uses reasonable technical and organizational safeguards, including authentication and scoped
          access controls, but no system can guarantee absolute security.
        </p>
      </section>

      <section className="legal-section">
        <h2>8. User choices and rights</h2>
        <p>
          Users may review certain profile and operational information through the application. Requests to access,
          correct, export, restrict, or delete information should normally be made through the user&apos;s organization
          administrator, which controls the business account and its records. Applicable law may provide additional rights.
        </p>
      </section>

      <section className="legal-section">
        <h2>9. Contact</h2>
        <p>
          For privacy questions or requests, contact your organization&apos;s VoxLogiX administrator or the existing
          VoxLogiX/Frontail representative through whom your organization receives the service.
        </p>
      </section>

      <section className="legal-section">
        <h2>10. Changes to this policy</h2>
        <p>
          This policy may be updated as the service, legal requirements, or operational practices change. The date above
          identifies the latest published version.
        </p>
      </section>
    </LegalDocumentPage>
  );
}
