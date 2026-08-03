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

export function serializePirmreizejaisPacients(
  data: PirmreizejaisPacientsData,
): string {
  const dzemdibasLabels: Record<string, string> = {
    dabigas: "DABĪGAS",
    "keizargrieziens-akuts": "ĶEIZARGRIEZIENS-AKŪTS",
    "keizargrieziens-planveida": "ĶEIZARGRIEZIENS-PLĀNVEIDA",
  };

  const sekmesLabels: Record<string, string> = {
    sliktas: "SLIKTAS",
    videjas: "VIDĒJAS",
    labas: "LABAS",
  };

  const pav = [
    data.pavLietosana.thc ? "THC" : null,
    data.pavLietosana.kok ? "KOK" : null,
    data.pavLietosana.amf ? "AMF" : null,
    data.pavLietosana.mdma ? "MDMA" : null,
  ].filter(Boolean);

  const piezimes = data.piezimes ?? {
    dzemdibasVeids: "",
    sarezgijumiDzemdibas: "",
    agrinasAttistibasAiztures: "",
    bernudarzs: "",
    draugiBD: "",
    skola: "",
    sekmes: "",
    apcelsanaSkola: "",
    uzvedibaSkola: "",
    biezasDarbaMainas: "",
    sobridStrada: "",
    parKoStrada: "",
    bern: "",
    gimenePsihSasl: "",
    alergijas: "",
    pavLietosana: "",
    blakusSaslimibas: "",
    lietotasMedikamenti: "",
  };

  return joinLines([
    "PIRMREIZĒJS PACIENTS",
    appendPiezime(
      `DZEMDĪBAS-: ${dzemdibasLabels[data.dzemdibasVeids] ?? "—"}`,
      piezimes.dzemdibasVeids,
    ),
    appendPiezime(
      `SAREŽĢĪJUMI DZEMDĪBĀS: ${formatJaNe(data.sarezgijumiDzemdibas)}`,
      piezimes.sarezgijumiDzemdibas,
    ),
    appendPiezime(
      `AGRĪNAS ATTĪSTĪBAS AIZTURES: ${formatJaNe(data.agrinasAttistibasAiztures)}`,
      piezimes.agrinasAttistibasAiztures,
    ),
    appendPiezime(
      `BĒRNUDĀRZS: ${formatJaNe(data.bernudarzs)}`,
      piezimes.bernudarzs,
    ),
    appendPiezime(
      `DRAUGI B/D: ${formatJaNe(data.draugiBD)}`,
      piezimes.draugiBD,
    ),
    appendPiezime(`SKOLĀ: ${data.skola || "—"}`, piezimes.skola),
    appendPiezime(
      `SEKMES: ${sekmesLabels[data.sekmes] ?? "—"}`,
      piezimes.sekmes,
    ),
    appendPiezime(
      `APCELŠANA SKOLĀ: ${formatJaNe(data.apcelsanaSkola)}`,
      piezimes.apcelsanaSkola,
    ),
    appendPiezime(
      `UZVEDĪBA SKOLĀ: ${data.uzvedibaSkola === "n" ? "N" : data.uzvedibaSkola === "traucejumi" ? "TRAUCĒJUMI" : "—"}`,
      piezimes.uzvedibaSkola,
    ),
    `IEGŪTĀ IZGLĪTĪBA-: ${data.iegutaIzglitiba || "—"}`,
    data.augstskola ? "AUGSTSKOLA: JĀ" : "AUGSTSKOLA: NĒ",
    appendPiezime(
      `BIEŽAS DARBA MAIŅAS: ${formatJaNe(data.biezasDarbaMainas)}`,
      piezimes.biezasDarbaMainas,
    ),
    appendPiezime(
      `ŠOBRĪD STRĀDĀ: ${formatJaNe(data.sobridStrada)}`,
      piezimes.sobridStrada,
    ),
    appendPiezime(
      `PAR KO STRĀDĀ: ${formatJaNe(data.parKoStrada)}`,
      piezimes.parKoStrada,
    ),
    `ATTIECĪBU STATUSS: ${data.attiecibuStatuss || "—"}`,
    appendPiezime(`BĒRNI: ${formatIrNav(data.bern)}`, piezimes.bern),
    appendPiezime(
      `ĢIMENĒ PSIH.SASL.: ${formatIrNav(data.gimenePsihSasl)}`,
      piezimes.gimenePsihSasl,
    ),
    `GALVAS TRAUMAS: ${data.galvasTraumas || "—"}`,
    `INFEKCIJAS: ${data.infekcijas || "—"}`,
    appendPiezime(
      `ALERĢIJAS: ${formatJaNe(data.alergijas)}${data.alergijasTeksts ? ` (${data.alergijasTeksts})` : ""}`,
      piezimes.alergijas,
    ),
    appendPiezime(
      `PAV LIETOŠANA: ${pav.length > 0 ? pav.join(", ") : "—"}`,
      piezimes.pavLietosana,
    ),
    `ALKOHOLS- BIEŽUMS,AR KO: ${data.alkohols || "—"}`,
    `SUICĪDS/ PAŠKAITĒJUMS ANAMN.: ${data.suicidsPaskaitijums || "—"}`,
    appendPiezime(
      `BLAKUS SASLIMŠANAS: ${formatJaNe(data.blakusSaslimibas)}`,
      piezimes.blakusSaslimibas,
    ),
    appendPiezime(
      `LIETOTIE MEDIKAMENTI: ${formatJaNe(data.lietotasMedikamenti)}`,
      piezimes.lietotasMedikamenti,
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
