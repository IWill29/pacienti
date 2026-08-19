import type { FormType } from "@/lib/types/forms";

export type SummaryValidationMode = "strict" | "ai";

export type SummaryValidationOptions = {
  mode?: SummaryValidationMode;
};

export type SummaryValidationResult =
  | { ok: true }
  | { ok: false; violations: string[] };

function significantWords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s,;:.!?()[\]"'-]+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 4);
}

function wordsOverlap(a: string, b: string): boolean {
  if (a.includes(b) || b.includes(a)) {
    return true;
  }
  const stemLength = Math.min(5, a.length, b.length);
  return stemLength >= 4 && a.slice(0, stemLength) === b.slice(0, stemLength);
}

function wordReflectedInText(word: string, haystack: string): boolean {
  if (haystack.includes(word)) {
    return true;
  }
  return significantWords(haystack).some((candidate) =>
    wordsOverlap(word, candidate),
  );
}

function textReflectedInSummary(
  summary: string,
  text: string,
  mode: SummaryValidationMode,
): boolean {
  const summaryLower = summary.toLowerCase();
  const textLower = text.toLowerCase().trim();
  if (!textLower) {
    return true;
  }
  if (summaryLower.includes(textLower)) {
    return true;
  }
  if (mode === "strict") {
    return false;
  }

  const words = significantWords(textLower);
  if (words.length === 0) {
    return true;
  }

  const matched = words.filter((word) => wordReflectedInText(word, summaryLower));
  const required = Math.max(1, Math.ceil(words.length * 0.35));
  return matched.length >= required;
}

function sudzibasReflectedInSummary(
  summary: string,
  sudzas: string,
  mode: SummaryValidationMode,
): boolean {
  if (textReflectedInSummary(summary, sudzas, mode)) {
    return true;
  }
  if (mode === "strict") {
    return false;
  }

  const fragments = sudzas
    .split(/[,;]/)
    .map((fragment) => fragment.trim())
    .filter((fragment) => fragment.length >= 5);

  if (fragments.length === 0) {
    return true;
  }

  return fragments.every((fragment) =>
    textReflectedInSummary(summary, fragment, "ai"),
  );
}

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
  "ĢIMENĒ PSIHISKAS SASLIMŠANAS",
  "GALVAS TRAUMAS",
  "NEIROINFEKCIJAS",
  "ALERĢIJAS",
  "ALKOHOLS",
  "PAV LIETOŠANA",
  "PAV MĒĢINĀJIS DZĪVES LAIKĀ",
  "SUICIDĀLA UZVEDĪBA",
] as const;

const VIZITE_FORM_LABELS = ["VIZĪTES IEMESLS", "SŪDZAS"] as const;

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

const TAKTIKA_FORM_LABELS = [
  "1. UZRAUDZĪBA",
  "2. IKDIENĀ",
  "3. MEDIKAMENTOZĀ TERAPIJA",
  "4. PSIHOLOĢISKAIS ATBALSTS",
] as const;

const PROTOKOLS_MENTAL_LABEL_PREFIX =
  /^(1\. Apziņa|2\. Orientācija|3\. Kontakts|4\. Atbild|5\. Runa|6\. Uztveres|7\. Halucinācijas|8\. Pārvērtēšanas|9\. Ideju|10\. Formālās|11\. Emocionālās|12\. Garastāvoklis|13\. Trauksme|14\. Uzmanība|15\. Intelekts|16\. Suicidālas|17\. Miegs|18\. Kritika)/i;

function extractPiezimes(serialized: string): string[] {
  const matches = [...serialized.matchAll(/\(piez\.:\s*([^)]+)\)/g)];
  return matches
    .map((match) => match[1]?.trim() ?? "")
    .filter((value) => value.length > 0);
}

function getFieldValue(serialized: string, label: string): string | null {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = serialized.match(
    new RegExp(`^${escaped}:[ \\t]*([^\\n]*)$`, "m"),
  );
  if (!match) {
    return null;
  }
  const value = match[1].replace(/\(piez\.:[^)]*\)/g, "").trim();
  return value.length > 0 ? value : null;
}

function fieldHasContent(serialized: string, label: string): boolean {
  const value = getFieldValue(serialized, label);
  return value !== null && value !== "" && value !== "—";
}

