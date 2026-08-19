import { assembleSummary } from "@/lib/assemble-summary";
import { assembleCanonicalSummary } from "@/lib/canonical-summary";
import { getSummaryPrompt } from "@/lib/summary-prompts";
import { sanitizeSummaryMarkdown } from "@/lib/sanitize-summary";
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
const FETCH_TIMEOUT_MS = 30_000;
/** Few polish attempts, then always fall back to the form-based summary. */
const MAX_SUMMARY_ATTEMPTS = 2;

export type SummarySource = "canonical" | "ai";

export type SummaryGenerationResult = {
  summary: string;
  source: SummarySource;
};

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
): Promise<string | null> {
  let response: Response;
  try {
    response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.OPENROUTER_HTTP_REFERER ?? "https://pacienti.vercel.app",
        "X-Title": "Pacienti",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0,
        max_tokens: 4096,
        response_format: getOpenRouterResponseFormat(formType),
      }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
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
    return null;
  }

  return content;
}

function canonicalResult(
  formType: FormType,
  serializedForm: string,
): SummaryGenerationResult {
  const summary = assembleCanonicalSummary(formType, serializedForm);
  validateSummaryOutput(formType, serializedForm, summary);
  return { summary, source: "canonical" };
}

export async function generateSummary(
  formType: FormType,
  serializedForm: string,
): Promise<SummaryGenerationResult> {
  const canonical = canonicalResult(formType, serializedForm);
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
      const responseContent = await callOpenRouter(apiKey, messages, formType);
      content = responseContent ?? "";

      if (!content) {
        violations.push("empty model response");
      } else {
        const json = parseSummaryJson(formType, content);
        violations.push(...validateSummaryJsonStructure(formType, json));

        const summary = sanitizeSummaryMarkdown(assembleSummary(formType, json));

        const textValidation = validateSummaryOutput(
          formType,
          serializedForm,
          summary,
        );
        if (!textValidation.ok) {
          violations.push(...textValidation.violations);
        }

        if (violations.length === 0) {
          return { summary, source: "ai" };
        }
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

    messages.push(
      { role: "assistant", content: content || "{}" },
      {
        role: "user",
        content: formatValidationFeedback(
          violations.length > 0
            ? violations
            : ["empty or invalid model response"],
        ),
      },
    );
  }

  return canonical;
}
