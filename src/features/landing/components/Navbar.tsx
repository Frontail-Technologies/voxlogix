"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/common/brand-logo";
import { cn } from "@/lib/utils";
import { CallButton } from "./CallButton";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "AI Troubleshooting", href: "#ai-troubleshooting" },
  { label: "Solutions", href: "#solutions" },
  { label: "Reporting", href: "#reporting" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="landing-navbar sticky top-0 inset-x-0 z-50">
      <div className="landing-container relative flex items-center justify-between xl:grid xl:grid-cols-[1fr_auto_1fr] h-16 md:h-20">
        <Link href="/" aria-label="VoxLogiX home" className="shrink-0">
          <BrandLogo size="sm" />
        </Link>

        <nav className="hidden xl:flex items-center gap-0.5 justify-self-center" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="landing-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          <div className="hidden xl:flex items-center gap-2">
            <CallButton />
            <ThemeToggle />
          </div>
          <Link href="#demo" className="landing-btn-outline hidden xl:inline-flex">
            Request a Demo
          </Link>

          <div className="flex xl:hidden items-center gap-1.5">
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
        <div className="xl:hidden bg-background border-t border-border px-6 py-4 flex flex-col gap-3">
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
          <Link href="#demo" className="landing-btn-outline justify-center" onClick={() => setMobileOpen(false)}>
            Request a Demo
          </Link>
        </div>
      ) : null}
    </header>
  );
}
