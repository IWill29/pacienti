import { describe, expect, it } from "vitest";

import {
  genderLabelOrDash,
  parrunatsArPacientuDefault,
  pickGender,
} from "@/lib/gender-phrases";

describe("gender-phrases", () => {
  it("pickGender returns sieviete form when selected", () => {
    expect(pickGender("sieviete", "Dzimis", "Dzimusi")).toBe("Dzimusi");
  });

  it("genderLabelOrDash uses feminine map for sieviete", () => {
    expect(
      genderLabelOrDash(
        "videji",
        { videji: "mācījies vidēji" },
        { videji: "mācījusies vidēji" },
        "sieviete",
      ),
    ).toBe("mācījusies vidēji");
  });

  it("parrunatsArPacientuDefault differs by gender", () => {
    expect(parrunatsArPacientuDefault("virietis")).toContain("informēts");
    expect(parrunatsArPacientuDefault("sieviete")).toContain("informēta");
  });
});
