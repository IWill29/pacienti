/** Build a valid HTML id from a prefix and label text (no spaces or special chars). */
export function toHtmlId(prefix: string, label: string): string {
  const slug = label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug ? `${prefix}-${slug}` : prefix;
}
