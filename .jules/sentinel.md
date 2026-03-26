## 2024-03-26 - XSS in ArticleDetail PDF Generator
**Vulnerability:** User inputs (article title, author, content) were injected directly into a raw HTML string used for PDF generation via `window.open().document.write()`. This completely bypasses React's XSS protections.
**Learning:** Functions that generate raw HTML strings for new windows must explicitly escape user input. React cannot protect code executed in a separate `document.write` context.
**Prevention:** Use a dedicated `escapeHtml` utility function to sanitize all user-provided data before injecting it into manually constructed HTML strings.
