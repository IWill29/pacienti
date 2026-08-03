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
  it("includes filled anamnesis fields and piezimes", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      dzemdibasVeids: "dabigas" as const,
      sarezgijumiDzemdibas: "ne" as const,
      galvasTraumas: "pirms 13 gadiem pēc kritiena",
      piezimes: {
        ...emptyPirmreizejaisPacients().piezimes,
        dzemdibasVeids: "bez komplikācijām",
      },
    };

    const serialized = serializePirmreizejaisPacients(data);

    expect(serialized).toContain("DABĪGAS");
    expect(serialized).toContain("pirms 13 gadiem");
    expect(serialized).toContain("bez komplikācijām");
  });

  it("includes lietotie medikamenti with piezime for AI prompt", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      lietotasMedikamenti: "ja" as const,
      piezimes: {
        ...emptyPirmreizejaisPacients().piezimes,
        lietotasMedikamenti: "Tab. Sertraline 50mg",
      },
    };

    const serialized = serializePirmreizejaisPacients(data);

    expect(serialized).toContain("LIETOTIE MEDIKAMENTI: JĀ");
    expect(serialized).toContain("Tab. Sertraline 50mg");
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

  it("includes extended talaka taktika options when checked", () => {
    const data = {
      ...emptyProtokols(),
      talakaTaktika: {
        ...emptyProtokols().talakaTaktika,
        mrpl: true,
        stacionešanaiPiekrīt: true,
      },
    };

    const serialized = serializeProtokols(data);

    expect(serialized).toContain("MRPL");
    expect(serialized).toContain("stacionēšanai piekrīt");
  });

  it("includes extended nozimejumi when filled", () => {
    const data = {
      ...emptyProtokols(),
      nozimejumi: {
        ...emptyProtokols().nozimejumi,
        rtg: true,
        novērošanasLimenis: "pasaprūpes" as const,
        novērotUz: ["nemierīgu", "agresīvu"],
        kontrolet: ["TA"],
        kontroletCits: "pēc 7 dienām",
        dieta: ["15."],
        terapija: "Tab. Sertraline 50mg",
      },
    };

    const serialized = serializeProtokols(data);

    expect(serialized).toContain("RTG");
    expect(serialized).toContain("pašaprūpes nodrošinājuma palāta");
    expect(serialized).toContain("nemierīgu");
    expect(serialized).toContain("agresīvu");
    expect(serialized).toContain("TA");
    expect(serialized).toContain("pēc 7 dienām");
    expect(serialized).toContain("15.");
    expect(serialized).toContain("Tab. Sertraline 50mg");
  });
});