function isPlaceholderOnly(value: string): boolean {
  const withoutLabels = value.replace(/\b[\p{L}]+:/gu, "");
  const normalized = withoutLabels.replace(/[\s,;—-]+/g, "");
  return normalized.length === 0;
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
    `(?:^|\\n)\\s*(?:\\*\\*)?\\s*${escaped}\\s*(?:\\*\\*)?\\s*:\\s*([^\\n]+(?:\\n(?!\\s*(?:\\*\\*)?[A-ZĀČĒĢĪĶĻŅŠŪŽ][^:\\n]{0,40}:)[^\\n]+)*)`,
    "i",
  );
  return pattern.exec(summary)?.[1]?.trim() ?? null;
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function phqGadScores(serialized: string): { phq9: string | null; gad7: string | null } {
  const line = getFieldValue(serialized, "PHQ9");
  if (!line) {
    return { phq9: null, gad7: null };
  }

  const phq9Raw = line.match(/^PHQ9:\s*([^;]+)/i)?.[1]?.trim()
    ?? line.split(";")[0]?.trim()
    ?? null;
  const gad7Raw = line.match(/GAD7:\s*(.+)$/i)?.[1]?.trim() ?? null;

  return {
    phq9: phq9Raw && phq9Raw !== "—" ? phq9Raw : null,
    gad7: gad7Raw && gad7Raw !== "—" ? gad7Raw : null,
  };
}

function getTraceableTexts(
  serialized: string,
  labels: readonly string[],
): string[] {
  const texts: string[] = [];

  for (const label of labels) {
    const value = getFieldValue(serialized, label);
    if (value && value !== "—") {
      texts.push(value);
    }

    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const piezMatch = serialized.match(
      new RegExp(`^${escaped}:.*\\(piez\\.:\\s*([^)]+)\\)`, "m"),
    );
    if (piezMatch?.[1]?.trim()) {
      texts.push(piezMatch[1].trim());
    }
  }

  return texts;
}

function sentenceTracesToForm(
  sentence: string,
  traceable: string[],
  mode: SummaryValidationMode,
): boolean {
  const normalized = sentence.toLowerCase().replace(/\.$/, "").trim();
  if (normalized.length === 0) {
    return true;
  }

  const strictMatch = traceable.some((text) => {
    const fragment = text.toLowerCase().trim();
    if (fragment.length < 3) {
      return false;
    }
    return (
      normalized.includes(fragment) ||
      fragment.includes(normalized) ||
      normalized.includes(fragment.slice(0, Math.min(fragment.length, 12)))
    );
  });
  if (strictMatch) {
    return true;
  }
  if (mode === "strict") {
    return false;
  }

  const sentenceWords = significantWords(normalized);
  if (sentenceWords.length === 0) {
    return true;
  }

  return traceable.some((text) => {
    const traceWords = significantWords(text);
    const overlap = sentenceWords.filter((word) =>
      traceWords.some((traceWord) => wordsOverlap(word, traceWord)),
    );
    const required =
      mode === "ai"
        ? 1
        : Math.min(2, sentenceWords.length);
    return overlap.length >= required;
  });
}

function validateSectionSentencesTraceToForm(
  summary: string,
  sectionHeading: string,
  serialized: string,
  formLabels: readonly string[],
  violationLabel: string,
  mode: SummaryValidationMode,
): string | null {
  if (!hasSection(summary, sectionHeading)) {
    return null;
  }

  const traceable = getTraceableTexts(serialized, formLabels);
  if (traceable.length === 0) {
    return null;
  }

  const content = extractSectionContent(summary, sectionHeading);
  if (!content) {
    return null;
  }

  const untraced = splitSentences(content).filter(
    (sentence) => !sentenceTracesToForm(sentence, traceable, mode),
  );

  if (untraced.length > 0) {
    return `invented ${violationLabel} sentences not traceable to filled form fields`;
  }

  return null;
}

function protokolsAnamnezeHasContent(serialized: string): boolean {
  const value = getFieldValue(serialized, "II Īsa anamnēze/katamnēze");
  return value !== null && value !== "" && value !== "—";
}

function protokolsMentalHasContent(serialized: string): boolean {
  return serialized.split("\n").some((line) => {
    const trimmed = line.trim();
    if (!PROTOKOLS_MENTAL_LABEL_PREFIX.test(trimmed)) {
      return false;
    }
    const colon = trimmed.indexOf(":");
    if (colon <= 0) {
      return false;
    }
    const value = trimmed.slice(colon + 1).trim();
    return value !== "" && value !== "—" && !isPlaceholderOnly(value);
  });
}

