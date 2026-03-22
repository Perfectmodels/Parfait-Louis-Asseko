## 2024-05-30 - XSS in HTML generation for PDF Downloads
**Vulnerability:** User-controlled article properties (title, content, author, image URLs) were being directly concatenated into a raw HTML string `generateArticleHtml` to be written to a new window for PDF generation, bypassing React's built-in XSS protection.
**Learning:** `window.open().document.write()` creates a raw HTML context where typical React safeguards do not apply. Any dynamic data injected into this raw template must be explicitly sanitized.
**Prevention:** Created and used an `escapeHtml` utility function to explicitly replace sensitive characters (`&`, `<`, `>`, `"`, `'`) with safe HTML entities before injecting dynamic string data into raw HTML templates.
