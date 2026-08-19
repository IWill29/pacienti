"use client";

import { useState } from "react";

import {
  copySummaryToClipboard,
  renderSummaryBold,
} from "@/lib/summary-display";
import type { FormType } from "@/lib/types/forms";

type SummaryPanelProps = {
  summary: string;
  isLoading: boolean;
  errorMessage: string;
};

export function SummaryPanel({
  summary,
  isLoading,
  errorMessage,
  source,
}: SummaryPanelProps & { source?: "canonical" | "ai" | null }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!summary) {
      return;
    }

    try {
      await copySummaryToClipboard(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard errors are surfaced via generic UI; no PHI in messages.
    }
  }

  return (
    <section className="space-y-4">
      {isLoading && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          Ģenerē kopsavilkumu...
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {summary && (
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] sm:p-6">
          {source === "canonical" && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Kopsavilkums no formas datiem (AI nav pieejams vai netika izmantots).
            </div>
          )}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">Kopsavilkums</h2>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              {copied ? "Kopēts!" : "Kopēt"}
            </button>
          </div>
          <div className="whitespace-pre-wrap rounded-xl bg-zinc-50 px-4 py-4 text-[15px] leading-relaxed text-zinc-800">
            {renderSummaryBold(summary)}
          </div>
        </div>
      )}
    </section>
  );
}

type FormShellProps = {
  formType: FormType;
  formData: unknown;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  wide?: boolean;
};

export function FormShell({
  formType,
  formData,
  title,
  subtitle,
  children,
  wide = false,
}: FormShellProps) {
  const [summary, setSummary] = useState("");
  const [summarySource, setSummarySource] = useState<"canonical" | "ai" | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formType === "pirmreizejais") {
      const data = formData as { pacientaDzimums?: string };
      if (!data.pacientaDzimums) {
        setErrorMessage("Lūdzu, norādiet pacienta dzimumu.");
        return;
      }
    }

    setIsLoading(true);
    setErrorMessage("");
    setSummary("");
    setSummarySource(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType, formData }),
      });

      const data = (await response.json()) as {
        summary?: string;
        source?: "canonical" | "ai";
        error?: string;
      };

      if (!response.ok || !data.summary) {
        setErrorMessage(
          "Neizdevās ģenerēt kopsavilkumu. Mēģiniet vēlreiz.",
        );
        return;
      }

      setSummary(data.summary);
      setSummarySource(data.source ?? null);
    } catch {
      setErrorMessage("Neizdevās ģenerēt kopsavilkumu. Mēģiniet vēlreiz.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`mx-auto w-full min-w-0 space-y-6 ${wide ? "max-w-6xl" : "max-w-4xl"}`}
    >
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        <p className="text-base text-zinc-600">{subtitle}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {children}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-[15px] font-medium text-white shadow-sm transition hover:bg-indigo-500 hover:shadow-md disabled:cursor-not-allowed disabled:bg-indigo-300 sm:w-auto"
        >
          {isLoading ? "Ģenerē..." : "Ģenerēt kopsavilkumu"}
        </button>
      </form>

      <SummaryPanel
        summary={summary}
        isLoading={isLoading}
        errorMessage={errorMessage}
        source={summarySource}
      />
    </div>
  );
}
