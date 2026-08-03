import {
  PIRMREIZEJAIS_EXAMPLE_FINGERPRINTS,
  PROTOKOLS_EXAMPLE_FINGERPRINTS,
} from "@/lib/summary-prompts";
import type { FormType } from "@/lib/types/forms";

const PIRMREIZEJAIS_FORBIDDEN_SECTIONS = [
  "Vizītes iemesls",
  "Psihiskais stāvoklis",
  "Somatiski",
  "Neiroloģiski",
  "Diagnoze",
  "Taktika",
] as const;

const DENY_PHRASES = /^(noliedz|nav|nelieto|—|-|\.)$/i;

function expressesDenial(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  return (
    DENY_PHRASES.test(normalized) ||
    /\bnoliedz\b/.test(normalized) ||
    /\bnav\b/.test(normalized) ||
    /\bnelieto\b/.test(normalized)
  );
}

function formTextOverlapsSummary(field: string, summary: string): boolean {
  const tokens = field
    .toLowerCase()
    .split(/[\s,;.()]+/)
    .filter((token) => token.length >= 4);

  if (tokens.length === 0) {
    return summary.toLowerCase().includes(field.toLowerCase());
  }

  const summaryLower = summary.toLowerCase();
  return tokens.some((token) => summaryLower.includes(token));
}

export type SummaryValidationResult =
  | { ok: true }
  | { ok: false; violations: string[] };

function hasForbiddenSection(summary: string, section: string): boolean {
  const pattern = new RegExp(`(^|\\n)\\s*${section}\\s*:`, "i");
  return pattern.test(summary);
}

