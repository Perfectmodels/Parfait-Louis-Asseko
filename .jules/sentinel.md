## 2024-05-18 - Prevent XSS in HTML generation for new windows
**Vulnerability:** XSS vulnerability when generating raw HTML strings for PDF downloads via `document.write(htmlContent)` in `ArticleDetail.tsx`. Dynamic user data (titles, content, etc.) was not being sanitized.
**Learning:** Functions that generate raw HTML strings for new windows (e.g., `window.open().document.write()`) bypass React's built-in XSS protection because they directly inject string content into the DOM instead of relying on React's rendering engine.
**Prevention:** Always explicitly escape user input using a utility function (like `escapeHtml`) when manually generating HTML strings to be written directly to the DOM or opened in a new window.