function protokolsTaktikaHasContent(serialized: string): boolean {
  return /XIII Tālākā taktika:\s*(?!—\s*$).+/im.test(serialized);
}

function validatePirmreizejais(
  serialized: string,
  summary: string,
  mode: SummaryValidationMode,
): string[] {
  const violations: string[] = [];

  if (PLACEHOLDER_PATTERN.test(summary)) {
    violations.push("summary contains format-template placeholders");
  }

  for (const piezime of extractPiezimes(serialized)) {
    if (!textReflectedInSummary(summary, piezime, mode)) {
      violations.push(`missing doctor piezīme in summary: "${piezime}"`);
    }
  }

  if (
    anyFieldHasContent(serialized, VIZITE_FORM_LABELS) &&
    !hasSection(summary, "Vizītes iemesls")
  ) {
    violations.push("missing Vizītes iemesls section");
  }

  if (fieldHasContent(serialized, "SŪDZAS")) {
    const sudzas = getFieldValue(serialized, "SŪDZAS");
    if (sudzas && !sudzibasReflectedInSummary(summary, sudzas, mode)) {
      violations.push("missing form sūdzības in summary");
    }
  }

  if (
    !anyFieldHasContent(serialized, ANAMNEZE_FORM_LABELS) &&
    hasSection(summary, "Anamnēze no pacienta")
  ) {
    violations.push("invented Anamnēze section when form anamnēze fields are empty");
  }

  const anamnezeTraceViolation = validateSectionSentencesTraceToForm(
    summary,
    "Anamnēze no pacienta",
    serialized,
    ANAMNEZE_FORM_LABELS,
    "anamnēze",
    mode,
  );
  if (anamnezeTraceViolation) {
    violations.push(anamnezeTraceViolation);
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

  const psihiskaisTraceViolation = validateSectionSentencesTraceToForm(
    summary,
    "Psihiskais stāvoklis",
    serialized,
    PSIHISKAS_FORM_LABELS,
    "psihiskais stāvoklis",
    mode,
  );
  if (psihiskaisTraceViolation) {
    violations.push(psihiskaisTraceViolation);
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
      !textReflectedInSummary(summary, medPiezime, mode)
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

  if (fieldHasContent(serialized, "PĀRRUNĀTS AR PACIENTU")) {
    const parrunats = getFieldValue(serialized, "PĀRRUNĀTS AR PACIENTU");
    if (
      parrunats &&
      !textReflectedInSummary(summary, parrunats, mode)
    ) {
      violations.push("missing form pārrunāts ar pacientu in summary");
    }
  }

  const { phq9, gad7 } = phqGadScores(serialized);
  if (phq9 && !summary.includes(phq9)) {
    violations.push("missing PHQ9 score in summary");
  }
  if (gad7 && !summary.includes(gad7)) {
    violations.push("missing GAD7 score in summary");
  }

  if (
    anyFieldHasContent(serialized, TAKTIKA_FORM_LABELS) &&
    !hasSection(summary, "Taktika")
  ) {
    violations.push("missing Taktika section when form taktika fields are filled");
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
      !textReflectedInSummary(summary, diagnoze, mode)
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

  if (
    !protokolsAnamnezeHasContent(serialized) &&
    hasSection(summary, "Anamnēze no pacienta")
  ) {
    violations.push("invented Anamnēze section when protokols anamnēze is empty");
  }

  if (protokolsAnamnezeHasContent(serialized)) {
    const anamneze = getFieldValue(serialized, "II Īsa anamnēze/katamnēze");
    if (
      anamneze &&
      hasSection(summary, "Anamnēze no pacienta") &&
      !summary.toLowerCase().includes(anamneze.toLowerCase())
    ) {
      violations.push("missing protokols anamnēze in summary");
    }
  }

  if (
    !protokolsMentalHasContent(serialized) &&
    hasSection(summary, "Psihiskais stāvoklis")
  ) {
    violations.push(
      "invented Psihiskais stāvoklis section when protokols mental-status is empty",
    );
  }

  if (
    !protokolsTaktikaHasContent(serialized) &&
    hasSection(summary, "Taktika")
  ) {
    violations.push("invented Taktika section when protokols taktika is empty");
  }

  return violations;
}

export function validateSummaryOutput(
  formType: FormType,
  serialized: string,
  summary: string,
  options: SummaryValidationOptions = {},
): SummaryValidationResult {
  const mode = options.mode ?? "strict";
  const violations =
    formType === "pirmreizejais"
      ? validatePirmreizejais(serialized, summary, mode)
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
