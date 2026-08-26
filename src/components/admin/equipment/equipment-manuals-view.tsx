"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import { DocumentUploadPanel } from "@/components/common/document-upload-panel";
import {
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
  DashboardPageHeader,
  StatusBadge,
} from "@/components/common/dashboard-ui";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { FormField } from "@/components/common/form-field";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEquipmentList } from "@/features/admin-equipment/api/equipment.queries";
import {
  useCreateEquipmentManual,
  useDeleteEquipmentManual,
} from "@/features/admin-equipment-manuals/api/equipment-manual.mutations";
import { useEquipmentManualsList } from "@/features/admin-equipment-manuals/api/equipment-manual.queries";
import type { EquipmentManualListItem } from "@/features/admin-equipment-manuals/api/equipment-manual.types";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { buildMultipartPayload } from "@/lib/api/multipart";
import {
  blurActiveElement,
  clearFieldError,
  focusFirstError,
  hasFieldErrors,
  type FieldErrors,
} from "@/lib/forms/form-state";
import { cn } from "@/lib/utils";

export function EquipmentManualsView() {
  const searchParams = useSearchParams();
  const requestedEquipmentId = searchParams.get("equipmentId") ?? "";
  const isEquipmentScoped = Boolean(requestedEquipmentId);
  const [equipmentId, setEquipmentId] = useState(() => requestedEquipmentId);
  const [search, setSearch] = useState("");
  const equipmentQuery = useEquipmentList({ page: 1, limit: 100 });
  const equipment = useMemo(() => equipmentQuery.data?.data ?? [], [equipmentQuery.data?.data]);
  const selectedEquipmentId = requestedEquipmentId || equipmentId;
  const manualsQuery = useEquipmentManualsList({
    page: 1,
    limit: 100,
    search,
    equipmentId: selectedEquipmentId || undefined,
  });
  const manuals = manualsQuery.data?.data ?? [];
  const selectedEquipment = useMemo(
    () => equipment.find((item) => item.id === selectedEquipmentId),
    [equipment, selectedEquipmentId],
  );
  const hasProcessingManual = manuals.some((manual) => manual.status === "PROCESSING");

  useEffect(() => {
    if (!hasProcessingManual) return;
    const interval = window.setInterval(() => {
      void manualsQuery.refetch();
    }, 2500);
    return () => window.clearInterval(interval);
  }, [hasProcessingManual, manualsQuery]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <DashboardPageHeader
        title="Equipment Manuals"
        description={isEquipmentScoped && selectedEquipment ? `${selectedEquipment.equipmentCode} - ${selectedEquipment.name}` : "Upload PDF references and store reusable context for AI equipment answers."}
        action={
          <Link href="/admin/equipment" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
            <AppIcon name="equipment" className="size-4" />
            Equipment
          </Link>
        }
      />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <ManualForm
          equipment={equipment}
          selectedEquipmentId={selectedEquipmentId}
          selectedEquipment={selectedEquipment}
          isEquipmentScoped={isEquipmentScoped}
          onEquipmentChange={setEquipmentId}
        />

        <UploadedManualsPanel
          manuals={manuals}
          isLoading={manualsQuery.isLoading}
          isError={manualsQuery.isError}
          search={search}
          onSearchChange={setSearch}
          equipmentLabel={selectedEquipment ? `${selectedEquipment.equipmentCode} - ${selectedEquipment.name}` : "Selected equipment"}
        />
      </div>
    </div>
  );
}

