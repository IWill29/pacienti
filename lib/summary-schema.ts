import type { FormType } from "@/lib/types/forms";

/** Structured AI output for pirmreizējā konsultācija — assembled to plain text server-side. */
export type PirmreizejaisSummaryJson = {
  pacientaVardsUzvards: string | null;
  personasKods: string | null;
  konsultacijasDatums: string | null;
  vizitesIemesls: string[] | null;
  anamneze: string[] | null;
  psihoaktivasVielas: string[] | null;
  citasSaslimbas: string | null;
  lietotieMedikamenti: string | null;
  galvasTraumas: string | null;
  neiroinfekcijas: string | null;
  alergijas: string | null;
  psihiskaisStavoklis: string[] | null;
  somatiski: string | null;
  neirologiski: string | null;
  phq9: string | null;
  gad7: string | null;
  parrunatsArPacientu: string | null;
  diagnoze: string | null;
  taktika: string[] | null;
};

/** Structured AI output for psihiatriskās apskates protokols. */
export type ProtokolsSummaryJson = {
  apskatesDatums: string | null;
  anamneze: string[] | null;
  psihoaktivasVielas: string[] | null;
  psihiskaisStavoklis: string[] | null;
  somatiski: string | null;
  neirologiski: string | null;
  diagnoze: string | null;
  parrunatsArPacientu: string | null;
  taktika: string[] | null;
};

export type SummaryJson = PirmreizejaisSummaryJson | ProtokolsSummaryJson;

const NULLABLE_STRING = { type: ["string", "null"] as const };

const NULLABLE_STRING_ARRAY = {
  type: ["array", "null"] as const,
  items: { type: "string" as const },
};

const PIRMREIZEJAIS_PROPERTIES = {
  pacientaVardsUzvards: NULLABLE_STRING,
  personasKods: NULLABLE_STRING,
  konsultacijasDatums: NULLABLE_STRING,
  vizitesIemesls: NULLABLE_STRING_ARRAY,
  anamneze: NULLABLE_STRING_ARRAY,
  psihoaktivasVielas: NULLABLE_STRING_ARRAY,
  citasSaslimbas: NULLABLE_STRING,
  lietotieMedikamenti: NULLABLE_STRING,
  galvasTraumas: NULLABLE_STRING,
  neiroinfekcijas: NULLABLE_STRING,
  alergijas: NULLABLE_STRING,
  psihiskaisStavoklis: NULLABLE_STRING_ARRAY,
  somatiski: NULLABLE_STRING,
  neirologiski: NULLABLE_STRING,
  phq9: NULLABLE_STRING,
  gad7: NULLABLE_STRING,
  parrunatsArPacientu: NULLABLE_STRING,
  diagnoze: NULLABLE_STRING,
  taktika: NULLABLE_STRING_ARRAY,
};

const PROTOKOLS_PROPERTIES = {
  apskatesDatums: NULLABLE_STRING,
  anamneze: NULLABLE_STRING_ARRAY,
  psihoaktivasVielas: NULLABLE_STRING_ARRAY,
  psihiskaisStavoklis: NULLABLE_STRING_ARRAY,
  somatiski: NULLABLE_STRING,
  neirologiski: NULLABLE_STRING,
  diagnoze: NULLABLE_STRING,
  parrunatsArPacientu: NULLABLE_STRING,
  taktika: NULLABLE_STRING_ARRAY,
};

export const PIRMREIZEJAIS_OPENROUTER_SCHEMA = {
  type: "object" as const,
  additionalProperties: false,
  properties: PIRMREIZEJAIS_PROPERTIES,
  required: Object.keys(PIRMREIZEJAIS_PROPERTIES),
};

export const PROTOKOLS_OPENROUTER_SCHEMA = {
  type: "object" as const,
  additionalProperties: false,
  properties: PROTOKOLS_PROPERTIES,
  required: Object.keys(PROTOKOLS_PROPERTIES),
};

export function getOpenRouterResponseFormat(formType: FormType): {
  type: "json_schema";
  json_schema: {
    name: string;
    strict: boolean;
    schema: Record<string, unknown>;
  };
} {
  const schema =
    formType === "pirmreizejais"
      ? PIRMREIZEJAIS_OPENROUTER_SCHEMA
      : PROTOKOLS_OPENROUTER_SCHEMA;

  return {
    type: "json_schema",
    json_schema: {
      name: `${formType}_summary`,
      strict: true,
      schema: schema as Record<string, unknown>,
    },
  };
}

