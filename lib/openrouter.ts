import { sanitizeSummaryMarkdown } from "@/lib/sanitize-summary";
import { getSummaryPrompt } from "@/lib/summary-prompts";
import type { FormType } from "@/lib/types/forms";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";

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
        { role: "system", content: getSummaryPrompt(formType) },
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
