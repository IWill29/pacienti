import { describe, expect, it } from "vitest";

import { getSummaryPrompt } from "@/lib/summary-prompts";

function extractExample(prompt: string): string {
  const startMarker = "--- PARAUGS ---";
  const endMarker = "--- PARAUGA BEIGAS ---";
  const start = prompt.indexOf(startMarker) + startMarker.length;
  const end = prompt.indexOf(endMarker);
  return prompt.slice(start, end);
}

describe("getSummaryPrompt", () => {
  it("forbids clinical sections that pirmreizejais form does not collect", () => {
    const prompt = getSummaryPrompt("pirmreizejais");

    expect(prompt).toContain("NEIEKĻAUJ sadaļas, ko šī forma nesavāc");
    expect(prompt).toContain("Vizītes iemesls");
    expect(prompt).toContain("Psihiskais stāvoklis");
    expect(prompt).toContain("Diagnoze");
    expect(prompt).toContain("Taktika");
  });

  it("uses anamnesis-only example for pirmreizejais", () => {
    const example = extractExample(getSummaryPrompt("pirmreizejais"));

    expect(example).toContain("Anamnēze no pacienta:");
    expect(example).not.toContain("dabīgās dzemdībās");
    expect(example).not.toContain("Vizītes iemesls:");
    expect(example).not.toContain("Psihiskais stāvoklis:");
    expect(example).not.toContain("Diagnoze:");
    expect(example).not.toContain("Taktika:");
    expect(example).not.toContain("Aleksandrs Stoikevics");
    expect(example).toContain("Lietotie medikamenti:");
  });

  it("forbids inventing anamnesis facts for pirmreizejais", () => {
    const prompt = getSummaryPrompt("pirmreizejais");

    expect(prompt).toContain("NEKAD neizdomā anamnēzes faktus");
    expect(prompt).toContain("NEKAD nekopē faktus no parauga");
    expect(prompt).toContain('"Lietotie medikamenti:"');
    expect(prompt).toContain("no piezīmes");
    expect(prompt).toContain('nevis "pārslimots HIV"');
  });

  it("combines PAV, alcohol and self-harm into one Psihoaktīvo vielu lietošana section", () => {
    const prompt = getSummaryPrompt("pirmreizejais");
    const example = extractExample(prompt);

    expect(example).toContain("Psihoaktīvo vielu lietošana: Alkoholu lieto reti.");
    expect(example).not.toContain("kokaini dzērienus");
    expect(prompt).toContain("PSIHOAKTĪVO VIELU LIETOŠANA");
    expect(prompt).toContain("PAV LIETOŠANA");
    expect(prompt).toContain("SUICĪDS/ PAŠKAITĒJUMS ANAMN.");
    expect(prompt).toContain('NE "Lieto kokaini dzērienus"');
    expect(prompt).toContain('NEKOPĒ no parauga nevienu konkrētu vielu');
    expect(prompt).toContain(
      'paškaitējuma/suicīda anamnēzi NEIEKĻAUJ "Anamnēze no pacienta:"',
    );
  });

  it("maps dzemdības from form without copying example birth type", () => {
    const prompt = getSummaryPrompt("pirmreizejais");

    expect(prompt).toContain("DZEMDĪBAS");
    expect(prompt).toContain("NE \"dabīgās dzemdībās\"");
    expect(prompt).toContain('NE "ķeizargrieziens ceļā"');
    expect(prompt).toContain("dzimis ar akūtu ķeizargriezienu");
  });

  it("requires no invented patient names for both form types", () => {
    expect(getSummaryPrompt("pirmreizejais")).toContain(
      "NEKAD neizdomā pacienta vārdu",
    );
    expect(getSummaryPrompt("protokols")).toContain(
      "NEKAD neizdomā pacienta vārdu",
    );
  });

  it("maps protokol fields to full summary sections", () => {
    const prompt = getSummaryPrompt("protokols");

    expect(prompt).toContain("Psihiskais stāvoklis:");
    expect(prompt).toContain("Diagnoze:");
    expect(prompt).toContain("Taktika:");
    expect(extractExample(prompt)).toContain("Psihiskais stāvoklis:");
  });
});
