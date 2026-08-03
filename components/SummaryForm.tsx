"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function SummaryForm() {
  const [patientInfo, setPatientInfo] = useState("");
  const [summary, setSummary] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const isLoading = formState === "loading";
  const canSubmit = patientInfo.trim().length > 0 && !isLoading;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setFormState("loading");
    setErrorMessage("");
    setSummary("");
    setCopied(false);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientInfo }),
      });

      const data = (await response.json()) as {
        summary?: string;
        error?: string;
      };

      if (!response.ok) {
        setFormState("error");
        setErrorMessage(
          "Neizdevās ģenerēt kopsavilkumu. Mēģiniet vēlreiz.",
        );
        return;
      }

      if (!data.summary) {
        setFormState("error");
        setErrorMessage(
          "Neizdevās ģenerēt kopsavilkumu. Mēģiniet vēlreiz.",
        );
        return;
      }

      setSummary(data.summary);
      setFormState("success");
    } catch {
      setFormState("error");
      setErrorMessage("Neizdevās ģenerēt kopsavilkumu. Mēģiniet vēlreiz.");
    }
  }

  async function handleCopy() {
    if (!summary) {
      return;
    }

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMessage("Neizdevās kopēt uz starpliktuvi.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <header className="space-y-2 text-center sm:text-left">
        <p className="text-sm font-medium uppercase tracking-wider text-indigo-600">
          Ārsta palīgs
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Pacienta kopsavilkums
        </h1>
        <p className="text-base text-zinc-600">
          Ievadiet pacienta informāciju — AI sagatavos īsu kopsavilkumu
          kopēšanai.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)]">
          <label
            htmlFor="patient-info"
            className="mb-3 block text-sm font-medium text-zinc-800"
          >
            Pacienta informācija
          </label>
          <textarea
            id="patient-info"
            name="patientInfo"
            rows={10}
            value={patientInfo}
            onChange={(event) => setPatientInfo(event.target.value)}
            placeholder="Sūdzības, anamnēze, atrastie, piezīmes..."
            disabled={isLoading}
            className="w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-[15px] leading-relaxed text-zinc-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-[15px] font-medium text-white shadow-sm transition hover:bg-indigo-500 hover:shadow-md disabled:cursor-not-allowed disabled:bg-indigo-300 sm:w-auto"
        >
          {isLoading ? "Ģenerē..." : "Ģenerēt kopsavilkumu"}
        </button>
      </form>

      {formState === "error" && errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {summary && (
        <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)]">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">
              Kopsavilkums
            </h2>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              {copied ? "Kopēts!" : "Kopēt"}
            </button>
          </div>
          <div className="whitespace-pre-wrap rounded-xl bg-zinc-50 px-4 py-4 text-[15px] leading-relaxed text-zinc-800">
            {summary}
          </div>
        </section>
      )}
    </div>
  );
}
