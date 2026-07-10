import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="flex min-h-[72vh] w-full max-w-5xl items-center justify-center rounded-2xl bg-secondary/55 px-6 py-12 text-center sm:px-10">
        <div className="w-full max-w-lg">
          <div className="relative mx-auto h-56 w-full max-w-md sm:h-64">
            <div className="absolute left-1/2 top-8 h-32 w-32 -translate-x-1/2 rounded-full bg-primary/8 blur-sm" />
            <div className="absolute left-[24%] top-8 flex size-10 items-center justify-center rounded-full bg-chart-4/18 text-chart-4 sm:size-12">
              <AppIcon name="planet" className="size-7" />
            </div>
            <div className="absolute right-[20%] bottom-12 flex size-12 items-center justify-center rounded-full bg-primary/12 text-primary sm:size-14">
              <AppIcon name="planet" className="size-8" />
            </div>
            <div className="absolute right-[23%] top-12 h-28 w-20 rotate-[-22deg] rounded-[50%] border-2 border-primary/55 border-l-transparent border-t-transparent" />
            <div className="absolute left-1/2 top-16 -translate-x-1/2 text-[6.5rem] font-black leading-none tracking-tight text-primary sm:text-[8.5rem]">
              404
            </div>
            <div className="absolute left-1/2 top-24 flex size-24 -translate-x-1/2 rotate-[-38deg] items-center justify-center text-primary drop-shadow-sm sm:top-28 sm:size-28">
              <AppIcon name="rocket" className="size-full" />
            </div>
            <div className="absolute left-[33%] top-[9.5rem] h-16 w-7 rotate-[-38deg] rounded-full bg-primary/25 blur-sm sm:top-[11rem]" />
            <span className="absolute left-[34%] top-12 size-1 rounded-full bg-foreground/20" />
            <span className="absolute right-[30%] top-10 size-1.5 rounded-full bg-foreground/20" />
            <span className="absolute right-[40%] bottom-9 size-1 rounded-full bg-foreground/20" />
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
            Page not found
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">
            The page you are looking for was removed, moved, renamed, or might
            never have existed.
          </p>

          <div className="mt-7 flex justify-center">
            <Link href="/master/dashboard" className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-xl px-6")}>
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
