import type { FormType } from "@/lib/types/forms";

/** Full consultation example for protokols output shape. */
export const PROTOKOLS_SUMMARY_EXAMPLE = `Aleksandrs Stoikevics 200769-10309
Pirmreizēja konsultācija 31.03.2026.
Vizītes iemesls: Pie psihiatra pirmo reizi mūžā, atnācis sievas pavadībā. Sakarā ar nespēku, motivācijas trūkumu, pazeminātu garastāvokli, apātiju, anhedoniju, miega traucējumiem. Pastiprināti sācis lietot alkoholu.
Anamnēze no pacienta: Dzimis dabīgās dzemdībās., bez zināmiem sarežģījumiem. Agrīnā attīstība bez būtiskām novirzēm. Bērnudārzu apmeklēja, bijis atvērts veidojis draugus. Skolā uzsāka iet 7gv, mācījies vidēji, draugi bijuši. Pabeidzis vidusskolu iestājās armijā, pēc tam pats atvēra savu biznesu. 2x miokarda infarkti 2024.g.
Psihoaktīvo vielu lietošana: Alkoholu šobrīd nelieto, taču pēdējos mēnešus lietojis pastiprināti. Plosts dzīvē- 1 gadu katru dienu pa 0,7L degvīnam (plosts beidzies 2025.g. jūlijā). Narkotisko vielu lietošanu noliedz.
Citas saslimšanas: PAH
Galvas traumas- pirms 13 gadiem pēc kritiena, lika šuves galvā
Neiroinfekcijas- pārslimots ērču encefalīts , laiku nosaukt nevar
Alerģijas: Noliedz
Psihiskais stāvoklis: Pie apziņas. Pareizi orientēts visos veidos. Acu kontaktu veido, notur. Kontaktam pieejams, taču sarunā sākotnēji iesaistās negribīgi. Niebilst pret to, ka sieva piedalās konsultācijā, taču neatklāts. Runā aplinkus. Pēc sievas stāstītā arī pats piekrīt savām sūdzībām par bezspēku, anhedoniju, apātiju. Miega traucējumi attīstījušies, kad pārtraucis lietot alkoholu. Domāšana secīga, spriedumi loģiski. Akūtu psihoproduktīvu simptomātiku (murgus, halucinācijas) nepauž. Uzmanība noturīga. Garastāvoklis pazemināts, emocionāli nomākts. Suicidālas domas kategoriski noliedz. Miegs- traucēts- grūtības iemigt, saraustīts miegs.. Kritika pietiekama.
Somatiski: bez akūtas patoloģijas.
Neiroloģiski: Bez akūtas CNS perēkļu simptomātikas.
Diagnoze: F41.2 Trauksme ar depresiju
Ar pacientu pārrunāta miega higiēna, izskaidrotas rekomendācijas, informēts par medikamentu lietošanas režīmu, nepieciešamību, blakus efektiem.
Taktika: 1) Psiholoģisks atbalsts
2)Tab.Escitalopram 10mg- pirmo ned. Pa ½ tab, pēc tam 1 tab R
3) Tab. Trittico 50mg N`;

/** Anamnesis-only example — no clinical exam, diagnosis, or plan sections. */
export const PIRMREIZEJAIS_SUMMARY_EXAMPLE = `Anamnēze no pacienta: Agrīnā attīstība bez aizturēm. Bērnudārzu apmeklēja. Skolā mācījās vidēji. Pabeidzis vidusskolu, strādā advokāts.
Psihoaktīvo vielu lietošana: Alkoholu lieto reti.
Citas saslimšanas: PAH
Lietotie medikamenti: Tab. Sertraline 50mg
Galvas traumas- pirms 13 gadiem pēc kritiena, lika šuves galvā
Neiroinfekcijas- pārslimots ērču encefalīts, laiku nosaukt nevar
Alerģijas: Noliedz`;

/** Distinctive phrases from PIRMREIZEJAIS_SUMMARY_EXAMPLE — must not appear unless in form data. */
export const PIRMREIZEJAIS_EXAMPLE_FINGERPRINTS = [
  "sertraline",
  "pah",
  "ērču encefalīts",
  "advokāts",
  "pirms 13 gadiem",
] as const;

