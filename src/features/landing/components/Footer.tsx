import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";

const FOOTER_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "AI Troubleshooting", href: "#ai-troubleshooting" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Safety", href: "#solutions" },
      { label: "Reporting", href: "#reporting" },
      { label: "Operational Logging", href: "#features" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Request a Demo", href: "#demo" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="landing-container relative">
        <div className="landing-footer-top">
          <Link href="/" aria-label="VoxLogiX home" className="w-fit">
            {/* Footer is always a dark surface in both site themes, but BrandLogo's
                default wordmark color/mark follow the page theme (dark text +
                dark-arrow mark in light mode) — override both to the footer's
                own fixed-light values so the logo stays readable regardless of
                page theme. Navbar's BrandLogo usage is untouched. */}
            <BrandLogo size="md" mark="light" textClassName="text-[var(--footer-fg)]" />
          </Link>

          <div className="landing-footer-groups">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title} className="landing-footer-group">
                <span className="landing-footer-group-title">{group.title}</span>
                <ul className="landing-footer-group-list">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="landing-footer-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="landing-footer-bottom">
          <p>
            &copy; {year} VoxLogiX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
