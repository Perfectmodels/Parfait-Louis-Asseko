/**
 * Escapes special characters in a string to prevent XSS when inserting into HTML.
 * @param str The string to escape.
 * @returns The escaped string.
 */
export function escapeHtml(str: string | undefined | null): string {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
