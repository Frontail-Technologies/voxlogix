"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type TruncatedTextProps = {
  text: string;
  className?: string;
  lines?: 1 | 2 | 3;
};

const lineClampClass: Record<1 | 2 | 3, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
};

export function TruncatedText({ text, className, lines = 1 }: TruncatedTextProps) {
  if (!text) {
    return <span className={className}>-</span>;
  }

  return (
    <Tooltip>
      <TooltipTrigger className={cn(lineClampClass[lines], "block cursor-default text-left", className)}>
        {text}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs whitespace-pre-wrap">{text}</TooltipContent>
    </Tooltip>
  );
}
