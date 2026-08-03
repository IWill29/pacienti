"use client";



import { useState } from "react";



import {

  DocCheckbox,

  DocFieldBlock,

  DocInlineInput,

  DocLine,

  DocRadio,

} from "@/components/doc/FormControls";

import {

  emptyPirmreizejaisPacients,

  type PirmreizejaisPacientsData,

  type PirmreizejaisPiezimes,

} from "@/lib/types/forms";

import { FormShell } from "@/components/FormShell";



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



  return (

    <FormShell

      formType="pirmreizejais"

      formData={data}

      title="Pirmreizējais pacients"

      subtitle="Anamnēzes forma — aizpildiet laukus atbilstoši pacienta datiem."
    >

      <article className="doc-sheet min-w-0">

        <DocLine label="DZEMDĪBAS-" {...noteProps("dzemdibasVeids")}>

          <DocRadio

            id="dz-dabigas"

            name="dzemdibasVeids"

            label="DABĪGAS"

            value="dabigas"

            checked={data.dzemdibasVeids === "dabigas"}

            onChange={(value) =>

              update("dzemdibasVeids", value as PirmreizejaisPacientsData["dzemdibasVeids"])

            }

          />

          <DocRadio

            id="dz-akuts"

            name="dzemdibasVeids"

            label="ĶEIZARGRIEZIENS-AKŪTS"

            value="keizargrieziens-akuts"

            checked={data.dzemdibasVeids === "keizargrieziens-akuts"}

            onChange={(value) =>

              update("dzemdibasVeids", value as PirmreizejaisPacientsData["dzemdibasVeids"])

            }

          />

          <DocRadio

            id="dz-planveida"

            name="dzemdibasVeids"

            label="ĶEIZARGRIEZIENS-PLĀNVEIDA"

            value="keizargrieziens-planveida"

            checked={data.dzemdibasVeids === "keizargrieziens-planveida"}

            onChange={(value) =>

              update("dzemdibasVeids", value as PirmreizejaisPacientsData["dzemdibasVeids"])

            }

          />

        </DocLine>



        <DocLine label="SAREŽĢĪJUMI DZEMDĪBĀS" {...noteProps("sarezgijumiDzemdibas")}>

          <DocRadio id="sd-ja" name="sarezgijumiDzemdibas" label="JĀ" value="ja" checked={data.sarezgijumiDzemdibas === "ja"} onChange={(v) => update("sarezgijumiDzemdibas", v as "ja" | "ne")} />

          <DocRadio id="sd-ne" name="sarezgijumiDzemdibas" label="NĒ" value="ne" checked={data.sarezgijumiDzemdibas === "ne"} onChange={(v) => update("sarezgijumiDzemdibas", v as "ja" | "ne")} />

        </DocLine>



        <DocLine label="AGRĪNAS ATTĪSTĪBAS AIZTURES" {...noteProps("agrinasAttistibasAiztures")}>

          <DocRadio id="aaa-ja" name="agrinasAttistibasAiztures" label="JĀ" value="ja" checked={data.agrinasAttistibasAiztures === "ja"} onChange={(v) => update("agrinasAttistibasAiztures", v as "ja" | "ne")} />

          <DocRadio id="aaa-ne" name="agrinasAttistibasAiztures" label="NĒ" value="ne" checked={data.agrinasAttistibasAiztures === "ne"} onChange={(v) => update("agrinasAttistibasAiztures", v as "ja" | "ne")} />

        </DocLine>



        <DocLine label="BĒRNUDĀRZS" {...noteProps("bernudarzs")}>

          <DocRadio id="bd-ja" name="bernudarzs" label="JĀ" value="ja" checked={data.bernudarzs === "ja"} onChange={(v) => update("bernudarzs", v as "ja" | "ne")} />

          <DocRadio id="bd-ne" name="bernudarzs" label="NĒ" value="ne" checked={data.bernudarzs === "ne"} onChange={(v) => update("bernudarzs", v as "ja" | "ne")} />

        </DocLine>



        <DocLine label="DRAUGI B/D" {...noteProps("draugiBD")}>

          <DocRadio id="dr-ja" name="draugiBD" label="JĀ" value="ja" checked={data.draugiBD === "ja"} onChange={(v) => update("draugiBD", v as "ja" | "ne")} />

          <DocRadio id="dr-ne" name="draugiBD" label="NĒ" value="ne" checked={data.draugiBD === "ne"} onChange={(v) => update("draugiBD", v as "ja" | "ne")} />

        </DocLine>



        <DocLine label="SKOLĀ" {...noteProps("skola")}>

          <DocRadio id="sk-7" name="skola" label="7" value="7" checked={data.skola === "7"} onChange={(v) => update("skola", v as "7" | "8" | "9")} />

          <DocRadio id="sk-8" name="skola" label="8" value="8" checked={data.skola === "8"} onChange={(v) => update("skola", v as "7" | "8" | "9")} />

          <DocRadio id="sk-9" name="skola" label="9" value="9" checked={data.skola === "9"} onChange={(v) => update("skola", v as "7" | "8" | "9")} />

        </DocLine>



        <DocLine label="SEKMES" {...noteProps("sekmes")}>

          <DocRadio id="sek-sliktas" name="sekmes" label="SLIKTAS" value="sliktas" checked={data.sekmes === "sliktas"} onChange={(v) => update("sekmes", v as PirmreizejaisPacientsData["sekmes"])} />

          <DocRadio id="sek-videjas" name="sekmes" label="VIDĒJAS" value="videjas" checked={data.sekmes === "videjas"} onChange={(v) => update("sekmes", v as PirmreizejaisPacientsData["sekmes"])} />

          <DocRadio id="sek-labas" name="sekmes" label="LABAS" value="labas" checked={data.sekmes === "labas"} onChange={(v) => update("sekmes", v as PirmreizejaisPacientsData["sekmes"])} />

        </DocLine>



        <DocLine label="APCELŠANA SKOLĀ" {...noteProps("apcelsanaSkola")}>

          <DocRadio id="as-ja" name="apcelsanaSkola" label="JĀ" value="ja" checked={data.apcelsanaSkola === "ja"} onChange={(v) => update("apcelsanaSkola", v as "ja" | "ne")} />

          <DocRadio id="as-ne" name="apcelsanaSkola" label="NĒ" value="ne" checked={data.apcelsanaSkola === "ne"} onChange={(v) => update("apcelsanaSkola", v as "ja" | "ne")} />

        </DocLine>



        <DocLine label="UZVEDĪBA SKOLĀ" {...noteProps("uzvedibaSkola")}>

          <DocRadio id="us-n" name="uzvedibaSkola" label="N" value="n" checked={data.uzvedibaSkola === "n"} onChange={(v) => update("uzvedibaSkola", v as "n" | "traucejumi")} />

          <DocRadio id="us-tr" name="uzvedibaSkola" label="TRAUCĒJUMI" value="traucejumi" checked={data.uzvedibaSkola === "traucejumi"} onChange={(v) => update("uzvedibaSkola", v as "n" | "traucejumi")} />

        </DocLine>



        <DocFieldBlock label="IEGŪTĀ IZGLĪTĪBA-">

          <DocInlineInput

            id="ieguta-izglitiba"

            value={data.iegutaIzglitiba}

            onChange={(value) => update("iegutaIzglitiba", value)}

          />

          <div className="mt-2">

            <DocCheckbox

              id="augstskola"

              label="AUGSTSKOLA"

              checked={data.augstskola}

              onChange={(checked) => update("augstskola", checked)}

            />

          </div>

        </DocFieldBlock>



        <DocLine label="BIEŽAS DARBA MAIŅAS" {...noteProps("biezasDarbaMainas")}>

          <DocRadio id="bdm-ja" name="biezasDarbaMainas" label="JĀ" value="ja" checked={data.biezasDarbaMainas === "ja"} onChange={(v) => update("biezasDarbaMainas", v as "ja" | "ne")} />

          <DocRadio id="bdm-ne" name="biezasDarbaMainas" label="NĒ" value="ne" checked={data.biezasDarbaMainas === "ne"} onChange={(v) => update("biezasDarbaMainas", v as "ja" | "ne")} />

        </DocLine>



        <DocLine label="ŠOBRĪD STRĀDĀ" {...noteProps("sobridStrada")}>

          <DocRadio id="ss-ja" name="sobridStrada" label="JĀ" value="ja" checked={data.sobridStrada === "ja"} onChange={(v) => update("sobridStrada", v as "ja" | "ne")} />

          <DocRadio id="ss-ne" name="sobridStrada" label="NĒ" value="ne" checked={data.sobridStrada === "ne"} onChange={(v) => update("sobridStrada", v as "ja" | "ne")} />

        </DocLine>



        <DocLine label="PAR KO STRĀDĀ" {...noteProps("parKoStrada")}>

          <DocRadio id="pks-ja" name="parKoStrada" label="JĀ" value="ja" checked={data.parKoStrada === "ja"} onChange={(v) => update("parKoStrada", v as "ja" | "ne")} />

          <DocRadio id="pks-ne" name="parKoStrada" label="NĒ" value="ne" checked={data.parKoStrada === "ne"} onChange={(v) => update("parKoStrada", v as "ja" | "ne")} />

        </DocLine>

        {data.parKoStrada === "ja" && (

          <DocInlineInput

            id="par-ko-strada-teksts"

            value={data.parKoStradaTeksts}

            onChange={(value) => update("parKoStradaTeksts", value)}

            className="ml-[140px] mt-1"

          />

        )}



        <DocFieldBlock label="ATTIECĪBU STATUSS">

          <DocInlineInput

            id="attiecibu-statuss"

            value={data.attiecibuStatuss}

            onChange={(value) => update("attiecibuStatuss", value)}

          />

        </DocFieldBlock>



        <DocLine label="BĒRNI" {...noteProps("bern")}>

          <DocRadio id="berni-ir" name="bern" label="IR" value="ir" checked={data.bern === "ir"} onChange={(v) => update("bern", v as "ir" | "nav")} />

          <DocRadio id="berni-nav" name="bern" label="NAV" value="nav" checked={data.bern === "nav"} onChange={(v) => update("bern", v as "ir" | "nav")} />

        </DocLine>



        <DocLine label="ĢIMENĒ PSIH.SASL." {...noteProps("gimenePsihSasl")}>

          <DocRadio id="gps-ir" name="gimenePsihSasl" label="IR" value="ir" checked={data.gimenePsihSasl === "ir"} onChange={(v) => update("gimenePsihSasl", v as "ir" | "nav")} />

          <DocRadio id="gps-nav" name="gimenePsihSasl" label="NAV" value="nav" checked={data.gimenePsihSasl === "nav"} onChange={(v) => update("gimenePsihSasl", v as "ir" | "nav")} />

        </DocLine>



        <DocFieldBlock label="GALVAS TRAUMAS">

          <DocInlineInput id="galvas-traumas" value={data.galvasTraumas} onChange={(v) => update("galvasTraumas", v)} />

        </DocFieldBlock>



        <DocFieldBlock label="INFEKCIJAS">

          <DocInlineInput id="infekcijas" value={data.infekcijas} onChange={(v) => update("infekcijas", v)} />

        </DocFieldBlock>



        <DocLine label="ALERĢIJAS" {...noteProps("alergijas")}>

          <DocRadio id="al-ja" name="alergijas" label="JĀ" value="ja" checked={data.alergijas === "ja"} onChange={(v) => update("alergijas", v as "ja" | "ne")} />

          <DocRadio id="al-ne" name="alergijas" label="NĒ" value="ne" checked={data.alergijas === "ne"} onChange={(v) => update("alergijas", v as "ja" | "ne")} />

        </DocLine>

        {data.alergijas === "ja" && (

          <DocInlineInput id="alergijas-teksts" value={data.alergijasTeksts} onChange={(v) => update("alergijasTeksts", v)} className="ml-[140px] mt-1" />

        )}



        <DocLine label="PAV LIETOŠANA" {...noteProps("pavLietosana")}>

          <DocCheckbox id="pav-thc" label="THC" checked={data.pavLietosana.thc} onChange={(c) => update("pavLietosana", { ...data.pavLietosana, thc: c })} />

          <DocCheckbox id="pav-kok" label="KOK" checked={data.pavLietosana.kok} onChange={(c) => update("pavLietosana", { ...data.pavLietosana, kok: c })} />

          <DocCheckbox id="pav-amf" label="AMF" checked={data.pavLietosana.amf} onChange={(c) => update("pavLietosana", { ...data.pavLietosana, amf: c })} />

          <DocCheckbox id="pav-mdma" label="MDMA" checked={data.pavLietosana.mdma} onChange={(c) => update("pavLietosana", { ...data.pavLietosana, mdma: c })} />

        </DocLine>



        <DocFieldBlock label="ALKOHOLS- BIEŽUMS,AR KO">

          <DocInlineInput id="alkohols" value={data.alkohols} onChange={(v) => update("alkohols", v)} />

        </DocFieldBlock>



        <DocFieldBlock label="SUICĪDS/ PAŠKAITĒJUMS ANAMN.">

          <DocInlineInput id="suicids" value={data.suicidsPaskaitijums} onChange={(v) => update("suicidsPaskaitijums", v)} />

        </DocFieldBlock>

      </article>

    </FormShell>

  );

}

