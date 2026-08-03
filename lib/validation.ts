import type { FormType } from "@/lib/types/forms";
import {
  serializePirmreizejaisPacients,
  serializeProtokols,
} from "@/lib/form-serialize";
import type {
  PirmreizejaisPacientsData,
  ProtokolsData,
} from "@/lib/types/forms";

const MAX_FORM_JSON_LENGTH = 50_000;

export type ValidationResult =
  | { ok: true; formType: FormType; serialized: string }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasAnyValue(value: unknown): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.some(hasAnyValue);
  }

  if (isRecord(value)) {
    return Object.values(value).some(hasAnyValue);
  }

  return false;
}

export function validateSummaryRequest(body: unknown): ValidationResult {
  if (!isRecord(body)) {
    return { ok: false, error: "Invalid request" };
  }

  const { formType, formData } = body;

  if (formType !== "pirmreizejais" && formType !== "protokols") {
    return { ok: false, error: "Invalid form type" };
  }

  if (!isRecord(formData)) {
    return { ok: false, error: "Invalid form data" };
  }

  const jsonLength = JSON.stringify(formData).length;

  if (jsonLength > MAX_FORM_JSON_LENGTH) {
    return { ok: false, error: "Input too long" };
  }

  if (!hasAnyValue(formData)) {
    return { ok: false, error: "Empty input" };
  }

  if (formType === "pirmreizejais") {
    return {
      ok: true,
      formType,
      serialized: serializePirmreizejaisPacients(
        formData as unknown as PirmreizejaisPacientsData,
      ),
    };
  }

  return {
    ok: true,
    formType,
    serialized: serializeProtokols(formData as unknown as ProtokolsData),
  };
}

/** @deprecated Legacy single-field validation kept for compatibility. */
export function validatePatientInfo(input: unknown): ValidationResult {
  if (typeof input !== "string") {
    return { ok: false, error: "Invalid input" };
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return { ok: false, error: "Empty input" };
  }

  if (trimmed.length > 10_000) {
    return { ok: false, error: "Input too long" };
  }

  return { ok: true, formType: "pirmreizejais", serialized: trimmed };
}
