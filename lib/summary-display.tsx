import type { ReactNode } from "react";

/** Strip markdown bold markers for plain-text clipboard fallback. */
export function summaryToPlainText(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}

/** Convert summary markdown (bold only) to HTML for rich clipboard paste. */
export function summaryToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br>");
}

export function renderSummaryBold(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-zinc-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export async function copySummaryToClipboard(text: string): Promise<void> {
  const plain = summaryToPlainText(text);
  const html = summaryToHtml(text);

  if (
    typeof ClipboardItem !== "undefined" &&
    typeof navigator.clipboard?.write === "function"
  ) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": new Blob([plain], { type: "text/plain" }),
          "text/html": new Blob([html], { type: "text/html" }),
        }),
      ]);
      return;
    } catch {
      // Fall through to writeText.
    }
  }

  await navigator.clipboard.writeText(plain);
}
