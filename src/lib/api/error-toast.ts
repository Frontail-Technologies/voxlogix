import { toast } from "sonner";

import { ApiClientError } from "@/lib/api/types";

function fieldLabel(field?: string) {
  if (!field) return "";

  return field
    .replace(/\.(\d+)\./g, " $1 ")
    .replace(/[._-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeMessage(message: string) {
  const minLengthMatch = message.match(/Too small: expected string to have >=(\d+) characters/);

  if (minLengthMatch) {
    return `Must be at least ${minLengthMatch[1]} characters`;
  }

  const maxLengthMatch = message.match(/Too big: expected string to have <=(\d+) characters/);

  if (maxLengthMatch) {
    return `Must be at most ${maxLengthMatch[1]} characters`;
  }

  return message;
}

function validationDescription(error: ApiClientError) {
  return error.errors
    .map((item) => {
      const label = fieldLabel(item.field);
      const message = normalizeMessage(item.message);

      return label ? `${label}: ${message}` : message;
    })
    .join("\n");
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiClientError && error.errors.length) {
    return validationDescription(error);
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function showApiErrorToast(error: unknown, fallback: string) {
  if (error instanceof ApiClientError && error.errors.length) {
    toast.error(error.message || fallback, {
      description: validationDescription(error),
    });
    return;
  }

  toast.error(getApiErrorMessage(error, fallback));
}
