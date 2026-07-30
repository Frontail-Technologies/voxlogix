import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const readinessItems = [
  {
    title: "API Contract",
    description: "Waiting for the matching company-scoped backend contract before this page accepts real actions.",
    icon: "database" as AppIconName,
  },
  {
    title: "UI Shell",
    description: "Layout, breadcrumbs, theme, and responsive spacing are ready for the final feature component.",
    icon: "dashboard" as AppIconName,
  },
  {
    title: "Next Step",
    description: "Wire queries, mutations, skeleton states, and empty/error handling when the contract is available.",
    icon: "status" as AppIconName,
  },
];

type PageScaffoldProps = {
  title: string;
  description: string;
  icon?: AppIconName;
};

export function PageScaffold({ title, description, icon = "dashboard" }: PageScaffoldProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary" className="gap-2 rounded-md px-3 py-1 text-sm font-medium">
            <AppIcon name={icon} className="size-4 text-primary" />
            Pending integration
          </Badge>
          <h1 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>

      <Card className="rounded-2xl border-border bg-card shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-border bg-secondary/40 p-5 sm:flex-row sm:items-center">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <AppIcon name={icon} className="size-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">This page is intentionally not showing mock data.</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                It is reserved for the next backend-backed implementation pass, so users do not mistake static samples for real company data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {readinessItems.map((item) => (
          <Card key={item.title} className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <AppIcon name={item.icon} className="size-5" />
              </div>
              <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
