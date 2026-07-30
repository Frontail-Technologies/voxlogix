import { useMutation } from "@tanstack/react-query";

import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type {
  DeleteAssetPayload,
  SignedUploadPayload,
  SignedUploadResult,
  UploadedAsset,
  UploadImagePayload,
} from "@/features/uploads/api/upload.types";

export async function uploadImageAsset(payload: UploadImagePayload) {
  const formData = new FormData();
  formData.append("file", payload.file);

  if (payload.folder) {
    formData.append("folder", payload.folder);
  }

  if (payload.fileName) {
    formData.append("fileName", payload.fileName);
  }

  if (payload.context) {
    formData.append("context", payload.context);
  }

  return apiRequest<UploadedAsset>(apiEndpoints.uploads.images, {
    method: "POST",
    body: formData,
  });
}

export async function uploadAudioAsset(payload: UploadImagePayload) {
  const formData = new FormData();
  formData.append("file", payload.file);

  if (payload.folder) {
    formData.append("folder", payload.folder);
  }

  if (payload.fileName) {
    formData.append("fileName", payload.fileName);
  }

  if (payload.context) {
    formData.append("context", payload.context);
  }

  return apiRequest<UploadedAsset>(apiEndpoints.uploads.audio, {
    method: "POST",
    body: formData,
  });
}

export async function deleteUploadedAsset(payload: DeleteAssetPayload) {
  return apiRequest<{ deleted: boolean; key: string; provider: string }>(
    apiEndpoints.uploads.assets,
    {
      method: "DELETE",
      body: payload,
    },
  );
}

export async function createSignedUpload(payload: SignedUploadPayload) {
  return apiRequest<SignedUploadResult>(apiEndpoints.uploads.signed, {
    method: "POST",
    body: payload,
  });
}

export function useUploadImageAsset() {
  return useMutation({
    mutationFn: uploadImageAsset,
  });
}

export function useUploadAudioAsset() {
  return useMutation({
    mutationFn: uploadAudioAsset,
  });
}

export function useDeleteUploadedAsset() {
  return useMutation({
    mutationFn: deleteUploadedAsset,
  });
}

export function useCreateSignedUpload() {
  return useMutation({
    mutationFn: createSignedUpload,
  });
}
