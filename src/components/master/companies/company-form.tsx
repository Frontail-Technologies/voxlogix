"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { showApiErrorToast } from "@/lib/api/error-toast";

import { AssetUploadPanel } from "@/components/common/asset-upload-panel";
import { CardContent, DashboardCard } from "@/components/common/dashboard-ui";
import { DatePickerField } from "@/components/common/date-picker-field";
import { FormActionBar } from "@/components/common/form-action-bar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCompany, useUpdateCompany } from "@/features/master-companies/api/company.mutations";
import type { CompanyPayload } from "@/features/master-companies/api/company.types";
import type { ImageAssetValue } from "@/features/uploads/api/upload.types";
import { isPendingImageAsset } from "@/features/uploads/api/upload.types";
import { buildMultipartPayload } from "@/lib/api/multipart";
import { cn } from "@/lib/utils";

export type CompanyFormValues = {
  companyName?: string;
  logo?: string | null;
  logoAsset?: ImageAssetValue | null;
  logoUrl?: string | null;
  logoKey?: string | null;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  businessType?: string;
  address?: string | null;
  planType?: string;
  status?: string;
  startDate?: string | null;
  expiryDate?: string | null;
  notes?: string | null;
};

type CompanyFormProps = {
  mode: "create" | "edit";
  companyId?: string;
  values?: CompanyFormValues;
};

const businessTypes = ["Manufacturing", "Maintenance Services", "Plant Operations", "Industrial Services", "Factory Operations"];
const plans = ["Demo", "Business", "Professional", "Enterprise"];
const statuses = ["ACTIVE", "DEMO", "INACTIVE", "SUSPENDED", "EXPIRED"];

export function CompanyForm({ mode, companyId, values }: CompanyFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany(companyId ?? "");
  const [logoAsset, setLogoAsset] = useState<ImageAssetValue | null>(() => values?.logoAsset ?? (values?.logoUrl ? { provider: "cloudinary", key: values.logoKey ?? values.logoUrl, url: values.logoUrl, secureUrl: values.logoUrl, mimeType: "image/*", bytes: 0 } : null));
  const uploadFileName = useMemo(() => values?.companyName?.trim().toLowerCase().replace(/\s+/g, "-"), [values?.companyName]);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const companyName = stringValue(formData, "companyName");
    const payload: CompanyPayload = {
      companyName,
      logo: (values?.logo ?? initials(companyName)).slice(0, 8),
      logoUrl: isPendingImageAsset(logoAsset) ? values?.logoUrl ?? null : logoAsset?.secureUrl ?? logoAsset?.url ?? null,
      logoKey: isPendingImageAsset(logoAsset) ? values?.logoKey ?? null : logoAsset?.key ?? null,
      ownerName: stringValue(formData, "ownerName"),
      ownerEmail: stringValue(formData, "ownerEmail"),
      ownerPhone: stringValue(formData, "ownerPhone"),
      businessType: stringValue(formData, "businessType"),
      planType: stringValue(formData, "planType"),
      status: stringValue(formData, "status"),
      startDate: optionalValue(formData, "startDate"),
      expiryDate: optionalValue(formData, "expiryDate"),
      address: optionalValue(formData, "address"),
      notes: optionalValue(formData, "notes"),
    };

    try {
      if (isEdit && companyId) {
        await updateMutation.mutateAsync(buildMultipartPayload(payload, isPendingImageAsset(logoAsset) ? logoAsset.file : null));
        toast.success("Company updated");
        router.push(`/master/companies/${companyId}`);
      } else {
        await createMutation.mutateAsync(buildMultipartPayload(payload, isPendingImageAsset(logoAsset) ? logoAsset.file : null));
        toast.success("Company created");
        router.push("/master/companies");
      }
    } catch (error) {
      showApiErrorToast(error, "Could not save company");
    }
  }

  return (
    <DashboardCard>
      <CardContent className="p-4 sm:p-6">
        <form className="space-y-8 pb-36" onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <Label>Company Logo</Label>
              <AssetUploadPanel className="mt-2" title={values?.companyName ?? "Company logo"} buttonLabel="Choose Logo" folder="companies" context="company-logo" fileName={uploadFileName} initials={values?.logo ?? "VX"} value={logoAsset} onChange={setLogoAsset} />
            </div>

            <Field label="Company Name"><Input name="companyName" defaultValue={values?.companyName} placeholder="Enter company name" className="h-11 rounded-xl bg-secondary/70" required /></Field>
            <Field label="Business Type"><Select name="businessType" defaultValue={values?.businessType ?? "Manufacturing"}><SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue placeholder="Select business type" /></SelectTrigger><SelectContent>{businessTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Owner Name"><Input name="ownerName" defaultValue={values?.ownerName} placeholder="Enter owner name" className="h-11 rounded-xl bg-secondary/70" required /></Field>
            <Field label="Owner Email"><Input name="ownerEmail" defaultValue={values?.ownerEmail} placeholder="owner@company.com" type="email" className="h-11 rounded-xl bg-secondary/70" required /></Field>
            <Field label="Owner Phone"><Input name="ownerPhone" defaultValue={values?.ownerPhone} placeholder="+91 98765 43210" className="h-11 rounded-xl bg-secondary/70" required /></Field>
            <Field label="Plan Type"><Select name="planType" defaultValue={values?.planType ?? "Professional"}><SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue placeholder="Select plan" /></SelectTrigger><SelectContent>{plans.map((plan) => <SelectItem key={plan} value={plan}>{plan}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Status"><Select name="status" defaultValue={values?.status ?? "ACTIVE"}><SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent>{statuses.map((status) => <SelectItem key={status} value={status}>{label(status)}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Start Date"><DatePickerField name="startDate" defaultValue={dateInput(values?.startDate)} placeholder="Select start date" /></Field>
            <Field label="Expiry Date"><DatePickerField name="expiryDate" defaultValue={dateInput(values?.expiryDate)} placeholder="Select expiry date" /></Field>
            <Field label="Address" className="lg:col-span-2"><Textarea name="address" defaultValue={values?.address ?? undefined} placeholder="Enter company address" className="min-h-24 rounded-xl bg-secondary/70" /></Field>
            <Field label="Notes" className="lg:col-span-2"><Textarea name="notes" defaultValue={values?.notes ?? undefined} placeholder="Internal notes for the Master team" className="min-h-24 rounded-xl bg-secondary/70" /></Field>
          </div>

          <FormActionBar cancelHref="/master/companies" submitLabel={isEdit ? "Update Company" : "Create Company"} submitIcon={isEdit ? "settings" : "plus"} isSubmitting={isSubmitting} />
        </form>
      </CardContent>
    </DashboardCard>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <div className={cn("space-y-2", className)}><Label>{label}</Label>{children}</div>;
}

function stringValue(formData: FormData, key: string) { return String(formData.get(key) ?? "").trim(); }
function optionalValue(formData: FormData, key: string) { const value = stringValue(formData, key); return value || undefined; }
function initials(value: string) { return value.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "VX"; }
function label(value: string) { return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); }
function dateInput(value?: string | null) { return value ? new Date(value).toISOString().slice(0, 10) : undefined; }


