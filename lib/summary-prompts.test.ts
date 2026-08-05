import { describe, expect, it } from "vitest";

import { getSummaryPrompt } from "@/lib/summary-prompts";

function extractTemplate(prompt: string): string {
  const startMarker = "--- FORMĀTA ŠABLONS ---";
  const endMarker = "--- ŠABLONA BEIGAS ---";
  const start = prompt.indexOf(startMarker) + startMarker.length;
  const end = prompt.indexOf(endMarker);
  return prompt.slice(start, end);
}

describe("getSummaryPrompt", () => {
  it("uses format template without real patient facts for pirmreizejais", () => {
    const prompt = getSummaryPrompt("pirmreizejais");
    const template = extractTemplate(prompt);

    expect(template).toContain("Vizītes iemesls:");
    expect(template).toContain("Anamnēze no pacienta:");
    expect(template).toContain("Psihiskais stāvoklis:");
    expect(template).toContain("Taktika:");
    expect(template).toContain("[");
    expect(prompt).toContain("NEKAD neizdomā faktus");
    expect(prompt).not.toContain("Aleksandrs Stoikevics");
    expect(prompt).not.toContain("Sertraline");
    expect(prompt).not.toContain("ērču encefalīts");
  });

  it("requires doctor text only rewriting", () => {
    const prompt = getSummaryPrompt("pirmreizejais");

    expect(prompt).toContain("Drīksti tikai loģiski sakārtot un gramatiski labot");
    expect(prompt).toContain("Piezīmes iekļauj");
  });

  it("maps protokols to format template without invented names", () => {
    const prompt = getSummaryPrompt("protokols");

    expect(prompt).toContain("Diagnoze:");
    expect(prompt).toContain("NEKAD neizdomā faktus");
    expect(extractTemplate(prompt)).toContain("Psihiskais stāvoklis:");
  });
});