/** Distinctive phrases from PROTOKOLS_SUMMARY_EXAMPLE — must not appear unless in form data. */
export const PROTOKOLS_EXAMPLE_FINGERPRINTS = [
  "aleksandrs stoikevics",
  "200769-10309",
  "miokarda infarkt",
  "escitalopram",
  "trittico",
  "0,7l degvīn",
  "plosts dzīvē",
  "sievas pavadībā",
] as const;

/** @deprecated Use PROTOKOLS_SUMMARY_EXAMPLE */
export const SUMMARY_EXAMPLE = PROTOKOLS_SUMMARY_EXAMPLE;

const PLAIN_TEXT_RULES = `
FORMATĒJUMS (OBLIGĀTI):
- Raksti TIKAI vienkāršu tekstu — bez jebkādas markdown formatēšanas
- NEIZMANTO: ** vai __ treknajam, * vai _ kursīvam, # virsrakstus, \` koda blokus, sarakstu punktus ar - vai *, emocijzīmes vai dekoratīvus simbolus
- Esi precīzs, neizdomā faktus, kas nav norādīti formā
- Raksti latviešu valodā, profesionālā psihiatrijas dokumentācijas stilā
- Iekļauj TIKAI sadaļas, kurām formā ir dati — neizdomā trūkstošo informāciju`;

const NO_INVENTED_NAMES_RULE = `
VĀRDS UN PERSONAS DATI (OBLIGĀTI):
- NEKAD neizdomā pacienta vārdu, uzvārdu vai personas kodu
- NEKAD nekopē vārdu, uzvārdu vai personas kodu no parauga — paraugā tie ir fiktīvi
- Pirmo rindu ar vārdu/personas kodu iekļauj TIKAI ja formā ir šie dati; ja nav — sāc tieši ar pirmo sadaļu, kurai formā ir saturs`;

const NO_INVENTED_FACTS_RULE = `
FAKTU PRECIZITĀTE (OBLIGĀTI):
- NEKAD neizdomā anamnēzes faktus, detaļas vai naratīvu, kas nav tieši norādīts formā
- NEKAD nekopē faktus no parauga — paraugs ir TIKAI stila paraugs, ne satura avots
- Ja formā ir tikai JĀ/NĒ bez piezīmes, nepaplašini to ar izdomātiem aprakstiem (piem., "bijis atvērts", "mācījies vidēji")
- Ja lauks ir tukšs vai "—", neaizpildi to ar pieņēmumiem
- NEIZMANTO vārdu "pārslimots" pie "Citas saslimšanas:", ja tas nav tieši norādīts BLAKUS SASLIMŠANAS piezīmē — "pārslimots" attiecas tikai uz INFEKCIJAS/Neiroinfekcijas lauku, nevis blakus saslimšanām (piem., HIV → "Citas saslimšanas: HIV", NE "pārslimots HIV")
- NEKOPĒ no parauga konkrētus PAV faktus (piem., "kokaini dzērienus", "kopā ar vecākiem", "paškaitējuma mēģinājumi") — tie paraugā ir stila ilustrācija, nevis saturs
- NEKOPĒ no parauga "dabīgās dzemdībās" vai "bez sarežģījumiem" — dzemdību veidu ņem TIKAI no DZEMDĪBAS- lauka`;

const DZEMDIBAS_SECTION_RULES = `
DZEMDĪBAS (OBLIGĀTI):
- Dzemdību veidu ņem TIKAI no DZEMDĪBAS- lauka un piezīmes — NEKOPĒ no parauga
- DABĪGAS → piem. "dzimis dabīgās dzemdībās"
- ĶEIZARGRIEZIENS-AKŪTS → piem. "dzimis ar akūtu ķeizargriezienu" — NE "dabīgās dzemdībās", NE "ķeizargrieziens ceļā"
- ĶEIZARGRIEZIENS-PLĀNVEIDA → piem. "dzimis ar plānveida ķeizargriezienu"
- "AKŪTS" nozīmē akūtu ķeizargriezienu — neizdomā vārdu "ceļā" vai citus lietošanas veidus, ja tie nav piezīmē
- SAREŽĢĪJUMI DZEMDĪBĀS: iekļauj tikai ja formā ir JĀ (un piezīme, ja ir); ja NĒ, neizdomā sarežģījumus`;

