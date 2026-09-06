"use client";

import { useState } from "react";

import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { PreviewRow } from "@/features/admin-master-data/api/master-data.types";

export function MasterDataImportRowEditDialog({
  row,
  open,
  onOpenChange,
  onSave,
}: {
  row: PreviewRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: Record<string, string>) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  // Track which row's values are currently loaded into local state so we can reset it
  // when a different row is opened — done during render (React's recommended pattern for
  // "adjust state when a prop changes"), not in an effect, to avoid an extra render pass.
  const [loadedPreviewId, setLoadedPreviewId] = useState<string | null>(null);

  if (row && row.previewId !== loadedPreviewId) {
    setLoadedPreviewId(row.previewId);
    setValues(row.values);
  }

  if (!row) return null;

  const fields = Object.keys(row.values);

  function updateField(key: string, next: string) {
    setValues((current) => ({ ...current, [key]: next }));
  }

  function handleSave() {
    onSave(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit row {row.originalRowNumber}</DialogTitle>
          <DialogDescription>
            Changes apply to this preview only — nothing is saved until you import.
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-1 sm:grid-cols-2">
          {fields.map((field) => (
            <FormField key={field} label={field} fieldName={field}>
              <Input
                value={values[field] ?? ""}
                onChange={(event) => updateField(field, event.target.value)}
                className="h-10 rounded-xl bg-secondary/70"
              />
            </FormField>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="rounded-xl" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
