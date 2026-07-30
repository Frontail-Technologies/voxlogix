import Link from "next/link";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStatePageProps = {
  icon: AppIconName;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

export function ErrorStatePage({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: ErrorStatePageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-5 text-center shadow-sm sm:p-6">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/14 text-primary">
          <AppIcon name={icon} className="size-6" />
        </div>
        <h1 className="mt-5 text-xl font-semibold tracking-normal text-foreground">
          {title}
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <Link
          href={actionHref}
          className={cn(buttonVariants(), "mt-6 h-10 rounded-xl px-5")}
        >
          {actionLabel}
        </Link>
      </section>
    </main>
  );
}
