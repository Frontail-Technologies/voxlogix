"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/common/brand-logo";
import { cn } from "@/lib/utils";
import { CallButton } from "./CallButton";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "AI Troubleshooting", href: "/#ai-troubleshooting" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Reporting", href: "/#reporting" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="landing-navbar sticky top-0 inset-x-0 z-50">
      <div className="landing-container relative flex h-16 items-center justify-between md:h-20 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" aria-label="VoxLogiX home" className="shrink-0">
          <BrandLogo size="sm" />
        </Link>

        <nav className="hidden items-center justify-self-center gap-0 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="landing-nav-link whitespace-nowrap lg:px-1.5 xl:px-3">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          <div className="hidden items-center gap-2 xl:flex">
            <CallButton />
            <ThemeToggle />
          </div>
          <Link href="/#demo" className="landing-btn-outline hidden whitespace-nowrap lg:inline-flex lg:px-3 xl:px-5">
            Request a Demo
          </Link>

          <div className="flex items-center gap-1.5 lg:hidden">
            <CallButton />
            <ThemeToggle />
            <button
              className="flex flex-col gap-1.5 p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <span className={cn("landing-hamburger-bar", mobileOpen && "rotate-45 translate-y-2")} />
              <span className={cn("landing-hamburger-bar", mobileOpen && "opacity-0")} />
              <span className={cn("landing-hamburger-bar", mobileOpen && "-rotate-45 -translate-y-2")} />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="flex flex-col gap-3 border-t border-border bg-background px-6 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="landing-nav-link py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/#demo" className="landing-btn-outline justify-center" onClick={() => setMobileOpen(false)}>
            Request a Demo
          </Link>
        </div>
      ) : null}
    </header>
  );
}
