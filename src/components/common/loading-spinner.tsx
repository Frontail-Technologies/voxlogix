import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function LoadingSpinner({
  className,
  label = "Loading",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span className={cn("inline-flex items-center justify-center", className)} role="status">
      <Loader2 className="size-5 animate-spin text-primary" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
