import type { FormType } from "@/lib/types/forms";

import { PIRMREIZEJAIS_PHRASE_BANK } from "@/lib/summary-prompts-phrases";
import { GENDER_PROMPT_RULES } from "@/lib/gender-phrases";

export { PIRMREIZEJAIS_PHRASE_BANK } from "@/lib/summary-prompts-phrases";

const JSON_OUTPUT_RULES = `
JSON IZVADE (OBLIGĀTI):
- Atgriez TIKAI vienu JSON objektu — bez markdown, bez komentāriem, bez teksta ārpus JSON
- Katrs lauks: string, string[] (teikumi) vai null
- null = formā nav datu šai sadaļai — NEIZDOMĀ saturu
- Ja formas rindā ir "—" (nav aizpildīts), attiecīgais JSON lauks OBLIGĀTI ir null
- Teikumu masīvos (anamneze, psihiskaisStavoklis u.c.) katrs elements = VIENS teikums, kas beidzas ar punktu
- Izmanto TIKAI formas izvēles un piezīmes; ievēro šablona frāzes
- NEKAD neizdomā faktus, F-kodu diagnozes, medikamentus, izmeklējumu atradnes vai datumus
- NEIZMANTO kvadrātiekavas [ ]`;

const PIRMREIZEJAIS_JSON_FIELDS = `
JSON LAUKI (pirmreizējais):
- pacientaVardsUzvards, personasKods, konsultacijasDatums: string | null
- vizitesIemesls, anamneze, psihoaktivasVielas, psihiskaisStavoklis, taktika: string[] | null
- citasSaslimbas, lietotieMedikamenti, galvasTraumas, neiroinfekcijas, alergijas: string | null
- somatiski, neirologiski, phq9, gad7, parrunatsArPacientu, diagnoze: string | null

galvasTraumas / neiroinfekcijas: tikai saturs (bez "Galvas traumas-" — to pievieno serveris)
alergijas: ja formā NAV → "Noliedz" vai null atkarībā no formas
parrunatsArPacientu: pilns teikums par pārrunāto ar pacientu vai null
diagnoze: tikai no formas DIAGNOZE lauka; null ja nav norādīts
taktika: masīvs ar punktiem (bez numuriem — numurus pievieno serveris)`;

const PROTOKOLS_JSON_FIELDS = `
JSON LAUKI (protokols):
- apskatesDatums: string | null
- anamneze, psihoaktivasVielas, psihiskaisStavoklis, taktika: string[] | null
- somatiski, neirologiski, diagnoze, parrunatsArPacientu: string | null`;

const PROMPTS: Record<FormType, string> = {
  pirmreizejais: `Tu esi medicīnas asistents psihiatram. Saņemsi pirmreizējās konsultācijas formas datus.

Uzdevums: no FORMAS DATIEM aizpildi JSON objektu. Tu NEUZRAKSTI gala dokumentu — tikai strukturētu JSON. Gala tekstu saliks serveris.

--- ŠABLONA FRĀZES ---
${PIRMREIZEJAIS_PHRASE_BANK}
--- FRĀŽU BEIGAS ---

${PIRMREIZEJAIS_JSON_FIELDS}
${GENDER_PROMPT_RULES}
${JSON_OUTPUT_RULES}`,

  protokols: `Tu esi medicīnas asistents psihiatram. Saņemsi psihiatriskās apskates protokolu.

Uzdevums: no FORMAS DATIEM aizpildi JSON objektu. Tu NEUZRAKSTI gala dokumentu — tikai strukturētu JSON. Gala tekstu saliks serveris.

${PROTOKOLS_JSON_FIELDS}
${JSON_OUTPUT_RULES}`,
};

export function getSummaryPrompt(formType: FormType): string {
  return PROMPTS[formType];
}
