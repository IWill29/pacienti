import type { FormType } from "@/lib/types/forms";

export type SummaryValidationResult =
  | { ok: true }
  | { ok: false; violations: string[] };

const PLACEHOLDER_PATTERN = /\[[^\]]{2,}\]/;

const ANAMNEZE_FORM_LABELS = [
  "DZEMDĪBAS",
  "DZEMDĪBU TERMINS",
  "DZEMDĪBU PATOLOĢIJA",
  "AGRĪNĀ ATTĪSTĪBA",
  "AUGA",
  "BĒRNUDĀRZS",
  "RAKSTURS",
  "SKOLĀ UZSĀKA",
  "MĀCĪJĀS",
  "APCELŠANA SKOLĀ",
  "UZVEDĪBA SKOLĀ",
  "IEGŪTĀ IZGLĪTĪBA",
  "DARBS",
  "ATTIECĪBU STATUSS",
  "BĒRNI",
  "GALVAS TRAUMAS",
  "NEIROINFEKCIJAS",
  "ALERĢIJAS",
  "ALKOHOLS",
  "PAV LIETOŠANA",
  "PAV MĒĢINĀJIS DZĪVES LAIKĀ",
  "SUICIDĀLA UZVEDĪBA",
  "VIZĪTES IEMESLS",
  "SŪDZAS",
] as const;

const PSIHISKAS_FORM_LABELS = [
  "APZIŅA",
  "ORIENTĀCIJA",
  "KONTAKTS",
  "SARUNAS INICIATĪVA",
  "IZSKATS",
  "RUNA",
  "ATBILDES",
  "STĀSTĪJUMS",
  "UZMANĪBA",
  "DOMĀŠANA",
  "PSIHOPRODUKTĪVA SIMPTOMĀTIKA",
  "GARASTĀVOKLIS",
  "EMOCIONĀLĀS REAKCIJAS",
  "TRAUKSME",
  "INTELEKTS",
  "SUICIDĀLAS DOMAS",
  "MIEGS",
  "KRITIKA",
] as const;

function extractPiezimes(serialized: string): string[] {
  const matches = [...serialized.matchAll(/\(piez\.:\s*([^)]+)\)/g)];
  return matches
    .map((match) => match[1]?.trim() ?? "")
    .filter((value) => value.length > 0);
}

function getFieldValue(serialized: string, label: string): string | null {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = serialized.match(new RegExp(`^${escaped}:\\s*(.+)$`, "m"));
  if (!match) {
    return null;
  }
  return match[1].replace(/\(piez\.:[^)]*\)/g, "").trim();
}

function fieldHasContent(serialized: string, label: string): boolean {
  const value = getFieldValue(serialized, label);
  return value !== null && value !== "" && value !== "—";
}

function anyFieldHasContent(
  serialized: string,
  labels: readonly string[],
): boolean {
  return labels.some((label) => fieldHasContent(serialized, label));
}

function hasSection(summary: string, heading: string): boolean {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `(^|\\n)\\s*(?:\\*\\*)?\\s*${escaped}\\s*(?:\\*\\*)?\\s*:`,
    "i",
  );
  return pattern.test(summary);
}

function extractSectionContent(
  summary: string,
  heading: string,
): string | null {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `(?:^|\\n)\\s*(?:\\*\\*)?\\s*${escaped}\\s*(?:\\*\\*)?\\s*:\\s*([^\\n]+)`,
    "i",
  );
  return pattern.exec(summary)?.[1]?.trim() ?? null;
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
    !anyFieldHasContent(serialized, ANAMNEZE_FORM_LABELS) &&
    hasSection(summary, "Anamnēze no pacienta")
  ) {
    violations.push("invented Anamnēze section when form anamnēze fields are empty");
  }

  if (
    /GIMENĒ PSIHISKAS SASLIMŠANAS:\s*NAV/i.test(serialized) &&
    hasSection(summary, "Anamnēze no pacienta")
  ) {
    const anamneze = extractSectionContent(summary, "Anamnēze no pacienta");
    if (
      anamneze &&
      /ģimen|schizofr|depresij|psihisk/i.test(anamneze) &&
      !extractPiezimes(serialized).some((p) =>
        anamneze.toLowerCase().includes(p.toLowerCase()),
      )
    ) {
      violations.push(
        "invented ģimenē psihiskas saslimšanas when form says NAV",
      );
    }
  }

  if (
    !anyFieldHasContent(serialized, PSIHISKAS_FORM_LABELS) &&
    hasSection(summary, "Psihiskais stāvoklis")
  ) {
    violations.push(
      "invented Psihiskais stāvoklis section when form mental-status fields are empty",
    );
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

  if (/LIETOTIE MEDIKAMENTI:\s*NAV/i.test(serialized)) {
    if (hasSection(summary, "Lietotie medikamenti")) {
      const meds = extractSectionContent(summary, "Lietotie medikamenti");
      if (meds && !/noliedz|nav/i.test(meds)) {
        violations.push("invented medikamenti when form says NAV");
      }
    }
  }

  if (
    /BLAKUS SASLIMŠANAS:\s*NAV/i.test(serialized) &&
    hasSection(summary, "Citas saslimšanas")
  ) {
    const citas = extractSectionContent(summary, "Citas saslimšanas");
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
    !fieldHasContent(serialized, "SOMATISKI") &&
    hasSection(summary, "Somatiski")
  ) {
    violations.push("invented Somatiski section when form field is empty");
  }

  if (
    !fieldHasContent(serialized, "NEIROLOĢISKI") &&
    hasSection(summary, "Neiroloģiski")
  ) {
    violations.push("invented Neiroloģiski section when form field is empty");
  }

  if (
    /Diagnoze:/i.test(summary) &&
    !fieldHasContent(serialized, "DIAGNOZE") &&
    !/XI DIAGNOZE:/i.test(serialized)
  ) {
    violations.push("invented Diagnoze section");
  }

  if (fieldHasContent(serialized, "DIAGNOZE")) {
    const diagnoze = getFieldValue(serialized, "DIAGNOZE");
    if (
      diagnoze &&
      !summary.toLowerCase().includes(diagnoze.toLowerCase())
    ) {
      violations.push("missing form diagnoze in summary");
    }
  }

  return violations;
}

function validateProtokols(serialized: string, summary: string): string[] {
  const violations: string[] = [];

  if (PLACEHOLDER_PATTERN.test(summary)) {
    violations.push("summary contains format-template placeholders");
  }

  const diagnoze = getFieldValue(serialized, "XI DIAGNOZE");
  if (
    diagnoze &&
    diagnoze !== "—" &&
    !summary.toLowerCase().includes(diagnoze.toLowerCase())
  ) {
    violations.push("missing form diagnoze in summary");
  }

  if (
    /Diagnoze:/i.test(summary) &&
    !fieldHasContent(serialized, "XI DIAGNOZE")
  ) {
    violations.push("invented Diagnoze section");
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
    "Iepriekšējais JSON pārkāpa noteikumus:",
    ...violations.map((violation) => `- ${violation}`),
    "Labo JSON: izmanto TIKAI formas izvēles un piezīmes; teikumu masīvos katrs elements beidzas ar punktu; null ja nav datu; neizdomā faktus.",
  ].join("\n");
}
