import {
  formatPacientaDzimums,
  genderLabelOrDash,
  parrunatsArPacientuDefault,
} from "@/lib/gender-phrases";
import type {
  PirmreizejaisPacientsData,
  ProtokolsData,
} from "@/lib/types/forms";

function formatJaNe(value: string): string {
  if (value === "ja") return "JĀ";
  if (value === "ne") return "NĒ";
  return "—";
}

function formatIrNav(value: string): string {
  if (value === "ir") return "IR";
  if (value === "nav") return "NAV";
  return "—";
}

function formatChecked(checked: boolean, label: string): string | null {
  return checked ? label : null;
}

function joinLines(lines: (string | null | undefined)[]): string {
  return lines.filter(Boolean).join("\n");
}

function appendPiezime(line: string, piezime: string | undefined): string {
  const trimmed = piezime?.trim();
  return trimmed ? `${line} (piez.: ${trimmed})` : line;
}

function labelOrDash(
  value: string,
  labels: Record<string, string>,
): string {
  if (!value) return "—";
  return labels[value] ?? value;
}

export function serializePirmreizejaisPacients(
  data: PirmreizejaisPacientsData,
): string {
  const piez = data.piezimes;
  const dz = data.pacientaDzimums;

  const pavActive = [
    data.pavLietosana.thc ? "THC" : null,
    data.pavLietosana.amp ? "AMP" : null,
    data.pavLietosana.coc ? "COC" : null,
    data.pavLietosana.mdma ? "MDMA" : null,
  ].filter(Boolean);

  const pavMegina = [
    data.pavMegina.thc ? "THC" : null,
    data.pavMegina.amp ? "AMP" : null,
    data.pavMegina.coc ? "COC" : null,
    data.pavMegina.mdma ? "MDMA" : null,
  ].filter(Boolean);

  const pavLine = data.pavLietosana.nelieto
    ? "nelieto"
    : pavActive.length > 0
      ? `lieto: ${pavActive.join(", ")}`
      : "—";

  return joinLines([
    "PIRMREIZĒJĀ KONSULTĀCIJA",
    `VĀRDS UZVĀRDS: ${data.pacientaVardsUzvards || "—"}`,
    `PERSONAS KODS: ${data.personasKods || "—"}`,
    `PACIENTA DZIMUMS: ${formatPacientaDzimums(dz)}`,
    `KONSULTĀCIJAS DATUMS: ${data.vizitesDatums || "—"}`,
    appendPiezime(
      `VIZĪTES IEMESLS: ${labelOrDash(data.vizitesIemesls, {
        pirmo_reizi: "pirmo reizi dzīvē",
        atkartoti: "atkārtoti",
      })}`,
      piez.vizitesIemesls,
    ),
    "",
    "ANAMNĒZE",
    appendPiezime(
      `DZEMDĪBAS: ${genderLabelOrDash(
        data.dzemdibasVeids,
        {
          dabigas: "Dzimis dabīgās dzemdībās",
          keizargrieziens: "Dzimis ar ķeizargriezienu",
        },
        {
          dabigas: "Dzimusi dabīgās dzemdībās",
          keizargrieziens: "Dzimusi ar ķeizargriezienu",
        },
        dz,
      )}`,
      piez.dzemdibasVeids,
    ),
    appendPiezime(
      `DZEMDĪBU TERMINS: ${labelOrDash(data.dzemdibasTermins, {
        laicigi: "laicīgi",
        prieksalicigi: "priekšlaicīgi",
        noveloti: "novēloti",
      })}`,
      piez.dzemdibasTermins,
    ),
    appendPiezime(
      `DZEMDĪBU PATOLOĢIJA: ${labelOrDash(data.dzemdibuPatologija, {
        neatzime: "bez zināmiem sarežģījumiem",
        ir: "ir dzemdību patoloģija",
      })}`,
      piez.dzemdibuPatologija,
    ),
    appendPiezime(
      `AGRĪNĀ ATTĪSTĪBA: ${labelOrDash(data.agrinaAttistiba, {
        bez_novirzem: "Agrīnā attīstība bez būtiskām novirzēm",
        ar_novirzem: "Agrīnā attīstība ar novirzēm",
      })}`,
      piez.agrinaAttistiba,
    ),
    appendPiezime(
      `AUGA: ${labelOrDash(data.augaGimene, {
        pilna: "Auga pilnā ģimenē",
        skirta: "Auga šķirtā ģimenē",
      })}`,
      piez.augaGimene,
    ),
    appendPiezime(
      `BĒRNUDĀRZS: ${labelOrDash(data.bernudarzs, {
        ja: "Bērnudārzu apmeklēja",
        ne: "Bērnudārzu neapmeklēja",
      })}`,
      piez.bernudarzs,
    ),
    appendPiezime(
      `RAKSTURS: ${genderLabelOrDash(
        data.raksturs,
        {
          atverts: "bijis atvērts, komunikabls",
          nosverts: "bijis nosvērts, kluss",
        },
        {
          atverts: "bijusi atvērta, komunikabla",
          nosverts: "bijusi nosvērta, klusa",
        },
        dz,
      )}`,
      piez.raksturs,
    ),
    appendPiezime(
      `SKOLĀ UZSĀKA: ${data.skola ? `Skolā uzsāka iet ${data.skola}gv` : "—"}`,
      piez.skola,
    ),
    appendPiezime(
      `MĀCĪJĀS: ${genderLabelOrDash(
        data.sekmes,
        {
          slikti: "mācījies slikti",
          videji: "mācījies vidēji",
          labi: "mācījies labi",
        },
        {
          slikti: "mācījusies slikti",
          videji: "mācījusies vidēji",
          labi: "mācījusies labi",
        },
        dz,
      )}`,
      piez.sekmes,
    ),
    appendPiezime(
      `APCELŠANA SKOLĀ: ${labelOrDash(data.apcelsanaSkola, {
        netika: "apcelšana netika novērota",
        tika: "apcelšana skolā tika novērota",
      })}`,
      piez.apcelsanaSkola,
    ),
    appendPiezime(
      `UZVEDĪBA SKOLĀ: ${labelOrDash(data.uzvedibaSkola, {
        apmierinosa: "uzvedība skolā apmierinoša",
        traucejumi: "uzvedība skolā ar traucējumiem",
      })}`,
      piez.uzvedibaSkola,
    ),
    piez.iegutaIzglitiba.trim()
      ? `IEGŪTĀ IZGLĪTĪBA: ${piez.iegutaIzglitiba.trim()}`
      : null,
    appendPiezime(
      `DARBS: ${labelOrDash(data.darbs, {
        nestrada: "nestrādā",
        strada: "strādā",
      })}`,
      piez.darbs,
    ),
    appendPiezime(
      `ATTIECĪBU STATUSS: ${genderLabelOrDash(
        data.attiecibuStatuss,
        { precejies: "precējies", dzivo_viens: "dzīvo viens" },
        { precejies: "precējusies", dzivo_viens: "dzīvo viena" },
        dz,
      )}`,
      piez.attiecibuStatuss,
    ),
    appendPiezime(`BĒRNI: ${formatIrNav(data.bern)}`, piez.bern),
    appendPiezime(
      `ĢIMENĒ PSIHISKAS SASLIMŠANAS: ${formatIrNav(data.gimenePsihSasl)}`,
      piez.gimenePsihSasl,
    ),
    appendPiezime(
      `GALVAS TRAUMAS: ${formatIrNav(data.galvasTraumas)}`,
      piez.galvasTraumas,
    ),
    appendPiezime(
      `NEIROINFEKCIJAS: ${formatIrNav(data.neiroinfekcijas)}`,
      piez.neiroinfekcijas,
    ),
    appendPiezime(
      `ALERĢIJAS: ${labelOrDash(data.alergijas, {
        nav: "Noliedz",
        ir: "IR",
      })}`,
      piez.alergijas,
    ),
    appendPiezime(
      `ALKOHOLS: ${labelOrDash(data.alkohols, {
        nelieto: "Alkoholu nelieto",
        lieto: "Alkoholu lieto",
      })}`,
      piez.alkohols,
    ),
    appendPiezime(
      `PAV LIETOŠANA: ${
        data.pavLietosana.nelieto
          ? "Narkotisko vielu lietošanu noliedz"
          : pavLine
      }`,
      piez.pavLietosana,
    ),
    appendPiezime(
      `PAV MĒĢINĀJIS DZĪVES LAIKĀ: ${pavMegina.length > 0 ? pavMegina.join(", ") : "—"}`,
      piez.pavMegina,
    ),
    appendPiezime(
      `SUICIDĀLA UZVEDĪBA: ${genderLabelOrDash(
        data.suicidalaUzvediba,
        {
          nav: "nav bijusi",
          paskaitējums: "veicis paškaitējumu",
          pasnavibas_meginajums: "veicis pašnāvības mēģinājumu",
        },
        {
          nav: "nav bijusi",
          paskaitējums: "veikusi paškaitējumu",
          pasnavibas_meginajums: "veikusi pašnāvības mēģinājumu",
        },
        dz,
      )}`,
      piez.suicidalaUzvediba,
    ),
    appendPiezime(
      `BLAKUS SASLIMŠANAS: ${formatIrNav(data.blakusSaslimibas)}`,
      piez.blakusSaslimibas,
    ),
    appendPiezime(
      `LIETOTIE MEDIKAMENTI: ${formatIrNav(data.lietotasMedikamenti)}`,
      piez.lietotasMedikamenti,
    ),
    "",
    "PSIHISKAIS STĀVOKLIS",
    appendPiezime(
      `APZIŅA: ${labelOrDash(data.apzina, {
        skaidra: "Pie apziņas",
        sasaurinata: "Apziņa sašaurināta",
      })}`,
      piez.apzina,
    ),
    appendPiezime(
      `ORIENTĀCIJA: ${genderLabelOrDash(
        data.orientacija,
        { pareizi: "Pareizi orientēts visos veidos", komentars: "skat. piezīmi" },
        { pareizi: "Pareizi orientēta visos veidos", komentars: "skat. piezīmi" },
        dz,
      )}`,
      piez.orientacija,
    ),
    appendPiezime(
      `KONTAKTS: ${labelOrDash(data.kontakts, {
        pieejams: "Kontaktam pieejams",
      })}`,
      piez.kontakts,
    ),
    appendPiezime(
      `SARUNAS INICIATĪVA: ${labelOrDash(data.sarunasIniciativa, {
        uztur: "sarunas iniciatīvu uztur",
        neuztur: "sarunas iniciatīvu neuztur",
      })}`,
      piez.sarunasIniciativa,
    ),
    appendPiezime(
      `IZSKATS: ${labelOrDash(data.izskats, {
        kopts: "izskats kopts",
        nevizigs: "izskats nevīžīgs",
      })}`,
      piez.izskats,
    ),
    appendPiezime(
      `RUNA: ${labelOrDash(data.runa, {
        apmierinosa: "runa apmierinoša tempa",
      })}`,
      piez.runa,
    ),
    appendPiezime(
      `ATBILDES: ${labelOrDash(data.atbildes, {
        pec_butibas: "atbildes pēc būtības",
        daleji: "atbildes daļēji pēc būtības",
        ne_pec_butibas: "atbildes ne pēc būtības",
      })}`,
      piez.atbildes,
    ),
    appendPiezime(
      `STĀSTĪJUMS: ${labelOrDash(data.stastijums, {
        secigs: "stāstījums secīgs",
      })}`,
      piez.stastijums,
    ),
    appendPiezime(`SŪDZAS: ${piez.sudzibas || "—"}`, undefined),
    appendPiezime(
      `UZMANĪBA: ${labelOrDash(data.uzmaniba, {
        noturiga: "Uzmanība noturīga",
        nenoturiga: "Uzmanība nenoturīga",
      })}`,
      piez.uzmaniba,
    ),
    appendPiezime(
      `DOMĀŠANA: ${labelOrDash(data.domasana, {
        seciga: "Domāšana secīga, spriedumi loģiski",
      })}`,
      piez.domasana,
    ),
    appendPiezime(
      `PSIHOPRODUKTĪVA SIMPTOMĀTIKA: ${labelOrDash(data.psihoproduktivs, {
        nenovero:
          "Akūtu psihoproduktīvu simptomātiku (murgus, halucinācijas) nepauž",
        ir: "ir psihoproduktīva simptomātika (murgi/halucinācijas)",
      })}`,
      piez.psihoproduktivs,
    ),
    appendPiezime(
      `GARASTĀVOKLIS: ${labelOrDash(data.garastavoklis, {
        piepacelts: "Garastāvoklis piepacelts",
        neitrals: "Garastāvoklis neitrāls",
        pazeminats: "Garastāvoklis pazemināts",
      })}`,
      piez.garastavoklis,
    ),
    appendPiezime(
      `EMOCIONĀLĀS REAKCIJAS: ${data.emocionalasReakcijas.length > 0 ? data.emocionalasReakcijas.join(", ") : "—"}`,
      piez.emocionalasReakcijas,
    ),
    appendPiezime(
      `TRAUKSME: ${formatJaNe(data.trauksme.ir)}${data.trauksme.veids ? ` (${data.trauksme.veids})` : ""}`,
      piez.trauksme,
    ),
    appendPiezime(
      `INTELEKTS: ${labelOrDash(data.intelekts, {
        pilnvertigs: "pilnvērtīgs",
        viegli: "viegli pazemināts",
        videji: "vidēji pazemināts",
        izteikti: "izteikti pazemināts",
      })}`,
      piez.intelekts,
    ),
    appendPiezime(
      `SUICIDĀLAS DOMAS: ${labelOrDash(data.suicidalsDomas, {
        noliedz: "Suicidālas domas noliedz",
        atklaj: "Suicidālas domas atklāj",
      })}`,
      piez.suicidalsDomas,
    ),
    appendPiezime(
      `MIEGS: ${data.miegs.length > 0 ? data.miegs.join(", ") : "—"}`,
      piez.miegs,
    ),
    appendPiezime(
      `KRITIKA: ${labelOrDash(data.kritika, {
        ir: "Kritika pietiekama",
        nav: "Kritika nav",
        formala: "Kritika formāla",
      })}`,
      piez.kritika,
    ),
    "",
    appendPiezime(
      `SOMATISKI: ${labelOrDash(data.somatiski, {
        bez_patologijas: "bez akūtas patoloģijas",
        ir: "ir",
      })}`,
      piez.somatiski,
    ),
    appendPiezime(
      `NEIROLOĢISKI: ${labelOrDash(data.neirologiski, {
        bez_simptomatikas: "Bez akūtas CNS perēkļu simptomātikas",
        ir: "ir",
      })}`,
      piez.neirologiski,
    ),
    appendPiezime(
      `PHQ9: ${data.phq9 || "—"}; GAD7: ${data.gad7 || "—"}`,
      piez.phq9Gad7,
    ),
    `PĀRRUNĀTS AR PACIENTU: ${piez.parrunats.trim() || parrunatsArPacientuDefault(dz)}`,
    piez.diagnoze.trim() ? `DIAGNOZE: ${piez.diagnoze.trim()}` : null,
    "",
    "TAKTIKA",
    appendPiezime(
      `1. UZRAUDZĪBA: ${[
        formatChecked(
          data.taktikaUzraudziba.gimenes_arsts,
          "Atrasties ģimenes ārsta uzraudzībā!",
        ),
        formatChecked(
          data.taktikaUzraudziba.psihiatrs,
          "Atrasties psihiatra uzraudzībā!",
        ),
        formatChecked(data.taktikaUzraudziba.cits, "cits"),
      ]
        .filter(Boolean)
        .join(" ") || "—"}`,
      piez.taktikaUzraudziba,
    ),
    appendPiezime("2. IKDIENĀ:", piez.taktikaIkdiena),
    appendPiezime("3. MEDIKAMENTOZĀ TERAPIJA:", piez.taktikaMedikamenti),
    appendPiezime(
      `4. PSIHOLOĢISKAIS ATBALSTS: ${labelOrDash(data.taktikaPsiholoģija, {
        psihologisks_atbalsts: "Psiholoģisks atbalsts",
        psihoterapija: "Psihoterapija",
      })}`,
      piez.taktikaPsiholoģija,
    ),
  ]);
}