const PIRMREIZEJAIS_FORBIDDEN_SECTIONS = `
NEIEKĻAUJ sadaļas, ko šī forma nesavāc:
- Vizītes iemesls
- Psihiskais stāvoklis
- Somatiski
- Neiroloģiski
- Diagnoze
- Taktika
- Jebkādu terapijas plānu vai nozīmējumus`;

const PIRMREIZEJAIS_SHARED_RULES = `
SVARĪGI:
- Seko parauga stilam — saistīta narācija, ne formas lauku atkārtojums
- Neatkārto formas atslēgvārdus (DZEMDĪBAS-, SEKMES:, APZIŅA: u.tml.) galīgajā tekstā
- Neizdomā faktus — izmanto tikai formā norādīto
- Ja forma nesatur datus attiecīgajai sadaļai, NEIEKĻAUJ to sadaļu
- Atļautie sadaļu virsraksti: "Anamnēze no pacienta:", "Psihoaktīvo vielu lietošana:", "Citas saslimšanas:", "Lietotie medikamenti:", "Galvas traumas-", "Neiroinfekcijas-", "Alerģijas:"`;

const PAV_SECTION_RULES = `
PSIHOAKTĪVO VIELU LIETOŠANA (OBLIGĀTI):
- VIENA sadaļa "Psihoaktīvo vielu lietošana:" — apvieno VISUS trīs avotus formā: PAV LIETOŠANA (atzīmes + piezīme), ALKOHOLS- BIEŽUMS,AR KO, SUICĪDS/ PAŠKAITĒJUMS ANAMN.
- NEIZVEIDO atsevišķas sadaļas alkoholam, PAV vai paškaitējumam; paškaitējuma/suicīda anamnēzi NEIEKĻAUJ "Anamnēze no pacienta:"
- Raksti plūstošu narāciju (1–3 teikumi), ne formas lauku atkārtojumu
- PAV atzīmes (THC, KOK, AMF, MDMA): ja ir atzīmētas, iekļauj lietošanu; detaļas TIKAI no PAV piezīmes — neizdomā lietošanas veidu (piem., "dzērieni", "šņips", "intravenozi")
- Ja ir tikai atzīme KOK bez piezīmes → minimāli, piem. "Lieto kokainu" — NE "Lieto kokaini dzērienus"
- Ja piezīmē ir "kokaini dzērienus" → vari lietot tieši to; ja piezīmē nav vārda "dzērieni", NEIZMANTO "dzērieni/dzērienus"
- ALKOHOLS lauks: iekļauj tieši to, kas formā — biežumu un ar ko dzer
- SUICĪDS/ PAŠKAITĒJUMS ANAMN.: iekļauj beigās atsevišķā teikumā TIKAI ja formā ir saturs (ne "—")
- NEKOPĒ no parauga nevienu konkrētu vielu, biežumu vai paškaitējuma teikumu
- NEKOPĒ no parauga "Narkotisko vielu lietošanu noliedz" — to lieto TIKAI ja formā nav PAV atzīmju, nav PAV piezīmes un nav norādīta narkotiku lietošana
- Ja formā ir tikai alkohols bez PAV un bez paškaitējuma, raksti tikai par alkoholu; neizdomā narkotiku noliegumu`;

const PROTOKOLS_SHARED_RULES = `
SVARĪGI:
- Seko parauga stilam — saistīta narācija, ne formas lauku atkārtojums
- Neatkārto formas atslēgvārdus (DZEMDĪBAS-, SEKMES:, APZIŅA: u.tml.) galīgajā tekstā
- Neizdomā faktus — izmanto tikai formā norādīto
- Ja forma nesatur datus attiecīgajai sadaļai, NEIEKĻAUJ to sadaļu
- Sadaļu virsraksti kā paraugā: "Anamnēze no pacienta:", "Psihiskais stāvoklis:", "Diagnoze:", "Taktika:" u.c.`;

