export function buildMultipartPayload<TPayload extends object>(
  payload: TPayload,
  file?: File | null,
): TPayload | FormData {
  if (!file) {
    return payload;
  }

  const formData = new FormData();
  formData.append("payload", JSON.stringify(payload));
  formData.append("file", file);

  return formData;
}

