import Link from "next/link";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormActionBarProps = {
  cancelHref: string;
  submitLabel: string;
  submitIcon?: AppIconName;
  className?: string;
};

export function FormActionBar({
  cancelHref,
  submitLabel,
  submitIcon,
  className,
}: FormActionBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-card/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:justify-end lg:static lg:mx-0 lg:mb-0 lg:border-t lg:bg-transparent lg:p-0 lg:pt-6 lg:shadow-none lg:backdrop-blur-none",
        className,
      )}
    >
      <Link
        href={cancelHref}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-11 flex-1 rounded-xl lg:h-8 lg:flex-none",
        )}
      >
        Cancel
      </Link>
      <Button type="button" className="h-11 flex-1 rounded-xl lg:h-8 lg:flex-none">
        {submitIcon ? <AppIcon name={submitIcon} className="size-4" /> : null}
        {submitLabel}
      </Button>
    </div>
  );
}
