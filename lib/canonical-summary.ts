import { assembleSummary } from "@/lib/assemble-summary";
import type {
  PirmreizejaisSummaryJson,
  ProtokolsSummaryJson,
  SummaryJson,
} from "@/lib/summary-schema";
import type { FormType } from "@/lib/types/forms";

type FormLine = {
  label: string;
  value: string;
  piezime: string | null;
};

function parseFormLines(serialized: string): FormLine[] {
  const lines: FormLine[] = [];

  for (const raw of serialized.split("\n")) {
    const trimmed = raw.trim();
    const colon = trimmed.indexOf(":");
    if (colon <= 0) {
      continue;
    }

    const label = trimmed.slice(0, colon).trim();
    const rest = trimmed.slice(colon + 1).trim();
    const piezMatch = rest.match(/\(piez\.:\s*([^)]+)\)\s*$/);
    const piezime = piezMatch?.[1]?.trim() || null;
    const value = rest.replace(/\(piez\.:\s*[^)]+\)\s*$/, "").trim();

    lines.push({ label, value, piezime });
  }

  return lines;
}

function isEmptyValue(value: string): boolean {
  return value === "" || value === "—";
}

function toSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }
  if (/[.!?]$/.test(trimmed)) {
    return trimmed;
  }
  return `${trimmed}.`;
}

function combineValueAndNote(value: string, piezime: string | null): string {
  const parts = [isEmptyValue(value) ? "" : value, piezime ?? ""]
    .map((part) => part.trim())
    .filter(Boolean);
  return toSentence(parts.join(", "));
}

function lineContent(line: FormLine | undefined): string | null {
  if (!line) {
    return null;
  }
  const combined = combineValueAndNote(line.value, line.piezime);
  return combined.length > 0 ? combined : null;
}

function findLine(lines: FormLine[], label: string): FormLine | undefined {
  return lines.find((line) => line.label === label);
}

function collectSentences(
  lines: FormLine[],
  labels: readonly string[],
): string[] | null {
  const sentences = labels
    .map((label) => lineContent(findLine(lines, label)))
    .filter((sentence): sentence is string => Boolean(sentence));
  return sentences.length > 0 ? sentences : null;
}

function fromIrNavLine(
  line: FormLine | undefined,
  navPhrase: string | null,
): string | null {
  if (!line) {
    return null;
  }
  if (/^NAV$/i.test(line.value) || /^Noliedz$/i.test(line.value)) {
    if (line.piezime) {
      return combineValueAndNote("", line.piezime);
    }
    return navPhrase ? toSentence(navPhrase) : null;
  }
  if (/^IR$/i.test(line.value)) {
    return line.piezime ? combineValueAndNote("", line.piezime) : null;
  }
  return lineContent(line);
}

const ANAMNEZE_LABELS = [
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
  "SUICIDĀLA UZVEDĪBA",
] as const;

