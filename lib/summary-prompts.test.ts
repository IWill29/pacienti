import { describe, expect, it } from "vitest";

import { getSummaryPrompt } from "@/lib/summary-prompts";

describe("getSummaryPrompt", () => {
  it("requests structured JSON output for pirmreizejais", () => {
    const prompt = getSummaryPrompt("pirmreizejais");

    expect(prompt).toContain("JSON objektu");
    expect(prompt).toContain("pacientaVardsUzvards");
    expect(prompt).toContain("anamneze");
    expect(prompt).toContain("NEKAD neizdomā faktus");
    expect(prompt).not.toContain("Aleksandrs Stoikevics");
    expect(prompt).toContain("ŠABLONA FRĀZES");
    expect(prompt).toContain("Dzimis dabīgās dzemdībās");
  });

  it("requests structured JSON output for protokols", () => {
    const prompt = getSummaryPrompt("protokols");

    expect(prompt).toContain("JSON objektu");
    expect(prompt).toContain("diagnoze");
    expect(prompt).toContain("apskatesDatums");
    expect(prompt).toContain("NEKAD neizdomā faktus");
  });

  it("requires sentence arrays with periods", () => {
    const prompt = getSummaryPrompt("pirmreizejais");

    expect(prompt).toContain("beidzas ar punktu");
    expect(prompt).toContain("NEUZRAKSTI gala dokumentu");
  });
});
