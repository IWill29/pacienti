import type {
  PirmreizejaisSummaryJson,
  ProtokolsSummaryJson,
  SummaryJson,
} from "@/lib/summary-schema";
import type { FormType } from "@/lib/types/forms";

function joinLines(lines: (string | null | undefined)[]): string {
  return lines.filter(Boolean).join("\n");
}

/** Blank line between major summary blocks (doctor template sections). */
function joinBlocks(blocks: (string | null | undefined)[]): string {
  return blocks.filter((block): block is string => Boolean(block)).join("\n\n");
}

function joinSentences(sentences: string[] | null): string | null {
  if (!sentences || sentences.length === 0) {
    return null;
  }
  return sentences.map((s) => s.trim()).filter(Boolean).join(" ");
}

function boldLabel(label: string): string {
  return `**${label}**`;
}

function labeledSection(
  label: string,
  content: string | null | undefined,
): string | null {
  const trimmed = content?.trim();
  if (!trimmed) {
    return null;
  }
  return `**${label}:** ${trimmed}`;
}

function labeledSentences(
  label: string,
  sentences: string[] | null,
): string | null {
  return labeledSection(label, joinSentences(sentences));
}

function withDashPrefix(label: string, value: string): string {
  const trimmed = value.trim();
  if (trimmed.toLowerCase().startsWith(label.toLowerCase())) {
    return trimmed;
  }
  return `${boldLabel(label)}- ${trimmed}`;
}

function formatPhqGad(phq9: string | null, gad7: string | null): string | null {
  if (!phq9 && !gad7) {
    return null;
  }
  return `${boldLabel("PHQ9")}- ${phq9 ?? "—"}; ${boldLabel("GAD7")}- ${gad7 ?? "—"}`;
}

function formatTaktika(items: string[] | null): string | null {
  if (!items || items.length === 0) {
    return null;
  }
  const lines = items.map((item, index) => {
    const cleaned = item.trim().replace(/^\d+\.\s*/, "");
    return `${index + 1}. ${cleaned}`;
  });
  return `**Taktika:**\n${lines.join("\n")}`;
}

function formatConsultationDate(datums: string): string {
  const trimmed = datums.trim();
  const withoutDot = trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;
  return `Pirmreizēja konsultācija ${withoutDot}.`;
}

export function assemblePirmreizejaisSummary(
  data: PirmreizejaisSummaryJson,
): string {
  const header = [data.pacientaVardsUzvards, data.personasKods]
    .filter(Boolean)
    .join(" ");

  const headerBlock = joinLines([
    header || null,
    data.konsultacijasDatums
      ? formatConsultationDate(data.konsultacijasDatums)
      : null,
  ]);

  return joinBlocks([
    headerBlock || null,
    labeledSentences("Vizītes iemesls", data.vizitesIemesls),
    labeledSentences("Anamnēze no pacienta", data.anamneze),
    labeledSentences("Psihoaktīvo vielu lietošana", data.psihoaktivasVielas),
    labeledSection("Citas saslimšanas", data.citasSaslimbas),
    labeledSection("Lietotie medikamenti", data.lietotieMedikamenti),
    data.galvasTraumas
      ? withDashPrefix("Galvas traumas", data.galvasTraumas)
      : null,
    data.neiroinfekcijas
      ? withDashPrefix("Neiroinfekcijas", data.neiroinfekcijas)
      : null,
    labeledSection("Alerģijas", data.alergijas),
    labeledSentences("Psihiskais stāvoklis", data.psihiskaisStavoklis),
    labeledSection("Somatiski", data.somatiski),
    labeledSection("Neiroloģiski", data.neirologiski),
    formatPhqGad(data.phq9, data.gad7),
    data.parrunatsArPacientu?.trim() || null,
    labeledSection("Diagnoze", data.diagnoze),
    formatTaktika(data.taktika),
  ]);
}

export function assembleProtokolsSummary(data: ProtokolsSummaryJson): string {
  const header = data.apskatesDatums
    ? `Psihiatriskā apskate ${data.apskatesDatums}`
    : "Psihiatriskā apskate";

  return joinBlocks([
    header,
    labeledSentences("Anamnēze no pacienta", data.anamneze),
    labeledSentences("Psihoaktīvo vielu lietošana", data.psihoaktivasVielas),
    labeledSentences("Psihiskais stāvoklis", data.psihiskaisStavoklis),
    labeledSection("Somatiski", data.somatiski),
    labeledSection("Neiroloģiski", data.neirologiski),
    labeledSection("Diagnoze", data.diagnoze),
    data.parrunatsArPacientu?.trim() || null,
    formatTaktika(data.taktika),
  ]);
}

export function assembleSummary(
  formType: FormType,
  json: SummaryJson,
): string {
  if (formType === "pirmreizejais") {
    return assemblePirmreizejaisSummary(json as PirmreizejaisSummaryJson);
  }
  return assembleProtokolsSummary(json as ProtokolsSummaryJson);
}
