import type { ComponentProps, ReactNode } from "react";
import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  PageHeaderBreadcrumbs,
  PageTitleBackButton,
} from "@/components/common/page-header-navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader as BaseTableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DashboardTone =
  | "amber"
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "blue"
  | "teal"
  | "navy";

const toneClasses: Record<DashboardTone, string> = {
  amber: "bg-primary/14 text-primary",
  green: "bg-chart-2/14 text-chart-2",
  orange: "bg-chart-3/12 text-chart-3",
  purple: "bg-chart-5/14 text-chart-5",
  red: "bg-destructive/12 text-destructive",
  blue: "bg-chart-4/14 text-chart-4",
  teal: "bg-primary/12 text-primary",
  navy: "bg-secondary text-secondary-foreground",
};

export function DashboardPageHeader({
  title,
  description,
  action,
  hideDescriptionOnMobile,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  hideDescriptionOnMobile?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <PageHeaderBreadcrumbs />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <PageTitleBackButton />
              <h1 className="truncate text-lg font-semibold tracking-normal text-foreground sm:text-xl">
                {title}
              </h1>
            </div>
            {description ? (
              <p
                className={cn(
                  "mt-1 max-w-2xl text-sm leading-5 text-muted-foreground",
                  hideDescriptionOnMobile && "hidden sm:block",
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
          {action ? (
            <div className="shrink-0 self-start [&>a]:size-9 [&>a]:gap-0 [&>a]:rounded-xl [&>a]:px-0 [&>a]:text-[0px] [&>button]:size-9 [&>button]:gap-0 [&>button]:rounded-xl [&>button]:px-0 [&>button]:text-[0px] [&_svg]:size-4 sm:hidden">
              {action}
            </div>
          ) : null}
        </div>
      </div>
      {action ? <div className="hidden pt-5 sm:block">{action}</div> : null}
    </div>
  );
}

export function DashboardStatCard({
  label,
  value,
  helper,
  icon,
  tone = "navy",
  isLoading = false,
}: {
  label: string;
  value: string;
  helper: string;
  icon: AppIconName;
  tone?: DashboardTone;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="min-h-[92px] rounded-2xl border-border bg-card shadow-sm sm:min-h-[106px]">
        <CardContent className="flex h-full items-center justify-center p-3 sm:p-5">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-h-[92px] rounded-2xl border-border bg-card shadow-sm sm:min-h-[106px]">
      <CardContent className="flex h-full flex-col items-start gap-2 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-12",
            toneClasses[tone],
          )}
        >
          <AppIcon name={icon} className="size-5 sm:size-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-lg font-semibold tracking-normal text-card-foreground sm:text-2xl">
            {value}
          </p>
          <p className="mt-1 hidden truncate text-xs text-muted-foreground sm:block">
            {helper}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const className =
    normalized === "active" ||
    normalized === "success" ||
    normalized === "completed" ||
    normalized === "enabled"
      ? "bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300"
      : normalized === "warning" ||
          normalized === "pending" ||
          normalized === "trial enabled"
        ? "bg-amber-500/16 text-amber-700 dark:bg-amber-400/18 dark:text-amber-300"
        : normalized === "suspended" ||
            normalized === "failed" ||
            normalized === "error" ||
            normalized === "blocked"
        ? "bg-red-500/12 text-red-700 dark:bg-red-400/16 dark:text-red-300"
        : normalized === "demo"
          ? "bg-sky-500/12 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300"
          : "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground";

  return (
    <Badge className={cn("rounded-md border-0", className)}>{status}</Badge>
  );
}

export function DashboardCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl border-border bg-card shadow-sm",
        className,
      )}
    >
      {children}
    </Card>
  );
}

export function ActionsButton() {
  return (
    <button className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
      <AppIcon name="more" className="size-5" />
      <span className="sr-only">Actions</span>
    </button>
  );
}

export function ActivityItem({
  title,
  actor,
  time,
  icon,
  tone,
}: {
  title: string;
  actor: string;
  time: string;
  icon: AppIconName;
  tone: DashboardTone;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          toneClasses[tone],
        )}
      >
        <AppIcon name={icon} className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-card-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">by {actor}</p>
      </div>
      <span className="whitespace-nowrap text-xs text-muted-foreground">
        {time}
      </span>
    </div>
  );
}

export function UsageProgress({ value }: { value: number }) {
  return <Progress value={value} className="h-2 min-w-28" />;
}

export function TableHeader({
  className,
  ...props
}: ComponentProps<typeof BaseTableHeader>) {
  return (
    <BaseTableHeader
      className={cn("bg-secondary text-secondary-foreground", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardHeader,
  CardTitle,
  CardContent,
};