function extractFieldValue(serialized: string, label: string): string | null {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = serialized.match(new RegExp(`^${escaped}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim() ?? null;
}

function extractSummarySection(
  summary: string,
  sectionLabel: string,
): string | null {
  const escaped = sectionLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = summary.match(
    new RegExp(`(?:^|\\n)\\s*${escaped}\\s*(?:-|:)?\\s*([^\\n]+)`, "i"),
  );
  return match?.[1]?.trim() ?? null;
}

function extractSummarySectionMultiline(
  summary: string,
  sectionLabel: string,
  nextSectionLabels: string[],
): string | null {
  const escaped = sectionLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const nextPattern = nextSectionLabels
    .map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const match = summary.match(
    new RegExp(
      `(?:^|\\n)\\s*${escaped}:\\s*([\\s\\S]*?)(?=\\n\\s*(?:${nextPattern})|$)`,
      "i",
    ),
  );
  return match?.[1]?.trim() ?? null;
}

function extractPiezimeFromLine(line: string | null): string | null {
  if (!line) {
    return null;
  }

  const match = line.match(/\(piez\.:\s*([^)]+)\)/);
  return match?.[1]?.trim() ?? null;
}

function extractJaNeFromLine(line: string | null): string | null {
  if (!line) {
    return null;
  }

  if (/(?:^|:|\s)JĀ(?:\s|\(|$)/.test(line)) {
    return "ja";
  }

  if (/(?:^|:|\s)NĒ(?:\s|\(|$)/.test(line)) {
    return "ne";
  }

  return null;
}

function isEmptyFormValue(value: string | null | undefined): boolean {
  if (!value) {
    return true;
  }

  const trimmed = value.trim();
  return trimmed === "" || trimmed === "—";
}

function isDenyOnly(text: string): boolean {
  return expressesDenial(text);
}

function formContextLower(serialized: string): string {
  return serialized.toLowerCase();
}

function summaryContextLower(summary: string): string {
  return summary.toLowerCase();
}

function validateCopiedPhrases(
  serialized: string,
  summary: string,
  fingerprints: readonly string[],
): string[] {
  const violations: string[] = [];
  const formLower = formContextLower(serialized);
  const summaryLower = summaryContextLower(summary);

  for (const phrase of fingerprints) {
    const phraseLower = phrase.toLowerCase();
    if (summaryLower.includes(phraseLower) && !formLower.includes(phraseLower)) {
      violations.push(`copied example phrase not in form: "${phrase}"`);
    }
  }

  return violations;
}

function validatePirmreizejaisSections(serialized: string, summary: string): string[] {
  const violations: string[] = [];

  const galvasTraumasField = extractFieldValue(serialized, "GALVAS TRAUMAS");
  const galvasTraumasSection = extractSummarySection(summary, "Galvas traumas");
  if (
    isEmptyFormValue(galvasTraumasField) &&
    galvasTraumasSection &&
    !isDenyOnly(galvasTraumasSection)
  ) {
    violations.push("Galvas traumas section without form data");
  }

  if (
    galvasTraumasField &&
    galvasTraumasSection &&
    !formTextOverlapsSummary(galvasTraumasField, galvasTraumasSection)
  ) {
    violations.push("Galvas traumas missing form content");
  }

  const infekcijasField = extractFieldValue(serialized, "INFEKCIJAS");
  const neiroSection = extractSummarySection(summary, "Neiroinfekcijas");
  if (
    isEmptyFormValue(infekcijasField) &&
    neiroSection &&
    !isDenyOnly(neiroSection)
  ) {
    violations.push("Neiroinfekcijas section without form data");
  }

  if (
    infekcijasField &&
    neiroSection &&
    !formTextOverlapsSummary(infekcijasField, neiroSection)
  ) {
    violations.push("Neiroinfekcijas missing form content");
  }

  if (
    neiroSection &&
    /pārslimots/i.test(neiroSection) &&
    (infekcijasField == null || !/pārslimots/i.test(infekcijasField))
  ) {
    violations.push('invented "pārslimots" in Neiroinfekcijas');
  }

  const blakusLine = serialized.match(/^BLAKUS SASLIMŠANAS:.*$/m)?.[0] ?? null;
  const blakusJaNe = extractJaNeFromLine(blakusLine);
  const blakusPiezime = extractPiezimeFromLine(blakusLine);
  const citasSection = extractSummarySection(summary, "Citas saslimšanas");

  if (blakusJaNe === "ne" && citasSection && !expressesDenial(citasSection)) {
    violations.push("Citas saslimšanas must deny when form says NĒ");
  }

  if (citasSection && /pārslimots/i.test(citasSection)) {
    const piezimeAllowsParslimots =
      blakusPiezime != null && /pārslimots/i.test(blakusPiezime);
    if (!piezimeAllowsParslimots) {
      violations.push('invented "pārslimots" in Citas saslimšanas');
    }
  }

  if (blakusPiezime && citasSection) {
    const piezimeLower = blakusPiezime.toLowerCase();
    const citasLower = citasSection.toLowerCase();
    if (!citasLower.includes(piezimeLower)) {
      violations.push("Citas saslimšanas missing BLAKUS SASLIMŠANAS piezime content");
    }
  }

  const medikamentiLine =
    serialized.match(/^LIETOTIE MEDIKAMENTI:.*$/m)?.[0] ?? null;
  const medikamentiJaNe = extractJaNeFromLine(medikamentiLine);
  const medikamentiPiezime = extractPiezimeFromLine(medikamentiLine);
  const medikamentiSection = extractSummarySection(summary, "Lietotie medikamenti");

  if (medikamentiJaNe === "ne" && medikamentiSection) {
    if (
      /\btab\.|\bmg\b/i.test(medikamentiSection) &&
      !expressesDenial(medikamentiSection)
    ) {
      violations.push("Lietotie medikamenti lists drugs when form says NĒ");
    }
  }

  if (medikamentiPiezime && medikamentiSection) {
    const piezimeLower = medikamentiPiezime.toLowerCase();
    const sectionLower = medikamentiSection.toLowerCase();
    if (!sectionLower.includes(piezimeLower)) {
      violations.push("Lietotie medikamenti missing form piezime content");
    }
  }

  const alergijasLine = serialized.match(/^ALERĢIJAS:.*$/m)?.[0] ?? null;
  const alergijasJaNe = extractJaNeFromLine(alergijasLine);
  const alergijasPiezime = extractPiezimeFromLine(alergijasLine);
  const alergijasInlineMatch = alergijasLine?.match(/\(([^)]+)\)/);
  const alergijasInline =
    alergijasInlineMatch?.[1]?.trim() &&
    !alergijasInlineMatch[1].startsWith("piez.:")
      ? alergijasInlineMatch[1].trim()
      : null;
  const alergijasSection = extractSummarySection(summary, "Alerģijas");

  if (alergijasJaNe === "ne" && alergijasSection && !expressesDenial(alergijasSection)) {
    violations.push("Alerģijas must deny when form says NĒ");
  }

  const alergijasExpected = alergijasInline ?? alergijasPiezime;
  if (alergijasJaNe === "ja" && alergijasExpected && alergijasSection) {
    if (!alergijasSection.toLowerCase().includes(alergijasExpected.toLowerCase())) {
      violations.push("Alerģijas missing form allergy content");
    }
  }

  const pavSection = extractSummarySection(summary, "Psihoaktīvo vielu lietošana");
  const pavFormContext = [
    serialized.match(/^PAV LIETOŠANA:.*$/m)?.[0],
    serialized.match(/^ALKOHOLS- BIEŽUMS,AR KO:.*$/m)?.[0],
    serialized.match(/^SUICĪDS\/ PAŠKAITĒJUMS ANAMN\.:.*$/m)?.[0],
  ]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();

  if (pavSection && /dzēri/i.test(pavSection) && !/dzēri/i.test(pavFormContext)) {
    violations.push('invented PAV detail "dzērieni" not in form');
  }

  const suicidsField = extractFieldValue(serialized, "SUICĪDS/ PAŠKAITĒJUMS ANAMN.");
  if (
    pavSection &&
    /paškaitējum/i.test(pavSection) &&
    isEmptyFormValue(suicidsField)
  ) {
    violations.push("invented paškaitējums not in form");
  }

  const alkoholsField = extractFieldValue(serialized, "ALKOHOLS- BIEŽUMS,AR KO");
  const pavLine = serialized.match(/^PAV LIETOŠANA:.*$/m)?.[0] ?? "";
  const pavEmpty = /PAV LIETOŠANA:\s*(—|$)/.test(pavLine);
  if (
    pavSection &&
    isEmptyFormValue(alkoholsField) &&
    pavEmpty &&
    isEmptyFormValue(suicidsField) &&
    /alkohol/i.test(pavSection)
  ) {
    violations.push("Psihoaktīvo vielu lietošana mentions alcohol without form data");
  }

  const dzemdibasLine = serialized.match(/^DZEMDĪBAS-:.*$/m)?.[0] ?? null;
  const anamneseSection = extractSummarySectionMultiline(
    summary,
    "Anamnēze no pacienta",
    [
      "Psihoaktīvo vielu lietošana:",
      "Citas saslimšanas:",
      "Lietotie medikamenti:",
      "Galvas traumas-",
      "Neiroinfekcijas-",
      "Alerģijas:",
    ],
  );

  if (dzemdibasLine && anamneseSection) {
    const dzemdibasLower = dzemdibasLine.toLowerCase();
    const anamneseLower = anamneseSection.toLowerCase();

    if (/keizargrieziens|ķeizargrieziens/i.test(dzemdibasLower)) {
      if (/dabīg/i.test(anamneseLower)) {
        violations.push(
          'invented "dabīgās dzemdībās" when form has keizargrieziens',
        );
      }
    }

    if (/\bdabīgas\b/i.test(dzemdibasLower)) {
      if (/keizargrieziens|ķeizargrieziens/i.test(anamneseLower)) {
        violations.push("invented keizargrieziens when form has dabīgas dzemdības");
      }
    }

    if (/ceļā/i.test(anamneseLower) && !/ceļā/i.test(dzemdibasLower)) {
      violations.push('invented "ceļā" in dzemdības narrative');
    }
  }

  return violations;
}

function extractDiagnoze(serialized: string): string | null {
  const match = serialized.match(/^XI DIAGNOZE:\s*(.+)$/m);
  if (!match) {
    return null;
  }

  const value = match[1].trim();
  return value === "—" || value.length === 0 ? null : value;
}

export function validateSummaryOutput(
  formType: FormType,
  serialized: string,
  summary: string,
): SummaryValidationResult {
  const violations: string[] = [];

  if (formType === "pirmreizejais") {
    for (const section of PIRMREIZEJAIS_FORBIDDEN_SECTIONS) {
      if (hasForbiddenSection(summary, section)) {
        violations.push(`forbidden section: ${section}`);
      }
    }

    violations.push(
      ...validateCopiedPhrases(
        serialized,
        summary,
        PIRMREIZEJAIS_EXAMPLE_FINGERPRINTS,
      ),
    );
    violations.push(...validatePirmreizejaisSections(serialized, summary));
  }

  if (formType === "protokols") {
    violations.push(
      ...validateCopiedPhrases(serialized, summary, PROTOKOLS_EXAMPLE_FINGERPRINTS),
    );

    const diagnoze = extractDiagnoze(serialized);
    if (diagnoze && !summary.toLowerCase().includes(diagnoze.toLowerCase())) {
      violations.push("missing form diagnoze in summary");
    }
  }

  if (violations.length > 0) {
    return { ok: false, violations };
  }

  return { ok: true };
}

export function formatValidationFeedback(violations: string[]): string {
  return [
    "Iepriekšējais kopsavilkums pārkāpa noteikumus:",
    ...violations.map((violation) => `- ${violation}`),
    "Labo kopsavilkumu, ievērojot formas datus un aizliegtās sadaļas.",
  ].join("\n");
}
