/**
 * Strips common markdown formatting from AI-generated summaries
 * while preserving Latvian medical content.
 */
export function sanitizeSummaryMarkdown(text: string): string {
  let result = text;

  // Fenced code blocks — keep inner content only
  result = result.replace(/```[^\n]*\n?([\s\S]*?)```/g, "$1");

  // Inline code
  result = result.replace(/`([^`]+)`/g, "$1");

  // Bold / italic (process longer markers first)
  result = result.replace(/\*\*([^*]+)\*\*/g, "$1");
  result = result.replace(/__([^_]+)__/g, "$1");
  result = result.replace(/\*([^*\n]+)\*/g, "$1");
  result = result.replace(/_([^_\n]+)_/g, "$1");

  // Strikethrough
  result = result.replace(/~~([^~]+)~~/g, "$1");

  // ATX headers (# ## ###)
  result = result.replace(/^#{1,6}\s+/gm, "");

  // Blockquotes
  result = result.replace(/^>\s?/gm, "");

  // Markdown links — keep link text
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Bullet list markers at line start
  result = result.replace(/^[\t ]*[-*+]\s+/gm, "");

  // Horizontal rules
  result = result.replace(/^[\t ]*[-*_]{3,}[\t ]*$/gm, "");

  // Collapse excessive blank lines
  result = result.replace(/\n{3,}/g, "\n\n");

  return result.trim();
}
