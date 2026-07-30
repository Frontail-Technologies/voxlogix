"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DatePickerFieldProps = {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
};

export function DatePickerField({
  name,
  value,
  defaultValue = "",
  onChange,
  placeholder = "Select date",
  className,
  required,
}: DatePickerFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value ?? internalValue;

  function handleSelect(date?: Date) {
    const nextValue = toDateValue(date);
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  }

  return (
    <>
      {name ? (
        <input
          type="hidden"
          name={name}
          value={selectedValue}
          required={required}
        />
      ) : null}
      <Popover>
        <PopoverTrigger
          className={cn(
            "inline-flex h-11 w-full items-center justify-start gap-2 rounded-xl border border-input bg-secondary/70 px-3 text-left text-sm transition-colors hover:bg-secondary/80 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            className,
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className={cn("truncate", !selectedValue && "text-muted-foreground")}>
            {selectedValue ? formatDateLabel(selectedValue) : placeholder}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={toDate(selectedValue)}
            onSelect={handleSelect}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </>
  );
}

function toDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toDateValue(date?: Date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(value: string) {
  const date = toDate(value);
  if (!date) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}
