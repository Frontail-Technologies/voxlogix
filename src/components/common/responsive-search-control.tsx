"use client";

import { useRef, type ChangeEvent } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEFAULT_SEARCH_DEBOUNCE_MS = 280;

type ResponsiveSearchControlProps = {
  placeholder: string;
  desktopClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
};

export function ResponsiveSearchControl({
  placeholder,
  desktopClassName = "lg:max-w-xs",
  value,
  onChange,
  debounceMs = DEFAULT_SEARCH_DEBOUNCE_MS,
}: ResponsiveSearchControlProps) {
  const timeoutRef = useRef<number | null>(null);
  const controlledValue = value ?? "";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      onChange?.(nextValue);
      timeoutRef.current = null;
    }, debounceMs);
  }

  const inputProps = {
    defaultValue: controlledValue,
    onChange: handleChange,
  };

  return (
    <div className={cn("relative min-w-0 basis-full sm:basis-auto sm:flex-none", desktopClassName)}>
      <AppIcon
        name="search"
        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        key={controlledValue}
        {...inputProps}
        placeholder={placeholder}
        className="h-10 rounded-xl bg-secondary/70 pl-9"
      />
    </div>
  );
}

