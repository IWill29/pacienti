/**
 * Regression tests for clinical fact invention leaks.
 * Tests prefixed REGRESSION assert safe behavior and FAIL on current code.
 */
import { describe, expect, it } from "vitest";

import {
  assemblePirmreizejaisSummary,
  assembleProtokolsSummary,
} from "@/lib/assemble-summary";
import { serializePirmreizejaisPacients } from "@/lib/form-serialize";
import { parrunatsArPacientuDefault } from "@/lib/gender-phrases";
import { PIRMREIZEJAIS_PHRASE_BANK } from "@/lib/summary-prompts-phrases";
import { validateSummaryOutput } from "@/lib/summary-validate";
import { emptyPirmreizejaisPacients } from "@/lib/types/forms";

const MINIMAL_EMPTY_FORM_SERIALIZED = [
  "PIRMREIZĒJĀ KONSULTĀCIJA",
  "VĀRDS UZVĀRDS: Testa Pacients",
  "DZEMDĪBAS: —",
  "DZEMDĪBU PATOLOĢIJA: —",
  "AGRĪNĀ ATTĪSTĪBA: —",
  "GIMENĒ PSIHISKAS SASLIMŠANAS: —",
  "BLAKUS SASLIMŠANAS: —",
  "LIETOTIE MEDIKAMENTI: NAV",
  "SOMATISKI: —",
  "NEIROLOĢISKI: —",
].join("\n");

describe("clinical invention leaks — validateSummaryOutput gaps", () => {
  it("REGRESSION: rejects invented anamnēze when form anamnēze fields are empty (—)", () => {
    const summary =
      "Anamnēze no pacienta: Dzimis ar ķeizargriezienu. Agrīnā attīstība ar būtiskām novirzēm. Bērnudārzu apmeklēja.";

    const result = validateSummaryOutput(
      "pirmreizejais",
      MINIMAL_EMPTY_FORM_SERIALIZED,
      summary,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.violations.some((v) => v.toLowerCase().includes("anamn")),
      ).toBe(true);
    }
  });

  it("REGRESSION: rejects invented psihiskais stāvoklis when form mental-status fields are empty", () => {
    const summary =
      "Psihiskais stāvoklis: Pie apziņas. Pareizi orientēts visos veidos. Garastāvoklis pazemināts. Suicidālas domas noliedz.";

    const result = validateSummaryOutput(
      "pirmreizejais",
      MINIMAL_EMPTY_FORM_SERIALIZED,
      summary,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.violations.some((v) =>
          v.toLowerCase().includes("psihisk"),
        ),
      ).toBe(true);
    }
  });

  it("REGRESSION: rejects invented family psychiatric history when form says GIMENĒ PSIHISKAS SASLIMŠANAS: NAV", () => {
    const serialized = MINIMAL_EMPTY_FORM_SERIALIZED.replace(
      "GIMENĒ PSIHISKAS SASLIMŠANAS: —",
      "GIMENĒ PSIHISKAS SASLIMŠANAS: NAV",
    );
    const summary =
      "Anamnēze no pacienta: Ģimenē ir schizofrēnija un depresija.";

    const result = validateSummaryOutput("pirmreizejais", serialized, summary);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.violations.some((v) =>
          v.toLowerCase().includes("ģimen"),
        ),
      ).toBe(true);
    }
  });

  it("REGRESSION: rejects invented medications when LIETOTIE MEDIKAMENTI: NAV", () => {
    const serialized = `${MINIMAL_EMPTY_FORM_SERIALIZED}\nLIETOTIE MEDIKAMENTI: NAV`;
    const summary =
      "Lietotie medikamenti: Escitalopram 10 mg dienā, Quetiapine vakarā.";

    const result = validateSummaryOutput("pirmreizejais", serialized, summary);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.violations.some((v) =>
          v.toLowerCase().includes("medikament"),
        ),
      ).toBe(true);
    }
  });

  it("REGRESSION: rejects somatiski/neirologiski sections when form fields are empty (—)", () => {
    const summary = [
      "Somatiski: bez akūtas patoloģijas.",
      "Neiroloģiski: Bez akūtas CNS perēkļu simptomātikas.",
    ].join("\n");

    const result = validateSummaryOutput(
      "pirmreizejais",
      MINIMAL_EMPTY_FORM_SERIALIZED,
      summary,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations.length).toBeGreaterThan(0);
    }
  });

  it("REGRESSION: rejects invented protokols diagnoze when XI DIAGNOZE is —", () => {
    const serialized = "XI DIAGNOZE: —\nII Īsa anamnēze/katamnēze: —";
    const summary = "Diagnoze: F20.0 Paranoid schizophrenia";

    const result = validateSummaryOutput("protokols", serialized, summary);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.violations.some((v) =>
          v.toLowerCase().includes("diagnoze"),
        ),
      ).toBe(true);
    }
  });

});

