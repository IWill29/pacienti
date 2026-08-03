import { describe, expect, it } from "vitest";

import { sanitizeSummaryMarkdown } from "@/lib/sanitize-summary";

describe("sanitizeSummaryMarkdown", () => {
  it("removes markdown formatting while keeping text", () => {
    const input = "**Anamnēze no pacienta:** Dzimis *dabīgās* dzemdībās.";
    expect(sanitizeSummaryMarkdown(input)).toBe(
      "Anamnēze no pacienta: Dzimis dabīgās dzemdībās.",
    );
  });

  it("removes bullet list markers at line start", () => {
    const input = "- Psihiskais stāvoklis: norma";
    expect(sanitizeSummaryMarkdown(input)).toBe(
      "Psihiskais stāvoklis: norma",
    );
  });
});
