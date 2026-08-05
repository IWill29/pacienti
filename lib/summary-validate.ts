import type { FormType } from "@/lib/types/forms";

export type SummaryValidationResult =
  | { ok: true }
  | { ok: false; violations: string[] };

const PLACEHOLDER_PATTERN = /\[[^\]]{2,}\]/;

function extractPiezimes(serialized: string): string[] {
  const matches = [...serialized.matchAll(/\(piez\.:\s*([^)]+)\)/g)];
  return matches
    .map((match) => match[1]?.trim() ?? "")
    .filter((value) => value.length > 0);
}

function hasSection(summary: string, heading: string): boolean {
  const pattern = new RegExp(`(^|\\n)\\s*${heading}\\s*:`, "i");
  return pattern.test(summary);
}

function fieldHasContent(serialized: string, label: string): boolean {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = serialized.match(new RegExp(`^${escaped}:\\s*(.+)$`, "m"));
  if (!match) {
    return false;
  }

  const value = match[1].replace(/\(piez\.:[^)]*\)/g, "").trim();
  return value !== "" && value !== "—";
}

function validatePirmreizejais(
  serialized: string,
  summary: string,
): string[] {
  const violations: string[] = [];

  if (PLACEHOLDER_PATTERN.test(summary)) {
    violations.push("summary contains format-template placeholders");
  }

  for (const piezime of extractPiezimes(serialized)) {
    if (!summary.toLowerCase().includes(piezime.toLowerCase())) {
      violations.push(`missing doctor piezīme in summary: "${piezime}"`);
    }
  }

  if (
    fieldHasContent(serialized, "VIZĪTES IEMESLS") &&
    !hasSection(summary, "Vizītes iemesls")
  ) {
    violations.push("missing Vizītes iemesls section");
  }

  if (
    fieldHasContent(serialized, "LIETOTIE MEDIKAMENTI") &&
    /LIETOTIE MEDIKAMENTI:\s*IR/i.test(serialized)
  ) {
    const piezimes = extractPiezimes(serialized);
    const medPiezime = serialized.match(
      /LIETOTIE MEDIKAMENTI:.*\(piez\.:\s*([^)]+)\)/i,
    )?.[1];
    if (
      medPiezime &&
      !summary.toLowerCase().includes(medPiezime.toLowerCase())
    ) {
      violations.push("missing lietotie medikamenti piezīme");
    }
    if (!medPiezime && /Tab\.|mg\b/i.test(summary) && piezimes.length === 0) {
      violations.push("invented medication names");
    }
  }

  if (
    /BLAKUS SASLIMŠANAS:\s*NAV/i.test(serialized) &&
    hasSection(summary, "Citas saslimšanas")
  ) {
    const citas = summary.match(/(?:^|\n)\s*Citas saslimšanas:\s*([^\n]+)/i)?.[1];
    if (
      citas &&
      !/noliedz|nav/i.test(citas) &&
      !extractPiezimes(serialized).some((p) =>
        citas.toLowerCase().includes(p.toLowerCase()),
      )
    ) {
      violations.push("Citas saslimšanas invents content when form says NAV");
    }
  }

  if (
    /DIAGNOZE:/i.test(summary) &&
    !/XI DIAGNOZE:/i.test(serialized)
  ) {
    violations.push("invented Diagnoze section");
  }

  return violations;
}

function validateProtokols(serialized: string, summary: string): string[] {
  const violations: string[] = [];

  if (PLACEHOLDER_PATTERN.test(summary)) {
    violations.push("summary contains format-template placeholders");
  }

  const diagnozeMatch = serialized.match(/^XI DIAGNOZE:\s*(.+)$/m);
  const diagnoze = diagnozeMatch?.[1]?.trim();
  if (
    diagnoze &&
    diagnoze !== "—" &&
    !summary.toLowerCase().includes(diagnoze.toLowerCase())
  ) {
    violations.push("missing form diagnoze in summary");
  }

  return violations;
}

export function validateSummaryOutput(
  formType: FormType,
  serialized: string,
  summary: string,
): SummaryValidationResult {
  const violations =
    formType === "pirmreizejais"
      ? validatePirmreizejais(serialized, summary)
      : validateProtokols(serialized, summary);

  if (violations.length > 0) {
    return { ok: false, violations };
  }

  return { ok: true };
}

export function formatValidationFeedback(violations: string[]): string {
  return [
    "Iepriekšējais kopsavilkums pārkāpa noteikumus:",
    ...violations.map((violation) => `- ${violation}`),
    "Labo kopsavilkumu: izmanto TIKAI formas izvēles un piezīmes; neizdomā faktus; neiekļauj [vietturi].",
  ].join("\n");
}
