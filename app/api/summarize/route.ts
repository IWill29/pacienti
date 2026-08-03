import { NextResponse } from "next/server";

import { OpenRouterError, generateSummary } from "@/lib/openrouter";
import { validateSummaryRequest } from "@/lib/validation";

export async function POST(request: Request) {
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
    const summary = await generateSummary(
      validation.formType,
      validation.serialized,
    );
    return NextResponse.json({ summary });
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