export function serializeProtokols(data: ProtokolsData): string {
  const orientLabels: Record<string, string> = {
    pilniga: "pilnīga",
    daleja: "daļēja",
    nav: "nav",
  };

  return joinLines([
    "PSIHIATRISKĀ APSKATE",
    `Neatliekamās medicīniskās palīdzības un pacientu uzņemšanas nodaļā ${data.gads} g. ${data.datums}, ${data.vieta}, plkst.: ${data.stunda}:${data.minutes}`,
    "",
    "I Ziņas par pacientu",
    `1. Pacients stacionēts: ${data.stacionets || "—"}`,
    `ar nosūtījumu no: ${data.nosutijumsNo || "—"}`,
    [
      formatChecked(data.nosutijumsTips.psihiatrs, "psihiatra"),
      formatChecked(data.nosutijumsTips.gimenesArsts, "ģimenes ārsta"),
      formatChecked(data.nosutijumsTips.nmpd, "NMPD"),
      formatChecked(data.nosutijumsTips.bezNosutijuma, "bez nosūtījuma"),
      formatChecked(data.nosutijumsTips.arPoliciju, "ar policiju"),
      formatChecked(data.nosutijumsTips.pirmreizeji, "pirmreizēji"),
      formatChecked(data.nosutijumsTips.atkartoti, "atkārtoti"),
      data.nosutijumsTips.parvestsNo
        ? `pārvests no: ${data.nosutijumsTips.parvestsNo}`
        : null,
    ]
      .filter(Boolean)
      .join("; "),
    `2. Pacients: ${data.strada ? "strādā" : data.nestrada ? "nestrādā" : "—"}`,
    data.invaliditate ? "ir invaliditāte" : null,
    [
      formatChecked(data.dzivo.viens, "Pacients dzīvo: viens"),
      formatChecked(data.dzivo.gimene, "Pacients dzīvo: ģimenē"),
      formatChecked(data.dzivo.sac, "Pacients dzīvo: SAC"),
      data.dzivo.cits ? `Pacients dzīvo: cits: ${data.dzivo.cits}` : null,
    ]
      .filter(Boolean)
      .join("; "),
    [
      formatChecked(data.ambulatoraisPsihiatrs.neapmekle, "neapmeklē"),
      formatChecked(data.ambulatoraisPsihiatrs.neregulari, "apmeklē neregulāri"),
      formatChecked(data.ambulatoraisPsihiatrs.regulari, "apmeklē regulāri"),
    ]
      .filter(Boolean)
      .join("; "),
    `5. Hroniskas slimības: ${data.hroniskasSlimibas.noliedz ? "noliedz" : data.hroniskasSlimibas.ir ? `ir, kādas: ${data.hroniskasSlimibas.apraksts}` : "—"}`,
    `6. Lietotās zāles: ${data.lietotasZales.nav ? "nav" : data.lietotasZales.ir ? `ir, kādas: ${data.lietotasZales.apraksts}` : "—"}`,
    `7. Suicīda mēģinājumi: ${data.suicidaMeginajumi.nav ? "nav" : data.suicidaMeginajumi.ir ? `ir, kādi: ${data.suicidaMeginajumi.apraksts}` : "—"}`,
    "",
    "II Īsa anamnēze/katamnēze:",
    data.anamneze || "—",
    "",
    "III Sūdzības, psihiskais stāvoklis:",
    `1. Apziņa: ${data.apzina || "—"}`,
    `2. Orientācija — laikā: ${orientLabels[data.orientacija.laika] ?? "—"}, vietā: ${orientLabels[data.orientacija.vieta] ?? "—"}, personībā: ${orientLabels[data.orientacija.personalba] ?? "—"}`,
    `3. Kontakts ar pacientu: ${data.kontakts || "—"}`,
    `4. Atbild: ${data.atbild || "—"}`,
    `5. Runa: ${data.runa.temp || "—"}, ${data.runa.saprotamiba || "—"}${data.runa.artikulacija ? ", artikulācijas traucējumi" : ""}`,
    `6. Uztveres traucējumi: ${formatJaNe(data.uztveresTraucejumi)}`,
    `7. Halucinācijas: ${Object.entries(data.halucinacijas).filter(([, v]) => v).map(([k]) => k).join(", ") || "—"}`,
    `8. Pārvērtēšanas un murgu idejas: ${formatJaNe(data.parvertesanasIdejas.ir)}${[
      formatChecked(data.parvertesanasIdejas.paranojalas, "paranojālas"),
      formatChecked(data.parvertesanasIdejas.paranoīdas, "paranoīdas"),
      formatChecked(data.parvertesanasIdejas.parafrēnas, "parafrēnas"),
      formatChecked(data.parvertesanasIdejas.telainas, "tēlainas"),
      formatChecked(data.parvertesanasIdejas.sistematizetas, "sistematizētas"),
      data.parvertesanasIdejas.citas ? `citas: ${data.parvertesanasIdejas.citas}` : null,
    ]
      .filter(Boolean)
      .join("; ")}`,
    `9. Ideju ietekme uzvedību: ${data.idejuIetekmeUzvediba || "—"}`,
    `10. Formālās domāšanas traucējumi: ${formatJaNe(data.formalasDomasanas.ir)} ${data.formalasDomasanas.apraksts || ""}`,
    `11. Emocionālās reakcijas: ${data.emocionalasReakcijas.join(", ") || "—"}`,
    `12. Garastāvoklis: ${data.garastavoklis || "—"}`,
    `13. Trauksme: ${formatJaNe(data.trauksme.ir)} ${data.trauksme.veids || ""}`,
    `14. Uzmanība, atmiņa: ${data.uzmanibaAtmina || "—"}`,
    `15. Intelekts: ${data.intelekts || "—"}`,
    `16. Suicidālas domas: ${formatJaNe(data.suicidalsDomas)}`,
    `17. Miegs: ${data.miegs.veids.join(", ") || "—"}${data.miegs.navGulejisNaktis ? `; nav gulējis ${data.miegs.navGulejisNaktis} naktis` : ""}`,
    `18. Kritika: ${data.kritika || "—"}`,
    "",
    "IV Pacienta ārējais izskats un uzvedība:",
    data.arejaisIzskats || "—",
    "",
    "V Alkohola/narkotisko vielu reibuma pazīmes:",
    data.alkoholaReibums.nekonstate
      ? "nekonstatē"
      : data.alkoholaReibums.ir
        ? `ir, BAC = ${data.alkoholaReibums.bac} ‰; ${data.alkoholaReibums.kadas}; lietošanas paradumi: ${data.alkoholaReibums.lietosanasParadumi}`
        : "—",
    "",
    "VI Neiroloģiskais stāvoklis:",
    data.neirologiskais.simptomatika || "—",
    data.neirologiskais.citaSimptomatika || "—",
    [
      formatChecked(data.neirologiskais.nenovēro, "nenovēro"),
      formatChecked(data.neirologiskais.ir, "ir"),
    ]
      .filter(Boolean)
      .join("; ") || null,
    "",
    "VII Somatiskais stāvoklis:",
    data.somatisks.nav
      ? "nav"
      : data.somatisks.ir
        ? `ir, kādas: ${data.somatisks.apraksts}`
        : "—",
    "",
    "VIII Vitalie rādītāji:",
    `Augums=${data.vitalieRaditaji.augums} cm; Svars=${data.vitalieRaditaji.svars} kg; tO=${data.vitalieRaditaji.to} °C; p=${data.vitalieRaditaji.pulss} x'; TA=${data.vitalieRaditaji.ta} mmHg; SpO2=${data.vitalieRaditaji.spo2}%; GLC=${data.vitalieRaditaji.glc} mmol/l`,
    "",
    "IX Augšējo elpceļu infekcijas simptomātika:",
    data.elpceļuInfekcija.nav
      ? "nav"
      : data.elpceļuInfekcija.ir
        ? `ir, kāda: ${data.elpceļuInfekcija.apraksts}`
        : "—",
    "",
    "X Miesas bojājumi:",
    data.miesasBojajumi.nav
      ? "nav"
      : data.miesasBojajumi.ir
        ? `ir, kādi: ${data.miesasBojajumi.apraksts}`
        : "—",
    "",
    `XI DIAGNOZE: ${data.diagnoze || "—"}`,
    `XII CGI-S skala: ${data.cgiS || "—"}`,
    "",
    "XIII Tālākā taktika:",
    [
      formatChecked(data.talakaTaktika.ambulatori, "turpināt ārstēšanu ambulatori"),
      formatChecked(
        data.talakaTaktika.psihiatraMotivets,
        "psihiatra motivēts lēmums par stacionēšanu",
      ),
      formatChecked(data.talakaTaktika.stacionets, "stacionēts saskaņā ar Ārstniecības likumu"),
      formatChecked(data.talakaTaktika.piemerotaIerobezosana, "piemērota ierobežošana"),
      formatChecked(data.talakaTaktika.stacionešanaiPiekrīt, "stacionēšanai piekrīt"),
      formatChecked(data.talakaTaktika.stacionešanaiNepiekrīt, "stacionēšanai nepiekrīt"),
      formatChecked(data.talakaTaktika.mrpl, "MRPL"),
      formatChecked(data.talakaTaktika.stpe, "STPE"),
      formatChecked(data.talakaTaktika.punkts1, "1.punktu"),
      formatChecked(data.talakaTaktika.punkts2, "2.punktu"),
    ]
      .filter(Boolean)
      .join("; "),
    "",
    "XIV NOZĪMĒJUMI:",
    `Izmeklējumi: stacionēt ${data.nozimejumi.stacionet || "—"} nodaļā!`,
    [
      formatChecked(data.nozimejumi.observet, "observēt"),
      formatChecked(data.nozimejumi.parvest, "pārvest"),
      formatChecked(data.nozimejumi.ekg, "EKG"),
      formatChecked(data.nozimejumi.pilnaAsinsAina, "pilna asins aina"),
      formatChecked(data.nozimejumi.asat, "ASAT"),
      formatChecked(data.nozimejumi.rtg, "RTG"),
      formatChecked(data.nozimejumi.urins, "urīns ar stripu"),
      formatChecked(data.nozimejumi.alat, "ALAT"),
      formatChecked(data.nozimejumi.glikoze, "glikoze ar stripu"),
      formatChecked(data.nozimejumi.ggt, "GGT"),
      formatChecked(data.nozimejumi.usg, "USG"),
      formatChecked(data.nozimejumi.na, "Na"),
      formatChecked(data.nozimejumi.k, "K"),
      formatChecked(data.nozimejumi.bi, "Bi"),
      formatChecked(data.nozimejumi.cro, "CRO"),
      formatChecked(data.nozimejumi.kreatinins, "kreatinīns"),
    ]
      .filter(Boolean)
      .join("; "),
    data.nozimejumi.novērošanasLimenis === "pasaprūpes"
      ? "Novērošanas līmenis: pašaprūpes nodrošinājuma palāta"
      : data.nozimejumi.novērošanasLimenis === "vispareja"
        ? "Novērošanas līmenis: vispārēja tipa palāta"
        : null,
    data.nozimejumi.novērotUz.length > 0
      ? `Novērot uz: ${data.nozimejumi.novērotUz.join(", ")}`
      : null,
    data.nozimejumi.kontrolet.length > 0 || data.nozimejumi.kontroletCits
      ? `Kontrolēt: ${[
          ...data.nozimejumi.kontrolet,
          data.nozimejumi.kontroletCits ? `cits: ${data.nozimejumi.kontroletCits}` : null,
        ]
          .filter(Boolean)
          .join(", ")}`
      : null,
    data.nozimejumi.dieta.length > 0 || data.nozimejumi.dietaCita
      ? `Diēta: ${[
          ...data.nozimejumi.dieta,
          data.nozimejumi.dietaCita ? `cita: ${data.nozimejumi.dietaCita}` : null,
        ]
          .filter(Boolean)
          .join(", ")}`
      : null,
    `Terapija: ${data.nozimejumi.terapija || "—"}`,
    `Citi nozīmējumi: ${data.nozimejumi.citiNozimejumi || "—"}`,
  ]);
}
