import { sanitizeSummaryMarkdown } from "@/lib/sanitize-summary";
import type { FormType } from "@/lib/types/forms";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";

const PLAIN_TEXT_RULES = `
FORMATĒJUMS (OBLIGĀTI):
- Raksti TIKAI vienkāršu tekstu — bez jebkādas markdown formatēšanas
- NEIZMANTO: ** vai __ treknajam, * vai _ kursīvam, # virsrakstus, \` koda blokus, sarakstu punktus ar - vai *, emocijzīmes vai dekoratīvus simbolus
- Strukturē ar skaidriem sadaļu nosaukumiem (piem., "Dzemdības un attīstība:") un tukšām rindām starp sadaļām
- Katram aizpildītajam formas laukam iekļauj attiecīgo informāciju — neizlaid nevienu norādītu faktu
- Kopsavilkumam jābūt DETALIZĒTAM un PILNĪGAM
- Esi precīzs, neizdomā faktus, kas nav norādīti formā
- Raksti latviešu valodā, profesionālā medicīnas stilā`;

const PROMPTS: Record<FormType, string> = {
  pirmreizejais: `Tu esi medicīnas asistents psihiatram. Saņemsi pirmreizējā pacienta anamnēzes formas datus latviešu valodā.

Sagatavo DETALIZĒTU un PILNĪGU strukturētu klinisko kopsavilkumu ārstam. Iekļauj VISUS aizpildītos formas laukus, tostarp:
- Dzemdību un agrīnās attīstības informāciju
- Izglītības un sociālo vēsturi (skola, darbs, attiecības)
- Ģimenes psihiatrisko anamnēzi
- Traumas, infekcijas, alerģijas
- PAV un alkohola lietošanu
- Suicīda/paškaitējuma anamnēzi
- Brīvā formā norādītos citus variantus un piezīmes (sadaļa "CITI VARIANTI / PIEZĪMES"), ja tāda ir
${PLAIN_TEXT_RULES}`,

  protokols: `Tu esi medicīnas asistents psihiatram. Saņemsi psihiatriskās apskates protokolu (uzņemšanas nodaļa) latviešu valodā.

Sagatavo DETALIZĒTU un PILNĪGU strukturētu klinisko kopsavilkumu ārstam. Iekļauj VISUS aizpildītos formas laukus, tostarp:
- Stacionēšanas apstākļus un nosūtījumu
- Anamnēzi/katamnēzi
- Psihiskā stāvokļa novērtējumu (apziņa, orientācija, kontakts, halucinācijas u.c.)
- Ārējo izskatu un uzvedību
- Somatisko un neiroloģisko stāvokli
- Vitalos rādītājus
- Diagnozi un CGI-S
- Tālāko taktiku un nozīmējumus
${PLAIN_TEXT_RULES}`,
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

export class OpenRouterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenRouterError";
  }
}

export async function generateSummary(
  formType: FormType,
  serializedForm: string,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new OpenRouterError("Service configuration error");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://pacienti.vercel.app",
      "X-Title": "Pacienti",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: PROMPTS[formType] },
        {
          role: "user",
          content: `Formas dati:\n\n${serializedForm}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    throw new OpenRouterError("Upstream request failed");
  }

  const data = (await response.json()) as OpenRouterResponse;

  if (data.error?.message) {
    throw new OpenRouterError("Upstream request failed");
  }

  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new OpenRouterError("Empty response");
  }

  return sanitizeSummaryMarkdown(content);
}
