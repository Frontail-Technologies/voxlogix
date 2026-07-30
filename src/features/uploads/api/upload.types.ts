export type UploadAssetContext =
  | "company-logo"
  | "admin-avatar"
  | "module-media"
  | "generic-image"
  | "log-attachment"
  | "voice-recording";

export type UploadImagePayload = {
  file: File;
  folder?: string;
  fileName?: string;
  context?: UploadAssetContext;
};

export type UploadedAsset = {
  provider: "cloudinary" | "s3";
  key: string;
  url: string;
  secureUrl: string;
  mimeType: string;
  bytes: number;
  width?: number | null;
  height?: number | null;
  format?: string | null;
};

export type PendingImageAsset = {
  provider: "local";
  key: string;
  url: string;
  secureUrl: string;
  mimeType: string;
  bytes: number;
  file: File;
};

export type ImageAssetValue = UploadedAsset | PendingImageAsset;

export function isPendingImageAsset(
  asset?: ImageAssetValue | null,
): asset is PendingImageAsset {
  return Boolean(asset && "file" in asset);
}

export type DeleteAssetPayload = {
  key: string;
};

export type SignedUploadPayload = {
  fileName: string;
  contentType: string;
  folder?: string;
  context?: UploadAssetContext;
};

export type SignedUploadResult = {
  provider: "cloudinary" | "s3";
  key: string;
  uploadUrl: string;
  publicUrl: string;
  expiresInSeconds: number;
  method: "PUT";
  headers: Record<string, string>;
};
