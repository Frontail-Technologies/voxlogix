"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  ImageAssetValue,
  UploadAssetContext,
} from "@/features/uploads/api/upload.types";
import { isPendingImageAsset } from "@/features/uploads/api/upload.types";
import { cn } from "@/lib/utils";

type AssetUploadPanelProps = {
  title: string;
  subtitle?: string;
  buttonLabel: string;
  folder: string;
  context: UploadAssetContext;
  fileName?: string;
  previewType?: "avatar" | "image";
  previewUrl?: string;
  initials?: string;
  value?: ImageAssetValue | null;
  onChange?: (value: ImageAssetValue | null) => void;
  className?: string;
};

export function AssetUploadPanel({
  title,
  subtitle,
  buttonLabel,
  folder: _folder,
  context,
  fileName,
  previewType = "avatar",
  previewUrl: fallbackPreviewUrl,
  initials = "VX",
  value,
  onChange,
  className,
}: AssetUploadPanelProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrl = value?.secureUrl ?? value?.url ?? fallbackPreviewUrl ?? null;
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (isPendingImageAsset(value)) {
        URL.revokeObjectURL(value.url);
      }
    };
  }, [value]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    if (isPendingImageAsset(value)) {
      URL.revokeObjectURL(value.url);
    }

    const objectUrl = URL.createObjectURL(file);
    onChange?.({
      provider: "local",
      key: `${_folder ? `${_folder}/` : ""}${context}-${fileName ?? file.name}`,
      url: objectUrl,
      secureUrl: objectUrl,
      mimeType: file.type,
      bytes: file.size,
      file,
    });
    toast.success("Image selected. Save to upload it.");
    event.target.value = "";
  }

  function handleRemove() {
    if (isPendingImageAsset(value)) {
      URL.revokeObjectURL(value.url);
    }
    onChange?.(null);
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border bg-secondary/70 p-4 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {previewType === "avatar" ? (
          <EntityAvatar
            initials={initials}
            imageUrl={previewUrl ?? undefined}
            className="size-14"
            fallbackClassName="text-base"
          />
        ) : (
          <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-border bg-background">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={title}
                className="size-full object-cover"
              />
            ) : (
              <AppIcon name="image" className="size-7 text-muted-foreground" />
            )}
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
          {isPendingImageAsset(value) ? (
            <p className="mt-2 truncate text-[11px] text-muted-foreground/90">
              {value.file.name}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 md:justify-end">
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => inputRef.current?.click()}
        >
          <AppIcon name="upload" className="size-4" />
          {value ? "Change Image" : buttonLabel}
        </Button>
        {previewUrl ? (
          <Button
            type="button"
          variant="ghost"
            className="rounded-xl text-muted-foreground hover:text-foreground"
            onClick={() => setPreviewOpen(true)}
          >
            <AppIcon name="eye" className="size-4" />
            Preview
          </Button>
        ) : null}
        {value ? (
          <Button
            type="button"
          variant="ghost"
            className="rounded-xl text-muted-foreground hover:text-foreground"
            onClick={handleRemove}
          >
            <AppIcon name="trash" className="size-4" />
            Remove
          </Button>
        ) : null}
      </div>

      {previewUrl ? (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="flex max-h-[70vh] items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
