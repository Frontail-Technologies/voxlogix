"use client";

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CardContent, DashboardCard } from "@/components/common/dashboard-ui";
import { FormActionBar } from "@/components/common/form-action-bar";
import { FormField as Field } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateEquipment,
  useUpdateEquipment,
} from "@/features/admin-equipment/api/equipment.mutations";
import type { EquipmentPayload } from "@/features/admin-equipment/api/equipment.types";
import {
  dateInputValue,
  equipmentCriticalities,
  equipmentInitials,
  equipmentStatuses,
  optionValueOrFallback,
} from "@/features/admin-equipment/equipment.presentation";
import {
  useEquipmentCategoriesList,
  useLocationsList,
} from "@/features/admin-master-data/api/master-data.queries";
import type { LocationItem } from "@/features/admin-master-data/api/master-data.types";
import type { ImageAssetValue } from "@/features/uploads/api/upload.types";
import { isPendingImageAsset } from "@/features/uploads/api/upload.types";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { buildMultipartPayload } from "@/lib/api/multipart";
import {
  blurActiveElement,
  clearFieldError,
  focusFirstError,
  hasFieldErrors,
  isFormDirty,
  readFormValues,
  validateRequiredFields,
  type FieldErrors,
  type FormValues,
} from "@/lib/forms/form-state";

import { EquipmentImagePicker } from "./equipment-image-picker";

export type EquipmentFormValues = {
  locationId?: string | null;
  equipmentCode?: string;
  imageUrl?: string | null;
  name?: string;
  section?: string;
  subLocation?: string;
  category?: string;
  makeBrand?: string | null;
  modelNumber?: string | null;
  commissionedAt?: string | null;
  criticality?: string;
  notes?: string | null;
  status?: string;
  latitude?: string | null;
  longitude?: string | null;
  mapUrl?: string | null;
};

type EquipmentFormProps = {
  mode: "create" | "edit";
  equipmentId?: string;
  values?: EquipmentFormValues;
};

