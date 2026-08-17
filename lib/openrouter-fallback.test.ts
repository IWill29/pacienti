/**
 * Regression tests for generateSummary retry / fallback policy.
 * Does not call the real OpenRouter API — fetch is mocked.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { generateSummary } from "@/lib/openrouter";
import { validateSummaryOutput } from "@/lib/summary-validate";

const SERIALIZED_WITH_HIV_PIEZIME = [
  "PIRMREIZĒJĀ KONSULTĀCIJA",
  "VĀRDS UZVĀRDS: Testa Pacients",
  "BLAKUS SASLIMŠANAS: IR (piez.: HIV)",
  "LIETOTIE MEDIKAMENTI: NAV",
  "DZEMDĪBAS: —",
].join("\n");

/** Valid JSON that assembles to clinically invented content (wrong piezīme + F-code). */
const INVENTED_SUMMARY_JSON = {
  pacientaVardsUzvards: "Testa Pacients",
  personasKods: null,
  konsultacijasDatums: null,
  vizitesIemesls: null,
  anamneze: ["Dzimis ar ķeizargriezienu agrīnā attīstībā ar novirzēm."],
  psihoaktivasVielas: null,
  citasSaslimbas: "PAH",
  lietotieMedikamenti: "Escitalopram 10 mg",
  galvasTraumas: null,
  neiroinfekcijas: null,
  alergijas: null,
  psihiskaisStavoklis: ["Garastāvoklis pazemināts."],
  somatiski: "bez akūtas patoloģijas",
  neirologiski: "Bez akūtas CNS perēkļu simptomātikas",
  phq9: null,
  gad7: null,
  parrunatsArPacientu: null,
  diagnoze: "F41.2 Trauksme ar depresiju",
  taktika: null,
};

function mockOpenRouterResponse(content: string): Response {
  return {
    ok: true,
    json: async () => ({
      choices: [{ message: { content } }],
    }),
  } as Response;
}

describe("generateSummary fallback after MAX_SUMMARY_ATTEMPTS", () => {
  beforeEach(() => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key-not-real");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns a form-based summary instead of invented AI text after failed polish attempts", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          mockOpenRouterResponse(JSON.stringify(INVENTED_SUMMARY_JSON)),
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const summary = await generateSummary(
      "pirmreizejais",
      SERIALIZED_WITH_HIV_PIEZIME,
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(summary).toContain("HIV");
    expect(summary).toContain("Testa Pacients");
    expect(summary).not.toContain("F41.2");
    expect(summary).not.toContain("Escitalopram");
    expect(summary).not.toContain("ķeizargriezienu");
    expect(
      validateSummaryOutput(
        "pirmreizejais",
        SERIALIZED_WITH_HIV_PIEZIME,
        summary,
      ).ok,
    ).toBe(true);
  });

  it("returns the form-based summary when OpenRouter is unreachable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );

    const summary = await generateSummary(
      "pirmreizejais",
      SERIALIZED_WITH_HIV_PIEZIME,
    );

    expect(summary).toContain("HIV");
    expect(summary).not.toContain("F41.2");
  });

  it("returns immediately when first attempt passes validation", async () => {
    const validJson = {
      ...INVENTED_SUMMARY_JSON,
      citasSaslimbas: "HIV",
      lietotieMedikamenti: null,
      diagnoze: null,
      anamneze: null,
      psihiskaisStavoklis: null,
      somatiski: null,
      neirologiski: null,
    };

    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(mockOpenRouterResponse(JSON.stringify(validJson))),
      );
    vi.stubGlobal("fetch", fetchMock);

    const summary = await generateSummary(
      "pirmreizejais",
      SERIALIZED_WITH_HIV_PIEZIME,
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(summary).toContain("HIV");
    expect(
      validateSummaryOutput(
        "pirmreizejais",
        SERIALIZED_WITH_HIV_PIEZIME,
        summary,
      ).ok,
    ).toBe(true);
  });
});
