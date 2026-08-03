"use client";

import { useState } from "react";

import {
  DocCheckbox,
  DocFieldBlock,
  DocInlineInput,
  DocLine,
  DocRadio,
  DocSectionTitle,
  DocTextArea,
} from "@/components/doc/FormControls";
import { FormShell } from "@/components/FormShell";
import { toHtmlId } from "@/lib/html-id";
import { emptyProtokols, type ProtokolsData } from "@/lib/types/forms";

function toggleArrayItem(list: string[], item: string, checked: boolean): string[] {
  if (checked) {
    return list.includes(item) ? list : [...list, item];
  }
  return list.filter((entry) => entry !== item);
}

export function ProtokolsForm() {
  const [data, setData] = useState<ProtokolsData>(() => emptyProtokols());

  function update<K extends keyof ProtokolsData>(key: K, value: ProtokolsData[K]) {
    setData((current) => ({ ...current, [key]: value }));
  }

  return (
    <FormShell
      formType="protokols"
      formData={data}
      title="Protokols (uzn.nod.1)"
      subtitle="Psihiatriskā apskate — Neatliekamās medicīniskās palīdzības un pacientu uzņemšanas nodaļā."
    >
      <article className="doc-sheet min-w-0">
        <header className="doc-header mb-6 text-center">
          <h2 className="text-base font-bold uppercase tracking-wide text-zinc-900 sm:text-lg">
            PSIHIATRISKĀ APSKATE
          </h2>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-[13px] leading-relaxed text-zinc-800">
            Neatliekamās medicīniskās palīdzības un pacientu uzņemšanas nodaļā
            <DocInlineInput
              id="gads"
              value={data.gads}
              onChange={(v) => update("gads", v)}
              className="mx-1 inline-block w-16"
            />
            g.
            <DocInlineInput
              id="datums"
              value={data.datums}
              onChange={(v) => update("datums", v)}
              className="mx-1 inline-block w-28"
            />
            ,
            <DocInlineInput
              id="vieta"
              value={data.vieta}
              onChange={(v) => update("vieta", v)}
              className="mx-1 inline-block w-40"
            />
            , plkst.:{" "}
            <DocInlineInput
              id="stunda"
              value={data.stunda}
              onChange={(v) => update("stunda", v)}
              className="inline-block w-10"
            />
            :
            <DocInlineInput
              id="minutes"
              value={data.minutes}
              onChange={(v) => update("minutes", v)}
              className="inline-block w-10"
            />
          </div>
        </header>

        <div className="doc-table-wrap mb-6">
        <table className="doc-table doc-table--patient doc-table--stacked w-full border-collapse text-[13px]">
          <tbody>
            <tr>
              <td colSpan={2} className="doc-table-section">
                I Ziņas par pacientu
              </td>
            </tr>
            <tr>
              <td className="doc-table-cell doc-table-cell--label align-top">
                1. Pacients stacionēts
              </td>
              <td className="doc-table-cell align-top">
                <DocInlineInput
                  id="stacionets"
                  value={data.stacionets}
                  onChange={(v) => update("stacionets", v)}
                  className="w-full"
                />
                <div className="mt-2">
                  ar nosūtījumu no:
                  <DocInlineInput
                    id="nosutijums-no"
                    value={data.nosutijumsNo}
                    onChange={(v) => update("nosutijumsNo", v)}
                    className="mt-1 w-full"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  <DocCheckbox id="nos-psih" label="psihiatra" checked={data.nosutijumsTips.psihiatrs} onChange={(c) => update("nosutijumsTips", { ...data.nosutijumsTips, psihiatrs: c })} />
                  <DocCheckbox id="nos-ga" label="ģimenes ārsta" checked={data.nosutijumsTips.gimenesArsts} onChange={(c) => update("nosutijumsTips", { ...data.nosutijumsTips, gimenesArsts: c })} />
                  <DocCheckbox id="nos-nmpd" label="NMPD" checked={data.nosutijumsTips.nmpd} onChange={(c) => update("nosutijumsTips", { ...data.nosutijumsTips, nmpd: c })} />
                  <DocCheckbox id="bez-nos" label="bez nosūtījuma" checked={data.nosutijumsTips.bezNosutijuma} onChange={(c) => update("nosutijumsTips", { ...data.nosutijumsTips, bezNosutijuma: c })} />
                  <DocCheckbox id="ar-policiju" label="ar policiju" checked={data.nosutijumsTips.arPoliciju} onChange={(c) => update("nosutijumsTips", { ...data.nosutijumsTips, arPoliciju: c })} />
                  <DocCheckbox id="pirmreizeji" label="pirmreizēji" checked={data.nosutijumsTips.pirmreizeji} onChange={(c) => update("nosutijumsTips", { ...data.nosutijumsTips, pirmreizeji: c })} />
                  <DocCheckbox id="atkartoti" label="atkārtoti" checked={data.nosutijumsTips.atkartoti} onChange={(c) => update("nosutijumsTips", { ...data.nosutijumsTips, atkartoti: c })} />
                </div>
                <div className="mt-2">
                  pārvests no:
                  <DocInlineInput id="parvests-no" value={data.nosutijumsTips.parvestsNo} onChange={(v) => update("nosutijumsTips", { ...data.nosutijumsTips, parvestsNo: v })} className="mt-1 w-full" />
                </div>
              </td>
            </tr>
            <tr>
              <td className="doc-table-cell doc-table-cell--label align-top">
                2. Pacients
              </td>
              <td className="doc-table-cell align-top">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <DocCheckbox id="strada" label="strādā" checked={data.strada} onChange={(c) => update("strada", c)} />
                  <DocCheckbox id="nestrada" label="nestrādā" checked={data.nestrada} onChange={(c) => update("nestrada", c)} />
                  <DocCheckbox id="invaliditate" label="ir invaliditāte" checked={data.invaliditate} onChange={(c) => update("invaliditate", c)} />
                </div>
              </td>
            </tr>
            <tr>
              <td className="doc-table-cell doc-table-cell--label align-top">
                3. Pacients ambulatoro psihiatru
              </td>
              <td className="doc-table-cell align-top">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <DocCheckbox id="amb-ne" label="neapmeklē" checked={data.ambulatoraisPsihiatrs.neapmekle} onChange={(c) => update("ambulatoraisPsihiatrs", { ...data.ambulatoraisPsihiatrs, neapmekle: c })} />
                  <DocCheckbox id="amb-nereg" label="apmeklē neregulāri" checked={data.ambulatoraisPsihiatrs.neregulari} onChange={(c) => update("ambulatoraisPsihiatrs", { ...data.ambulatoraisPsihiatrs, neregulari: c })} />
                  <DocCheckbox id="amb-reg" label="apmeklē regulāri" checked={data.ambulatoraisPsihiatrs.regulari} onChange={(c) => update("ambulatoraisPsihiatrs", { ...data.ambulatoraisPsihiatrs, regulari: c })} />
                </div>
              </td>
            </tr>
            <tr>
              <td className="doc-table-cell doc-table-cell--label align-top">
                4. Pacients dzīvo
              </td>
              <td className="doc-table-cell align-top">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <DocCheckbox id="dz-viens" label="viens" checked={data.dzivo.viens} onChange={(c) => update("dzivo", { ...data.dzivo, viens: c })} />
                  <DocCheckbox id="dz-gimene" label="ģimenē" checked={data.dzivo.gimene} onChange={(c) => update("dzivo", { ...data.dzivo, gimene: c })} />
                  <DocCheckbox id="dz-sac" label="SAC" checked={data.dzivo.sac} onChange={(c) => update("dzivo", { ...data.dzivo, sac: c })} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span>cits:</span>
                  <DocInlineInput id="dz-cits" value={data.dzivo.cits} onChange={(v) => update("dzivo", { ...data.dzivo, cits: v })} className="min-w-0 flex-1" />
                </div>
              </td>
            </tr>
            <tr>
              <td className="doc-table-cell doc-table-cell--label align-top">
                5. Hroniskas slimības
              </td>
              <td className="doc-table-cell align-top">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <DocCheckbox id="hs-noliedz" label="noliedz" checked={data.hroniskasSlimibas.noliedz} onChange={(c) => update("hroniskasSlimibas", { ...data.hroniskasSlimibas, noliedz: c })} />
                  <DocCheckbox id="hs-ir" label="ir, kādas:" checked={data.hroniskasSlimibas.ir} onChange={(c) => update("hroniskasSlimibas", { ...data.hroniskasSlimibas, ir: c })} />
                </div>
                {data.hroniskasSlimibas.ir && (
                  <DocInlineInput id="hs-apr" value={data.hroniskasSlimibas.apraksts} onChange={(v) => update("hroniskasSlimibas", { ...data.hroniskasSlimibas, apraksts: v })} className="mt-2 w-full" />
                )}
              </td>
            </tr>
            <tr>
              <td className="doc-table-cell doc-table-cell--label align-top">
                6. Lietotās zāles
              </td>
              <td className="doc-table-cell align-top">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <DocCheckbox id="lz-nav" label="nav" checked={data.lietotasZales.nav} onChange={(c) => update("lietotasZales", { ...data.lietotasZales, nav: c })} />
                  <DocCheckbox id="lz-ir" label="ir, kādas:" checked={data.lietotasZales.ir} onChange={(c) => update("lietotasZales", { ...data.lietotasZales, ir: c })} />
                </div>
                {data.lietotasZales.ir && (
                  <DocInlineInput id="lz-apr" value={data.lietotasZales.apraksts} onChange={(v) => update("lietotasZales", { ...data.lietotasZales, apraksts: v })} className="mt-2 w-full" />
                )}
              </td>
            </tr>
            <tr>
              <td className="doc-table-cell doc-table-cell--label align-top">
                7. Suicīda mēģinājumi
              </td>
              <td className="doc-table-cell align-top">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <DocCheckbox id="sm-nav" label="nav" checked={data.suicidaMeginajumi.nav} onChange={(c) => update("suicidaMeginajumi", { ...data.suicidaMeginajumi, nav: c })} />
                  <DocCheckbox id="sm-ir" label="ir, kādi:" checked={data.suicidaMeginajumi.ir} onChange={(c) => update("suicidaMeginajumi", { ...data.suicidaMeginajumi, ir: c })} />
                </div>
                {data.suicidaMeginajumi.ir && (
                  <DocInlineInput id="sm-apr" value={data.suicidaMeginajumi.apraksts} onChange={(v) => update("suicidaMeginajumi", { ...data.suicidaMeginajumi, apraksts: v })} className="mt-2 w-full" />
                )}
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        <DocSectionTitle>II Īsa anamnēze/katamnēze:</DocSectionTitle>
        <DocTextArea id="anamneze" value={data.anamneze} onChange={(v) => update("anamneze", v)} rows={5} />

        <DocSectionTitle className="mt-6">III Sūdzības, psihiskais stāvoklis:</DocSectionTitle>

        <DocLine label="1. Apziņa">
          <DocRadio id="apz-netr" name="apzina" label="netraucēta" value="netrauceta" checked={data.apzina === "netrauceta"} onChange={(v) => update("apzina", v as ProtokolsData["apzina"])} />
          <DocRadio id="apz-sas" name="apzina" label="sašaurināta" value="sasaurinata" checked={data.apzina === "sasaurinata"} onChange={(v) => update("apzina", v as ProtokolsData["apzina"])} />
          <DocRadio id="apz-main" name="apzina" label="mainīga" value="mainiga" checked={data.apzina === "mainiga"} onChange={(v) => update("apzina", v as ProtokolsData["apzina"])} />
          <DocRadio id="apz-apt" name="apzina" label="aptumšota" value="aptumsota" checked={data.apzina === "aptumsota"} onChange={(v) => update("apzina", v as ProtokolsData["apzina"])} />
        </DocLine>

        <div className="doc-subsection">
          <div className="doc-label mb-2">2. Orientācija</div>
          <table className="doc-table doc-table--compact doc-table--stacked w-full border-collapse text-[13px]">
            <tbody>
              {(["laika", "vieta", "personalba"] as const).map((dim) => (
                <tr key={dim}>
                  <td className="doc-table-cell w-28 capitalize">{dim === "personalba" ? "personībā" : dim === "laika" ? "laikā" : "vietā"}</td>
                  <td className="doc-table-cell">
                    <DocRadio id={`ori-${dim}-p`} name={`orientacija-${dim}`} label="pilnīga" value="pilniga" checked={data.orientacija[dim] === "pilniga"} onChange={(v) => update("orientacija", { ...data.orientacija, [dim]: v as "pilniga" | "daleja" | "nav" })} />
                  </td>
                  <td className="doc-table-cell">
                    <DocRadio id={`ori-${dim}-d`} name={`orientacija-${dim}`} label="daļēja" value="daleja" checked={data.orientacija[dim] === "daleja"} onChange={(v) => update("orientacija", { ...data.orientacija, [dim]: v as "pilniga" | "daleja" | "nav" })} />
                  </td>
                  <td className="doc-table-cell">
                    <DocRadio id={`ori-${dim}-n`} name={`orientacija-${dim}`} label="nav" value="nav" checked={data.orientacija[dim] === "nav"} onChange={(v) => update("orientacija", { ...data.orientacija, [dim]: v as "pilniga" | "daleja" | "nav" })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DocLine label="3. Kontakts ar pacientu">
          <DocRadio id="kon-p" name="kontakts" label="pieejams (-a)" value="pieejams" checked={data.kontakts === "pieejams"} onChange={(v) => update("kontakts", v as ProtokolsData["kontakts"])} />
          <DocRadio id="kon-v" name="kontakts" label="virspusējs" value="virspusējs" checked={data.kontakts === "virspusējs"} onChange={(v) => update("kontakts", v as ProtokolsData["kontakts"])} />
          <DocRadio id="kon-n" name="kontakts" label="neproduktīvs" value="neproduktivs" checked={data.kontakts === "neproduktivs"} onChange={(v) => update("kontakts", v as ProtokolsData["kontakts"])} />
        </DocLine>

        <DocLine label="4. Atbild">
          <DocRadio id="atb-pb" name="atbild" label="pēc būtības" value="pec_butibas" checked={data.atbild === "pec_butibas"} onChange={(v) => update("atbild", v as ProtokolsData["atbild"])} />
          <DocRadio id="atb-dpb" name="atbild" label="daļēji pēc būtības" value="daleji_pec_butibas" checked={data.atbild === "daleji_pec_butibas"} onChange={(v) => update("atbild", v as ProtokolsData["atbild"])} />
          <DocRadio id="atb-npb" name="atbild" label="ne pēc būtības" value="ne_pec_butibas" checked={data.atbild === "ne_pec_butibas"} onChange={(v) => update("atbild", v as ProtokolsData["atbild"])} />
        </DocLine>

        <div className="doc-subsection">
          <div className="doc-label mb-2">5. Runa</div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <DocRadio id="run-paat" name="runa-temp" label="paātrināta" value="paatrinata" checked={data.runa.temp === "paatrinata"} onChange={(v) => update("runa", { ...data.runa, temp: v as ProtokolsData["runa"]["temp"] })} />
            <DocRadio id="run-pal" name="runa-temp" label="palēnināta" value="palelinata" checked={data.runa.temp === "palelinata"} onChange={(v) => update("runa", { ...data.runa, temp: v as ProtokolsData["runa"]["temp"] })} />
            <DocRadio id="run-daudz" name="runa-temp" label="daudzrunīgs" value="daudzrunigs" checked={data.runa.temp === "daudzrunigs"} onChange={(v) => update("runa", { ...data.runa, temp: v as ProtokolsData["runa"]["temp"] })} />
            <DocRadio id="run-maz" name="runa-temp" label="mazrunīgs" value="mazrunigs" checked={data.runa.temp === "mazrunigs"} onChange={(v) => update("runa", { ...data.runa, temp: v as ProtokolsData["runa"]["temp"] })} />
            <DocRadio id="run-sap" name="runa-sap" label="saprotama" value="saprotama" checked={data.runa.saprotamiba === "saprotama"} onChange={(v) => update("runa", { ...data.runa, saprotamiba: v as ProtokolsData["runa"]["saprotamiba"] })} />
            <DocRadio id="run-nesap" name="runa-sap" label="nesaprotama" value="nesaprotama" checked={data.runa.saprotamiba === "nesaprotama"} onChange={(v) => update("runa", { ...data.runa, saprotamiba: v as ProtokolsData["runa"]["saprotamiba"] })} />
            <DocCheckbox id="run-art" label="artikulācijas traucējumi" checked={data.runa.artikulacija} onChange={(c) => update("runa", { ...data.runa, artikulacija: c })} />
          </div>
        </div>

        <DocLine label="6. Uztveres traucējumi">
          <DocRadio id="uzt-ja" name="uztveres" label="jā" value="ja" checked={data.uztveresTraucejumi === "ja"} onChange={(v) => update("uztveresTraucejumi", v as "ja" | "ne")} />
          <DocRadio id="uzt-ne" name="uztveres" label="nē" value="ne" checked={data.uztveresTraucejumi === "ne"} onChange={(v) => update("uztveresTraucejumi", v as "ja" | "ne")} />
        </DocLine>

        <div className="doc-subsection">
          <div className="doc-label mb-2">7. Halucinācijas</div>
          <div className="grid gap-2 sm:grid-cols-2">
            <DocCheckbox id="hal-redzes" label="redzes" checked={data.halucinacijas.redzes} onChange={(c) => update("halucinacijas", { ...data.halucinacijas, redzes: c })} />
            <DocCheckbox id="hal-istas" label="īstās halucinācijas" checked={data.halucinacijas.istas} onChange={(c) => update("halucinacijas", { ...data.halucinacijas, istas: c })} />
            <DocCheckbox id="hal-dzirdes" label="dzirdes" checked={data.halucinacijas.dzirdes} onChange={(c) => update("halucinacijas", { ...data.halucinacijas, dzirdes: c })} />
            <DocCheckbox id="hal-pseido" label="pseidohalucinācijas" checked={data.halucinacijas.pseido} onChange={(c) => update("halucinacijas", { ...data.halucinacijas, pseido: c })} />
            <DocCheckbox id="hal-garsas" label="garšas" checked={data.halucinacijas.garsas} onChange={(c) => update("halucinacijas", { ...data.halucinacijas, garsas: c })} />
            <DocCheckbox id="hal-senes" label="senestopātijas" checked={data.halucinacijas.senestopatijas} onChange={(c) => update("halucinacijas", { ...data.halucinacijas, senestopatijas: c })} />
            <DocCheckbox id="hal-ozas" label="ožas" checked={data.halucinacijas.ozas} onChange={(c) => update("halucinacijas", { ...data.halucinacijas, ozas: c })} />
            <DocCheckbox id="hal-psiho" label="citas (psihosensori vai ķermeņa shēmas traucējumi)" checked={data.halucinacijas.psihosensori} onChange={(c) => update("halucinacijas", { ...data.halucinacijas, psihosensori: c })} />
            <DocCheckbox id="hal-iluz" label="iluzori traucējumi" checked={data.halucinacijas.iluzori} onChange={(c) => update("halucinacijas", { ...data.halucinacijas, iluzori: c })} />
            <DocCheckbox id="hal-tak" label="taktilas" checked={data.halucinacijas.taktilas} onChange={(c) => update("halucinacijas", { ...data.halucinacijas, taktilas: c })} />
            <DocCheckbox id="hal-dere" label="derealizācija" checked={data.halucinacijas.derealizacija} onChange={(c) => update("halucinacijas", { ...data.halucinacijas, derealizacija: c })} />
            <DocCheckbox id="hal-vis" label="viscerālas" checked={data.halucinacijas.visceralas} onChange={(c) => update("halucinacijas", { ...data.halucinacijas, visceralas: c })} />
            <DocCheckbox id="hal-dep" label="depersonalizācija" checked={data.halucinacijas.depersonalizacija} onChange={(c) => update("halucinacijas", { ...data.halucinacijas, depersonalizacija: c })} />
          </div>
        </div>

        <div className="doc-subsection">
          <div className="doc-label mb-2">8. Pārvērtēšanas un murgu idejas</div>
          <div className="flex flex-wrap gap-4">
            <DocRadio id="pi-ja" name="parvert-ir" label="jā" value="ja" checked={data.parvertesanasIdejas.ir === "ja"} onChange={(v) => update("parvertesanasIdejas", { ...data.parvertesanasIdejas, ir: v as "ja" | "ne" })} />
            <DocRadio id="pi-ne" name="parvert-ir" label="nē" value="ne" checked={data.parvertesanasIdejas.ir === "ne"} onChange={(v) => update("parvertesanasIdejas", { ...data.parvertesanasIdejas, ir: v as "ja" | "ne" })} />
            <DocCheckbox id="pi-paran" label="paranojālas" checked={data.parvertesanasIdejas.paranojalas} onChange={(c) => update("parvertesanasIdejas", { ...data.parvertesanasIdejas, paranojalas: c })} />
            <DocCheckbox id="pi-parano" label="paranoīdas" checked={data.parvertesanasIdejas.paranoīdas} onChange={(c) => update("parvertesanasIdejas", { ...data.parvertesanasIdejas, paranoīdas: c })} />
            <DocCheckbox id="pi-para" label="parafrēnas" checked={data.parvertesanasIdejas.parafrēnas} onChange={(c) => update("parvertesanasIdejas", { ...data.parvertesanasIdejas, parafrēnas: c })} />
            <DocCheckbox id="pi-tela" label="tēlainas" checked={data.parvertesanasIdejas.telainas} onChange={(c) => update("parvertesanasIdejas", { ...data.parvertesanasIdejas, telainas: c })} />
            <DocCheckbox id="pi-sist" label="sistematizētas" checked={data.parvertesanasIdejas.sistematizetas} onChange={(c) => update("parvertesanasIdejas", { ...data.parvertesanasIdejas, sistematizetas: c })} />
            <span className="text-[13px]">citas:</span>
            <DocInlineInput id="pi-citas" value={data.parvertesanasIdejas.citas} onChange={(v) => update("parvertesanasIdejas", { ...data.parvertesanasIdejas, citas: v })} />
          </div>
        </div>

        <DocFieldBlock label="9. Vai un kā šīs idejas ietekmē uzvedību, rada apdraudējumu:">
          <DocTextArea id="ideju-ietekme" value={data.idejuIetekmeUzvediba} onChange={(v) => update("idejuIetekmeUzvediba", v)} rows={2} />
        </DocFieldBlock>

        <DocLine label="10. Formālās domāšanas traucējumi">
          <DocRadio id="fd-ja" name="form-domas" label="jā" value="ja" checked={data.formalasDomasanas.ir === "ja"} onChange={(v) => update("formalasDomasanas", { ...data.formalasDomasanas, ir: v as "ja" | "ne" })} />
          <DocRadio id="fd-ne" name="form-domas" label="nē" value="ne" checked={data.formalasDomasanas.ir === "ne"} onChange={(v) => update("formalasDomasanas", { ...data.formalasDomasanas, ir: v as "ja" | "ne" })} />
          <span className="text-[13px]">kādi:</span>
          <DocInlineInput id="fd-apr" value={data.formalasDomasanas.apraksts} onChange={(v) => update("formalasDomasanas", { ...data.formalasDomasanas, apraksts: v })} />
        </DocLine>

        <div className="doc-subsection">
          <div className="doc-label mb-2">11. Emocionālās reakcijas</div>
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            {[
              "eiforiskas", "neitrālas", "apātiskas", "pacilātas", "labilas",
              "vienaldzīgas", "drūmas", "dzīvas", "atbilstošas situācijai",
              "izteikti nomāktas", "blāvas", "neatbilstošas situācijai",
            ].map((item) => (
              <DocCheckbox
                key={item}
                id={toHtmlId("emo", item)}
                label={item}
                checked={data.emocionalasReakcijas.includes(item)}
                onChange={(c) =>
                  update(
                    "emocionalasReakcijas",
                    toggleArrayItem(data.emocionalasReakcijas, item, c),
                  )
                }
              />
            ))}
          </div>
        </div>

        <DocLine label="12. Garastāvoklis">
          {[
            ["pacilats", "pacilāts"],
            ["pazeminats", "pazemināts"],
            ["lidzsvarots", "līdzsvarots"],
            ["mainigs", "mainīgs"],
            ["jaukts", "jaukts"],
            ["disforisks", "disforisks"],
          ].map(([value, label]) => (
            <DocRadio key={value} id={`gs-${value}`} name="garastavoklis" label={label} value={value} checked={data.garastavoklis === value} onChange={(v) => update("garastavoklis", v as ProtokolsData["garastavoklis"])} />
          ))}
        </DocLine>

        <DocLine label="13. Trauksme">
          <DocRadio id="tr-ir" name="trauksme-ir" label="ir" value="ja" checked={data.trauksme.ir === "ja"} onChange={(v) => update("trauksme", { ...data.trauksme, ir: v as "ja" | "ne" })} />
          <DocRadio id="tr-nav" name="trauksme-ir" label="nav" value="ne" checked={data.trauksme.ir === "ne"} onChange={(v) => update("trauksme", { ...data.trauksme, ir: v as "ja" | "ne" })} />
          <span className="text-[13px]">Kāda?</span>
          {[
            ["viegla", "viegla"],
            ["mereni", "mēreni izteikta"],
            ["izteikta", "izteikta"],
            ["panika", "panika"],
          ].map(([value, label]) => (
            <DocRadio key={value} id={`tr-${value}`} name="trauksme-veids" label={label} value={value} checked={data.trauksme.veids === value} onChange={(v) => update("trauksme", { ...data.trauksme, veids: v as ProtokolsData["trauksme"]["veids"] })} />
          ))}
        </DocLine>

        <DocLine label="14. Uzmanība, atmiņa">
          <DocRadio id="ua-bez" name="uzmaniba" label="bez traucējumiem" value="bez_traucejumiem" checked={data.uzmanibaAtmina === "bez_traucejumiem"} onChange={(v) => update("uzmanibaAtmina", v as ProtokolsData["uzmanibaAtmina"])} />
          <DocRadio id="ua-ar" name="uzmaniba" label="ar traucējumiem" value="ar_traucejumiem" checked={data.uzmanibaAtmina === "ar_traucejumiem"} onChange={(v) => update("uzmanibaAtmina", v as ProtokolsData["uzmanibaAtmina"])} />
        </DocLine>

        <DocLine label="15. Intelekts">
          <DocRadio id="int-piln" name="intelekts" label="pilnvērtīgs" value="pilnvertigs" checked={data.intelekts === "pilnvertigs"} onChange={(v) => update("intelekts", v as ProtokolsData["intelekts"])} />
          <DocRadio id="int-viegli" name="intelekts" label="viegli pazemināts" value="viegli" checked={data.intelekts === "viegli"} onChange={(v) => update("intelekts", v as ProtokolsData["intelekts"])} />
          <DocRadio id="int-videji" name="intelekts" label="vidēji pazemināts" value="videji" checked={data.intelekts === "videji"} onChange={(v) => update("intelekts", v as ProtokolsData["intelekts"])} />
          <DocRadio id="int-izteikti" name="intelekts" label="izteikti pazemināts" value="izteikti" checked={data.intelekts === "izteikti"} onChange={(v) => update("intelekts", v as ProtokolsData["intelekts"])} />
        </DocLine>

        <DocLine label="16. Suicidālas domas">
          <DocRadio id="sd-ir" name="suicid-dom" label="ir" value="ja" checked={data.suicidalsDomas === "ja"} onChange={(v) => update("suicidalsDomas", v as "ja" | "ne")} />
          <DocRadio id="sd-nav" name="suicid-dom" label="nav" value="ne" checked={data.suicidalsDomas === "ne"} onChange={(v) => update("suicidalsDomas", v as "ja" | "ne")} />
        </DocLine>

        <div className="doc-subsection">
          <div className="doc-label mb-2">17. Miegs</div>
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            {[
              "apmierinošs", "saraustīts", "guļ ar miegazālēm", "pagarināts",
              "saīsināts", "iemigšanas grūtības", "agra pamošanās",
            ].map((item) => (
              <DocCheckbox
                key={item}
                id={toHtmlId("miegs", item)}
                label={item}
                checked={data.miegs.veids.includes(item)}
                onChange={(c) =>
                  update("miegs", {
                    ...data.miegs,
                    veids: toggleArrayItem(data.miegs.veids, item, c),
                  })
                }
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
            nav gulējis
            <DocInlineInput
              id="miegs-naktis"
              value={data.miegs.navGulejisNaktis}
              onChange={(v) => update("miegs", { ...data.miegs, navGulejisNaktis: v })}
              className="w-12"
            />
            naktis
          </div>
        </div>

        <DocLine label="18. Kritika">
          <DocRadio id="kr-k" name="kritika" label="kritisks (-a)" value="kritisks" checked={data.kritika === "kritisks"} onChange={(v) => update("kritika", v as ProtokolsData["kritika"])} />
          <DocRadio id="kr-dk" name="kritika" label="daļēji kritisks (-a)" value="daleji" checked={data.kritika === "daleji"} onChange={(v) => update("kritika", v as ProtokolsData["kritika"])} />
          <DocRadio id="kr-nk" name="kritika" label="nekritisks (-a)" value="nekritisks" checked={data.kritika === "nekritisks"} onChange={(v) => update("kritika", v as ProtokolsData["kritika"])} />
        </DocLine>

        <DocSectionTitle>IV Pacienta ārējais izskats un uzvedība:</DocSectionTitle>
        <DocTextArea id="arejais-izskats" value={data.arejaisIzskats} onChange={(v) => update("arejaisIzskats", v)} rows={3} />

        <DocSectionTitle>V Alkohola/narkotisko vielu reibuma pazīmes</DocSectionTitle>
        <div className="flex flex-wrap gap-4">
          <DocCheckbox id="alk-nek" label="nekonstatē" checked={data.alkoholaReibums.nekonstate} onChange={(c) => update("alkoholaReibums", { ...data.alkoholaReibums, nekonstate: c })} />
          <DocCheckbox id="alk-ir" label="ir, BAC =" checked={data.alkoholaReibums.ir} onChange={(c) => update("alkoholaReibums", { ...data.alkoholaReibums, ir: c })} />
          <DocInlineInput id="alk-bac" value={data.alkoholaReibums.bac} onChange={(v) => update("alkoholaReibums", { ...data.alkoholaReibums, bac: v })} className="w-16" />
          <span className="text-[13px]">‰</span>
          <span className="text-[13px]">kādas:</span>
          <DocInlineInput id="alk-kadas" value={data.alkoholaReibums.kadas} onChange={(v) => update("alkoholaReibums", { ...data.alkoholaReibums, kadas: v })} />
          <span className="text-[13px]">lietošanas paradumi:</span>
          <DocInlineInput id="alk-par" value={data.alkoholaReibums.lietosanasParadumi} onChange={(v) => update("alkoholaReibums", { ...data.alkoholaReibums, lietosanasParadumi: v })} className="min-w-[160px]" />
        </div>

        <DocSectionTitle>VI Neiroloģiskais stāvoklis</DocSectionTitle>
        <DocFieldBlock label="Centrālās un perifērās NS simptomātika">
          <DocTextArea id="neiro-sim" value={data.neirologiskais.simptomatika} onChange={(v) => update("neirologiskais", { ...data.neirologiskais, simptomatika: v })} rows={2} />
        </DocFieldBlock>
        <DocFieldBlock label="Cita simptomātika:">
          <DocTextArea id="neiro-cita" value={data.neirologiskais.citaSimptomatika} onChange={(v) => update("neirologiskais", { ...data.neirologiskais, citaSimptomatika: v })} rows={2} />
          <div className="mt-2 flex flex-wrap gap-4">
            <DocCheckbox id="neiro-nen" label="nenovēro" checked={data.neirologiskais.nenovēro} onChange={(c) => update("neirologiskais", { ...data.neirologiskais, nenovēro: c })} />
            <DocCheckbox id="neiro-ir" label="ir" checked={data.neirologiskais.ir} onChange={(c) => update("neirologiskais", { ...data.neirologiskais, ir: c })} />
          </div>
        </DocFieldBlock>

        <DocSectionTitle>VII Somatiskais stāvoklis</DocSectionTitle>
        <DocFieldBlock label="Akūtas somatiskas patoloģijas pazīmes">
          <div className="flex flex-wrap gap-4">
            <DocCheckbox id="som-nav" label="nav" checked={data.somatisks.nav} onChange={(c) => update("somatisks", { ...data.somatisks, nav: c })} />
            <DocCheckbox id="som-ir" label="ir, kādas:" checked={data.somatisks.ir} onChange={(c) => update("somatisks", { ...data.somatisks, ir: c })} />
            {data.somatisks.ir && (
              <DocInlineInput id="som-apr" value={data.somatisks.apraksts} onChange={(v) => update("somatisks", { ...data.somatisks, apraksts: v })} className="min-w-[200px] flex-1" />
            )}
          </div>
        </DocFieldBlock>

        <DocSectionTitle>VIII</DocSectionTitle>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
          <span>Augums=</span>
          <DocInlineInput id="v-aug" value={data.vitalieRaditaji.augums} onChange={(v) => update("vitalieRaditaji", { ...data.vitalieRaditaji, augums: v })} className="w-16" />
          <span>cm</span>
          <span>Svars=</span>
          <DocInlineInput id="v-svar" value={data.vitalieRaditaji.svars} onChange={(v) => update("vitalieRaditaji", { ...data.vitalieRaditaji, svars: v })} className="w-16" />
          <span>kg</span>
          <span>tO =</span>
          <DocInlineInput id="v-to" value={data.vitalieRaditaji.to} onChange={(v) => update("vitalieRaditaji", { ...data.vitalieRaditaji, to: v })} className="w-16" />
          <span>°C</span>
          <span>p=</span>
          <DocInlineInput id="v-p" value={data.vitalieRaditaji.pulss} onChange={(v) => update("vitalieRaditaji", { ...data.vitalieRaditaji, pulss: v })} className="w-16" />
          <span>x&apos;</span>
          <span>TA=</span>
          <DocInlineInput id="v-ta" value={data.vitalieRaditaji.ta} onChange={(v) => update("vitalieRaditaji", { ...data.vitalieRaditaji, ta: v })} className="w-24" />
          <span>mmHg</span>
          <span>SpO2 =</span>
          <DocInlineInput id="v-spo2" value={data.vitalieRaditaji.spo2} onChange={(v) => update("vitalieRaditaji", { ...data.vitalieRaditaji, spo2: v })} className="w-16" />
          <span>%</span>
          <span>GLC=</span>
          <DocInlineInput id="v-glc" value={data.vitalieRaditaji.glc} onChange={(v) => update("vitalieRaditaji", { ...data.vitalieRaditaji, glc: v })} className="w-16" />
          <span>mmol/l</span>
        </div>

        <DocSectionTitle>IX Augšējo elpceļu infekcijas simptomātika</DocSectionTitle>
        <div className="flex flex-wrap gap-4">
          <DocCheckbox id="ae-nav" label="nav" checked={data.elpceļuInfekcija.nav} onChange={(c) => update("elpceļuInfekcija", { ...data.elpceļuInfekcija, nav: c })} />
          <DocCheckbox id="ae-ir" label="ir, kāda:" checked={data.elpceļuInfekcija.ir} onChange={(c) => update("elpceļuInfekcija", { ...data.elpceļuInfekcija, ir: c })} />
          {data.elpceļuInfekcija.ir && (
            <DocInlineInput id="ae-apr" value={data.elpceļuInfekcija.apraksts} onChange={(v) => update("elpceļuInfekcija", { ...data.elpceļuInfekcija, apraksts: v })} />
          )}
        </div>

        <DocSectionTitle>X Miesas bojājumi</DocSectionTitle>
        <div className="flex flex-wrap gap-4">
          <DocCheckbox id="mb-nav" label="nav" checked={data.miesasBojajumi.nav} onChange={(c) => update("miesasBojajumi", { ...data.miesasBojajumi, nav: c })} />
          <DocCheckbox id="mb-ir" label="ir, kādi:" checked={data.miesasBojajumi.ir} onChange={(c) => update("miesasBojajumi", { ...data.miesasBojajumi, ir: c })} />
          {data.miesasBojajumi.ir && (
            <DocInlineInput id="mb-apr" value={data.miesasBojajumi.apraksts} onChange={(v) => update("miesasBojajumi", { ...data.miesasBojajumi, apraksts: v })} />
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <DocFieldBlock label="XI DIAGNOZE">
            <DocTextArea id="diagnoze" value={data.diagnoze} onChange={(v) => update("diagnoze", v)} rows={3} />
          </DocFieldBlock>
          <DocFieldBlock label="XII CGI-S skala">
            <div className="flex flex-wrap gap-3">
              {["0", "1", "2", "3", "4", "5", "6", "7"].map((value) => (
                <DocRadio
                  key={value}
                  id={`cgi-${value}`}
                  name="cgi-s"
                  label={value === "0" ? "0 (N/A)" : value}
                  value={value}
                  checked={data.cgiS === value}
                  onChange={(v) => update("cgiS", v as ProtokolsData["cgiS"])}
                />
              ))}
            </div>
          </DocFieldBlock>
        </div>

        <DocSectionTitle>XIII Tālākā taktika</DocSectionTitle>
        <div className="doc-checkbox-stack text-[13px]">
          <DocCheckbox id="tt-amb" label="turpināt ārstēšanu ambulatori, stacionēšana nav nepieciešama" checked={data.talakaTaktika.ambulatori} onChange={(c) => update("talakaTaktika", { ...data.talakaTaktika, ambulatori: c })} />
          <DocCheckbox id="tt-psih" label="psihiatra motivēts lēmums par psihiskās veselības izmeklēšanas, ārstēšanas un rehabilitācijas nepieciešamību psihiatriskajā ārstniecības iestādē" checked={data.talakaTaktika.psihiatraMotivets} onChange={(c) => update("talakaTaktika", { ...data.talakaTaktika, psihiatraMotivets: c })} />
          <DocCheckbox id="tt-stac" label="stacionēts(-a) saskaņā ar Ārstniecības likuma 68.panta pirmās daļas:" checked={data.talakaTaktika.stacionets} onChange={(c) => update("talakaTaktika", { ...data.talakaTaktika, stacionets: c })} />
          <DocCheckbox id="tt-ier" label="piemērota Ārstniecības likuma 69.1panta sestā daļa. Ierobežošana" checked={data.talakaTaktika.piemerotaIerobezosana} onChange={(c) => update("talakaTaktika", { ...data.talakaTaktika, piemerotaIerobezosana: c })} />
          <div className="flex flex-wrap gap-4 pl-4">
            <span>stacionēšanai</span>
            <DocCheckbox id="tt-pk" label="piekrīt" checked={data.talakaTaktika.stacionešanaiPiekrīt} onChange={(c) => update("talakaTaktika", { ...data.talakaTaktika, stacionešanaiPiekrīt: c })} />
            <DocCheckbox id="tt-npk" label="nepiekrīt" checked={data.talakaTaktika.stacionešanaiNepiekrīt} onChange={(c) => update("talakaTaktika", { ...data.talakaTaktika, stacionešanaiNepiekrīt: c })} />
            <DocCheckbox id="tt-mrpl" label="MRPL" checked={data.talakaTaktika.mrpl} onChange={(c) => update("talakaTaktika", { ...data.talakaTaktika, mrpl: c })} />
            <DocCheckbox id="tt-stpe" label="STPE" checked={data.talakaTaktika.stpe} onChange={(c) => update("talakaTaktika", { ...data.talakaTaktika, stpe: c })} />
            <DocCheckbox id="tt-p1" label="1.punktu" checked={data.talakaTaktika.punkts1} onChange={(c) => update("talakaTaktika", { ...data.talakaTaktika, punkts1: c })} />
            <DocCheckbox id="tt-p2" label="2.punktu" checked={data.talakaTaktika.punkts2} onChange={(c) => update("talakaTaktika", { ...data.talakaTaktika, punkts2: c })} />
          </div>
        </div>

        <DocSectionTitle>XIV NOZĪMĒJUMI</DocSectionTitle>
        <DocFieldBlock label="Izmeklējumi:">
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            stacionēt
            <DocInlineInput id="noz-stac" value={data.nozimejumi.stacionet} onChange={(v) => update("nozimejumi", { ...data.nozimejumi, stacionet: v })} className="w-32" />
            nodaļā!
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            <DocCheckbox id="noz-obs" label="observēt" checked={data.nozimejumi.observet} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, observet: c })} />
            <DocCheckbox id="noz-parv" label="pārvest" checked={data.nozimejumi.parvest} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, parvest: c })} />
            <DocCheckbox id="noz-ekg" label="EKG" checked={data.nozimejumi.ekg} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, ekg: c })} />
            <DocCheckbox id="noz-paa" label="pilna asins aina" checked={data.nozimejumi.pilnaAsinsAina} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, pilnaAsinsAina: c })} />
            <DocCheckbox id="noz-asat" label="ASAT" checked={data.nozimejumi.asat} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, asat: c })} />
          </div>
        </DocFieldBlock>

        <DocFieldBlock label="2. Novērošanas līmenis, režīms">
          <DocRadio id="noz-pas" name="noz-limenis" label="pašaprūpes nodrošinājuma palāta" value="pasaprūpes" checked={data.nozimejumi.novērošanasLimenis === "pasaprūpes"} onChange={(v) => update("nozimejumi", { ...data.nozimejumi, novērošanasLimenis: v as "pasaprūpes" | "vispareja" })} />
          <DocRadio id="noz-visp" name="noz-limenis" label="vispārēja tipa palāta" value="vispareja" checked={data.nozimejumi.novērošanasLimenis === "vispareja"} onChange={(v) => update("nozimejumi", { ...data.nozimejumi, novērošanasLimenis: v as "pasaprūpes" | "vispareja" })} />
          <div className="mt-2 flex flex-wrap gap-3">
            <DocCheckbox id="noz-rtg" label="RTG:" checked={data.nozimejumi.rtg} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, rtg: c })} />
            <DocCheckbox id="noz-urins" label="urīns ar stripu" checked={data.nozimejumi.urins} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, urins: c })} />
            <DocCheckbox id="noz-alat" label="ALAT" checked={data.nozimejumi.alat} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, alat: c })} />
            <DocCheckbox id="noz-glik" label="glikoze ar stripu" checked={data.nozimejumi.glikoze} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, glikoze: c })} />
            <DocCheckbox id="noz-ggt" label="GGT" checked={data.nozimejumi.ggt} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, ggt: c })} />
          </div>
        </DocFieldBlock>

        <DocFieldBlock label="3. Novērot uz (uzvedību):">
          <div className="flex flex-wrap gap-3">
            {[
              "nemierīgu", "autoagresīvu", "krampju lēkmēm", "murgainu",
              "neapjēdzīgu", "impulsīvu", "delīriju", "bēgšanu",
              "agresīvu", "kritieniem",
            ].map((item) => (
              <DocCheckbox
                key={item}
                id={toHtmlId("noz-nov", item)}
                label={item}
                checked={data.nozimejumi.novērotUz.includes(item)}
                onChange={(c) =>
                  update("nozimejumi", {
                    ...data.nozimejumi,
                    novērotUz: toggleArrayItem(data.nozimejumi.novērotUz, item, c),
                  })
                }
              />
            ))}
          </div>
        </DocFieldBlock>

        <DocFieldBlock label="6. Terapija:">
          <DocTextArea id="terapija" value={data.nozimejumi.terapija} onChange={(v) => update("nozimejumi", { ...data.nozimejumi, terapija: v })} rows={3} />
        </DocFieldBlock>

        <DocFieldBlock label="4. Kontrolēt">
          <div className="flex flex-wrap gap-3">
            {["TA", "p", "tO", "SpO2", "GLC"].map((item) => (
              <DocCheckbox
                key={item}
                id={`noz-kon-${item}`}
                label={item}
                checked={data.nozimejumi.kontrolet.includes(item)}
                onChange={(c) =>
                  update("nozimejumi", {
                    ...data.nozimejumi,
                    kontrolet: toggleArrayItem(data.nozimejumi.kontrolet, item, c),
                  })
                }
              />
            ))}
            <span className="text-[13px]">cits:</span>
            <DocInlineInput id="noz-kon-cits" value={data.nozimejumi.kontroletCits} onChange={(v) => update("nozimejumi", { ...data.nozimejumi, kontroletCits: v })} />
          </div>
        </DocFieldBlock>

        <DocFieldBlock label="5. Diēta">
          <div className="flex flex-wrap gap-3">
            {["15.", "9.", "sekot", "ēdināt!", "dzirdināt!", "mudināt paēst"].map((item) => (
              <DocCheckbox
                key={item}
                id={toHtmlId("noz-diet", item)}
                label={item}
                checked={data.nozimejumi.dieta.includes(item)}
                onChange={(c) =>
                  update("nozimejumi", {
                    ...data.nozimejumi,
                    dieta: toggleArrayItem(data.nozimejumi.dieta, item, c),
                  })
                }
              />
            ))}
            <span className="text-[13px]">cita:</span>
            <DocInlineInput id="noz-diet-cita" value={data.nozimejumi.dietaCita} onChange={(v) => update("nozimejumi", { ...data.nozimejumi, dietaCita: v })} />
          </div>
        </DocFieldBlock>

        <div className="mt-2 flex flex-wrap gap-3">
          <DocCheckbox id="noz-usg" label="USG:" checked={data.nozimejumi.usg} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, usg: c })} />
          <DocCheckbox id="noz-na" label="Na" checked={data.nozimejumi.na} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, na: c })} />
          <DocCheckbox id="noz-k" label="K" checked={data.nozimejumi.k} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, k: c })} />
          <DocCheckbox id="noz-bi" label="Bi" checked={data.nozimejumi.bi} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, bi: c })} />
          <DocCheckbox id="noz-cro" label="CRO" checked={data.nozimejumi.cro} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, cro: c })} />
          <DocCheckbox id="noz-kreat" label="kreatinīns" checked={data.nozimejumi.kreatinins} onChange={(c) => update("nozimejumi", { ...data.nozimejumi, kreatinins: c })} />
        </div>

        <DocFieldBlock label="7. Citi nozīmējumi, atzīmes:">
          <DocTextArea id="citi-noz" value={data.nozimejumi.citiNozimejumi} onChange={(v) => update("nozimejumi", { ...data.nozimejumi, citiNozimejumi: v })} rows={3} />
        </DocFieldBlock>
      </article>
    </FormShell>
  );
}