const PSIHISKAS_LABELS = [
  "APZIŅA",
  "ORIENTĀCIJA",
  "KONTAKTS",
  "SARUNAS INICIATĪVA",
  "IZSKATS",
  "RUNA",
  "ATBILDES",
  "STĀSTĪJUMS",
  "SŪDZAS",
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

const SUBSTANCE_LABELS = [
  "ALKOHOLS",
  "PAV LIETOŠANA",
  "PAV MĒĢINĀJIS DZĪVES LAIKĀ",
] as const;

const TAKTIKA_LABELS = [
  "1. UZRAUDZĪBA",
  "2. IKDIENĀ",
  "3. MEDIKAMENTOZĀ TERAPIJA",
  "4. PSIHOLOĢISKAIS ATBALSTS",
] as const;

function parsePhqGad(lines: FormLine[]): { phq9: string | null; gad7: string | null } {
  const line = findLine(lines, "PHQ9");
  if (!line) {
    return { phq9: null, gad7: null };
  }

  const phqMatch = `${line.label}: ${line.value}`.match(/PHQ9:\s*([^;]+)/i);
  const gadMatch = line.value.match(/GAD7:\s*(.+)$/i);
  const phq9 = phqMatch?.[1]?.trim();
  const gad7 = gadMatch?.[1]?.trim();

  return {
    phq9: phq9 && !isEmptyValue(phq9) ? phq9 : null,
    gad7: gad7 && !isEmptyValue(gad7) ? gad7 : null,
  };
}

function buildPirmreizejaisCanonical(
  serialized: string,
): PirmreizejaisSummaryJson {
  const lines = parseFormLines(serialized);
  const { phq9, gad7 } = parsePhqGad(lines);

  const family = findLine(lines, "ĢIMENĒ PSIHISKAS SASLIMŠANAS");
  const anamneze = collectSentences(
    lines,
    ANAMNEZE_LABELS.filter((label) => label !== "ĢIMENĒ PSIHISKAS SASLIMŠANAS"),
  );
  const familySentence = fromIrNavLine(family, null);
  const anamnezeAll = [
    ...(anamneze ?? []),
    ...(familySentence ? [familySentence] : []),
  ];

  const vizite = findLine(lines, "VIZĪTES IEMESLS");
  let vizitesIemesls: string[] | null = null;
  if (vizite && (!isEmptyValue(vizite.value) || vizite.piezime)) {
    const mapped = !isEmptyValue(vizite.value)
      ? vizite.value.toLowerCase().includes("pirmo reizi")
        ? `Pie psihiatra ${vizite.value}`
        : vizite.value
      : "";
    vizitesIemesls = [combineValueAndNote(mapped, vizite.piezime)];
  }

  return {
    pacientaVardsUzvards: lineContent(findLine(lines, "VĀRDS UZVĀRDS"))?.replace(
      /\.$/,
      "",
    ) ?? null,
    personasKods:
      lineContent(findLine(lines, "PERSONAS KODS"))?.replace(/\.$/, "") ?? null,
    konsultacijasDatums:
      lineContent(findLine(lines, "KONSULTĀCIJAS DATUMS"))?.replace(/\.$/, "") ??
      null,
    vizitesIemesls,
    anamneze: anamnezeAll.length > 0 ? anamnezeAll : null,
    psihoaktivasVielas: collectSentences(lines, SUBSTANCE_LABELS),
    citasSaslimbas: fromIrNavLine(
      findLine(lines, "BLAKUS SASLIMŠANAS"),
      null,
    ),
    lietotieMedikamenti: fromIrNavLine(
      findLine(lines, "LIETOTIE MEDIKAMENTI"),
      null,
    ),
    galvasTraumas: fromIrNavLine(findLine(lines, "GALVAS TRAUMAS"), null),
    neiroinfekcijas: fromIrNavLine(findLine(lines, "NEIROINFEKCIJAS"), null),
    alergijas: fromIrNavLine(findLine(lines, "ALERĢIJAS"), "Noliedz"),
    psihiskaisStavoklis: collectSentences(lines, PSIHISKAS_LABELS),
    somatiski: lineContent(findLine(lines, "SOMATISKI")),
    neirologiski: lineContent(findLine(lines, "NEIROLOĢISKI")),
    phq9,
    gad7,
    parrunatsArPacientu: lineContent(
      findLine(lines, "PĀRRUNĀTS AR PACIENTU"),
    ),
    diagnoze: lineContent(findLine(lines, "DIAGNOZE")),
    taktika: collectSentences(lines, TAKTIKA_LABELS),
  };
}

function nonemptyProtokolsLine(line: FormLine): boolean {
  if (line.piezime) {
    return true;
  }
  if (isEmptyValue(line.value)) {
    return false;
  }
  if (/^[-—]+$/.test(line.value)) {
    return false;
  }
  return true;
}

function buildProtokolsCanonical(serialized: string): ProtokolsSummaryJson {
  const lines = parseFormLines(serialized);
  const diagnoze = findLine(lines, "XI DIAGNOZE");

  const anamnezeLine = lines.find((line) =>
    line.label.includes("Īsa anamnēze"),
  );
  const anamnezeText = anamnezeLine
    ? lineContent(anamnezeLine)
    : null;

  const mental = lines.filter((line) =>
    /^(1\. Apziņa|2\. Orientācija|3\. Kontakts|4\. Atbild|5\. Runa|6\. Uztveres|7\. Halucinācijas|8\. Pārvērtēšanas|9\. Ideju|10\. Formālās|11\. Emocionālās|12\. Garastāvoklis|13\. Trauksme|14\. Uzmanība|15\. Intelekts|16\. Suicidālas|17\. Miegs|18\. Kritika)/i.test(
      line.label,
    ),
  );

  const substances = lines.filter((line) =>
    /alkohol|narkot/i.test(line.label + line.value),
  );

  const somatics = findLine(lines, "VII Somatiskais stāvoklis") ??
    lines.find((line) => /Somatiskais stāvoklis/i.test(line.label));
  const neuro = lines.find((line) =>
    /Neiroloģiskais stāvoklis/i.test(line.label),
  );

  const taktika = lines.filter(
    (line) =>
      nonemptyProtokolsLine(line) &&
      (/Tālākā taktika|turpināt|stacion|XIII/i.test(line.label) ||
        /turpināt|stacion/i.test(line.value)),
  );

  const dateLine = serialized.match(
    /nodaļā\s+(.+?plkst\.:\s*\d+:\d+)/i,
  )?.[1];

  return {
    apskatesDatums: dateLine?.trim() ?? null,
    anamneze: anamnezeText ? [anamnezeText] : null,
    psihoaktivasVielas: collectSentences(
      substances,
      substances.map((line) => line.label),
    ),
    psihiskaisStavoklis: collectSentences(
      mental.filter(nonemptyProtokolsLine),
      mental.map((line) => line.label),
    ),
    somatiski: somatics ? lineContent(somatics) : null,
    neirologiski: neuro ? lineContent(neuro) : null,
    diagnoze: diagnoze ? lineContent(diagnoze) : null,
    parrunatsArPacientu: null,
    taktika: taktika.length
      ? taktika
          .map((line) => lineContent(line))
          .filter((item): item is string => Boolean(item))
      : null,
  };
}

export function buildCanonicalSummaryJson(
  formType: FormType,
  serialized: string,
): SummaryJson {
  if (formType === "pirmreizejais") {
    return buildPirmreizejaisCanonical(serialized);
  }
  return buildProtokolsCanonical(serialized);
}

/** Deterministic summary from form data only — never invents clinical facts. */
export function assembleCanonicalSummary(
  formType: FormType,
  serialized: string,
): string {
  return assembleSummary(
    formType,
    buildCanonicalSummaryJson(formType, serialized),
  );
}
