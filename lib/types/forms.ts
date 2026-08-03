export type FormType = "pirmreizejais" | "protokols";

export type JaNe = "" | "ja" | "ne";
export type IrNav = "" | "ir" | "nav";

export type PirmreizejaisPiezimes = {
  dzemdibasVeids: string;
  sarezgijumiDzemdibas: string;
  agrinasAttistibasAiztures: string;
  bernudarzs: string;
  draugiBD: string;
  skola: string;
  sekmes: string;
  apcelsanaSkola: string;
  uzvedibaSkola: string;
  biezasDarbaMainas: string;
  sobridStrada: string;
  parKoStrada: string;
  bern: string;
  gimenePsihSasl: string;
  alergijas: string;
  pavLietosana: string;
};

export const emptyPirmreizejaisPiezimes = (): PirmreizejaisPiezimes => ({
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
});

export type PirmreizejaisPacientsData = {
  dzemdibasVeids: "" | "dabigas" | "keizargrieziens-akuts" | "keizargrieziens-planveida";
  sarezgijumiDzemdibas: JaNe;
  agrinasAttistibasAiztures: JaNe;
  bernudarzs: JaNe;
  draugiBD: JaNe;
  skola: "" | "7" | "8" | "9";
  sekmes: "" | "sliktas" | "videjas" | "labas";
  apcelsanaSkola: JaNe;
  uzvedibaSkola: "" | "n" | "traucejumi";
  iegutaIzglitiba: string;
  augstskola: boolean;
  biezasDarbaMainas: JaNe;
  sobridStrada: JaNe;
  parKoStrada: JaNe;
  attiecibuStatuss: string;
  bern: IrNav;
  gimenePsihSasl: IrNav;
  galvasTraumas: string;
  infekcijas: string;
  alergijas: JaNe;
  alergijasTeksts: string;
  pavLietosana: {
    thc: boolean;
    kok: boolean;
    amf: boolean;
    mdma: boolean;
  };
  alkohols: string;
  suicidsPaskaitijums: string;
  piezimes: PirmreizejaisPiezimes;
};

