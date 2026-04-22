/**
 * Escapes characters to safe HTML entities to prevent XSS vulnerabilities.
 * @param unsafe The string to sanitize.
 * @returns The sanitized string.
 */
export const escapeHtml = (unsafe: string | null | undefined): string => {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
};
