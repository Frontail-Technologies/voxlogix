export type FormPrimitive = string | number | boolean | null | undefined;
export type FormValue = FormPrimitive | FormValue[] | { [key: string]: FormValue };
export type FormValues = Record<string, FormValue>;
export type FieldErrors = Record<string, string>;

type RequiredField = {
  key: string;
  label: string;
};

export function blurActiveElement() {
  if (typeof document === "undefined") return;
  const activeElement = document.activeElement;
  if (activeElement instanceof HTMLElement) activeElement.blur();
}

export function readFormValues(form: HTMLFormElement, overrides: FormValues = {}) {
  const data = new FormData(form);
  const values: FormValues = {};

  for (const [key, value] of data.entries()) {
    if (typeof value !== "string") continue;
    if (key in values) {
      const existing = values[key];
      values[key] = Array.isArray(existing) ? [...existing, value] : [existing as FormPrimitive, value];
    } else {
      values[key] = value;
    }
  }

  return { ...values, ...overrides };
}

export function normalizeFormValue(value: FormValue): unknown {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.map((item) => normalizeFormValue(item));
  if (typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, unknown>>((current, key) => {
        current[key] = normalizeFormValue(value[key]);
        return current;
      }, {});
  }
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
  return value;
}

export function normalizeFormValues(values: FormValues) {
  return Object.keys(values)
    .sort()
    .reduce<Record<string, unknown>>((current, key) => {
      current[key] = normalizeFormValue(values[key]);
      return current;
    }, {});
}

export function areFormValuesEqual(first: FormValues, second: FormValues) {
  return stableStringify(normalizeFormValues(first)) === stableStringify(normalizeFormValues(second));
}

export function isFormDirty(initialValues: FormValues, currentValues: FormValues) {
  return !areFormValuesEqual(initialValues, currentValues);
}

export function validateRequiredFields(values: FormValues, fields: RequiredField[]) {
  return fields.reduce<FieldErrors>((errors, field) => {
    if (!hasMeaningfulValue(values[field.key])) {
      errors[field.key] = `${field.label} is required.`;
    }
    return errors;
  }, {});
}

export function hasFieldErrors(errors: FieldErrors) {
  return Object.keys(errors).length > 0;
}

export function clearFieldError(errors: FieldErrors, key: string) {
  if (!errors[key]) return errors;
  const nextErrors = { ...errors };
  delete nextErrors[key];
  return nextErrors;
}

export function focusFirstError(form: HTMLFormElement, errors: FieldErrors) {
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return;
  const field = form.elements.namedItem(firstKey);
  if (field instanceof HTMLElement) {
    field.focus();
    field.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const selector = `[data-field-name="${CSS.escape(firstKey)}"]`;
  const wrapper = form.querySelector<HTMLElement>(selector);
  wrapper?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function hasMeaningfulValue(value: FormValue) {
  if (Array.isArray(value)) return value.some(hasMeaningfulValue);
  if (typeof value === "object" && value !== null) return Object.values(value).some(hasMeaningfulValue);
  return normalizeFormValue(value) !== "";
}

function stableStringify(value: unknown) {
  return JSON.stringify(value);
}
