import { describe, expect, it } from "vitest";

import { emptyPirmreizejaisPacients } from "@/lib/types/forms";
import { validateSummaryRequest } from "@/lib/validation";

describe("validateSummaryRequest", () => {
  it("returns 400-equivalent error for non-object body", () => {
    expect(validateSummaryRequest(null).ok).toBe(false);
    expect(validateSummaryRequest("text").ok).toBe(false);
  });

  it("returns error for invalid form type", () => {
    expect(
      validateSummaryRequest({ formType: "invalid", formData: {} }).ok,
    ).toBe(false);
  });

  it("returns error for empty form data", () => {
    expect(
      validateSummaryRequest({
        formType: "pirmreizejais",
        formData: emptyPirmreizejaisPacients(),
      }).ok,
    ).toBe(false);
  });

  it("serializes pirmreizejais form when at least one field is filled", () => {
    const formData = {
      ...emptyPirmreizejaisPacients(),
      dzemdibasVeids: "dabigas" as const,
    };

    const result = validateSummaryRequest({
      formType: "pirmreizejais",
      formData,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.formType).toBe("pirmreizejais");
      expect(result.serialized).toContain("DABĪGAS");
    }
  });
});
