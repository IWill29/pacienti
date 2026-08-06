import { describe, expect, it } from "vitest";

import {
  assemblePirmreizejaisSummary,
  assembleProtokolsSummary,
} from "@/lib/assemble-summary";

describe("assemblePirmreizejaisSummary", () => {
  it("assembles sections in doctor template order with proper labels", () => {
    const text = assemblePirmreizejaisSummary({
      pacientaVardsUzvards: "Jānis Bērziņš",
      personasKods: "010101-12345",
      konsultacijasDatums: "05.08.2026",
      vizitesIemesls: ["Pie psihiatra pirmo reizi dzīvē."],
      anamneze: [
        "Dzimis dabīgās dzemdībās.",
        "Agrīnā attīstība bez būtiskām novirzēm.",
      ],
      psihoaktivasVielas: ["Alkoholu nelieto."],
      citasSaslimbas: null,
      lietotieMedikamenti: null,
      galvasTraumas: "pirms 10 gadiem",
      neiroinfekcijas: null,
      alergijas: "Noliedz",
      psihiskaisStavoklis: [
        "Pie apziņas.",
        "Pareizi orientēts visos veidos.",
      ],
      somatiski: "bez akūtas patoloģijas.",
      neirologiski: "Bez akūtas CNS perēkļu simptomātikas.",
      phq9: "12",
      gad7: "8",
      parrunatsArPacientu:
        "Ar pacientu pārrunāta miega higiēna, izskaidrotas rekomendācijas.",
      taktika: [
        "Atrasties psihiatra uzraudzībā!",
        "Psiholoģisks atbalsts.",
      ],
    });

    expect(text).toMatch(/^Jānis Bērziņš 010101-12345/);
    expect(text).toContain("Pirmreizēja konsultācija 05.08.2026.");
    expect(text).toContain(
      "**Vizītes iemesls:** Pie psihiatra pirmo reizi dzīvē.",
    );
    expect(text).toContain(
      "**Anamnēze no pacienta:** Dzimis dabīgās dzemdībās. Agrīnā attīstība bez būtiskām novirzēm.",
    );
    expect(text).toContain("**Galvas traumas**- pirms 10 gadiem");
    expect(text).toContain("**PHQ9**- 12; **GAD7**- 8");
    expect(text).toContain("**Taktika:**");
    expect(text).toContain("1. Atrasties psihiatra uzraudzībā!");
    expect(text).toContain("2. Psiholoģisks atbalsts.");
    expect(text).toMatch(
      /Pirmreizēja konsultācija 05\.08\.2026\.\n\n\*\*Vizītes iemesls:\*\*/,
    );
  });
});

describe("assembleProtokolsSummary", () => {
  it("assembles protokols sections with diagnoze", () => {
    const text = assembleProtokolsSummary({
      apskatesDatums: "05.08.2026",
      anamneze: ["Pacients ziņo par bezmiegu."],
      psihoaktivasVielas: null,
      psihiskaisStavoklis: ["Apziņa skaidra."],
      somatiski: "bez akūtas patoloģijas.",
      neirologiski: null,
      diagnoze: "F41.2 Trauksme ar depresiju",
      parrunatsArPacientu: null,
      taktika: ["Turpināt ambulatoro ārstēšanu."],
    });

    expect(text).toContain("Psihiatriskā apskate 05.08.2026");
    expect(text).toContain("**Diagnoze:** F41.2 Trauksme ar depresiju");
    expect(text).toContain("1. Turpināt ambulatoro ārstēšanu.");
  });
});