export function EquipmentForm({ mode, equipmentId, values }: EquipmentFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const createMutation = useCreateEquipment();
  const updateMutation = useUpdateEquipment(equipmentId ?? "");
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const categoriesQuery = useEquipmentCategoriesList({ limit: 100, status: "ACTIVE" });
  const locationsQuery = useLocationsList({ limit: 100, status: "ACTIVE" });
  const equipmentCategoryOptions = useMemo(() => categoriesQuery.data?.data ?? [], [categoriesQuery.data?.data]);
  const locationOptions = useMemo(() => locationsQuery.data?.data ?? [], [locationsQuery.data?.data]);
  const [imageAsset, setImageAsset] = useState<ImageAssetValue | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState(values?.locationId ?? "");
  const [section, setSection] = useState(values?.section ?? "");
  const [subLocation, setSubLocation] = useState(values?.subLocation ?? "");
  const [latitude, setLatitude] = useState(values?.latitude ?? "");
  const [longitude, setLongitude] = useState(values?.longitude ?? "");
  const [mapUrl, setMapUrl] = useState(values?.mapUrl ?? "");

  const uploadFileName = useMemo(
    () =>
      (values?.name ?? values?.equipmentCode)
        ?.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    [values?.equipmentCode, values?.name],
  );

  const sectionOptions = useMemo(() => uniqueValues(locationOptions.map((location) => location.section)), [locationOptions]);
  const filteredLocations = useMemo(
    () => locationOptions.filter((location) => location.section === section),
    [locationOptions, section],
  );
  const selectedLocation = useMemo(
    () => locationOptions.find((location) => location.id === selectedLocationId) ?? findLocationByText(locationOptions, section, subLocation),
    [locationOptions, section, selectedLocationId, subLocation],
  );
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const initialValues = useMemo<FormValues>(() => ({
    equipmentCode: values?.equipmentCode ?? "",
    name: values?.name ?? "",
    locationId: values?.locationId ?? "",
    section: values?.section ?? "",
    subLocation: values?.subLocation ?? "",
    latitude: values?.latitude ?? "",
    longitude: values?.longitude ?? "",
    mapUrl: values?.mapUrl ?? "",
    category: values?.category ?? "",
    criticality: values?.criticality ?? "MEDIUM",
    status: values?.status ?? "ACTIVE",
    makeBrand: values?.makeBrand ?? "",
    modelNumber: values?.modelNumber ?? "",
    commissionedAt: dateInputValue(values?.commissionedAt) ?? "",
    notes: values?.notes ?? "",
    imageUrl: values?.imageUrl ?? "",
  }), [values?.category, values?.commissionedAt, values?.criticality, values?.equipmentCode, values?.imageUrl, values?.latitude, values?.locationId, values?.longitude, values?.makeBrand, values?.mapUrl, values?.modelNumber, values?.name, values?.notes, values?.section, values?.status, values?.subLocation]);
  const [currentValues, setCurrentValues] = useState<FormValues>(initialValues);
  const isDirty = !isEdit || isFormDirty(initialValues, currentValues);
  const createReady = Boolean(currentValues.equipmentCode)
    && Boolean(currentValues.name)
    && Boolean(currentValues.section)
    && Boolean(currentValues.subLocation)
    && Boolean(currentValues.category)
    && Boolean(currentValues.criticality)
    && Boolean(currentValues.status);
  const submitDisabled = !isDirty || !createReady || hasFieldErrors(errors);

  function handleFormChange(event: ChangeEvent<HTMLFormElement>) {
    const fieldName = (event.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).name;
    if (fieldName) setErrors((current) => clearFieldError(current, fieldName));
    setCurrentValues(readFormValues(event.currentTarget, {
      locationId: selectedLocation?.id ?? selectedLocationId,
      section,
      subLocation,
      latitude,
      longitude,
      mapUrl,
      imageUrl: equipmentImageValue(imageAsset, values),
    }));
  }

  function handleSectionChange(nextSection: string | null) {
    if (!nextSection) return;
    setSection(nextSection);
    const firstLocation = locationOptions.find((location) => location.section === nextSection);
    setSelectedLocationId(firstLocation?.id ?? "");
    setSubLocation(firstLocation?.subLocation ?? "");
    setErrors((current) => clearFieldError(clearFieldError(current, "section"), "subLocation"));
    setCurrentValues((current) => ({ ...current, section: nextSection, subLocation: firstLocation?.subLocation ?? "", locationId: firstLocation?.id ?? "" }));
  }

  function handleSubLocationChange(locationId: string | null) {
    if (!locationId) return;
    const location = locationOptions.find((item) => item.id === locationId);
    setSelectedLocationId(location?.id ?? "");
    setSection(location?.section ?? section);
    setSubLocation(location?.subLocation ?? "");
    setErrors((current) => clearFieldError(current, "subLocation"));
    setCurrentValues((current) => ({ ...current, locationId: location?.id ?? "", section: location?.section ?? section, subLocation: location?.subLocation ?? "" }));
  }

  function handleMapUrlChange(nextMapUrl: string) {
    setMapUrl(nextMapUrl);
    const coordinates = parseCoordinates(nextMapUrl);
    if (coordinates) {
      setLatitude(coordinates.latitude);
      setLongitude(coordinates.longitude);
    }
    setCurrentValues((current) => ({
      ...current,
      mapUrl: nextMapUrl,
      latitude: coordinates?.latitude ?? latitude,
      longitude: coordinates?.longitude ?? longitude,
    }));
  }

  function syncMapFromCoordinates() {
    if (latitude && longitude && !mapUrl) {
      const nextMapUrl = buildGoogleMapUrl(latitude, longitude);
      setMapUrl(nextMapUrl);
      setCurrentValues((current) => ({ ...current, mapUrl: nextMapUrl }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    blurActiveElement();
    const formData = new FormData(event.currentTarget);
    const formValues = readFormValues(event.currentTarget, {
      locationId: selectedLocation?.id ?? selectedLocationId,
      section,
      subLocation,
      latitude,
      longitude,
      mapUrl,
    });
    const nextErrors = validateRequiredFields(formValues, [
      { key: "equipmentCode", label: "Equipment ID" },
      { key: "name", label: "Equipment name" },
      { key: "section", label: "Section" },
      { key: "subLocation", label: "Sub location" },
      { key: "category", label: "Equipment category" },
      { key: "criticality", label: "Criticality" },
      { key: "status", label: "Status" },
    ]);
    if (hasFieldErrors(nextErrors)) {
      setErrors(nextErrors);
      focusFirstError(event.currentTarget, nextErrors);
      return;
    }
    const equipmentCode = stringValue(formData, "equipmentCode");
    const name = stringValue(formData, "name");
    const payload: EquipmentPayload = {
      locationId: selectedLocation?.id ?? null,
      equipmentCode,
      name,
      category: stringValue(formData, "category") || "Equipment",
      section,
      subLocation,
      criticality: stringValue(formData, "criticality") || "MEDIUM",
      status: stringValue(formData, "status") || "ACTIVE",
      makeBrand: nullableValue(formData, "makeBrand"),
      modelNumber: nullableValue(formData, "modelNumber"),
      commissionedAt: nullableValue(formData, "commissionedAt"),
      imageUrl: isPendingImageAsset(imageAsset) ? values?.imageUrl ?? null : imageAsset?.secureUrl ?? imageAsset?.url ?? values?.imageUrl ?? null,
      latitude: latitude || null,
      longitude: longitude || null,
      mapUrl: mapUrl || null,
      notes: nullableValue(formData, "notes"),
    };

    try {
      if (isEdit && equipmentId) {
        await updateMutation.mutateAsync(buildMultipartPayload(payload, isPendingImageAsset(imageAsset) ? imageAsset.file : null));
        toast.success("Equipment updated");
        router.push(`/admin/equipment/${equipmentId}`);
      } else {
        const response = await createMutation.mutateAsync(buildMultipartPayload(payload, isPendingImageAsset(imageAsset) ? imageAsset.file : null));
        toast.success("Equipment created");
        router.push(response.data?.id ? `/admin/equipment/${response.data.id}` : "/admin/equipment");
      }
    } catch (error) {
      showApiErrorToast(error, "Could not save equipment");
    }
  }

  return (
    <DashboardCard>
      <CardContent className="p-4 sm:p-6">
        <form ref={formRef} className="space-y-8 pb-36" onSubmit={handleSubmit} onChange={handleFormChange} noValidate>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <Field label="Equipment Image">
                <EquipmentImagePicker
                  title={values?.name ?? "Equipment image"}
                  initials={equipmentInitials(values?.name, values?.equipmentCode)}
                  imageUrl={values?.imageUrl}
                  fileName={uploadFileName}
                  value={imageAsset}
                  onChange={(asset) => { setImageAsset(asset); setCurrentValues((current) => ({ ...current, imageUrl: equipmentImageValue(asset, values) })); }}
                />
              </Field>
            </div>

            <Field label="Equipment ID" fieldName="equipmentCode" error={errors.equipmentCode}>
              <Input name="equipmentCode" defaultValue={values?.equipmentCode} placeholder="EQP-0012" className="h-11 rounded-xl bg-secondary/70" aria-invalid={Boolean(errors.equipmentCode)} />
            </Field>

            <Field label="Equipment Name" fieldName="name" error={errors.name}>
              <Input name="name" defaultValue={values?.name} placeholder="Hydraulic Excavator" className="h-11 rounded-xl bg-secondary/70" aria-invalid={Boolean(errors.name)} />
            </Field>

            <Field label="Section" fieldName="section" error={errors.section}>
              <Select value={section} onValueChange={handleSectionChange} disabled={!sectionOptions.length} required>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70" aria-invalid={Boolean(errors.section)}>
                  <SelectValue placeholder={locationsQuery.isLoading ? "Loading sections..." : "Select section"} />
                </SelectTrigger>
                <SelectContent>
                  {sectionOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Sub Location" fieldName="subLocation" error={errors.subLocation}>
              <Select value={selectedLocation?.id ?? selectedLocationId} onValueChange={handleSubLocationChange} disabled={!filteredLocations.length} required>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70" aria-invalid={Boolean(errors.subLocation)}>
                  <SelectValue placeholder={section ? "Select sub location" : "Select section first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.subLocation}{location.department ? ` - ${location.department}` : ""}{location.shiftDetails ? ` (${location.shiftDetails})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Latitude">
              <Input name="latitude" value={latitude} placeholder="25.204849" className="h-11 rounded-xl bg-secondary/70" onChange={(event) => { setLatitude(event.target.value); setCurrentValues((current) => ({ ...current, latitude: event.target.value })); }} onBlur={syncMapFromCoordinates} />
            </Field>

            <Field label="Longitude">
              <Input name="longitude" value={longitude} placeholder="55.270783" className="h-11 rounded-xl bg-secondary/70" onChange={(event) => { setLongitude(event.target.value); setCurrentValues((current) => ({ ...current, longitude: event.target.value })); }} onBlur={syncMapFromCoordinates} />
            </Field>

            <Field label="Google Map Link" className="lg:col-span-2">
              <Input name="mapUrl" value={mapUrl} placeholder="https://maps.google.com/?q=25.204849,55.270783" className="h-11 rounded-xl bg-secondary/70" onChange={(event) => handleMapUrlChange(event.target.value)} />
            </Field>

            <Field label="Equipment Category" fieldName="category" error={errors.category}>
              <Select name="category" defaultValue={values?.category ?? equipmentCategoryOptions[0]?.name}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70" aria-invalid={Boolean(errors.category)}><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {equipmentCategoryOptions.map((category) => <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Criticality" fieldName="criticality" error={errors.criticality}>
              <Select name="criticality" defaultValue={optionValueOrFallback(values?.criticality, equipmentCriticalities, "MEDIUM")}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70" aria-invalid={Boolean(errors.criticality)}><SelectValue placeholder="Select criticality" /></SelectTrigger>
                <SelectContent>
                  {equipmentCriticalities.map((criticality) => <SelectItem key={criticality.value} value={criticality.value}>{criticality.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Make / Brand">
              <Input name="makeBrand" defaultValue={values?.makeBrand ?? undefined} placeholder="Kirloskar" className="h-11 rounded-xl bg-secondary/70" />
            </Field>

            <Field label="Model Number">
              <Input name="modelNumber" defaultValue={values?.modelNumber ?? undefined} placeholder="KBL-450" className="h-11 rounded-xl bg-secondary/70" />
            </Field>

            <Field label="Commissioned Date">
              <Input name="commissionedAt" type="date" defaultValue={dateInputValue(values?.commissionedAt)} className="h-11 rounded-xl bg-secondary/70" />
            </Field>

            <Field label="Status" fieldName="status" error={errors.status}>
              <Select name="status" defaultValue={optionValueOrFallback(values?.status, equipmentStatuses, "ACTIVE")}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70" aria-invalid={Boolean(errors.status)}><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  {equipmentStatuses.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Notes" className="lg:col-span-2">
              <Textarea name="notes" defaultValue={values?.notes ?? undefined} placeholder="Internal notes about this equipment" className="min-h-24 rounded-xl bg-secondary/70" />
            </Field>
          </div>

          <FormActionBar cancelHref={equipmentId ? `/admin/equipment/${equipmentId}` : "/admin/equipment"} submitLabel={isEdit ? "Update Equipment" : "Add Equipment"} submitIcon={isEdit ? "settings" : "plus"} isSubmitting={isSubmitting} submitDisabled={submitDisabled} />
        </form>
      </CardContent>
    </DashboardCard>
  );
}

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function nullableValue(formData: FormData, key: string) {
  const value = stringValue(formData, key);
  return value || null;
}

function uniqueValues(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function findLocationByText(locations: LocationItem[], section: string, subLocation: string) {
  return locations.find((location) => location.section === section && location.subLocation === subLocation);
}

function parseCoordinates(value: string) {
  const match = value.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  return { latitude: match[1], longitude: match[2] };
}

function buildGoogleMapUrl(latitude: string, longitude: string) {
  return `https://maps.google.com/?q=${latitude},${longitude}`;
}

function equipmentImageValue(asset: ImageAssetValue | null, values?: EquipmentFormValues) {
  return isPendingImageAsset(asset)
    ? values?.imageUrl ?? ""
    : asset?.secureUrl ?? asset?.url ?? values?.imageUrl ?? "";
}


