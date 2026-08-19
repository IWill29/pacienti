import { NextResponse } from "next/server";

import { OpenRouterError, generateSummary } from "@/lib/openrouter";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateSummaryRequest } from "@/lib/validation";

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  if (!checkRateLimit(clientKey(request))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const validation = validateSummaryRequest(body);

  if (!validation.ok) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const result = await generateSummary(
      validation.formType,
      validation.serialized,
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof OpenRouterError) {
      return NextResponse.json(
        { error: "Summary generation failed" },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { error: "Summary generation failed" },
      { status: 500 },
    );
  }
}