function ManualForm({
  equipment,
  selectedEquipmentId,
  selectedEquipment,
  isEquipmentScoped,
  onEquipmentChange,
}: {
  equipment: Array<{ id: string; equipmentCode: string; name: string }>;
  selectedEquipmentId: string;
  selectedEquipment?: { id: string; equipmentCode: string; name: string };
  isEquipmentScoped: boolean;
  onEquipmentChange: (equipmentId: string) => void;
}) {
  const createMutation = useCreateEquipmentManual();
  const [title, setTitle] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [manualText, setManualText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const manualTitle = title.trim() || (selectedEquipment ? `${selectedEquipment.name} Manual` : "");
  const canSubmit = Boolean(selectedEquipmentId && manualTitle && (file || manualUrl.trim() || manualText.trim()));
  const selectedEquipmentLabel = selectedEquipment
    ? `${selectedEquipment.equipmentCode} - ${selectedEquipment.name}`
    : "Select equipment";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    blurActiveElement();
    const nextErrors: FieldErrors = {};
    if (!selectedEquipmentId) nextErrors.equipmentId = "Select equipment.";
    if (!manualTitle) nextErrors.title = "Manual title is required.";
    if (!file && !manualUrl.trim() && !manualText.trim()) {
      nextErrors.manualSource = "Upload a PDF, add a manual URL, or paste context text.";
    }
    if (hasFieldErrors(nextErrors)) {
      setErrors(nextErrors);
      focusFirstError(event.currentTarget, nextErrors);
      return;
    }

    try {
      await createMutation.mutateAsync(buildMultipartPayload({
        equipmentId: selectedEquipmentId,
        title: manualTitle,
        manualUrl: manualUrl.trim() || null,
        manualText: manualText.trim() || null,
      }, file));
      toast.success(manualText.trim() ? "Manual context saved" : "Manual uploaded. AI context will be prepared in the background.");
      setTitle("");
      setManualUrl("");
      setManualText("");
      setFile(null);
      setErrors({});
    } catch (error) {
      showApiErrorToast(error, "Could not save equipment manual");
    }
  }

  return (
    <DashboardCard>
      <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
        <CardTitle>Add Manual Context</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-5 sm:pb-5">
        <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
          <FormField label="Equipment" fieldName="equipmentId" error={errors.equipmentId}>
            {isEquipmentScoped ? (
              <div className="flex h-11 items-center rounded-xl border border-input bg-secondary/50 px-3 text-sm text-foreground">
                {selectedEquipmentLabel}
              </div>
            ) : (
              <Select value={selectedEquipmentId} onValueChange={(value) => {
                if (!value) return;
                onEquipmentChange(value);
                setErrors((current) => clearFieldError(current, "equipmentId"));
              }}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
                  <span className={cn("truncate text-sm", !selectedEquipment && "text-muted-foreground")}>
                    {selectedEquipmentLabel}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {equipment.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.equipmentCode} - {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField label="Manual Title" fieldName="title" error={errors.title}>
            <Input
              name="title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setErrors((current) => clearFieldError(current, "title"));
              }}
              placeholder={selectedEquipment ? `${selectedEquipment.name} Manual` : "Equipment operator manual"}
              className="h-11 rounded-xl bg-secondary/70"
              aria-invalid={Boolean(errors.title)}
            />
          </FormField>

          <FormField label="Manual URL" className="lg:col-span-2" fieldName="manualSource" error={errors.manualSource}>
            <Input
              name="manualSource"
              value={manualUrl}
              onChange={(event) => {
                setManualUrl(event.target.value);
                setErrors((current) => clearFieldError(current, "manualSource"));
              }}
              placeholder="https://..."
              className="h-11 rounded-xl bg-secondary/70"
              aria-invalid={Boolean(errors.manualSource)}
            />
          </FormField>

          <div className="lg:col-span-2">
            <DocumentUploadPanel
              title="PDF Manual"
              subtitle="Upload a source PDF. Context is prepared in the background if no text is pasted below."
              value={file}
              onChange={(nextFile) => {
                setFile(nextFile);
                setErrors((current) => clearFieldError(current, "manualSource"));
              }}
            />
          </div>

          <Field label="Manual Context" className="lg:col-span-2">
            <Textarea
              value={manualText}
              onChange={(event) => {
                setManualText(event.target.value);
                setErrors((current) => clearFieldError(current, "manualSource"));
              }}
              placeholder="Optional: paste extracted manual text for best AI answers. If empty, a background context seed will be created from the stored manual reference."
              className="min-h-36 rounded-xl bg-secondary/70 leading-6"
            />
          </Field>

          <div className="flex flex-wrap items-center gap-2 lg:col-span-2">
            <Button type="submit" className="h-10 rounded-xl" disabled={!canSubmit || createMutation.isPending || hasFieldErrors(errors)}>
              <AppIcon name="plus" className="size-4" />
              {createMutation.isPending ? "Saving..." : "Save Manual"}
            </Button>
            <p className="text-xs text-muted-foreground">
              AI uses saved context for fast equipment answers.
            </p>
          </div>
        </form>
      </CardContent>
    </DashboardCard>
  );
}

function UploadedManualsPanel({
  manuals,
  isLoading,
  isError,
  search,
  onSearchChange,
  equipmentLabel,
}: {
  manuals: EquipmentManualListItem[];
  isLoading: boolean;
  isError: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  equipmentLabel: string;
}) {
  return (
    <DashboardCard className="xl:sticky xl:top-4">
      <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Uploaded Manuals</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">{equipmentLabel}</p>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {manuals.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4 sm:px-5 sm:pb-5">
        <ResponsiveSearchControl
          placeholder="Search manuals..."
          value={search}
          onChange={onSearchChange}
          desktopClassName="w-full"
        />

        {isLoading ? <p className="py-6 text-sm text-muted-foreground">Loading manuals...</p> : null}
        {isError ? <p className="py-6 text-sm text-muted-foreground">Could not load equipment manuals.</p> : null}
        {!isLoading && !isError && manuals.length ? (
          <div className="max-h-[calc(100vh-18rem)] space-y-3 overflow-y-auto pr-1">
            {manuals.map((manual) => <ManualCard key={manual.id} manual={manual} />)}
          </div>
        ) : null}
        {!isLoading && !isError && !manuals.length ? (
          <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-5 text-center text-sm text-muted-foreground">
            No manuals uploaded for this equipment yet.
          </div>
        ) : null}
      </CardContent>
    </DashboardCard>
  );
}

function ManualCard({ manual }: { manual: EquipmentManualListItem }) {
  const deleteMutation = useDeleteEquipmentManual();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const contextLength = manual.extractedTextLength;

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(manual.id);
      toast.success("Equipment manual deleted");
    } catch (error) {
      showApiErrorToast(error, "Could not delete equipment manual");
    }
  }

  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{manual.title}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{manualDisplayName(manual)}</p>
        </div>
        <StatusBadge status={manual.status} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <Meta label="Context" value={contextLength ? `${contextLength.toLocaleString()} chars` : "Preparing"} />
        <Meta label="Updated" value={formatDate(manual.updatedAt)} />
      </div>
      <div className="mt-3 flex items-center justify-end gap-1">
        {manual.fileUrl ? (
          <a
            href={manual.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Open manual"
            download={manualDownloadName(manual)}
          >
            <AppIcon name="download" className="size-4" />
          </a>
        ) : null}
        <button
          type="button"
          className="inline-flex size-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
          onClick={() => setDeleteDialogOpen(true)}
          aria-label="Delete manual"
        >
          <AppIcon name="trash" className="size-4" />
        </button>
      </div>
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete equipment manual?"
        description={`This will remove ${manual.title} and clear it from AI context if it is the latest manual for this equipment.`}
        confirmLabel="Delete Manual"
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/50 px-2.5 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate font-medium text-foreground">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function manualDisplayName(manual: EquipmentManualListItem) {
  return manualDownloadName(manual) || manual.fileUrl || "Manual context only";
}

function manualDownloadName(manual: EquipmentManualListItem) {
  const name = manual.fileName?.trim();
  if (!name) return undefined;
  if (manual.mimeType === "application/pdf" && !name.toLowerCase().endsWith(".pdf")) {
    return `${name}.pdf`;
  }
  return name;
}
