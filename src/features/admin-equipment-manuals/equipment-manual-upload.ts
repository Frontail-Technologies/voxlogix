import { ApiClientError } from "@/lib/api/types";

export const EQUIPMENT_MANUAL_MAX_FILE_SIZE_MB = 10;

export function equipmentManualUploadError(error: unknown) {
  if (error instanceof ApiClientError) {
    if (error.status === 413 || error.message.toLowerCase().includes("10 mb")) {
      return "PDF must be 10 MB or smaller.";
    }

    if (error.status === 503) {
      return "Storage unavailable. Please try again.";
    }

    if (error.status >= 500) {
      return "Could not save manual. Please try again.";
    }

    return error.message;
  }

  if (error instanceof TypeError) {
    return "Upload failed. The server could not receive the PDF. Please try again.";
  }

  return "Could not save manual. Please try again.";
}
