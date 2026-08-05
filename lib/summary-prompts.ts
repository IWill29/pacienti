import type { FormType } from "@/lib/types/forms";

/**
 * Format-only template for pirmreizējā konsultācija.
 * Contains NO patient facts — only section order and phrasing patterns.
 * Placeholders in [iekavās] must never appear in the final summary.
 */
export const PIRMREIZEJAIS_FORMAT_TEMPLATE = `[Vārds Uzvārds] [personas kods]
Pirmreizēja konsultācija [datums]
Vizītes iemesls: [pirmo reizi dzīvē / atkārtoti] [ārsta komentārs]
Anamnēze no pacienta: [dzimis ģimenē; dzemdības; termins; patoloģija; agrīnā attīstība; auga; bērnudārzs; raksturs; skola; mācības; apcelšana; uzvedība; izglītība; darbs; attiecības; bērni; ģimenes psih.sasl.; galvas traumas; neiroinfekcijas; alerģijas — tikai aizpildītais]
Psihoaktīvo vielu lietošana: [alkohols; PAV; suicidāla uzvedība — tikai aizpildītais]
Citas saslimšanas: [blakus saslimšanas]
Lietotie medikamenti: [medikamenti]
Psihiskais stāvoklis: [apziņa; orientācija; kontakts; iniciatīva; izskats; runa; atbildes; stāstījums; sūdzības; uzmanība; domāšana; psihoproduktīva simptomātika; garastāvoklis; emocijas; trauksme; intelekts; suicidālas domas; miegs; kritika — tikai aizpildītais]
Somatiski: [bez akūtas patoloģijas / ārsta komentārs]
Neiroloģiski: [Bez akūtas CNS perēkļu simptomātikas / ārsta komentārs]
PHQ9- [punkti]; GAD7- [punkti]
Ar pacientu pārrunāta miega higiēna, izskaidrotas rekomendācijas, informēts par medikamentu lietošanas režīmu, nepieciešamību, blakus efektiem. Informēts par psiholoģiskā atbalsta saņemšanas iespējām. [ārsta papildinājums]
Taktika:
1. Atrasties [ģimenes ārsta / psihiatra / komentārs] uzraudzībā!
2. Ikdienā ievērot sabalansētu darba-atpūtas režīmu, veikt fiziskas aktivitātes vismaz 1h/dienā, uzņemt sabalansētu uzturu!
3. Medikamentozā terapija: [ārsta komentārs]
4. [Psiholoģisks atbalsts / psihoterapija]`;

/** Protokols keeps a separate clinical format; no invented patient content. */
export const PROTOKOLS_FORMAT_TEMPLATE = `Psihiatriskā apskate [datums]
Anamnēze no pacienta: [tikai no formas]
Psihoaktīvo vielu lietošana: [tikai no formas]
Psihiskais stāvoklis: [tikai no formas]
Somatiski: [tikai no formas]
Neiroloģiski: [tikai no formas]
Diagnoze: [tikai no formas]
Taktika: [tikai no formas]`;

/** @deprecated — use PIRMREIZEJAIS_FORMAT_TEMPLATE */
export const PIRMREIZEJAIS_SUMMARY_EXAMPLE = PIRMREIZEJAIS_FORMAT_TEMPLATE;
/** @deprecated — use PROTOKOLS_FORMAT_TEMPLATE */
export const PROTOKOLS_SUMMARY_EXAMPLE = PROTOKOLS_FORMAT_TEMPLATE;
/** @deprecated */
export const SUMMARY_EXAMPLE = PROTOKOLS_FORMAT_TEMPLATE;

const PLAIN_TEXT_RULES = `
FORMATĒJUMS (OBLIGĀTI):
- Raksti TIKAI vienkāršu tekstu — bez markdown
- NEIZMANTO: **, __, #, \` , sarakstu punktus ar - vai *, emocijzīmes
- Raksti latviešu valodā, profesionālā psihiatrijas dokumentācijas stilā
- Iekļauj TIKAI sadaļas, kurām formā ir dati
- NEIZMANTO kvadrātiekavas [ ] gala tekstā — tās šablonā ir tikai vietturis`;

const DOCTOR_TEXT_ONLY_RULES = `
ĀRSTA TEKSTS (OBLIGĀTI):
- Izmanto TIKAI formas izvēles un piezīmes (piez.: ...)
- Drīksti tikai loģiski sakārtot un gramatiski labot ārsta tekstu
- NEKAD neizdomā faktus, diagnozes, medikamentus, datumus, vārdus vai detaļas
- Ja lauks ir tukšs vai "—", neaizpildi to
- Ja ir tikai izvēle bez piezīmes, raksti minimāli (piem., "dzimis dabīgās dzemdībās") — bez izdomāta stāsta
- Piezīmes iekļauj tajā pašā teikumā/sadaļā, kurai tās pieder
- NEKOPĒ šablona vietturi vai parauga tekstu`;

const PIRMREIZEJAIS_SECTION_RULES = `
SADAĻU KĀRTĪBA (kā ārsta šablonā; izlaid tukšās):
1. Vārds/personas kods (tikai ja formā ir)
2. Pirmreizēja konsultācija [datums]
3. Vizītes iemesls:
4. Anamnēze no pacienta: — VIENS plūstošs paragrāfs no anamnēzes laukiem
5. Psihoaktīvo vielu lietošana: — alkohols, PAV, suicidālā uzvedība
6. Citas saslimšanas: / Lietotie medikamenti:
7. Psihiskais stāvoklis: — VIENS plūstošs paragrāfs
8. Somatiski: / Neiroloģiski:
9. PHQ9- …; GAD7- …
10. Rindkopa par pārrunāto (ja formā atzīmēts vai ir piezīme)
11. Taktika: numurēti punkti 1–4 no formas`;

const PROTOKOLS_SECTION_RULES = `
SADAĻAS (tikai ja formā ir dati):
- Anamnēze no pacienta:
- Psihoaktīvo vielu lietošana:
- Psihiskais stāvoklis:
- Somatiski: / Neiroloģiski:
- Diagnoze:
- Taktika:`;

const PROMPTS: Record<FormType, string> = {
  pirmreizejais: `Tu esi medicīnas asistents psihiatram. Saņemsi pirmreizējās konsultācijas formas datus.

Uzdevums: no FORMAS DATIEM sagatavo gala dokumenta tekstu. Seko šai STRUKTŪRAI (ne saturam — šablonā nav īstu pacientu datu):

--- FORMĀTA ŠABLONS ---
${PIRMREIZEJAIS_FORMAT_TEMPLATE}
--- ŠABLONA BEIGAS ---

${DOCTOR_TEXT_ONLY_RULES}
${PIRMREIZEJAIS_SECTION_RULES}
${PLAIN_TEXT_RULES}`,

  protokols: `Tu esi medicīnas asistents psihiatram. Saņemsi psihiatriskās apskates protokolu.

Sagatavo kopsavilkumu TIKAI no formas datiem. Struktūra:

--- FORMĀTA ŠABLONS ---
${PROTOKOLS_FORMAT_TEMPLATE}
--- ŠABLONA BEIGAS ---

${DOCTOR_TEXT_ONLY_RULES}
${PROTOKOLS_SECTION_RULES}
${PLAIN_TEXT_RULES}`,
};

export function getSummaryPrompt(formType: FormType): string {
  return PROMPTS[formType];
}
