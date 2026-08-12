import { describe, expect, it } from "vitest";

import { validateSummaryOutput } from "@/lib/summary-validate";

describe("validateSummaryOutput", () => {
  it("accepts summary that includes doctor piezīmes", () => {
    const serialized =
      "DZEMDĪBAS: dabīgās dzemdībās (piez.: bez komplikācijām)\nBLAKUS SASLIMŠANAS: IR (piez.: HIV)";

    expect(
      validateSummaryOutput(
        "pirmreizejais",
        serialized,
        "Anamnēze no pacienta: Dzimis dabīgās dzemdībās, bez komplikācijām.\nCitas saslimšanas: HIV",
      ).ok,
    ).toBe(true);
  });

  it("rejects missing doctor piezīme", () => {
    const serialized =
      "BLAKUS SASLIMŠANAS: IR (piez.: HIV)\nLIETOTIE MEDIKAMENTI: NAV";

    const result = validateSummaryOutput(
      "pirmreizejais",
      serialized,
      "Citas saslimšanas: PAH",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations.some((v) => v.includes("HIV"))).toBe(true);
    }
  });

  it("rejects format-template placeholders in summary", () => {
    const result = validateSummaryOutput(
      "pirmreizejais",
      "DZEMDĪBAS: dabīgās dzemdībās",
      "Anamnēze no pacienta: [dzemdības]",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain(
        "summary contains format-template placeholders",
      );
    }
  });

  it("rejects invented Diagnoze for pirmreizejais", () => {
    const result = validateSummaryOutput(
      "pirmreizejais",
      "DZEMDĪBAS: dabīgās dzemdībās",
      "Anamnēze no pacienta: Dzimis dabīgās dzemdībās.\nDiagnoze: F41.2",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain("invented Diagnoze section");
    }
  });

  it("requires pirmreizejais diagnoze from form when provided", () => {
    const serialized = "DIAGNOZE: F41.2 Trauksme ar depresiju";

    expect(
      validateSummaryOutput(
        "pirmreizejais",
        serialized,
        "Anamnēze no pacienta: bezmiegs.",
      ).ok,
    ).toBe(false);

    expect(
      validateSummaryOutput(
        "pirmreizejais",
        serialized,
        "Diagnoze: F41.2 Trauksme ar depresiju",
      ).ok,
    ).toBe(true);
  });

  it("requires protokols diagnoze from form", () => {
    const serialized = "XI DIAGNOZE: F41.2 Trauksme ar depresiju";

    expect(
      validateSummaryOutput(
        "protokols",
        serialized,
        "Psihiskais stāvoklis: nomākts.",
      ).ok,
    ).toBe(false);

    expect(
      validateSummaryOutput(
        "protokols",
        serialized,
        "Diagnoze: F41.2 Trauksme ar depresiju",
      ).ok,
    ).toBe(true);
  });

  it("requires Vizītes iemesls when form has it", () => {
    const serialized = "VIZĪTES IEMESLS: pirmo reizi dzīvē (piez.: bezmiegs)";

    const result = validateSummaryOutput(
      "pirmreizejais",
      serialized,
      "Anamnēze no pacienta: bezmiegs.",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain("missing Vizītes iemesls section");
    }
  });
});
