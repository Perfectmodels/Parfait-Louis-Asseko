## 2026-03-12 - Prevent XSS in dynamically generated HTML downloads
**Vulnerability:** Article content rendered via `window.open().document.write()` for PDF downloads was interpolating user input (title, category, author, content) without escaping, leading to a DOM-based XSS vulnerability.
**Learning:** Functions that generate raw HTML strings for new windows must strictly sanitize inputs, even if the primary DOM is protected by React's built-in escaping.
**Prevention:** Always escape user input using a utility function when generating HTML strings manually.