describe("clinical invention leaks — serialization and prompt phrase bank", () => {
  it("REGRESSION: empty PĀRRUNĀTS serializes as — without default counseling", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      pacientaVardsUzvards: "Testa Pacients",
      pacientaDzimums: "virietis" as const,
      piezimes: {
        ...emptyPirmreizejaisPacients().piezimes,
        parrunats: "",
      },
    };

    const serialized = serializePirmreizejaisPacients(data);
    const defaultText = parrunatsArPacientuDefault("virietis");

    expect(serialized).toContain("PĀRRUNĀTS AR PACIENTU: —");
    expect(serialized).not.toContain(defaultText);
    expect(serialized).not.toContain("miega higiēna");
  });

  it("REGRESSION: unmarked dzemdību patoloģija serializes as —", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      pacientaVardsUzvards: "Testa Pacients",
      dzemdibuPatologija: "neatzime" as const,
    };

    const serialized = serializePirmreizejaisPacients(data);

    expect(serialized).toContain("DZEMDĪBU PATOLOĢIJA: —");
    expect(serialized).not.toContain("bez zināmiem sarežģījumiem");
  });

  it("REGRESSION: phrase bank has no fill-when-unmarked defaults", () => {
    expect(PIRMREIZEJAIS_PHRASE_BANK).not.toContain(
      "DZEMDĪBU PATOLOĢIJA neatzīmē",
    );
    expect(PIRMREIZEJAIS_PHRASE_BANK).not.toContain("Noklusējumi");
    expect(PIRMREIZEJAIS_PHRASE_BANK).not.toContain("miega higiēna");
  });

  it("REGRESSION: assembled summary from AI JSON should not include sections for empty (—) form fields", () => {
    const aiJson = {
      pacientaVardsUzvards: "Testa Pacients",
      personasKods: null,
      konsultacijasDatums: null,
      vizitesIemesls: null,
      anamneze: ["Dzimis ar ķeizargriezienu."],
      psihoaktivasVielas: null,
      citasSaslimbas: null,
      lietotieMedikamenti: "Escitalopram 10 mg",
      galvasTraumas: null,
      neiroinfekcijas: null,
      alergijas: null,
      psihiskaisStavoklis: ["Pie apziņas."],
      somatiski: "bez akūtas patoloģijas",
      neirologiski: "Bez akūtas CNS perēkļu simptomātikas",
      phq9: null,
      gad7: null,
      parrunatsArPacientu: parrunatsArPacientuDefault("virietis"),
      diagnoze: "F41.2",
      taktika: null,
    };

    const summary = assemblePirmreizejaisSummary(aiJson);
    const validation = validateSummaryOutput(
      "pirmreizejais",
      MINIMAL_EMPTY_FORM_SERIALIZED,
      summary,
    );

    expect(validation.ok).toBe(false);
  });
});

describe("clinical invention leaks — partial form edge cases", () => {
  const SINGLE_ANAMNEZE_FIELD_SERIALIZED = [
    "DZEMDĪBAS: dabīgās dzemdībās",
    "DZEMDĪBU PATOLOĢIJA: —",
    "AGRĪNĀ ATTĪSTĪBA: —",
    "GIMENĒ PSIHISKAS SASLIMŠANAS: —",
    "BLAKUS SASLIMŠANAS: —",
    "LIETOTIE MEDIKAMENTI: NAV",
    "SOMATISKI: —",
    "NEIROLOĢISKI: —",
  ].join("\n");

  it("allows anamnēze matching the single filled form field", () => {
    const summary = "Anamnēze no pacienta: Dzimis dabīgās dzemdībās.";

    expect(
      validateSummaryOutput(
        "pirmreizejais",
        SINGLE_ANAMNEZE_FIELD_SERIALIZED,
        summary,
      ).ok,
    ).toBe(true);
  });

  it("allows anamnēze when only dzemdības is marked in serialized form", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      pacientaDzimums: "virietis" as const,
      pacientaVardsUzvards: "Testa Pacients",
      dzemdibasVeids: "dabigas" as const,
    };

    const serialized = serializePirmreizejaisPacients(data);
    const summary = "Anamnēze no pacienta: Dzimis dabīgās dzemdībās.";

    expect(
      validateSummaryOutput("pirmreizejais", serialized, summary).ok,
    ).toBe(true);
  });

  it("accepts summary without Lietotie medikamenti when form says NAV", () => {
    const summary = "Testa Pacients";

    expect(
      validateSummaryOutput(
        "pirmreizejais",
        MINIMAL_EMPTY_FORM_SERIALIZED,
        summary,
      ).ok,
    ).toBe(true);
  });

  it("accepts protokols summary without Diagnoze when XI DIAGNOZE is —", () => {
    const serialized =
      "II Īsa anamnēze/katamnēze: —\nXI DIAGNOZE: —\n1. Apziņa: skaidra";
    const summary = "Psihiskais stāvoklis: skaidra.";

    expect(
      validateSummaryOutput("protokols", serialized, summary).ok,
    ).toBe(true);
  });

  it("assembled protokols summary omits Diagnoze when JSON diagnoze is null", () => {
    const summary = assembleProtokolsSummary({
      apskatesDatums: null,
      anamneze: null,
      psihoaktivasVielas: null,
      psihiskaisStavoklis: ["skaidra."],
      somatiski: null,
      neirologiski: null,
      diagnoze: null,
      parrunatsArPacientu: null,
      taktika: null,
    });

    expect(summary).not.toMatch(/Diagnoze:/i);

    const validation = validateSummaryOutput(
      "protokols",
      "XI DIAGNOZE: —\nII Īsa anamnēze/katamnēze: —\n1. Apziņa: skaidra",
      summary,
    );
    expect(validation.ok).toBe(true);
  });
});
