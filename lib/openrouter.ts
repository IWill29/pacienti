import { assembleSummary } from "@/lib/assemble-summary";
import { assembleCanonicalSummary } from "@/lib/canonical-summary";
import { getSummaryPrompt } from "@/lib/summary-prompts";
import {
  getOpenRouterResponseFormat,
  parseSummaryJson,
  validateSummaryJsonStructure,
} from "@/lib/summary-schema";
import {
  formatValidationFeedback,
  validateSummaryOutput,
} from "@/lib/summary-validate";
import type { FormType } from "@/lib/types/forms";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";
/** Few polish attempts, then always fall back to the form-based summary. */
const MAX_SUMMARY_ATTEMPTS = 2;

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
  formType: FormType,
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(OPENROUTER_URL, {
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
        temperature: 0,
        max_tokens: 4096,
        response_format: getOpenRouterResponseFormat(formType),
      }),
    });
  } catch {
    throw new OpenRouterError("Upstream request failed");
  }

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
  const canonical = assembleCanonicalSummary(formType, serializedForm);
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return canonical;
  }

  const messages: ChatMessage[] = [
    { role: "system", content: getSummaryPrompt(formType) },
    {
      role: "user",
      content: `Formas dati:\n\n${serializedForm}`,
    },
  ];

  for (let attempt = 0; attempt < MAX_SUMMARY_ATTEMPTS; attempt++) {
    let content = "";
    const violations: string[] = [];

    try {
      content = await callOpenRouter(apiKey, messages, formType);
      const json = parseSummaryJson(formType, content);
      violations.push(...validateSummaryJsonStructure(formType, json));

      const summary = assembleSummary(formType, json);

      const textValidation = validateSummaryOutput(
        formType,
        serializedForm,
        summary,
      );
      if (!textValidation.ok) {
        violations.push(...textValidation.violations);
      }

      if (violations.length === 0) {
        return summary;
      }
    } catch (error) {
      if (error instanceof OpenRouterError) {
        return canonical;
      }
      violations.push(
        error instanceof Error ? error.message : "invalid summary JSON",
      );
    }

    if (attempt === MAX_SUMMARY_ATTEMPTS - 1) {
      return canonical;
    }

    if (content) {
      messages.push(
        { role: "assistant", content },
        {
          role: "user",
          content: formatValidationFeedback(violations),
        },
      );
    }
  }

  return canonical;
}