function asNullableString(value: unknown, field: string): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "string") {
    throw new Error(`${field} must be string or null`);
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function asNullableStringArray(value: unknown, field: string): string[] | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be array or null`);
  }
  const items = value
    .map((item, index) => {
      if (typeof item !== "string") {
        throw new Error(`${field}[${index}] must be string`);
      }
      return item.trim();
    })
    .filter((item) => item.length > 0);

  return items.length === 0 ? null : items;
}

function stripJsonFence(content: string): string {
  const trimmed = content.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

const PIRMREIZEJAIS_ARRAY_FIELDS = [
  "vizitesIemesls",
  "anamneze",
  "psihoaktivasVielas",
  "psihiskaisStavoklis",
  "taktika",
] as const;

const PROTOKOLS_ARRAY_FIELDS = [
  "anamneze",
  "psihoaktivasVielas",
  "psihiskaisStavoklis",
  "taktika",
] as const;

/** Common AI typos / Latvian diacritic variants → canonical JSON keys. */
const FIELD_ALIASES: Record<string, string> = {
  lietošieMedikamenti: "lietotieMedikamenti",
  lietotasMedikamenti: "lietotieMedikamenti",
  lietotāsMedikamenti: "lietotieMedikamenti",
  parrunats: "parrunatsArPacientu",
  parrunātsArPacientu: "parrunatsArPacientu",
  vizītesIemesls: "vizitesIemesls",
  psihiskaisStāvoklis: "psihiskaisStavoklis",
  psihoaktīvāsVielas: "psihoaktivasVielas",
};

function coerceObjectToString(value: Record<string, unknown>): string | null {
  for (const key of ["value", "text", "content", "apraksts"]) {
    const candidate = value[key];
    if (typeof candidate === "string") {
      const trimmed = candidate.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }

  const strings = Object.values(value).filter(
    (entry): entry is string => typeof entry === "string",
  );
  if (strings.length === 0) {
    return null;
  }
  return strings.map((entry) => entry.trim()).filter(Boolean).join(" ") || null;
}

function coerceToStringValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    const joined = value
      .filter((entry): entry is string => typeof entry === "string")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .join(" ");
    return joined.length > 0 ? joined : null;
  }
  if (typeof value === "object") {
    return coerceObjectToString(value as Record<string, unknown>);
  }
  return null;
}

function ensureSentence(text: string): string {
  const trimmed = text.trim();
  if (/[.!?]$/.test(trimmed)) {
    return trimmed;
  }
  return `${trimmed}.`;
}

function coerceToStringArrayValue(value: unknown): string[] | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === "string") {
          return entry.trim();
        }
        return coerceToStringValue(entry);
      })
      .filter((entry): entry is string => Boolean(entry))
      .map(ensureSentence);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? [ensureSentence(trimmed)] : null;
  }
  const coerced = coerceToStringValue(value);
  return coerced ? [ensureSentence(coerced)] : null;
}

/** Normalize common AI JSON shape mistakes before strict parsing. */
export function normalizeSummaryJsonRecord(
  formType: FormType,
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(raw)) {
    const canonicalKey = FIELD_ALIASES[key] ?? key;
    normalized[canonicalKey] = value;
  }

  const arrayFields =
    formType === "pirmreizejais"
      ? PIRMREIZEJAIS_ARRAY_FIELDS
      : PROTOKOLS_ARRAY_FIELDS;

  for (const field of arrayFields) {
    if (field in normalized) {
      normalized[field] = coerceToStringArrayValue(normalized[field]);
    }
  }

  if (formType === "pirmreizejais") {
    for (const field of [
      "pacientaVardsUzvards",
      "personasKods",
      "konsultacijasDatums",
      "citasSaslimbas",
      "lietotieMedikamenti",
      "galvasTraumas",
      "neiroinfekcijas",
      "alergijas",
      "somatiski",
      "neirologiski",
      "phq9",
      "gad7",
      "parrunatsArPacientu",
      "diagnoze",
    ] as const) {
      if (field in normalized) {
        normalized[field] = coerceToStringValue(normalized[field]);
      }
    }
  } else {
    for (const field of [
      "apskatesDatums",
      "somatiski",
      "neirologiski",
      "diagnoze",
      "parrunatsArPacientu",
    ] as const) {
      if (field in normalized) {
        normalized[field] = coerceToStringValue(normalized[field]);
      }
    }
  }

  return normalized;
}

export function parseSummaryJson(
  formType: FormType,
  rawContent: string,
): SummaryJson {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonFence(rawContent));
  } catch {
    throw new Error("invalid JSON in model response");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("summary JSON must be an object");
  }

  const record = normalizeSummaryJsonRecord(
    formType,
    parsed as Record<string, unknown>,
  );

  if (formType === "pirmreizejais") {
    return {
      pacientaVardsUzvards: asNullableString(
        record.pacientaVardsUzvards,
        "pacientaVardsUzvards",
      ),
      personasKods: asNullableString(record.personasKods, "personasKods"),
      konsultacijasDatums: asNullableString(
        record.konsultacijasDatums,
        "konsultacijasDatums",
      ),
      vizitesIemesls: asNullableStringArray(
        record.vizitesIemesls,
        "vizitesIemesls",
      ),
      anamneze: asNullableStringArray(record.anamneze, "anamneze"),
      psihoaktivasVielas: asNullableStringArray(
        record.psihoaktivasVielas,
        "psihoaktivasVielas",
      ),
      citasSaslimbas: asNullableString(record.citasSaslimbas, "citasSaslimbas"),
      lietotieMedikamenti: asNullableString(
        record.lietotieMedikamenti,
        "lietotieMedikamenti",
      ),
      galvasTraumas: asNullableString(record.galvasTraumas, "galvasTraumas"),
      neiroinfekcijas: asNullableString(
        record.neiroinfekcijas,
        "neiroinfekcijas",
      ),
      alergijas: asNullableString(record.alergijas, "alergijas"),
      psihiskaisStavoklis: asNullableStringArray(
        record.psihiskaisStavoklis,
        "psihiskaisStavoklis",
      ),
      somatiski: asNullableString(record.somatiski, "somatiski"),
      neirologiski: asNullableString(record.neirologiski, "neirologiski"),
      phq9: asNullableString(record.phq9, "phq9"),
      gad7: asNullableString(record.gad7, "gad7"),
      parrunatsArPacientu: asNullableString(
        record.parrunatsArPacientu,
        "parrunatsArPacientu",
      ),
      diagnoze: asNullableString(record.diagnoze, "diagnoze"),
      taktika: asNullableStringArray(record.taktika, "taktika"),
    };
  }

  return {
    apskatesDatums: asNullableString(record.apskatesDatums, "apskatesDatums"),
    anamneze: asNullableStringArray(record.anamneze, "anamneze"),
    psihoaktivasVielas: asNullableStringArray(
      record.psihoaktivasVielas,
      "psihoaktivasVielas",
    ),
    psihiskaisStavoklis: asNullableStringArray(
      record.psihiskaisStavoklis,
      "psihiskaisStavoklis",
    ),
    somatiski: asNullableString(record.somatiski, "somatiski"),
    neirologiski: asNullableString(record.neirologiski, "neirologiski"),
    diagnoze: asNullableString(record.diagnoze, "diagnoze"),
    parrunatsArPacientu: asNullableString(
      record.parrunatsArPacientu,
      "parrunatsArPacientu",
    ),
    taktika: asNullableStringArray(record.taktika, "taktika"),
  };
}

const SENTENCE_ARRAY_FIELDS: Record<FormType, string[]> = {
  pirmreizejais: [
    "vizitesIemesls",
    "anamneze",
    "psihoaktivasVielas",
    "psihiskaisStavoklis",
    "taktika",
  ],
  protokols: [
    "anamneze",
    "psihoaktivasVielas",
    "psihiskaisStavoklis",
    "taktika",
  ],
};

export function validateSummaryJsonStructure(
  formType: FormType,
  json: SummaryJson,
): string[] {
  const violations: string[] = [];
  const record = json as Record<string, string[] | string | null>;

  for (const field of SENTENCE_ARRAY_FIELDS[formType]) {
    const value = record[field];
    if (!value || !Array.isArray(value)) {
      continue;
    }
    for (const [index, sentence] of value.entries()) {
      if (!/[.!?]$/.test(sentence.trim())) {
        violations.push(
          `${field}[${index}] must be a sentence ending with . ! or ?`,
        );
      }
    }
  }

  return violations;
}