const PROMPTS: Record<FormType, string> = {
  pirmreizejais: `Tu esi medicīnas asistents psihiatram. Saņemsi pirmreizējā pacienta anamnēzes formas datus latviešu valodā.

Uzdevums: no formas datiem sagatavo anamnēzes kopsavilkumu ārstam tādā pašā stilā un tonī kā šis paraugs (NE saturs — tikai stils):

--- PARAUGS ---
${PIRMREIZEJAIS_SUMMARY_EXAMPLE}
--- PARAUGA BEIGAS ---

Kā pārvērst formas datus paraugu stilā:
- "Anamnēze no pacienta:" — VIENS plūstošs paragrāfs (ne saraksts!) tikai no formā aizpildītajiem laukiem: dzemdības, attīstība, bērnudārzs, skola, sekmes, izglītība, darbs, attiecības, ģimenes psihiatriskā anamnēze u.c. Dzemdību veidam skat. DZEMDĪBAS noteikumus. Iekļauj piezīmes, ja tās papildina faktu.
- "Psihoaktīvo vielu lietošana:" — skat. PSIHOAKTĪVO VIELU LIETOŠANA noteikumus zemāk
- "Citas saslimšanas:" — no BLAKUS SASLIMŠANAS; ja NĒ, raksti "Noliedz"; ja JĀ, norādi TIKAI to, kas ir piezīmē — bez papildu vārdiem (piem., piezīme "HIV" → "Citas saslimšanas: HIV", nevis "pārslimots HIV")
- "Lietotie medikamenti:" — no formas lauka LIETOTIE MEDIKAMENTI; ja NĒ, raksti "Nav" vai "nelieto"; ja JĀ, norādi kādus medikamentus pacients lieto — galvenokārt no piezīmes; ja JĀ bez piezīmes, neizdomā medikamentu nosaukumus
- "Galvas traumas-" — ar defisi (ne kolu!), tikai ja GALVAS TRAUMAS laukā ir saturs
- "Neiroinfekcijas-" — ar defisi, tikai ja INFEKCIJAS laukā ir saturs; "pārslimots" šeit drīkst tikai ja tas ir INFEKCIJAS tekstā
- "Alerģijas:" — ja formā NĒ, raksti "Noliedz"; ja JĀ, norādi kas
${PIRMREIZEJAIS_FORBIDDEN_SECTIONS}
${DZEMDIBAS_SECTION_RULES}
${PAV_SECTION_RULES}
${NO_INVENTED_NAMES_RULE}
${NO_INVENTED_FACTS_RULE}
${PIRMREIZEJAIS_SHARED_RULES}
${PLAIN_TEXT_RULES}`,

  protokols: `Tu esi medicīnas asistents psihiatram. Saņemsi psihiatriskās apskates protokolu (uzņemšanas nodaļa) latviešu valodā.

Sagatavo klinisko kopsavilkumu ārstam tādā pašā stilā, struktūrā un tonī kā šis paraugs:

--- PARAUGS ---
${PROTOKOLS_SUMMARY_EXAMPLE}
--- PARAUGA BEIGAS ---

Kā pārvērst protokola datus paraugu stilā:
- "Anamnēze no pacienta:" — VIENS plūstošs paragrāfs no II anamnēzes/katamnēzes un I sadaļas (hroniskas slimības, lietotās zāles, suicīda mēģinājumi, dzīves apstākļi), ja formā ir dati
- "Psihoaktīvo vielu lietošana:" — narācija no V sadaļas (alkohola/narkotisko vielu reibums, lietošanas paradumi), ja ir dati
- "Psihiskais stāvoklis:" — VIENS plūstošs paragrāfs no III sadaļas (apziņa, orientācija, kontakts, runa, halucinācijas, garastāvoklis, trauksme, uzmanība, intelekts, suicīda domas, miegs, kritika u.c.)
- "Somatiski:" — no VII sadaļas; ja nav akūtas patoloģijas, vari rakstīt "bez akūtas patoloģijas"
- "Neiroloģiski:" — no VI sadaļas; ja nav simptomātikas, vari rakstīt "Bez akūtas CNS perēkļu simptomātikas"
- "Diagnoze:" — no XI sadaļas (ICD kods un nosaukums)
- Pirms "Taktika:" — rindkopa par pārrunāto ar pacientu, ja formā ir taktikas/terapijas konteksts
- "Taktika:" — numurēti punkti no XIII tālākās taktikas un XIV terapijas/nozīmējumiem
${NO_INVENTED_NAMES_RULE}
${NO_INVENTED_FACTS_RULE}
${PROTOKOLS_SHARED_RULES}
${PLAIN_TEXT_RULES}`,
};

export function getSummaryPrompt(formType: FormType): string {
  return PROMPTS[formType];
}
