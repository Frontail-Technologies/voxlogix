"use client";

import {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
  "logs/create": "Create Log",
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
  manuals: "Manuals",
  media: "Media",
  modules: "Modules",
  new: "New",
  planners: "Planners",
  profile: "Profile",
  remarks: "Remarks",
  reports: "Reports",
  "ai-usage": "AI Usage",
  "company-access": "Company Access",
  schema: "Schema",
  settings: "Settings",
  status: "Status",
  table: "Table",
  usage: "AI Usage",
};

type BreadcrumbLabelContextValue = {
  labels: Record<string, string>;
  registerLabel: (key: string, label: string) => () => void;
};

const BreadcrumbLabelContext = createContext<BreadcrumbLabelContextValue | null>(null);

export function DynamicBreadcrumbProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState<Record<string, string>>({});

  const registerLabel = useCallback((key: string, label: string) => {
    if (!key || !label) {
      return () => undefined;
    }

    setLabels((current) => ({ ...current, [key]: label }));

    return () => {
      setLabels((current) => {
        if (current[key] !== label) {
          return current;
        }

        const next = { ...current };
        delete next[key];
        return next;
      });
    };
  }, []);

  const value = useMemo(() => ({ labels, registerLabel }), [labels, registerLabel]);

  return (
    <BreadcrumbLabelContext.Provider value={value}>
      {children}
    </BreadcrumbLabelContext.Provider>
  );
}

export function useRegisterBreadcrumbLabel(key?: string | null, label?: string | null) {
  const registerLabel = useContext(BreadcrumbLabelContext)?.registerLabel;

  useEffect(() => {
    if (!registerLabel || !key || !label) {
      return undefined;
    }

    return registerLabel(key, label);
  }, [registerLabel, key, label]);
}

function roleHome(role: UserRole) {
  return `/${role}/dashboard`;
}

function labelFromSegment(segment: string, dynamicLabels: Record<string, string>) {
  return (
    dynamicLabels[segment] ??
    segmentLabels[segment] ??
    segment
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

function buildBreadcrumbs(pathname: string, dynamicLabels: Record<string, string>) {
  const role = roleFromPath(pathname);
  const navItems = ROLE_NAVIGATION[role];
  const segments = pathname.split("/").filter(Boolean);
  const roleSegment = segments[0];
  const pageSegments = segments.slice(1);
  const crumbs = [{ href: roleHome(role), label: ROLE_LABELS[role] }];

  pageSegments.forEach((segment, index) => {
    const href = `/${[roleSegment, ...pageSegments.slice(0, index + 1)].join("/")}`;
    const editOnlyEntityPath = `${roleSegment}/${pageSegments.slice(0, index).join("/")}`;

    if (
      pageSegments[index + 1] === "edit" &&
      EDIT_ROUTES_WITHOUT_DETAIL_PAGE.has(editOnlyEntityPath)
    ) {
      return;
    }

    const navItem = navItems.find((item) => item.href === href);
    const isNestedUsage =
      segment === "usage" && pageSegments[index - 1] === "companies";

    crumbs.push({
      href,
      label:
        navItem?.title ?? (isNestedUsage ? "Usage" : labelFromSegment(segment, dynamicLabels)),
    });
  });

  return crumbs;
}

// Edit routes for these entities have no sibling [id] detail page - back
// should skip past the (non-existent) detail route straight to the list.
const EDIT_ROUTES_WITHOUT_DETAIL_PAGE = new Set([
  "admin/modules",
  "admin/issue-categories",
  "admin/locations",
  "admin/equipment-categories",
]);

function parentHref(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 2) {
    return null;
  }

  if (segments[segments.length - 1] === "edit" && segments.length >= 4) {
    const entityPath = segments.slice(0, -2).join("/");
    if (EDIT_ROUTES_WITHOUT_DETAIL_PAGE.has(entityPath)) {
      return `/${segments.slice(0, -2).join("/")}`;
    }
  }

  return `/${segments.slice(0, -1).join("/")}`;
}

export function PageHeaderBreadcrumbs() {
  const pathname = usePathname();
  const context = useContext(BreadcrumbLabelContext);
  const breadcrumbs = buildBreadcrumbs(pathname, context?.labels ?? {});

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
