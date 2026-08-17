import { describe, expect, it } from "vitest";

import { assembleCanonicalSummary } from "@/lib/canonical-summary";
import { serializePirmreizejaisPacients } from "@/lib/form-serialize";
import { validateSummaryOutput } from "@/lib/summary-validate";
import { emptyPirmreizejaisPacients } from "@/lib/types/forms";

describe("assembleCanonicalSummary", () => {
  it("builds a grounded pirmreizējais summary from filled form fields only", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      pacientaVardsUzvards: "Testa Pacients",
      personasKods: "010101-12345",
      vizitesDatums: "05.08.2026",
      dzemdibasVeids: "dabigas" as const,
      apzina: "skaidra" as const,
      blakusSaslimibas: "ir" as const,
      lietotasMedikamenti: "ir" as const,
      piezimes: {
        ...emptyPirmreizejaisPacients().piezimes,
        lietotasMedikamenti: "Tab. Sertraline 50mg",
        blakusSaslimibas: "HIV",
      },
    };

    const serialized = serializePirmreizejaisPacients(data);
    const summary = assembleCanonicalSummary("pirmreizejais", serialized);

    expect(summary).toContain("Testa Pacients");
    expect(summary).toContain("Dzimis dabīgās dzemdībās");
    expect(summary).toContain("Pie apziņas");
    expect(summary).toContain("HIV");
    expect(summary).toContain("Tab. Sertraline 50mg");
    expect(summary).not.toMatch(/F\d{2}/);
    expect(summary).not.toContain("miega higiēna");
    expect(
      validateSummaryOutput("pirmreizejais", serialized, summary).ok,
    ).toBe(true);
  });

  it("omits empty and NAV sections so the doctor still gets a usable note", () => {
    const serialized = [
      "VĀRDS UZVĀRDS: Testa Pacients",
      "BLAKUS SASLIMŠANAS: IR (piez.: HIV)",
      "LIETOTIE MEDIKAMENTI: NAV",
      "DZEMDĪBAS: —",
      "SOMATISKI: —",
      "PĀRRUNĀTS AR PACIENTU: —",
    ].join("\n");

    const summary = assembleCanonicalSummary("pirmreizejais", serialized);

    expect(summary).toContain("Testa Pacients");
    expect(summary).toContain("HIV");
    expect(summary).not.toContain("Escitalopram");
    expect(summary).not.toMatch(/Diagnoze:/i);
    expect(summary).not.toContain("miega higiēna");
    expect(
      validateSummaryOutput("pirmreizejais", serialized, summary).ok,
    ).toBe(true);
  });
});
