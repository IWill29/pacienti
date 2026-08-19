import { describe, expect, it } from "vitest";

import { assembleCanonicalSummary } from "@/lib/canonical-summary";
import {
  serializePirmreizejaisPacients,
  serializeProtokols,
} from "@/lib/form-serialize";
import { validateSummaryOutput } from "@/lib/summary-validate";
import { emptyPirmreizejaisPacients, emptyProtokols } from "@/lib/types/forms";

describe("assembleCanonicalSummary", () => {
  it("builds a grounded pirmreizējais summary from filled form fields only", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      pacientaDzimums: "virietis" as const,
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

  it("places sūdzības under Vizītes iemesls with Sakarā ar phrasing", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      pacientaVardsUzvards: "Testa Pacients",
      vizitesDatums: "05.08.2026",
      vizitesIemesls: "pirmo_reizi" as const,
      piezimes: {
        ...emptyPirmreizejaisPacients().piezimes,
        vizitesIemesls: "atnācis sievas pavadībā",
        sudzibas: "nespēku, motivācijas trūkumu, pazeminātu garastāvokli",
      },
    };

    const serialized = serializePirmreizejaisPacients(data);
    const summary = assembleCanonicalSummary("pirmreizejais", serialized);

    expect(summary).toMatch(/Vizītes iemesls:/i);
    expect(summary).toContain("atnācis sievas pavadībā");
    expect(summary).toContain(
      "Sakarā ar nespēku, motivācijas trūkumu, pazeminātu garastāvokli",
    );
    expect(summary).not.toMatch(/Psihiskais stāvoklis:/i);
    expect(
      validateSummaryOutput("pirmreizejais", serialized, summary).ok,
    ).toBe(true);
  });

  it("places only sūdzības under Vizītes iemesls without mental status section", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      pacientaVardsUzvards: "Testa Pacients",
      piezimes: {
        ...emptyPirmreizejaisPacients().piezimes,
        sudzibas: "trauksme, miega traucējumi",
      },
    };

    const serialized = serializePirmreizejaisPacients(data);
    const summary = assembleCanonicalSummary("pirmreizejais", serialized);

    expect(summary).toMatch(/Vizītes iemesls:/i);
    expect(summary).toContain("Sakarā ar trauksme, miega traucējumi");
    expect(summary).not.toMatch(/Psihiskais stāvoklis:/i);
    expect(
      validateSummaryOutput("pirmreizejais", serialized, summary).ok,
    ).toBe(true);
  });

  it("keeps mental exam findings under Psihiskais stāvoklis when both are filled", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      pacientaVardsUzvards: "Testa Pacients",
      apzina: "skaidra" as const,
      piezimes: {
        ...emptyPirmreizejaisPacients().piezimes,
        sudzibas: "bezmiegs",
      },
    };

    const serialized = serializePirmreizejaisPacients(data);
    const summary = assembleCanonicalSummary("pirmreizejais", serialized);

    expect(summary).toContain("Sakarā ar bezmiegs");
    expect(summary).toContain("Pie apziņas");
    expect(summary).toMatch(/Psihiskais stāvoklis:/i);
    expect(
      validateSummaryOutput("pirmreizejais", serialized, summary).ok,
    ).toBe(true);
  });
});

describe("assembleCanonicalSummary — protokols", () => {
  it("parses anamnēze from single-line II Īsa anamnēze/katamnēze field", () => {
    const data = {
      ...emptyProtokols(),
      anamneze: "Pacients pēdējās dienas nomākts, guvis slikti.",
      apzina: "netrauceta" as const,
    };

    const serialized = serializeProtokols(data);
    const summary = assembleCanonicalSummary("protokols", serialized);

    expect(serialized).toContain(
      "II Īsa anamnēze/katamnēze: Pacients pēdējās dienas nomākts, guvis slikti.",
    );
    expect(summary).toContain("Pacients pēdējās dienas nomākts, guvis slikti.");
    expect(
      validateSummaryOutput("protokols", serialized, summary).ok,
    ).toBe(true);
  });

  it("omits em-dash-only mental status and spurious stacionēts taktika", () => {
    const data = {
      ...emptyProtokols(),
      stacionets: "",
      nosutijumsNo: "",
      anamneze: "",
      apzina: "" as const,
      diagnoze: "",
      talakaTaktika: {
        ...emptyProtokols().talakaTaktika,
        ambulatori: false,
        psihiatraMotivets: false,
        stacionets: false,
        piemerotaIerobezosana: false,
        stacionešanaiPiekrīt: false,
        stacionešanaiNepiekrīt: false,
        mrpl: false,
        stpe: false,
        punkts1: false,
        punkts2: false,
      },
    };

    const serialized = serializeProtokols(data);
    const summary = assembleCanonicalSummary("protokols", serialized);

    expect(summary).not.toMatch(/Psihiskais stāvoklis:/i);
    expect(summary).not.toMatch(/Taktika:/i);
    expect(summary).not.toContain("—.");
    expect(
      validateSummaryOutput("protokols", serialized, summary).ok,
    ).toBe(true);
  });
});
