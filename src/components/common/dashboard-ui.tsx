import type { ComponentProps, ReactNode } from "react";
import { AppIcon, type AppIconName } from "@/components/common/app-icon";
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
  orange: "bg-chart-2/14 text-chart-2",
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
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function DashboardStatCard({
  label,
  value,
  helper,
  icon,
  tone = "navy",
}: {
  label: string;
  value: string;
  helper: string;
  icon: AppIconName;
  tone?: DashboardTone;
}) {
  return (
    <Card className="rounded-2xl border-border bg-card shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            toneClasses[tone],
          )}
        >
          <AppIcon name={icon} className="size-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-normal text-card-foreground">
            {value}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
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
    normalized === "active"
      ? "bg-chart-2/14 text-chart-2"
      : normalized === "suspended"
        ? "bg-destructive/12 text-destructive"
        : normalized === "demo"
          ? "bg-chart-4/14 text-chart-4"
          : "bg-muted text-muted-foreground";

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

export function UsageVisual({ points }: { points: number[] }) {
  const width = 640;
  const height = 220;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const coords = points.map((value, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((value - min) / (max - min || 1)) * (height - 36) - 18;
    return `${x},${y}`;
  });
  const area = `0,${height} ${coords.join(" ")} ${width},${height}`;

  return (
    <div className="h-72 w-full overflow-hidden rounded-xl bg-gradient-to-b from-background to-primary/8 p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {[0, 1, 2, 3, 4].map((line) => (
          <line
            key={line}
            x1="0"
            x2={width}
            y1={(height / 4) * line}
            y2={(height / 4) * line}
            className="stroke-border"
            strokeWidth="1"
          />
        ))}
        <polygon points={area} className="fill-primary/12" />
        <polyline
          points={coords.join(" ")}
          fill="none"
          className="stroke-primary"
          strokeWidth="3"
        />
        {coords.map((point, index) => {
          const [cx, cy] = point.split(",");
          return (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r="4"
              className="fill-card stroke-primary"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    </div>
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
  return <BaseTableHeader className={cn("bg-muted/65", className)} {...props} />;
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
