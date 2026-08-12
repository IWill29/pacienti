import type { PacientaDzimums } from "@/lib/types/forms";

export function pickGender(
  dzimums: PacientaDzimums,
  virietis: string,
  sieviete: string,
): string {
  return dzimums === "sieviete" ? sieviete : virietis;
}

export function genderLabelOrDash(
  value: string,
  virietis: Record<string, string>,
  sieviete: Record<string, string>,
  dzimums: PacientaDzimums,
): string {
  if (!value) {
    return "—";
  }
  const labels = dzimums === "sieviete" ? sieviete : virietis;
  return labels[value] ?? value;
}

export function formatPacientaDzimums(dzimums: PacientaDzimums): string {
  if (dzimums === "virietis") {
    return "vīrietis";
  }
  if (dzimums === "sieviete") {
    return "sieviete";
  }
  return "—";
}

export const PARRUNATS_AR_PACIENTU_DEFAULT = {
  virietis:
    "Ar pacientu pārrunāta miega higiēna, izskaidrotas rekomendācijas, informēts par medikamentu lietošanas režīmu, nepieciešamību, blakus efektiem. Informēts par psiholoģiskā atbalsta saņemšanas iespējām.",
  sieviete:
    "Ar pacienti pārrunāta miega higiēna, izskaidrotas rekomendācijas, informēta par medikamentu lietošanas režīmu, nepieciešamību, blakus efektiem. Informēta par psiholoģiskā atbalsta saņemšanas iespējām.",
} as const;

export function parrunatsArPacientuDefault(dzimums: PacientaDzimums): string {
  return pickGender(
    dzimums,
    PARRUNATS_AR_PACIENTU_DEFAULT.virietis,
    PARRUNATS_AR_PACIENTU_DEFAULT.sieviete,
  );
}

export const GENDER_PROMPT_RULES = `
DZIMUMS (OBLIGĀTI):
- Formā ir PACIENTA DZIMUMS: vīrietis vai sieviete
- Visā JSON saturā lieto VIENĪGI atbilstošo dzimi — darbības vārdus, divdabjus, īpašības vārdus
- Piemēri vīrietim: "Dzimis", "Bijis atvērts", "Mācījies vidēji", "Precējies", "Pareizi orientēts", "informēts"
- Piemēri sievietei: "Dzimusi", "Bijusi atvērta", "Mācījusies vidēji", "Precējusies", "Pareizi orientēta", "informēta"
- Ja formas frāze jau ir pareizajā dzimtē, saglabā to; citādi pielāgo gramatiski`;
