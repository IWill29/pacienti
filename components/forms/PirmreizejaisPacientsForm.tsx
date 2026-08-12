"use client";

import { useState } from "react";

import {
  DocCheckbox,
  DocFieldBlock,
  DocInlineInput,
  DocLine,
  DocRadio,
  DocSectionTitle,
} from "@/components/doc/FormControls";
import { FormShell } from "@/components/FormShell";
import {
  emptyPirmreizejaisPacients,
  type PirmreizejaisPacientsData,
  type PirmreizejaisPiezimes,
} from "@/lib/types/forms";

const EMOCIONALAS_REAKCIJAS = [
  "eiforiskas",
  "neitrālas",
  "apātiskas",
  "pacilātas",
  "labilas",
  "vienaldzīgas",
  "drūmas",
  "izteikti nomāktas",
  "blāvas",
  "atbilstošas situācijai",
  "neatbilstošas situācijai",
] as const;

const MIEGS_OPTIONS = [
  "apmierinošs",
  "saraustīts",
  "pagarināts",
  "saīsināts",
  "iemigšanas grūtības",
  "agra pamošanās",
  "nav gulējis naktis",
] as const;

export function PirmreizejaisPacientsForm() {
  const [data, setData] = useState<PirmreizejaisPacientsData>(
    () => emptyPirmreizejaisPacients(),
  );

  function update<K extends keyof PirmreizejaisPacientsData>(
    key: K,
    value: PirmreizejaisPacientsData[K],
  ) {
    setData((current) => ({ ...current, [key]: value }));
  }

  function updatePiezime(key: keyof PirmreizejaisPiezimes, value: string) {
    setData((current) => ({
      ...current,
      piezimes: { ...current.piezimes, [key]: value },
    }));
  }

  function noteProps(key: keyof PirmreizejaisPiezimes) {
    return {
      noteId: `piezime-${key}`,
      noteValue: data.piezimes[key],
      onNoteChange: (value: string) => updatePiezime(key, value),
    };
  }

  function toggleListItem(
    key: "emocionalasReakcijas" | "miegs",
    item: string,
    checked: boolean,
  ) {
    setData((current) => {
      const list = current[key];
      const next = checked
        ? list.includes(item)
          ? list
          : [...list, item]
        : list.filter((entry) => entry !== item);
      return { ...current, [key]: next };
    });
  }

  return (
    <FormShell
      formType="pirmreizejais"
      formData={data}
      title="Pirmreizējais pacients"
      subtitle="Aizpildiet izvēles un komentārus — AI saliks tikai ārsta ievadīto tekstu."
      wide
    >
      <article className="doc-sheet min-w-0">
        <DocSectionTitle>Pacients un vizīte</DocSectionTitle>

        <DocLine label="DZIMUMS">
          <DocRadio
            id="dz-virietis"
            name="pacientaDzimums"
            label="vīrietis"
            value="virietis"
            checked={data.pacientaDzimums === "virietis"}
            onChange={(v) =>
              update(
                "pacientaDzimums",
                v as PirmreizejaisPacientsData["pacientaDzimums"],
              )
            }
          />
          <DocRadio
            id="dz-sieviete"
            name="pacientaDzimums"
            label="sieviete"
            value="sieviete"
            checked={data.pacientaDzimums === "sieviete"}
            onChange={(v) =>
              update(
                "pacientaDzimums",
                v as PirmreizejaisPacientsData["pacientaDzimums"],
              )
            }
          />
        </DocLine>

        <DocFieldBlock label="VĀRDS UZVĀRDS">
          <DocInlineInput
            id="vards"
            value={data.pacientaVardsUzvards}
            onChange={(v) => update("pacientaVardsUzvards", v)}
          />
        </DocFieldBlock>

        <DocFieldBlock label="PERSONAS KODS">
          <DocInlineInput
            id="pk"
            value={data.personasKods}
            onChange={(v) => update("personasKods", v)}
          />
        </DocFieldBlock>

        <DocFieldBlock label="KONSULTĀCIJAS DATUMS">
          <DocInlineInput
            id="datums"
            value={data.vizitesDatums}
            onChange={(v) => update("vizitesDatums", v)}
            placeholder="dd.mm.gggg"
          />
        </DocFieldBlock>

        <DocLine label="VIZĪTES IEMESLS" {...noteProps("vizitesIemesls")}>
          <DocRadio
            id="vi-pirmo"
            name="vizitesIemesls"
            label="pirmo reizi dzīvē"
            value="pirmo_reizi"
            checked={data.vizitesIemesls === "pirmo_reizi"}
            onChange={(v) =>
              update("vizitesIemesls", v as PirmreizejaisPacientsData["vizitesIemesls"])
            }
          />
          <DocRadio
            id="vi-atk"
            name="vizitesIemesls"
            label="atkārtoti"
            value="atkartoti"
            checked={data.vizitesIemesls === "atkartoti"}
            onChange={(v) =>
              update("vizitesIemesls", v as PirmreizejaisPacientsData["vizitesIemesls"])
            }
          />
        </DocLine>

        <DocSectionTitle>Anamnēze no pacienta</DocSectionTitle>

        <DocLine label="DZEMDĪBAS" {...noteProps("dzemdibasVeids")}>
          <DocRadio
            id="dz-dab"
            name="dzemdibasVeids"
            label="dabīgās"
            value="dabigas"
            checked={data.dzemdibasVeids === "dabigas"}
            onChange={(v) =>
              update("dzemdibasVeids", v as PirmreizejaisPacientsData["dzemdibasVeids"])
            }
          />
          <DocRadio
            id="dz-keiz"
            name="dzemdibasVeids"
            label="ķeizargrieziens"
            value="keizargrieziens"
            checked={data.dzemdibasVeids === "keizargrieziens"}
            onChange={(v) =>
              update("dzemdibasVeids", v as PirmreizejaisPacientsData["dzemdibasVeids"])
            }
          />
        </DocLine>

        <DocLine label="DZEMDĪBU TERMINS" {...noteProps("dzemdibasTermins")}>
          <DocRadio
            id="dt-lai"
            name="dzemdibasTermins"
            label="laicīgi"
            value="laicigi"
            checked={data.dzemdibasTermins === "laicigi"}
            onChange={(v) =>
              update(
                "dzemdibasTermins",
                v as PirmreizejaisPacientsData["dzemdibasTermins"],
              )
            }
          />
          <DocRadio
            id="dt-pr"
            name="dzemdibasTermins"
            label="priekšlaicīgi"
            value="prieksalicigi"
            checked={data.dzemdibasTermins === "prieksalicigi"}
            onChange={(v) =>
              update(
                "dzemdibasTermins",
                v as PirmreizejaisPacientsData["dzemdibasTermins"],
              )
            }
          />
          <DocRadio
            id="dt-nov"
            name="dzemdibasTermins"
            label="novēloti"
            value="noveloti"
            checked={data.dzemdibasTermins === "noveloti"}
            onChange={(v) =>
              update(
                "dzemdibasTermins",
                v as PirmreizejaisPacientsData["dzemdibasTermins"],
              )
            }
          />
        </DocLine>

        <DocLine label="DZEMDĪBU PATOLOĢIJA" {...noteProps("dzemdibuPatologija")}>
          <DocRadio
            id="dp-ne"
            name="dzemdibuPatologija"
            label="neatzīmē"
            value="neatzime"
            checked={data.dzemdibuPatologija === "neatzime"}
            onChange={(v) =>
              update(
                "dzemdibuPatologija",
                v as PirmreizejaisPacientsData["dzemdibuPatologija"],
              )
            }
          />
          <DocRadio
            id="dp-ir"
            name="dzemdibuPatologija"
            label="ir"
            value="ir"
            checked={data.dzemdibuPatologija === "ir"}
            onChange={(v) =>
              update(
                "dzemdibuPatologija",
                v as PirmreizejaisPacientsData["dzemdibuPatologija"],
              )
            }
          />
        </DocLine>

        <DocLine label="AGRĪNĀ ATTĪSTĪBA" {...noteProps("agrinaAttistiba")}>
          <DocRadio
            id="aa-bez"
            name="agrinaAttistiba"
            label="bez novirzēm"
            value="bez_novirzem"
            checked={data.agrinaAttistiba === "bez_novirzem"}
            onChange={(v) =>
              update(
                "agrinaAttistiba",
                v as PirmreizejaisPacientsData["agrinaAttistiba"],
              )
            }
          />
          <DocRadio
            id="aa-ar"
            name="agrinaAttistiba"
            label="ar novirzēm"
            value="ar_novirzem"
            checked={data.agrinaAttistiba === "ar_novirzem"}
            onChange={(v) =>
              update(
                "agrinaAttistiba",
                v as PirmreizejaisPacientsData["agrinaAttistiba"],
              )
            }
          />
        </DocLine>

        <DocLine label="AUGA" {...noteProps("augaGimene")}>
          <DocRadio
            id="ag-pilna"
            name="augaGimene"
            label="pilnā ģimenē"
            value="pilna"
            checked={data.augaGimene === "pilna"}
            onChange={(v) =>
              update("augaGimene", v as PirmreizejaisPacientsData["augaGimene"])
            }
          />
          <DocRadio
            id="ag-skirta"
            name="augaGimene"
            label="šķirtā ģimenē"
            value="skirta"
            checked={data.augaGimene === "skirta"}
            onChange={(v) =>
              update("augaGimene", v as PirmreizejaisPacientsData["augaGimene"])
            }
          />
        </DocLine>

        <DocLine label="BĒRNUDĀRZS" {...noteProps("bernudarzs")}>
          <DocRadio
            id="bd-ja"
            name="bernudarzs"
            label="apmeklēja"
            value="ja"
            checked={data.bernudarzs === "ja"}
            onChange={(v) => update("bernudarzs", v as "ja" | "ne")}
          />
          <DocRadio
            id="bd-ne"
            name="bernudarzs"
            label="neapmeklēja"
            value="ne"
            checked={data.bernudarzs === "ne"}
            onChange={(v) => update("bernudarzs", v as "ja" | "ne")}
          />
        </DocLine>

        <DocLine label="RAKSTURS" {...noteProps("raksturs")}>
          <DocRadio
            id="rk-atv"
            name="raksturs"
            label="atvērts, komunikabls"
            value="atverts"
            checked={data.raksturs === "atverts"}
            onChange={(v) =>
              update("raksturs", v as PirmreizejaisPacientsData["raksturs"])
            }
          />
          <DocRadio
            id="rk-nos"
            name="raksturs"
            label="nosvērts, kluss"
            value="nosverts"
            checked={data.raksturs === "nosverts"}
            onChange={(v) =>
              update("raksturs", v as PirmreizejaisPacientsData["raksturs"])
            }
          />
        </DocLine>

        <DocLine label="SKOLĀ UZSĀKA" {...noteProps("skola")}>
          <DocRadio
            id="sk-6"
            name="skola"
            label="6 gv"
            value="6"
            checked={data.skola === "6"}
            onChange={(v) => update("skola", v as "6" | "7" | "8")}
          />
          <DocRadio
            id="sk-7"
            name="skola"
            label="7 gv"
            value="7"
            checked={data.skola === "7"}
            onChange={(v) => update("skola", v as "6" | "7" | "8")}
          />
          <DocRadio
            id="sk-8"
            name="skola"
            label="8 gv"
            value="8"
            checked={data.skola === "8"}
            onChange={(v) => update("skola", v as "6" | "7" | "8")}
          />
        </DocLine>

        <DocLine label="MĀCĪJĀS" {...noteProps("sekmes")}>
          <DocRadio
            id="sek-sl"
            name="sekmes"
            label="slikti"
            value="slikti"
            checked={data.sekmes === "slikti"}
            onChange={(v) =>
              update("sekmes", v as PirmreizejaisPacientsData["sekmes"])
            }
          />
          <DocRadio
            id="sek-vid"
            name="sekmes"
            label="vidēji"
            value="videji"
            checked={data.sekmes === "videji"}
            onChange={(v) =>
              update("sekmes", v as PirmreizejaisPacientsData["sekmes"])
            }
          />
          <DocRadio
            id="sek-lab"
            name="sekmes"
            label="labi"
            value="labi"
            checked={data.sekmes === "labi"}
            onChange={(v) =>
              update("sekmes", v as PirmreizejaisPacientsData["sekmes"])
            }
          />
        </DocLine>

        <DocLine label="APCELŠANA SKOLĀ" {...noteProps("apcelsanaSkola")}>
          <DocRadio
            id="as-ne"
            name="apcelsanaSkola"
            label="netika novērota"
            value="netika"
            checked={data.apcelsanaSkola === "netika"}
            onChange={(v) =>
              update(
                "apcelsanaSkola",
                v as PirmreizejaisPacientsData["apcelsanaSkola"],
              )
            }
          />
          <DocRadio
            id="as-ja"
            name="apcelsanaSkola"
            label="tika novērota"
            value="tika"
            checked={data.apcelsanaSkola === "tika"}
            onChange={(v) =>
              update(
                "apcelsanaSkola",
                v as PirmreizejaisPacientsData["apcelsanaSkola"],
              )
            }
          />
        </DocLine>

        <DocLine label="UZVEDĪBA SKOLĀ" {...noteProps("uzvedibaSkola")}>
          <DocRadio
            id="us-apm"
            name="uzvedibaSkola"
            label="apmierinoša"
            value="apmierinosa"
            checked={data.uzvedibaSkola === "apmierinosa"}
            onChange={(v) =>
              update(
                "uzvedibaSkola",
                v as PirmreizejaisPacientsData["uzvedibaSkola"],
              )
            }
          />
          <DocRadio
            id="us-tr"
            name="uzvedibaSkola"
            label="ar traucējumiem"
            value="traucejumi"
            checked={data.uzvedibaSkola === "traucejumi"}
            onChange={(v) =>
              update(
                "uzvedibaSkola",
                v as PirmreizejaisPacientsData["uzvedibaSkola"],
              )
            }
          />
        </DocLine>

        <DocLine label="IEGŪTĀ IZGLĪTĪBA" {...noteProps("iegutaIzglitiba")} />

        <DocLine label="ŠOBRĪD" {...noteProps("darbs")}>
          <DocRadio
            id="darbs-ne"
            name="darbs"
            label="nestrādā"
            value="nestrada"
            checked={data.darbs === "nestrada"}
            onChange={(v) =>
              update("darbs", v as PirmreizejaisPacientsData["darbs"])
            }
          />
          <DocRadio
            id="darbs-ja"
            name="darbs"
            label="strādā par"
            value="strada"
            checked={data.darbs === "strada"}
            onChange={(v) =>
              update("darbs", v as PirmreizejaisPacientsData["darbs"])
            }
          />
        </DocLine>

        <DocLine label="ATTIECĪBU STATUSS" {...noteProps("attiecibuStatuss")}>
          <DocRadio
            id="att-prec"
            name="attiecibuStatuss"
            label="precējies"
            value="precejies"
            checked={data.attiecibuStatuss === "precejies"}
            onChange={(v) =>
              update(
                "attiecibuStatuss",
                v as PirmreizejaisPacientsData["attiecibuStatuss"],
              )
            }
          />
          <DocRadio
            id="att-viens"
            name="attiecibuStatuss"
            label="dzīvo viens"
            value="dzivo_viens"
            checked={data.attiecibuStatuss === "dzivo_viens"}
            onChange={(v) =>
              update(
                "attiecibuStatuss",
                v as PirmreizejaisPacientsData["attiecibuStatuss"],
              )
            }
          />
        </DocLine>

        <DocLine label="BĒRNI" {...noteProps("bern")}>
          <DocRadio
            id="bern-nav"
            name="bern"
            label="nav"
            value="nav"
            checked={data.bern === "nav"}
            onChange={(v) => update("bern", v as "ir" | "nav")}
          />
          <DocRadio
            id="bern-ir"
            name="bern"
            label="ir"
            value="ir"
            checked={data.bern === "ir"}
            onChange={(v) => update("bern", v as "ir" | "nav")}
          />
        </DocLine>

        <DocLine label="ĢIMENĒ PSIH. SASL." {...noteProps("gimenePsihSasl")}>
          <DocRadio
            id="gps-nav"
            name="gimenePsihSasl"
            label="nav"
            value="nav"
            checked={data.gimenePsihSasl === "nav"}
            onChange={(v) => update("gimenePsihSasl", v as "ir" | "nav")}
          />
          <DocRadio
            id="gps-ir"
            name="gimenePsihSasl"
            label="ir"
            value="ir"
            checked={data.gimenePsihSasl === "ir"}
            onChange={(v) => update("gimenePsihSasl", v as "ir" | "nav")}
          />
        </DocLine>

        <DocLine label="GALVAS TRAUMAS" {...noteProps("galvasTraumas")}>
          <DocRadio
            id="gt-nav"
            name="galvasTraumas"
            label="nav"
            value="nav"
            checked={data.galvasTraumas === "nav"}
            onChange={(v) => update("galvasTraumas", v as "ir" | "nav")}
          />
          <DocRadio
            id="gt-ir"
            name="galvasTraumas"
            label="ir"
            value="ir"
            checked={data.galvasTraumas === "ir"}
            onChange={(v) => update("galvasTraumas", v as "ir" | "nav")}
          />
        </DocLine>

        <DocLine label="NEIROINFEKCIJAS" {...noteProps("neiroinfekcijas")}>
          <DocRadio
            id="ni-nav"
            name="neiroinfekcijas"
            label="nav"
            value="nav"
            checked={data.neiroinfekcijas === "nav"}
            onChange={(v) => update("neiroinfekcijas", v as "ir" | "nav")}
          />
          <DocRadio
            id="ni-ir"
            name="neiroinfekcijas"
            label="ir"
            value="ir"
            checked={data.neiroinfekcijas === "ir"}
            onChange={(v) => update("neiroinfekcijas", v as "ir" | "nav")}
          />
        </DocLine>

        <DocLine label="ALERĢIJAS" {...noteProps("alergijas")}>
          <DocRadio
            id="al-nav"
            name="alergijas"
            label="nav"
            value="nav"
            checked={data.alergijas === "nav"}
            onChange={(v) => update("alergijas", v as "ir" | "nav")}
          />
          <DocRadio
            id="al-ir"
            name="alergijas"
            label="ir"
            value="ir"
            checked={data.alergijas === "ir"}
            onChange={(v) => update("alergijas", v as "ir" | "nav")}
          />
        </DocLine>

        <DocLine label="ALKOHOLS" {...noteProps("alkohols")}>
          <DocRadio
            id="alk-ne"
            name="alkohols"
            label="nelieto"
            value="nelieto"
            checked={data.alkohols === "nelieto"}
            onChange={(v) =>
              update("alkohols", v as PirmreizejaisPacientsData["alkohols"])
            }
          />
          <DocRadio
            id="alk-ja"
            name="alkohols"
            label="lieto"
            value="lieto"
            checked={data.alkohols === "lieto"}
            onChange={(v) =>
              update("alkohols", v as PirmreizejaisPacientsData["alkohols"])
            }
          />
        </DocLine>

        <DocLine label="PAV LIETOŠANA" {...noteProps("pavLietosana")}>
          <DocCheckbox
            id="pav-nelieto"
            label="nelieto"
            checked={data.pavLietosana.nelieto}
            onChange={(c) =>
              update("pavLietosana", {
                ...data.pavLietosana,
                nelieto: c,
                ...(c ? { thc: false, amp: false, coc: false, mdma: false } : {}),
              })
            }
          />
          <DocCheckbox
            id="pav-thc"
            label="THC"
            checked={data.pavLietosana.thc}
            onChange={(c) =>
              update("pavLietosana", {
                ...data.pavLietosana,
                thc: c,
                nelieto: c ? false : data.pavLietosana.nelieto,
              })
            }
          />
          <DocCheckbox
            id="pav-amp"
            label="AMP"
            checked={data.pavLietosana.amp}
            onChange={(c) =>
              update("pavLietosana", {
                ...data.pavLietosana,
                amp: c,
                nelieto: c ? false : data.pavLietosana.nelieto,
              })
            }
          />
          <DocCheckbox
            id="pav-coc"
            label="COC"
            checked={data.pavLietosana.coc}
            onChange={(c) =>
              update("pavLietosana", {
                ...data.pavLietosana,
                coc: c,
                nelieto: c ? false : data.pavLietosana.nelieto,
              })
            }
          />
          <DocCheckbox
            id="pav-mdma"
            label="MDMA"
            checked={data.pavLietosana.mdma}
            onChange={(c) =>
              update("pavLietosana", {
                ...data.pavLietosana,
                mdma: c,
                nelieto: c ? false : data.pavLietosana.nelieto,
              })
            }
          />
        </DocLine>

        <DocLine label="PAV MĒĢINĀJIS DZĪVES LAIKĀ" {...noteProps("pavMegina")}>
          <DocCheckbox
            id="meg-thc"
            label="THC"
            checked={data.pavMegina.thc}
            onChange={(c) =>
              update("pavMegina", { ...data.pavMegina, thc: c })
            }
          />
          <DocCheckbox
            id="meg-amp"
            label="AMP"
            checked={data.pavMegina.amp}
            onChange={(c) =>
              update("pavMegina", { ...data.pavMegina, amp: c })
            }
          />
          <DocCheckbox
            id="meg-coc"
            label="COC"
            checked={data.pavMegina.coc}
            onChange={(c) =>
              update("pavMegina", { ...data.pavMegina, coc: c })
            }
          />
          <DocCheckbox
            id="meg-mdma"
            label="MDMA"
            checked={data.pavMegina.mdma}
            onChange={(c) =>
              update("pavMegina", { ...data.pavMegina, mdma: c })
            }
          />
        </DocLine>

        <DocLine label="SUICIDĀLA UZVEDĪBA" {...noteProps("suicidalaUzvediba")}>
          <DocRadio
            id="su-nav"
            name="suicidalaUzvediba"
            label="nav bijusi"
            value="nav"
            checked={data.suicidalaUzvediba === "nav"}
            onChange={(v) =>
              update(
                "suicidalaUzvediba",
                v as PirmreizejaisPacientsData["suicidalaUzvediba"],
              )
            }
          />
          <DocRadio
            id="su-pask"
            name="suicidalaUzvediba"
            label="paškaitējums"
            value="paskaitējums"
            checked={data.suicidalaUzvediba === "paskaitējums"}
            onChange={(v) =>
              update(
                "suicidalaUzvediba",
                v as PirmreizejaisPacientsData["suicidalaUzvediba"],
              )
            }
          />
          <DocRadio
            id="su-pasn"
            name="suicidalaUzvediba"
            label="pašnāvības mēģinājums"
            value="pasnavibas_meginajums"
            checked={data.suicidalaUzvediba === "pasnavibas_meginajums"}
            onChange={(v) =>
              update(
                "suicidalaUzvediba",
                v as PirmreizejaisPacientsData["suicidalaUzvediba"],
              )
            }
          />
        </DocLine>

        <DocLine label="BLAKUS SASLIMŠANAS" {...noteProps("blakusSaslimibas")}>
          <DocRadio
            id="bs-nav"
            name="blakusSaslimibas"
            label="nav"
            value="nav"
            checked={data.blakusSaslimibas === "nav"}
            onChange={(v) => update("blakusSaslimibas", v as "ir" | "nav")}
          />
          <DocRadio
            id="bs-ir"
            name="blakusSaslimibas"
            label="ir"
            value="ir"
            checked={data.blakusSaslimibas === "ir"}
            onChange={(v) => update("blakusSaslimibas", v as "ir" | "nav")}
          />
        </DocLine>

        <DocLine
          label="LIETOTIE MEDIKAMENTI"
          {...noteProps("lietotasMedikamenti")}
          notePlaceholder="kādi medikamenti"
        >
          <DocRadio
            id="lm-nav"
            name="lietotasMedikamenti"
            label="nav"
            value="nav"
            checked={data.lietotasMedikamenti === "nav"}
            onChange={(v) => update("lietotasMedikamenti", v as "ir" | "nav")}
          />
          <DocRadio
            id="lm-ir"
            name="lietotasMedikamenti"
            label="ir"
            value="ir"
            checked={data.lietotasMedikamenti === "ir"}
            onChange={(v) => update("lietotasMedikamenti", v as "ir" | "nav")}
          />
        </DocLine>

        <DocSectionTitle>Psihiskais stāvoklis</DocSectionTitle>

        <DocLine label="APZIŅA" {...noteProps("apzina")}>
          <DocRadio
            id="apz-sk"
            name="apzina"
            label="skaidra"
            value="skaidra"
            checked={data.apzina === "skaidra"}
            onChange={(v) =>
              update("apzina", v as PirmreizejaisPacientsData["apzina"])
            }
          />
          <DocRadio
            id="apz-sas"
            name="apzina"
            label="sašaurināta"
            value="sasaurinata"
            checked={data.apzina === "sasaurinata"}
            onChange={(v) =>
              update("apzina", v as PirmreizejaisPacientsData["apzina"])
            }
          />
        </DocLine>

        <DocLine label="ORIENTĀCIJA" {...noteProps("orientacija")}>
          <DocRadio
            id="or-par"
            name="orientacija"
            label="pareizi visos veidos"
            value="pareizi"
            checked={data.orientacija === "pareizi"}
            onChange={(v) =>
              update("orientacija", v as PirmreizejaisPacientsData["orientacija"])
            }
          />
        </DocLine>

        <DocLine label="KONTAKTS" {...noteProps("kontakts")}>
          <DocRadio
            id="kon-pie"
            name="kontakts"
            label="kontaktam pieejams"
            value="pieejams"
            checked={data.kontakts === "pieejams"}
            onChange={(v) =>
              update("kontakts", v as PirmreizejaisPacientsData["kontakts"])
            }
          />
        </DocLine>

        <DocLine label="SARUNAS INICIATĪVA" {...noteProps("sarunasIniciativa")}>
          <DocRadio
            id="si-uz"
            name="sarunasIniciativa"
            label="uztur"
            value="uztur"
            checked={data.sarunasIniciativa === "uztur"}
            onChange={(v) =>
              update(
                "sarunasIniciativa",
                v as PirmreizejaisPacientsData["sarunasIniciativa"],
              )
            }
          />
          <DocRadio
            id="si-ne"
            name="sarunasIniciativa"
            label="neuztur"
            value="neuztur"
            checked={data.sarunasIniciativa === "neuztur"}
            onChange={(v) =>
              update(
                "sarunasIniciativa",
                v as PirmreizejaisPacientsData["sarunasIniciativa"],
              )
            }
          />
        </DocLine>

        <DocLine label="IZSKATS" {...noteProps("izskats")}>
          <DocRadio
            id="iz-kop"
            name="izskats"
            label="kopts"
            value="kopts"
            checked={data.izskats === "kopts"}
            onChange={(v) =>
              update("izskats", v as PirmreizejaisPacientsData["izskats"])
            }
          />
          <DocRadio
            id="iz-nev"
            name="izskats"
            label="nevīžīgs"
            value="nevizigs"
            checked={data.izskats === "nevizigs"}
            onChange={(v) =>
              update("izskats", v as PirmreizejaisPacientsData["izskats"])
            }
          />
        </DocLine>

        <DocLine label="RUNA" {...noteProps("runa")}>
          <DocRadio
            id="runa-apm"
            name="runa"
            label="apmierinoša tempa"
            value="apmierinosa"
            checked={data.runa === "apmierinosa"}
            onChange={(v) =>
              update("runa", v as PirmreizejaisPacientsData["runa"])
            }
          />
        </DocLine>

        <DocLine label="ATBILDES" {...noteProps("atbildes")}>
          <DocRadio
            id="atb-pec"
            name="atbildes"
            label="pēc būtības"
            value="pec_butibas"
            checked={data.atbildes === "pec_butibas"}
            onChange={(v) =>
              update("atbildes", v as PirmreizejaisPacientsData["atbildes"])
            }
          />
          <DocRadio
            id="atb-dal"
            name="atbildes"
            label="daļēji pēc būtības"
            value="daleji"
            checked={data.atbildes === "daleji"}
            onChange={(v) =>
              update("atbildes", v as PirmreizejaisPacientsData["atbildes"])
            }
          />
          <DocRadio
            id="atb-ne"
            name="atbildes"
            label="ne pēc būtības"
            value="ne_pec_butibas"
            checked={data.atbildes === "ne_pec_butibas"}
            onChange={(v) =>
              update("atbildes", v as PirmreizejaisPacientsData["atbildes"])
            }
          />
        </DocLine>

        <DocLine label="STĀSTĪJUMS" {...noteProps("stastijums")}>
          <DocRadio
            id="st-sec"
            name="stastijums"
            label="secīgs"
            value="secigs"
            checked={data.stastijums === "secigs"}
            onChange={(v) =>
              update("stastijums", v as PirmreizejaisPacientsData["stastijums"])
            }
          />
        </DocLine>

        <DocLine label="SŪDZAS" {...noteProps("sudzibas")} />

        <DocLine label="UZMANĪBA" {...noteProps("uzmaniba")}>
          <DocRadio
            id="uzm-not"
            name="uzmaniba"
            label="noturīga"
            value="noturiga"
            checked={data.uzmaniba === "noturiga"}
            onChange={(v) =>
              update("uzmaniba", v as PirmreizejaisPacientsData["uzmaniba"])
            }
          />
          <DocRadio
            id="uzm-nen"
            name="uzmaniba"
            label="nenoturīga"
            value="nenoturiga"
            checked={data.uzmaniba === "nenoturiga"}
            onChange={(v) =>
              update("uzmaniba", v as PirmreizejaisPacientsData["uzmaniba"])
            }
          />
        </DocLine>

        <DocLine label="DOMĀŠANA" {...noteProps("domasana")}>
          <DocRadio
            id="dom-sec"
            name="domasana"
            label="secīga"
            value="seciga"
            checked={data.domasana === "seciga"}
            onChange={(v) =>
              update("domasana", v as PirmreizejaisPacientsData["domasana"])
            }
          />
        </DocLine>

        <DocLine label="PSIHOPRODUKTĪVA SIMPTOMĀTIKA" {...noteProps("psihoproduktivs")}>
          <DocRadio
            id="pp-ne"
            name="psihoproduktivs"
            label="nenovēro"
            value="nenovero"
            checked={data.psihoproduktivs === "nenovero"}
            onChange={(v) =>
              update(
                "psihoproduktivs",
                v as PirmreizejaisPacientsData["psihoproduktivs"],
              )
            }
          />
          <DocRadio
            id="pp-ir"
            name="psihoproduktivs"
            label="ir (murgi/halucinācijas)"
            value="ir"
            checked={data.psihoproduktivs === "ir"}
            onChange={(v) =>
              update(
                "psihoproduktivs",
                v as PirmreizejaisPacientsData["psihoproduktivs"],
              )
            }
          />
        </DocLine>

        <DocLine label="GARASTĀVOKLIS" {...noteProps("garastavoklis")}>
          <DocRadio
            id="gs-pie"
            name="garastavoklis"
            label="piepacelts"
            value="piepacelts"
            checked={data.garastavoklis === "piepacelts"}
            onChange={(v) =>
              update(
                "garastavoklis",
                v as PirmreizejaisPacientsData["garastavoklis"],
              )
            }
          />
          <DocRadio
            id="gs-nei"
            name="garastavoklis"
            label="neitrāls"
            value="neitrals"
            checked={data.garastavoklis === "neitrals"}
            onChange={(v) =>
              update(
                "garastavoklis",
                v as PirmreizejaisPacientsData["garastavoklis"],
              )
            }
          />
          <DocRadio
            id="gs-paz"
            name="garastavoklis"
            label="pazemināts"
            value="pazeminats"
            checked={data.garastavoklis === "pazeminats"}
            onChange={(v) =>
              update(
                "garastavoklis",
                v as PirmreizejaisPacientsData["garastavoklis"],
              )
            }
          />
        </DocLine>

        <DocLine label="EMOCIONĀLĀS REAKCIJAS" {...noteProps("emocionalasReakcijas")}>
          {EMOCIONALAS_REAKCIJAS.map((item) => (
            <DocCheckbox
              key={item}
              id={`em-${item}`}
              label={item}
              checked={data.emocionalasReakcijas.includes(item)}
              onChange={(c) => toggleListItem("emocionalasReakcijas", item, c)}
            />
          ))}
        </DocLine>

        <DocLine label="TRAUKSME" {...noteProps("trauksme")}>
          <DocRadio
            id="tr-ne"
            name="trauksme-ir"
            label="nav"
            value="ne"
            checked={data.trauksme.ir === "ne"}
            onChange={() => update("trauksme", { ir: "ne", veids: "" })}
          />
          <DocRadio
            id="tr-ja"
            name="trauksme-ir"
            label="ir"
            value="ja"
            checked={data.trauksme.ir === "ja"}
            onChange={() =>
              update("trauksme", { ...data.trauksme, ir: "ja" })
            }
          />
          {data.trauksme.ir === "ja" && (
            <>
              <DocRadio
                id="tr-vie"
                name="trauksme-veids"
                label="viegla"
                value="viegla"
                checked={data.trauksme.veids === "viegla"}
                onChange={(v) =>
                  update("trauksme", {
                    ...data.trauksme,
                    veids: v as PirmreizejaisPacientsData["trauksme"]["veids"],
                  })
                }
              />
              <DocRadio
                id="tr-mer"
                name="trauksme-veids"
                label="mērena"
                value="merena"
                checked={data.trauksme.veids === "merena"}
                onChange={(v) =>
                  update("trauksme", {
                    ...data.trauksme,
                    veids: v as PirmreizejaisPacientsData["trauksme"]["veids"],
                  })
                }
              />
              <DocRadio
                id="tr-izt"
                name="trauksme-veids"
                label="izteikta"
                value="izteikta"
                checked={data.trauksme.veids === "izteikta"}
                onChange={(v) =>
                  update("trauksme", {
                    ...data.trauksme,
                    veids: v as PirmreizejaisPacientsData["trauksme"]["veids"],
                  })
                }
              />
              <DocRadio
                id="tr-pan"
                name="trauksme-veids"
                label="panika"
                value="panika"
                checked={data.trauksme.veids === "panika"}
                onChange={(v) =>
                  update("trauksme", {
                    ...data.trauksme,
                    veids: v as PirmreizejaisPacientsData["trauksme"]["veids"],
                  })
                }
              />
            </>
          )}
        </DocLine>

        <DocLine label="INTELEKTS" {...noteProps("intelekts")}>
          <DocRadio
            id="int-pil"
            name="intelekts"
            label="pilnvērtīgs"
            value="pilnvertigs"
            checked={data.intelekts === "pilnvertigs"}
            onChange={(v) =>
              update("intelekts", v as PirmreizejaisPacientsData["intelekts"])
            }
          />
          <DocRadio
            id="int-vie"
            name="intelekts"
            label="viegli pazemināts"
            value="viegli"
            checked={data.intelekts === "viegli"}
            onChange={(v) =>
              update("intelekts", v as PirmreizejaisPacientsData["intelekts"])
            }
          />
          <DocRadio
            id="int-vid"
            name="intelekts"
            label="vidēji pazemināts"
            value="videji"
            checked={data.intelekts === "videji"}
            onChange={(v) =>
              update("intelekts", v as PirmreizejaisPacientsData["intelekts"])
            }
          />
          <DocRadio
            id="int-izt"
            name="intelekts"
            label="izteikti pazemināts"
            value="izteikti"
            checked={data.intelekts === "izteikti"}
            onChange={(v) =>
              update("intelekts", v as PirmreizejaisPacientsData["intelekts"])
            }
          />
        </DocLine>

        <DocLine label="SUICIDĀLAS DOMAS" {...noteProps("suicidalsDomas")}>
          <DocRadio
            id="sd-nol"
            name="suicidalsDomas"
            label="noliedz"
            value="noliedz"
            checked={data.suicidalsDomas === "noliedz"}
            onChange={(v) =>
              update(
                "suicidalsDomas",
                v as PirmreizejaisPacientsData["suicidalsDomas"],
              )
            }
          />
          <DocRadio
            id="sd-atk"
            name="suicidalsDomas"
            label="atklāj"
            value="atklaj"
            checked={data.suicidalsDomas === "atklaj"}
            onChange={(v) =>
              update(
                "suicidalsDomas",
                v as PirmreizejaisPacientsData["suicidalsDomas"],
              )
            }
          />
        </DocLine>

        <DocLine label="MIEGS" {...noteProps("miegs")}>
          {MIEGS_OPTIONS.map((item) => (
            <DocCheckbox
              key={item}
              id={`miegs-${item}`}
              label={item}
              checked={data.miegs.includes(item)}
              onChange={(c) => toggleListItem("miegs", item, c)}
            />
          ))}
        </DocLine>

        <DocLine label="KRITIKA" {...noteProps("kritika")}>
          <DocRadio
            id="kr-ir"
            name="kritika"
            label="ir"
            value="ir"
            checked={data.kritika === "ir"}
            onChange={(v) =>
              update("kritika", v as PirmreizejaisPacientsData["kritika"])
            }
          />
          <DocRadio
            id="kr-nav"
            name="kritika"
            label="nav"
            value="nav"
            checked={data.kritika === "nav"}
            onChange={(v) =>
              update("kritika", v as PirmreizejaisPacientsData["kritika"])
            }
          />
          <DocRadio
            id="kr-for"
            name="kritika"
            label="formāla"
            value="formala"
            checked={data.kritika === "formala"}
            onChange={(v) =>
              update("kritika", v as PirmreizejaisPacientsData["kritika"])
            }
          />
        </DocLine>

        <DocSectionTitle>Somatiski / Neiroloģiski / Skalas</DocSectionTitle>

        <DocLine label="SOMATISKI" {...noteProps("somatiski")}>
          <DocRadio
            id="som-bez"
            name="somatiski"
            label="bez akūtas patoloģijas"
            value="bez_patologijas"
            checked={data.somatiski === "bez_patologijas"}
            onChange={(v) =>
              update("somatiski", v as PirmreizejaisPacientsData["somatiski"])
            }
          />
          <DocRadio
            id="som-ir"
            name="somatiski"
            label="ir"
            value="ir"
            checked={data.somatiski === "ir"}
            onChange={(v) =>
              update("somatiski", v as PirmreizejaisPacientsData["somatiski"])
            }
          />
        </DocLine>

        <DocLine label="NEIROLOĢISKI" {...noteProps("neirologiski")}>
          <DocRadio
            id="neu-bez"
            name="neirologiski"
            label="Bez akūtas CNS perēkļu simptomātikas"
            value="bez_simptomatikas"
            checked={data.neirologiski === "bez_simptomatikas"}
            onChange={(v) =>
              update(
                "neirologiski",
                v as PirmreizejaisPacientsData["neirologiski"],
              )
            }
          />
          <DocRadio
            id="neu-ir"
            name="neirologiski"
            label="ir"
            value="ir"
            checked={data.neirologiski === "ir"}
            onChange={(v) =>
              update(
                "neirologiski",
                v as PirmreizejaisPacientsData["neirologiski"],
              )
            }
          />
        </DocLine>

        <DocLine label="PHQ9 / GAD7" {...noteProps("phq9Gad7")}>
          <span className="text-[13px]">PHQ9</span>
          <DocInlineInput
            id="phq9"
            value={data.phq9}
            onChange={(v) => update("phq9", v)}
            className="w-16"
            placeholder="punkti"
          />
          <span className="text-[13px]">GAD7</span>
          <DocInlineInput
            id="gad7"
            value={data.gad7}
            onChange={(v) => update("gad7", v)}
            className="w-16"
            placeholder="punkti"
          />
        </DocLine>

        <DocLine
          label="PĀRRUNĀTS AR PACIENTU"
          {...noteProps("parrunats")}
          notePlaceholder="miega higiēna, rekomendācijas, medikamenti, psiholoģiskais atbalsts"
        />

        <DocLine
          label="DIAGNOZE"
          {...noteProps("diagnoze")}
          notePlaceholder="F41.2 Trauksme ar depresiju"
        />

        <DocSectionTitle>Taktika</DocSectionTitle>

        <DocLine label="1. UZRAUDZĪBĀ" {...noteProps("taktikaUzraudziba")}>
          <DocCheckbox
            id="tu-ga"
            label="ģimenes ārsta"
            checked={data.taktikaUzraudziba.gimenes_arsts}
            onChange={(checked) =>
              update("taktikaUzraudziba", {
                ...data.taktikaUzraudziba,
                gimenes_arsts: checked,
              })
            }
          />
          <DocCheckbox
            id="tu-ps"
            label="psihiatra"
            checked={data.taktikaUzraudziba.psihiatrs}
            onChange={(checked) =>
              update("taktikaUzraudziba", {
                ...data.taktikaUzraudziba,
                psihiatrs: checked,
              })
            }
          />
          <DocCheckbox
            id="tu-cits"
            label="cits"
            checked={data.taktikaUzraudziba.cits}
            onChange={(checked) =>
              update("taktikaUzraudziba", {
                ...data.taktikaUzraudziba,
                cits: checked,
              })
            }
          />
        </DocLine>

        <DocLine
          label="2. IKDIENĀ"
          {...noteProps("taktikaIkdiena")}
          notePlaceholder="darba-atpūtas režīms, fiziskas aktivitātes ≥1h/dienā, sabalansēts uzturs"
        />

        <DocLine
          label="3. MEDIKAMENTOZĀ TERAPIJA"
          {...noteProps("taktikaMedikamenti")}
          notePlaceholder="medikamenti"
        />

        <DocLine label="4. PSIHOLOĢISKAIS ATBALSTS" {...noteProps("taktikaPsiholoģija")}>
          <DocRadio
            id="tp-atb"
            name="taktikaPsiholoģija"
            label="psiholoģisks atbalsts"
            value="psihologisks_atbalsts"
            checked={data.taktikaPsiholoģija === "psihologisks_atbalsts"}
            onChange={(v) =>
              update(
                "taktikaPsiholoģija",
                v as PirmreizejaisPacientsData["taktikaPsiholoģija"],
              )
            }
          />
          <DocRadio
            id="tp-ter"
            name="taktikaPsiholoģija"
            label="psihoterapija"
            value="psihoterapija"
            checked={data.taktikaPsiholoģija === "psihoterapija"}
            onChange={(v) =>
              update(
                "taktikaPsiholoģija",
                v as PirmreizejaisPacientsData["taktikaPsiholoģija"],
              )
            }
          />
        </DocLine>
      </article>
    </FormShell>
  );
}
