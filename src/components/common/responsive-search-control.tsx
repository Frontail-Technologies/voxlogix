"use client";

import { AppIcon } from "@/components/common/app-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ResponsiveSearchControlProps = {
  placeholder: string;
  desktopClassName?: string;
};

export function ResponsiveSearchControl({
  placeholder,
  desktopClassName = "lg:max-w-xs",
}: ResponsiveSearchControlProps) {
  return (
    <>
      <div className={`relative hidden w-full lg:block ${desktopClassName}`}>
        <AppIcon
          name="search"
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder={placeholder}
          className="h-10 rounded-xl bg-secondary/70 pl-9"
        />
      </div>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-9 rounded-xl bg-secondary/70 p-0 lg:hidden"
            />
          }
        >
          <AppIcon name="search" className="size-3.5" />
          <span className="sr-only">{placeholder}</span>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-[min(calc(100vw-1.5rem),22rem)] rounded-xl p-3"
        >
          <div className="relative">
            <AppIcon
              name="search"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              autoFocus
              placeholder={placeholder}
              className="h-10 rounded-xl bg-secondary/70 pl-9"
            />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
