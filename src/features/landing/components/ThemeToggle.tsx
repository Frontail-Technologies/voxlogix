"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { AppIcon } from "@/components/common/app-icon";

// Same mounted-guard pattern as the dashboard's own theme toggle
// (DashboardShell) — resolvedTheme is unknown on the server, so we render
// the light-mode icon until after hydration to avoid a mismatch.
const subscribe = () => () => undefined;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      className="landing-icon-btn"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <AppIcon name={isDark ? "moon" : "sun"} size={17} weight="bold" />
    </button>
  );
}
