import { describe, expect, it } from "vitest";

import {
  parseSummaryJson,
  validateSummaryJsonStructure,
} from "@/lib/summary-schema";

describe("parseSummaryJson", () => {
  it("parses valid pirmreizejais JSON", () => {
    const json = parseSummaryJson(
      "pirmreizejais",
      JSON.stringify({
        pacientaVardsUzvards: "Test",
        personasKods: null,
        konsultacijasDatums: "01.01.2026",
        vizitesIemesls: null,
        anamneze: ["Dzimis dabīgās dzemdībās."],
        psihoaktivasVielas: null,
        citasSaslimbas: null,
        lietotieMedikamenti: null,
        galvasTraumas: null,
        neiroinfekcijas: null,
        alergijas: null,
        psihiskaisStavoklis: null,
        somatiski: null,
        neirologiski: null,
        phq9: null,
        gad7: null,
        parrunatsArPacientu: null,
        diagnoze: null,
        taktika: null,
      }),
    );

    expect(json).toMatchObject({
      pacientaVardsUzvards: "Test",
      anamneze: ["Dzimis dabīgās dzemdībās."],
    });
  });

  it("rejects invalid JSON", () => {
    expect(() => parseSummaryJson("pirmreizejais", "not json")).toThrow(
      "invalid JSON",
    );
  });

  it("strips markdown code fences", () => {
    const json = parseSummaryJson(
      "pirmreizejais",
      '```json\n{"pacientaVardsUzvards":null,"personasKods":null,"konsultacijasDatums":null,"vizitesIemesls":null,"anamneze":["Dzimis."],"psihoaktivasVielas":null,"citasSaslimbas":null,"lietotieMedikamenti":null,"galvasTraumas":null,"neiroinfekcijas":null,"alergijas":null,"psihiskaisStavoklis":null,"somatiski":null,"neirologiski":null,"phq9":null,"gad7":null,"parrunatsArPacientu":null,"diagnoze":null,"taktika":null}\n```',
    );

    expect(json.anamneze).toEqual(["Dzimis."]);
  });
});

describe("validateSummaryJsonStructure", () => {
  it("flags sentences without ending punctuation", () => {
    const json = parseSummaryJson(
      "pirmreizejais",
      JSON.stringify({
        pacientaVardsUzvards: null,
        personasKods: null,
        konsultacijasDatums: null,
        vizitesIemesls: null,
        anamneze: ["Dzimis dabīgās dzemdībās"],
        psihoaktivasVielas: null,
        citasSaslimbas: null,
        lietotieMedikamenti: null,
        galvasTraumas: null,
        neiroinfekcijas: null,
        alergijas: null,
        psihiskaisStavoklis: null,
        somatiski: null,
        neirologiski: null,
        phq9: null,
        gad7: null,
        parrunatsArPacientu: null,
        diagnoze: null,
        taktika: null,
      }),
    );

    const violations = validateSummaryJsonStructure("pirmreizejais", json);
    expect(violations.some((v) => v.includes("anamneze"))).toBe(true);
  });
});
