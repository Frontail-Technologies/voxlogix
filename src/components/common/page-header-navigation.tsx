"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppIcon } from "@/components/common/app-icon";
import { ROLE_NAVIGATION } from "@/config/navigation";
import { ROLE_LABELS, type UserRole } from "@/config/roles";

function roleFromPath(pathname: string): UserRole {
  if (pathname.startsWith("/master")) return "master";
  if (pathname.startsWith("/planner")) return "planner";
  if (pathname.startsWith("/execution")) return "execution";
  return "admin";
}

const segmentLabels: Record<string, string> = {
  access: "Access Control",
  activities: "Activities",
  admins: "Admins",
  "ai-review": "AI Review",
  companies: "Companies",
  "create-log": "Create Log",
  dashboard: "Dashboard",
  details: "Details",
  "edit-draft": "Edit Draft",
  edit: "Edit",
  equipment: "Equipment",
  executions: "Execution Users",
  grid: "Grid",
  "issue-categories": "Issue Categories",
  locations: "Locations",
  logs: "Logs",
  media: "Media",
  modules: "Modules",
  new: "New",
  planners: "Planners",
  profile: "Profile",
  remarks: "Remarks",
  reports: "Reports",
  schema: "Schema",
  settings: "Settings",
  status: "Status",
  table: "Table",
  usage: "AI Usage",
};

function roleHome(role: UserRole) {
  return `/${role}/dashboard`;
}

function labelFromSegment(segment: string) {
  return (
    segmentLabels[segment] ??
    segment
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

function buildBreadcrumbs(pathname: string) {
  const role = roleFromPath(pathname);
  const navItems = ROLE_NAVIGATION[role];
  const segments = pathname.split("/").filter(Boolean);
  const roleSegment = segments[0];
  const pageSegments = segments.slice(1);
  const crumbs = [{ href: roleHome(role), label: ROLE_LABELS[role] }];

  pageSegments.forEach((segment, index) => {
    const href = `/${[roleSegment, ...pageSegments.slice(0, index + 1)].join("/")}`;
    const navItem = navItems.find((item) => item.href === href);
    const isNestedUsage =
      segment === "usage" && pageSegments[index - 1] === "companies";

    crumbs.push({
      href,
      label: navItem?.title ?? (isNestedUsage ? "Usage" : labelFromSegment(segment)),
    });
  });

  return crumbs;
}

function parentHref(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 2) {
    return null;
  }

  return `/${segments.slice(0, -1).join("/")}`;
}

export function PageHeaderBreadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);

  if (breadcrumbs.length <= 2) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-2 hidden min-w-0 flex-wrap items-center gap-1 text-sm sm:flex"
    >
      {breadcrumbs.map((crumb, index) => {
        const current = index === breadcrumbs.length - 1;

        return (
          <Fragment key={`${crumb.href}-${index}`}>
            {index > 0 ? (
              <span className="px-1 text-muted-foreground/60">/</span>
            ) : null}
            {current ? (
              <span className="max-w-64 truncate font-medium text-foreground">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="max-w-56 truncate text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

export function PageTitleBackButton() {
  const pathname = usePathname();
  const href = parentHref(pathname);

  if (!href) {
    return null;
  }

  return (
    <Link
      href={href}
      className="-ml-2 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Go back"
    >
      <AppIcon name="arrow-left" className="size-5" />
    </Link>
  );
}
