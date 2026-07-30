"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import {
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
} from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addLogAttachment, useCreateLog } from "@/features/logs/api/log.mutations";
import type { ExtractedLogFields } from "@/features/logs/api/ai.types";
import { useUploadAudioAsset, useUploadImageAsset } from "@/features/uploads/api/upload.mutations";
import type { EquipmentListItem } from "@/features/admin-equipment/api/equipment.types";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

type PhotoSlotKey = "before" | "after" | "other";

const PHOTO_SLOTS: { key: PhotoSlotKey; label: string }[] = [
  { key: "before", label: "Before" },
  { key: "after", label: "After" },
  { key: "other", label: "Other" },
];

type PhotoSlotState = {
  file: File;
  previewUrl: string;
};

type LocationState = {
  latitude: number;
  longitude: number;
  address: string;
} | null;

type AttachmentsLocationStepProps = {
  equipment: EquipmentListItem;
  moduleId: string;
  moduleType: string;
  transcript: string;
  voiceDurationSeconds: number;
  voiceAudioBlob: Blob | null;
  extractedFields: ExtractedLogFields;
  onSubmit: (logId: string | null) => void;
  onBack: () => void;
};

function deriveTitle(equipmentName: string) {
  return `${equipmentName} log`;
}

export function AttachmentsLocationStep({
  equipment,
  moduleId,
  moduleType,
  transcript,
  voiceDurationSeconds,
  voiceAudioBlob,
  extractedFields,
  onSubmit,
  onBack,
}: AttachmentsLocationStepProps) {
  const createMutation = useCreateLog();
  const uploadMutation = useUploadImageAsset();
  const audioUploadMutation = useUploadAudioAsset();
  const [photos, setPhotos] = useState<Partial<Record<PhotoSlotKey, PhotoSlotState>>>({});
  const [location, setLocation] = useState<LocationState>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<Partial<Record<PhotoSlotKey, HTMLInputElement | null>>>({});

  function handleFileSelect(slot: PhotoSlotKey, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }

    setPhotos((current) => {
      const existing = current[slot];
      if (existing) URL.revokeObjectURL(existing.previewUrl);
      return { ...current, [slot]: { file, previewUrl: URL.createObjectURL(file) } };
    });
  }

  function removePhoto(slot: PhotoSlotKey) {
    setPhotos((current) => {
      const existing = current[slot];
      if (existing) URL.revokeObjectURL(existing.previewUrl);
      const next = { ...current };
      delete next[slot];
      return next;
    });
  }

  function captureLocation() {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported in this browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: "",
        });
        setIsLocating(false);
      },
      (error) => {
        setLocationError(error.message || "Could not capture your location.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function submitLog(status: "SUBMITTED" | "DRAFT") {
    setIsSubmitting(true);

    try {
      let voiceRecordingUrl: string | null = null;
      let voiceRecordingKey: string | null = null;

      if (voiceAudioBlob) {
        try {
          const uploadedAudio = await audioUploadMutation.mutateAsync({
            file: new File([voiceAudioBlob], `voice-${Date.now()}.webm`, { type: voiceAudioBlob.type || "audio/webm" }),
            folder: "logs",
            fileName: `voice-${Date.now()}`,
            context: "voice-recording",
          });
          voiceRecordingUrl = uploadedAudio.data?.secureUrl || uploadedAudio.data?.url || null;
          voiceRecordingKey = uploadedAudio.data?.key || null;
        } catch {
          // Voice recording upload failures should never block log submission.
        }
      }

      const response = await createMutation.mutateAsync({
        moduleId,
        equipmentId: equipment.id,
        moduleType,
        title: deriveTitle(equipment.name),
        description: transcript,
        transcript,
        voiceDurationSeconds,
        voiceRecordingUrl,
        voiceRecordingKey,
        status,
        aiProcessed: true,
        extractedFields,
        capturedLatitude: location?.latitude ?? null,
        capturedLongitude: location?.longitude ?? null,
        capturedAddress: location?.address || null,
      });

      const logId = response.data?.id;

      if (logId) {
        const uploads = PHOTO_SLOTS.filter((slot) => photos[slot.key]).map(async (slot) => {
          const photo = photos[slot.key];
          if (!photo) return;

          const uploaded = await uploadMutation.mutateAsync({
            file: photo.file,
            folder: "logs",
            fileName: `${slot.key}-${photo.file.name}`,
            context: "log-attachment",
          });

          if (uploaded.data) {
            await addLogAttachment(logId, {
              url: uploaded.data.secureUrl || uploaded.data.url,
              key: uploaded.data.key,
              fileName: photo.file.name,
              mimeType: uploaded.data.mimeType,
              label: slot.label,
            });
          }
        });

        await Promise.all(uploads);
      }

      toast.success(status === "DRAFT" ? "Draft saved" : "Log submitted");
      onSubmit(logId ?? null);
    } catch (error) {
      showApiErrorToast(error, status === "DRAFT" ? "Could not save draft" : "Could not submit log");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardCard>
      <CardHeader className="border-b border-border/70 px-4 py-3 sm:px-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <AppIcon name="image" className="size-5" />
          </div>
          <div>
            <CardTitle>Media &amp; Location</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-40 pt-4 sm:px-5">
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-foreground">Photos</h3>
            <span className="text-xs text-muted-foreground">
              {Object.keys(photos).length} of {PHOTO_SLOTS.length} attached
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {PHOTO_SLOTS.map((slot) => {
              const photo = photos[slot.key];

              return (
                <div key={slot.key} className="space-y-2">
                  <input
                    ref={(element) => {
                      inputRefs.current[slot.key] = element;
                    }}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(event) => handleFileSelect(slot.key, event)}
                  />
                  {photo ? (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.previewUrl} alt={slot.label} className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(slot.key)}
                        className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm backdrop-blur hover:text-destructive"
                      >
                        <AppIcon name="trash" className="size-3.5" />
                      </button>
                      <span className="absolute bottom-2 left-2 rounded-md bg-background/90 px-2 py-0.5 text-xs font-medium text-foreground">
                        {slot.label}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => inputRefs.current[slot.key]?.click()}
                      className={cn(
                        "flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/6 hover:text-foreground",
                      )}
                    >
                      <div className="flex size-11 items-center justify-center rounded-xl bg-background shadow-sm">
                        <AppIcon name="upload" className="size-5" />
                      </div>
                      <span className="text-xs font-medium">{slot.label}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Location</h3>
          {location ? (
            <div className="grid gap-4 rounded-2xl border border-border bg-background p-3 sm:p-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
              <div className="relative min-h-44 overflow-hidden rounded-2xl border border-border bg-secondary">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,hsl(var(--border))_25px,transparent_26px),linear-gradient(0deg,transparent_24px,hsl(var(--border))_25px,transparent_26px)] bg-[size:52px_52px] opacity-35" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-chart-4/12" />
                <div className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                  <AppIcon name="planet" className="size-7" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-border bg-secondary/40 px-3 py-2">
                    <p className="text-xs text-muted-foreground">Latitude</p>
                    <p className="mt-1 font-medium text-foreground">{location.latitude.toFixed(6)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/40 px-3 py-2">
                    <p className="text-xs text-muted-foreground">Longitude</p>
                    <p className="mt-1 font-medium text-foreground">{location.longitude.toFixed(6)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address (optional)</Label>
                  <Input
                    value={location.address}
                    onChange={(event) => setLocation((current) => (current ? { ...current, address: event.target.value } : current))}
                    placeholder="Add a description of this location"
                    className="h-11 rounded-xl bg-secondary/70"
                  />
                </div>
                <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={captureLocation} disabled={isLocating}>
                  <AppIcon name="planet" className="size-4" />
                  {isLocating ? "Capturing..." : "Recapture Location"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-2xl border-2 border-dashed border-border bg-secondary/40 p-5">
              <div className="flex size-12 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
                <AppIcon name="planet" className="size-6" />
              </div>
              <p className="text-sm text-muted-foreground">
                Capture the current site location for traceability.
              </p>
              <Button type="button" variant="outline" className="rounded-xl" onClick={captureLocation} disabled={isLocating}>
                <AppIcon name="planet" className="size-4" />
                {isLocating ? "Capturing..." : "Capture Current Location"}
              </Button>
              {locationError ? <p className="text-xs text-destructive">{locationError}</p> : null}
            </div>
          )}
        </section>

        <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-3 border-t border-border bg-card/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between md:left-(--sidebar-width) lg:px-8">
          <div>
            <p className="text-sm font-semibold text-foreground">Ready to submit?</p>
          </div>
          <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="rounded-xl"
            onClick={() => void submitLog("SUBMITTED")}
            disabled={isSubmitting}
          >
            <AppIcon name="status" className="size-4" />
            {isSubmitting ? "Submitting..." : "Submit Log"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => void submitLog("DRAFT")}
            disabled={isSubmitting}
          >
            Save Draft
          </Button>
          <Button type="button" variant="ghost" className="rounded-xl" onClick={onBack} disabled={isSubmitting}>
            Back
          </Button>
          </div>
        </div>
      </CardContent>
    </DashboardCard>
  );
}
