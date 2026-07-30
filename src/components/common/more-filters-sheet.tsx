"use client";

import { useState, type ReactNode } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MoreFiltersSheetProps = {
  activeCount?: number;
  title?: string;
  description?: string;
  children: ReactNode;
};

export function MoreFiltersSheet({
  activeCount = 0,
  title = "Filters",
  description = "Refine results using the filters below.",
  children,
}: MoreFiltersSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button type="button" variant="outline" className="h-10 gap-2 rounded-xl bg-secondary/70" />}>
        <AppIcon name="filter" className="size-4" />
        Filters
        {activeCount > 0 ? (
          <Badge className="rounded-full bg-primary/15 px-1.5 text-primary">{activeCount}</Badge>
        ) : null}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto p-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