export type ProtokolsData = {
  gads: string;
  datums: string;
  vieta: string;
  stunda: string;
  minutes: string;
  stacionets: string;
  nosutijumsNo: string;
  nosutijumsTips: {
    psihiatrs: boolean;
    gimenesArsts: boolean;
    nmpd: boolean;
    bezNosutijuma: boolean;
    arPoliciju: boolean;
    pirmreizeji: boolean;
    atkartoti: boolean;
    parvestsNo: string;
  };
  strada: boolean;
  nestrada: boolean;
  invaliditate: boolean;
  dzivo: {
    viens: boolean;
    gimene: boolean;
    sac: boolean;
    cits: string;
  };
  ambulatoraisPsihiatrs: {
    neapmekle: boolean;
    neregulari: boolean;
    regulari: boolean;
  };
  hroniskasSlimibas: {
    noliedz: boolean;
    ir: boolean;
    apraksts: string;
  };
  lietotasZales: {
    nav: boolean;
    ir: boolean;
    apraksts: string;
  };
  suicidaMeginajumi: {
    nav: boolean;
    ir: boolean;
    apraksts: string;
  };
  anamneze: string;
  apzina: "" | "netrauceta" | "sasaurinata" | "mainiga" | "aptumsota";
  orientacija: {
    laika: "" | "pilniga" | "daleja" | "nav";
    vieta: "" | "pilniga" | "daleja" | "nav";
    personalba: "" | "pilniga" | "daleja" | "nav";
  };
  kontakts: "" | "pieejams" | "virspusējs" | "neproduktivs";
  atbild: "" | "pec_butibas" | "daleji_pec_butibas" | "ne_pec_butibas";
  runa: {
    temp: "" | "paatrinata" | "palelinata" | "daudzrunigs" | "mazrunigs";
    saprotamiba: "" | "saprotama" | "nesaprotama";
    artikulacija: boolean;
  };
  uztveresTraucejumi: JaNe;
  halucinacijas: {
    redzes: boolean;
    dzirdes: boolean;
    garsas: boolean;
    ozas: boolean;
    taktilas: boolean;
    visceralas: boolean;
    istas: boolean;
    pseido: boolean;
    senestopatijas: boolean;
    psihosensori: boolean;
    iluzori: boolean;
    derealizacija: boolean;
    depersonalizacija: boolean;
  };
  parvertesanasIdejas: {
    ir: JaNe;
    paranojalas: boolean;
    paranoīdas: boolean;
    parafrēnas: boolean;
    telainas: boolean;
    sistematizetas: boolean;
    citas: string;
  };
  idejuIetekmeUzvediba: string;
  formalasDomasanas: {
    ir: JaNe;
    apraksts: string;
  };
  emocionalasReakcijas: string[];
  garastavoklis: "" | "pacilats" | "pazeminats" | "lidzsvarots" | "mainigs" | "jaukts" | "disforisks";
  trauksme: {
    ir: JaNe;
    veids: "" | "viegla" | "mereni" | "izteikta" | "panika";
  };
  uzmanibaAtmina: "" | "bez_traucejumiem" | "ar_traucejumiem";
  intelekts: "" | "pilnvertigs" | "viegli" | "videji" | "izteikti";
  suicidalsDomas: JaNe;
  miegs: {
    veids: string[];
    navGulejisNaktis: string;
  };
  kritika: "" | "kritisks" | "daleji" | "nekritisks";
  arejaisIzskats: string;
  alkoholaReibums: {
    nekonstate: boolean;
    ir: boolean;
    bac: string;
    kadas: string;
    lietosanasParadumi: string;
  };
  neirologiskais: {
    simptomatika: string;
    citaSimptomatika: string;
    nenovēro: boolean;
    ir: boolean;
  };
  somatisks: {
    nav: boolean;
    ir: boolean;
    apraksts: string;
  };
  vitalieRaditaji: {
    augums: string;
    svars: string;
    to: string;
    pulss: string;
    ta: string;
    spo2: string;
    glc: string;
  };
  elpceļuInfekcija: {
    nav: boolean;
    ir: boolean;
    apraksts: string;
  };
  miesasBojajumi: {
    nav: boolean;
    ir: boolean;
    apraksts: string;
  };
  diagnoze: string;
  cgiS: "" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
  talakaTaktika: {
    ambulatori: boolean;
    psihiatraMotivets: boolean;
    stacionets: boolean;
    piemerotaIerobezosana: boolean;
    stacionešanaiPiekrīt: boolean;
    stacionešanaiNepiekrīt: boolean;
    mrpl: boolean;
    stpe: boolean;
    punkts1: boolean;
    punkts2: boolean;
  };
  nozimejumi: {
    stacionet: string;
    observet: boolean;
    parvest: boolean;
    ekg: boolean;
    pilnaAsinsAina: boolean;
    asat: boolean;
    novērošanasLimenis: "" | "pasaprūpes" | "vispareja";
    rtg: boolean;
    urins: boolean;
    alat: boolean;
    glikoze: boolean;
    ggt: boolean;
    novērotUz: string[];
    usg: boolean;
    na: boolean;
    k: boolean;
    bi: boolean;
    cro: boolean;
    kreatinins: boolean;
    terapija: string;
    kontrolet: string[];
    kontroletCits: string;
    dieta: string[];
    dietaCita: string;
    citiNozimejumi: string;
  };
};

export const emptyPirmreizejaisPacients = (): PirmreizejaisPacientsData => ({
  dzemdibasVeids: "",
  sarezgijumiDzemdibas: "",
  agrinasAttistibasAiztures: "",
  bernudarzs: "",
  draugiBD: "",
  skola: "",
  sekmes: "",
  apcelsanaSkola: "",
  uzvedibaSkola: "",
  iegutaIzglitiba: "",
  augstskola: false,
  biezasDarbaMainas: "",
  sobridStrada: "",
  parKoStrada: "",
  attiecibuStatuss: "",
  bern: "",
  gimenePsihSasl: "",
  galvasTraumas: "",
  infekcijas: "",
  alergijas: "",
  alergijasTeksts: "",
  pavLietosana: { thc: false, kok: false, amf: false, mdma: false },
  alkohols: "",
  suicidsPaskaitijums: "",
  piezimes: emptyPirmreizejaisPiezimes(),
});

