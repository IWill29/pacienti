import { describe, expect, it } from "vitest";

import { getSummaryPrompt } from "@/lib/summary-prompts";

describe("getSummaryPrompt", () => {
  it("includes shared example and no-invented-names rule for pirmreizejais", () => {
    const prompt = getSummaryPrompt("pirmreizejais");

    expect(prompt).toContain("Anamnēze no pacienta:");
    expect(prompt).toContain("NEKAD neizdomā pacienta vārdu");
    expect(prompt).toContain("Aleksandrs Stoikevics");
  });

  it("maps protokol fields to the same summary sections", () => {
    const prompt = getSummaryPrompt("protokols");

    expect(prompt).toContain("Psihiskais stāvoklis:");
    expect(prompt).toContain("Diagnoze:");
    expect(prompt).toContain("Taktika:");
    expect(prompt).toContain("NEKAD neizdomā pacienta vārdu");
  });
});
