import { sanitizeSummaryMarkdown } from "@/lib/sanitize-summary";
import { getSummaryPrompt } from "@/lib/summary-prompts";
import {
  formatValidationFeedback,
  validateSummaryOutput,
} from "@/lib/summary-validate";
import type { FormType } from "@/lib/types/forms";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";
const MAX_SUMMARY_ATTEMPTS = 5;

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
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

async function callOpenRouter(
  apiKey: string,
  messages: ChatMessage[],
): Promise<string> {
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
      messages,
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

  return content;
}

export async function generateSummary(
  formType: FormType,
  serializedForm: string,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new OpenRouterError("Service configuration error");
  }

  const messages: ChatMessage[] = [
    { role: "system", content: getSummaryPrompt(formType) },
    {
      role: "user",
      content: `Formas dati:\n\n${serializedForm}`,
    },
  ];

  for (let attempt = 0; attempt < MAX_SUMMARY_ATTEMPTS; attempt++) {
    const content = await callOpenRouter(apiKey, messages);
    const summary = sanitizeSummaryMarkdown(content);
    const validation = validateSummaryOutput(
      formType,
      serializedForm,
      summary,
    );

    if (validation.ok) {
      return summary;
    }

    if (attempt === MAX_SUMMARY_ATTEMPTS - 1) {
      // Prefer a best-effort summary over total failure when the model keeps
      // missing minor formatting rules after several guided retries.
      return summary;
    }

    messages.push(
      { role: "assistant", content: summary },
      {
        role: "user",
        content: formatValidationFeedback(validation.violations),
      },
    );
  }

  throw new OpenRouterError("Summary validation failed");
}
