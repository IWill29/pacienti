import { describe, expect, it } from "vitest";

import { validateSummaryOutput } from "@/lib/summary-validate";

describe("validateSummaryOutput", () => {
  it("rejects forbidden clinical sections for pirmreizejais", () => {
    const result = validateSummaryOutput(
      "pirmreizejais",
      "DZEMDĪBAS-: DABĪGAS",
      "Anamnēze no pacienta: dzimis dabīgās dzemdībās.\nDiagnoze: F41.2",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain("forbidden section: Diagnoze");
    }
  });

  it("accepts anamnesis-only output for pirmreizejais", () => {
    const result = validateSummaryOutput(
      "pirmreizejais",
      "DZEMDĪBAS-: DABĪGAS",
      "Anamnēze no pacienta: dzimis dabīgās dzemdībās.",
    );

    expect(result).toEqual({ ok: true });
  });

  it("requires protokols diagnoze from form to appear in summary", () => {
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

  it('rejects invented "pārslimots" for HIV when piezime only says HIV', () => {
    const serialized =
      "BLAKUS SASLIMŠANAS: JĀ (piez.: HIV)\nLIETOTIE MEDIKAMENTI: NĒ";

    const result = validateSummaryOutput(
      "pirmreizejais",
      serialized,
      "Citas saslimšanas: pārslimots HIV",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain(
        'invented "pārslimots" in Citas saslimšanas',
      );
    }
  });

  it("accepts Citas saslimšanas with exact piezime text", () => {
    const serialized =
      "BLAKUS SASLIMŠANAS: JĀ (piez.: HIV)\nLIETOTIE MEDIKAMENTI: NĒ";

    expect(
      validateSummaryOutput(
        "pirmreizejais",
        serialized,
        "Citas saslimšanas: HIV",
      ).ok,
    ).toBe(true);
  });

  it('rejects invented "kokaini dzērienus" when form only has KOK checkbox', () => {
    const serialized =
      "PAV LIETOŠANA: KOK\nALKOHOLS- BIEŽUMS,AR KO: reti\nSUICĪDS/ PAŠKAITĒJUMS ANAMN.: —";

    const result = validateSummaryOutput(
      "pirmreizejais",
      serialized,
      "Psihoaktīvo vielu lietošana: Lieto kokaini dzērienus, alkoholu lieto reti.",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain(
        'invented PAV detail "dzērieni" not in form',
      );
    }
  });

  it("accepts minimal kokainu wording when only KOK is checked", () => {
    const serialized =
      "PAV LIETOŠANA: KOK\nALKOHOLS- BIEŽUMS,AR KO: reti\nSUICĪDS/ PAŠKAITĒJUMS ANAMN.: —";

    expect(
      validateSummaryOutput(
        "pirmreizejais",
        serialized,
        "Psihoaktīvo vielu lietošana: Lieto kokainu. Alkoholu lieto reti.",
      ).ok,
    ).toBe(true);
  });

  it("accepts dzērieni when PAV piezime mentions them", () => {
    const serialized =
      "PAV LIETOŠANA: KOK (piez.: kokaini dzērienus)\nALKOHOLS- BIEŽUMS,AR KO: —";

    expect(
      validateSummaryOutput(
        "pirmreizejais",
        serialized,
        "Psihoaktīvo vielu lietošana: Lieto kokaini dzērienus.",
      ).ok,
    ).toBe(true);
  });

  it("rejects invented paškaitējums when suicids field is empty", () => {
    const serialized =
      "PAV LIETOŠANA: —\nALKOHOLS- BIEŽUMS,AR KO: bieži\nSUICĪDS/ PAŠKAITĒJUMS ANAMN.: —";

    const result = validateSummaryOutput(
      "pirmreizejais",
      serialized,
      "Psihoaktīvo vielu lietošana: Alkoholu lieto bieži. Ir bijuši paškaitējuma mēģinājumi.",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain(
        "invented paškaitējums not in form",
      );
    }
  });

  it('rejects "dabīgās dzemdībās" when form has keizargrieziens', () => {
    const serialized = "DZEMDĪBAS-: ĶEIZARGRIEZIENS-AKŪTS";

    const result = validateSummaryOutput(
      "pirmreizejais",
      serialized,
      "Anamnēze no pacienta: Dzimis dabīgās dzemdībās.",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain(
        'invented "dabīgās dzemdībās" when form has keizargrieziens',
      );
    }
  });

  it("accepts akūts keizargrieziens wording from form", () => {
    const serialized = "DZEMDĪBAS-: ĶEIZARGRIEZIENS-AKŪTS";

    expect(
      validateSummaryOutput(
        "pirmreizejais",
        serialized,
        "Anamnēze no pacienta: Dzimis ar akūtu ķeizargriezienu.",
      ).ok,
    ).toBe(true);
  });

  it('rejects invented "ceļā" for keizargrieziens', () => {
    const serialized = "DZEMDĪBAS-: ĶEIZARGRIEZIENS-AKŪTS";

    const result = validateSummaryOutput(
      "pirmreizejais",
      serialized,
      "Anamnēze no pacienta: Dzimis ar ķeizargriezienu ceļā.",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain(
        'invented "ceļā" in dzemdības narrative',
      );
    }
  });

  it("rejects copied example PAH when blakus saslimibas is NĒ", () => {
    const serialized =
      "BLAKUS SASLIMŠANAS: NĒ\nGALVAS TRAUMAS: —\nINFEKCIJAS: —";

    const result = validateSummaryOutput(
      "pirmreizejais",
      serialized,
      "Citas saslimšanas: PAH",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain(
        'copied example phrase not in form: "pah"',
      );
    }
  });

  it("rejects galvas traumas section when form field is empty", () => {
    const serialized = "GALVAS TRAUMAS: —";

    const result = validateSummaryOutput(
      "pirmreizejais",
      serialized,
      "Galvas traumas- pirms 13 gadiem pēc kritiena, lika šuves galvā",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain("Galvas traumas section without form data");
      expect(result.violations).toContain(
        'copied example phrase not in form: "pirms 13 gadiem"',
      );
    }
  });

  it("rejects neiroinfekcijas section when infekcijas field is empty", () => {
    const serialized = "INFEKCIJAS: —";

    const result = validateSummaryOutput(
      "pirmreizejais",
      serialized,
      "Neiroinfekcijas- pārslimots ērču encefalīts",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain("Neiroinfekcijas section without form data");
      expect(result.violations).toContain(
        'invented "pārslimots" in Neiroinfekcijas',
      );
    }
  });

  it("rejects Sertraline when medikamenti is NĒ", () => {
    const serialized = "LIETOTIE MEDIKAMENTI: NĒ";

    const result = validateSummaryOutput(
      "pirmreizejais",
      serialized,
      "Lietotie medikamenti: Tab. Sertraline 50mg",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain(
        "Lietotie medikamenti lists drugs when form says NĒ",
      );
      expect(result.violations).toContain(
        'copied example phrase not in form: "sertraline"',
      );
    }
  });

  it("rejects advokāts in anamnese when not in form", () => {
    const serialized = "DZEMDĪBAS-: DABĪGAS\nPAR KO STRĀDĀ: NĒ";

    const result = validateSummaryOutput(
      "pirmreizejais",
      serialized,
      "Anamnēze no pacienta: Strādā advokāts.",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain(
        'copied example phrase not in form: "advokāts"',
      );
    }
  });

  it("rejects alcohol in PAV section when all PAV fields empty", () => {
    const serialized =
      "PAV LIETOŠANA: —\nALKOHOLS- BIEŽUMS,AR KO: —\nSUICĪDS/ PAŠKAITĒJUMS ANAMN.: —";

    const result = validateSummaryOutput(
      "pirmreizejais",
      serialized,
      "Psihoaktīvo vielu lietošana: Alkoholu lieto reti.",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain(
        "Psihoaktīvo vielu lietošana mentions alcohol without form data",
      );
    }
  });

  it("rejects protokols example patient name when not in form", () => {
    const serialized = "XI DIAGNOZE: F32.1";

    const result = validateSummaryOutput(
      "protokols",
      serialized,
      "Aleksandrs Stoikevics 200769-10309\nDiagnoze: F32.1",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations).toContain(
        'copied example phrase not in form: "aleksandrs stoikevics"',
      );
    }
  });

  it("accepts Nav wording for Citas saslimšanas when blakus is NĒ", () => {
    const serialized = "BLAKUS SASLIMŠANAS: NĒ";

    expect(
      validateSummaryOutput(
        "pirmreizejais",
        serialized,
        "Citas saslimšanas: Nav citu hronisku slimību.",
      ).ok,
    ).toBe(true);
  });

  it("accepts paraphrased galvas traumas when key token overlaps", () => {
    const serialized = "GALVAS TRAUMAS: kritiens 2020, šuves";

    expect(
      validateSummaryOutput(
        "pirmreizejais",
        serialized,
        "Galvas traumas- pēc galvas kritiena 2020. gadā, lika šuves.",
      ).ok,
    ).toBe(true);
  });
});