export const emptyProtokols = (): ProtokolsData => ({
  gads: "",
  datums: "",
  vieta: "",
  stunda: "",
  minutes: "",
  stacionets: "",
  nosutijumsNo: "",
  nosutijumsTips: {
    psihiatrs: false,
    gimenesArsts: false,
    nmpd: false,
    bezNosutijuma: false,
    arPoliciju: false,
    pirmreizeji: false,
    atkartoti: false,
    parvestsNo: "",
  },
  strada: false,
  nestrada: false,
  invaliditate: false,
  dzivo: { viens: false, gimene: false, sac: false, cits: "" },
  ambulatoraisPsihiatrs: {
    neapmekle: false,
    neregulari: false,
    regulari: false,
  },
  hroniskasSlimibas: { noliedz: false, ir: false, apraksts: "" },
  lietotasZales: { nav: false, ir: false, apraksts: "" },
  suicidaMeginajumi: { nav: false, ir: false, apraksts: "" },
  anamneze: "",
  apzina: "",
  orientacija: { laika: "", vieta: "", personalba: "" },
  kontakts: "",
  atbild: "",
  runa: { temp: "", saprotamiba: "", artikulacija: false },
  uztveresTraucejumi: "",
  halucinacijas: {
    redzes: false,
    dzirdes: false,
    garsas: false,
    ozas: false,
    taktilas: false,
    visceralas: false,
    istas: false,
    pseido: false,
    senestopatijas: false,
    psihosensori: false,
    iluzori: false,
    derealizacija: false,
    depersonalizacija: false,
  },
  parvertesanasIdejas: {
    ir: "",
    paranojalas: false,
    paranoīdas: false,
    parafrēnas: false,
    telainas: false,
    sistematizetas: false,
    citas: "",
  },
  idejuIetekmeUzvediba: "",
  formalasDomasanas: { ir: "", apraksts: "" },
  emocionalasReakcijas: [],
  garastavoklis: "",
  trauksme: { ir: "", veids: "" },
  uzmanibaAtmina: "",
  intelekts: "",
  suicidalsDomas: "",
  miegs: { veids: [], navGulejisNaktis: "" },
  kritika: "",
  arejaisIzskats: "",
  alkoholaReibums: {
    nekonstate: false,
    ir: false,
    bac: "",
    kadas: "",
    lietosanasParadumi: "",
  },
  neirologiskais: {
    simptomatika: "",
    citaSimptomatika: "",
    nenovēro: false,
    ir: false,
  },
  somatisks: { nav: false, ir: false, apraksts: "" },
  vitalieRaditaji: {
    augums: "",
    svars: "",
    to: "",
    pulss: "",
    ta: "",
    spo2: "",
    glc: "",
  },
  elpceļuInfekcija: { nav: false, ir: false, apraksts: "" },
  miesasBojajumi: { nav: false, ir: false, apraksts: "" },
  diagnoze: "",
  cgiS: "",
  talakaTaktika: {
    ambulatori: false,
    psihiatraMotivets: false,
    stacionets: false,
    piemerotaIerobezosana: false,
    stacionešanaiPiekrīt: false,
    stacionešanaiNepiekrīt: false,
    mrpl: false,
    stpe: false,
    punkts1: false,
    punkts2: false,
  },
  nozimejumi: {
    stacionet: "",
    observet: false,
    parvest: false,
    ekg: false,
    pilnaAsinsAina: false,
    asat: false,
    novērošanasLimenis: "",
    rtg: false,
    urins: false,
    alat: false,
    glikoze: false,
    ggt: false,
    novērotUz: [],
    usg: false,
    na: false,
    k: false,
    bi: false,
    cro: false,
    kreatinins: false,
    terapija: "",
    kontrolet: [],
    kontroletCits: "",
    dieta: [],
    dietaCita: "",
    citiNozimejumi: "",
  },
});
