/**
 * Sanitizes a string to prevent Cross-Site Scripting (XSS) when generating raw HTML.
 * Replaces dangerous characters (&, <, >, ", ') with safe HTML entities.
 */
export const escapeHtml = (unsafe: string | undefined | null): string => {
  if (unsafe == null) return '';
  const str = typeof unsafe !== 'string' ? String(unsafe) : unsafe;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
