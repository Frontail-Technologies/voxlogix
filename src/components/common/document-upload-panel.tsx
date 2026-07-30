"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DocumentUploadPanelProps = {
  title?: string;
  subtitle?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMb?: number;
  className?: string;
};

export function DocumentUploadPanel({
  title = "Document",
  subtitle = "Upload a PDF document.",
  value,
  onChange,
  accept = "application/pdf,.pdf",
  maxSizeMb = 25,
  className,
}: DocumentUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewUrl = useMemo(() => (value ? URL.createObjectURL(value) : null), [value]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    if (!selectedFile) {
      onChange(null);
      return;
    }

    const isPdf = selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      toast.error("Please choose a PDF manual file.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > maxSizeMb * 1024 * 1024) {
      toast.error(`PDF size should be under ${maxSizeMb} MB.`);
      event.target.value = "";
      return;
    }

    onChange(selectedFile);
  }

  function handleRemove() {
    onChange(null);
    setPreviewOpen(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-secondary/50 p-4 transition-colors hover:border-brand/50",
        className,
      )}
    >
      <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <AppIcon name={value ? "database" : "upload"} className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{subtitle}</p>
            {value ? (
              <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-brand/10 px-2 py-0.5 font-medium text-brand">PDF</span>
                <span className="max-w-full truncate text-foreground">{value.name}</span>
                <span className="text-muted-foreground">{formatFileSize(value.size)}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {previewUrl ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-xl"
              onClick={() => setPreviewOpen(true)}
            >
              <AppIcon name="eye" className="size-4" />
              Preview
            </Button>
          ) : null}
          <Button
            type="button"
            variant={value ? "outline" : "default"}
            className="h-9 rounded-xl"
            onClick={() => inputRef.current?.click()}
          >
            <AppIcon name="upload" className="size-4" />
            {value ? "Replace" : "Choose PDF"}
          </Button>
          {value ? (
            <Button type="button" variant="ghost" size="icon-sm" className="rounded-xl" onClick={handleRemove}>
              <AppIcon name="trash" className="size-4" />
              <span className="sr-only">Remove document</span>
            </Button>
          ) : null}
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[min(calc(100vw-2rem),64rem)]">
          <DialogHeader>
            <DialogTitle>{value?.name ?? "PDF Preview"}</DialogTitle>
          </DialogHeader>
          {previewUrl ? (
            <iframe
              title="PDF preview"
              src={previewUrl}
              className="h-[min(72vh,46rem)] w-full rounded-xl border border-border bg-background"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
