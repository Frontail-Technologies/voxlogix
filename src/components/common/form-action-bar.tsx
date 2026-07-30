import Link from "next/link";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormActionBarProps = {
  cancelHref: string;
  submitLabel: string;
  submitIcon?: AppIconName;
  className?: string;
  isSubmitting?: boolean;
};

export function FormActionBar({
  cancelHref,
  submitLabel,
  submitIcon,
  className,
  isSubmitting,
}: FormActionBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-border bg-card/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:justify-end md:left-(--sidebar-width) lg:px-8",
        className,
      )}
    >
      <Link
        href={cancelHref}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-10 flex-1 rounded-xl lg:flex-none",
        )}
      >
        Cancel
      </Link>
      <Button
        type="submit"
        className="h-10 flex-1 rounded-xl lg:flex-none"
        disabled={isSubmitting}
      >
        {submitIcon ? <AppIcon name={submitIcon} className="size-4" /> : null}
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
}
