"use client";

import { AssetUploadPanel } from "@/components/common/asset-upload-panel";
import type { ImageAssetValue } from "@/features/uploads/api/upload.types";

export type EquipmentImagePickerProps = {
  title: string;
  initials: string;
  imageUrl?: string | null;
  fileName?: string;
  value?: ImageAssetValue | null;
  onChange: (value: ImageAssetValue | null) => void;
};

export function EquipmentImagePicker({
  title,
  initials,
  imageUrl,
  fileName,
  value,
  onChange,
}: EquipmentImagePickerProps) {
  return (
    <AssetUploadPanel
      title={title}
      subtitle="Choose an equipment image. It uploads only when the equipment is saved."
      buttonLabel={imageUrl || value ? "Change Image" : "Choose Image"}
      folder="equipment"
      context="generic-image"
      fileName={fileName}
      previewType="image"
      previewUrl={imageUrl ?? undefined}
      initials={initials}
      value={value}
      onChange={onChange}
    />
  );
}
