import { describe, expect, it } from "vitest";

import {
  serializePirmreizejaisPacients,
  serializeProtokols,
} from "@/lib/form-serialize";
import {
  emptyPirmreizejaisPacients,
  emptyProtokols,
} from "@/lib/types/forms";

describe("serializePirmreizejaisPacients", () => {
  it("includes patient identity and filled anamnesis with piezīmes", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      pacientaVardsUzvards: "Testa Pacients",
      personasKods: "010101-12345",
      vizitesDatums: "05.08.2026",
      dzemdibasVeids: "dabigas" as const,
      piezimes: {
        ...emptyPirmreizejaisPacients().piezimes,
        dzemdibasVeids: "bez komplikācijām",
      },
    };

    const serialized = serializePirmreizejaisPacients(data);

    expect(serialized).toContain("Testa Pacients");
    expect(serialized).toContain("010101-12345");
    expect(serialized).toContain("Dzimis dabīgās dzemdībās");
    expect(serialized).toContain("bez komplikācijām");
  });

  it("serializes feminine grammar when pacienta dzimums is sieviete", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      pacientaDzimums: "sieviete" as const,
      dzemdibasVeids: "dabigas" as const,
      sekmes: "videji" as const,
      orientacija: "pareizi" as const,
    };

    const serialized = serializePirmreizejaisPacients(data);

    expect(serialized).toContain("PACIENTA DZIMUMS: sieviete");
    expect(serialized).toContain("Dzimusi dabīgās dzemdībās");
    expect(serialized).toContain("mācījusies vidēji");
    expect(serialized).toContain("Pareizi orientēta visos veidos");
  });

  it("includes lietotie medikamenti with piezīme", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      lietotasMedikamenti: "ir" as const,
      piezimes: {
        ...emptyPirmreizejaisPacients().piezimes,
        lietotasMedikamenti: "Tab. Sertraline 50mg",
      },
    };

    const serialized = serializePirmreizejaisPacients(data);

    expect(serialized).toContain("LIETOTIE MEDIKAMENTI: IR");
    expect(serialized).toContain("Tab. Sertraline 50mg");
  });

  it("serializes psihiskais stāvoklis and taktika sections", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      apzina: "skaidra" as const,
      garastavoklis: "pazeminats" as const,
      phq9: "12",
      gad7: "8",
      taktikaUzraudziba: {
        gimenes_arsts: false,
        psihiatrs: true,
        cits: false,
      },
      piezimes: {
        ...emptyPirmreizejaisPacients().piezimes,
        taktikaIkdiena:
          "Ikdienā ievērot sabalansētu darba-atpūtas režīmu, veikt fiziskas aktivitātes vismaz 1h/dienā, uzņemt sabalansētu uzturu",
        taktikaMedikamenti: "Escitalopram 10mg",
      },
    };

    const serialized = serializePirmreizejaisPacients(data);

    expect(serialized).toContain("PSIHISKAIS STĀVOKLIS");
    expect(serialized).toContain("Pie apziņas");
    expect(serialized).toContain("Garastāvoklis pazemināts");
    expect(serialized).toContain("PHQ9: 12");
    expect(serialized).toContain("GAD7: 8");
    expect(serialized).toContain("TAKTIKA");
    expect(serialized).toContain("2. IKDIENĀ:");
    expect(serialized).toContain("Atrasties psihiatra uzraudzībā!");
    expect(serialized).toContain("Escitalopram 10mg");
  });

  it("serializes multiple uzraudzība options", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      taktikaUzraudziba: {
        gimenes_arsts: true,
        psihiatrs: true,
        cits: false,
      },
    };

    const serialized = serializePirmreizejaisPacients(data);

    expect(serialized).toContain("Atrasties ģimenes ārsta uzraudzībā!");
    expect(serialized).toContain("Atrasties psihiatra uzraudzībā!");
  });
});

describe("serializeProtokols", () => {
  it("includes parvertesanas ideju veidi when checked", () => {
    const data = {
      ...emptyProtokols(),
      parvertesanasIdejas: {
        ...emptyProtokols().parvertesanasIdejas,
        ir: "ja" as const,
        paranojalas: true,
        sistematizetas: true,
      },
    };

    const serialized = serializeProtokols(data);

    expect(serialized).toContain("paranojālas");
    expect(serialized).toContain("sistematizētas");
  });

  it("includes neirologiskais flags when checked", () => {
    const data = {
      ...emptyProtokols(),
      neirologiskais: {
        ...emptyProtokols().neirologiskais,
        nenovēro: true,
      },
    };

    const serialized = serializeProtokols(data);

    expect(serialized).toContain("nenovēro");
  });
});
