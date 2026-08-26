import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
  error?: string;
  fieldName?: string;
};

export function FormField({ label, children, className, error, fieldName }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} data-field-name={fieldName}>
      <Label className={cn(error && "text-destructive")}>{label}</Label>
      {children}
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  );
}

export function FieldError({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium leading-5 text-destructive" role="alert">
      {children}
    </p>
  );
}
