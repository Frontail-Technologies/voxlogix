import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_LOGS, MOCK_STATS } from "@/config/mock-data";
import { MODULE_SCHEMAS } from "@/config/modules";

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
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            <AppIcon name={icon} className="size-4 text-primary" />
            Mock-only scaffold
          </div>
          <h1 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MOCK_STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
            <CardDescription>Static sample data for layout validation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_LOGS.map((log) => (
              <div
                key={log.id}
                className="flex flex-col gap-2 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{log.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.id} - {log.module}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{log.status}</Badge>
                  <Badge>{log.severity}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dynamic Module Schemas</CardTitle>
            <CardDescription>Placeholder schemas for future AI extraction.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MODULE_SCHEMAS.map((module) => (
              <div
                key={module.id}
                className="flex items-start gap-3 rounded-md border border-border p-3"
              >
                <div className="rounded-md bg-accent p-2 text-primary">
                  <AppIcon name={module.icon} className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{module.name}</p>
                  <p className="text-xs leading-5 text-muted-foreground">{module.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
