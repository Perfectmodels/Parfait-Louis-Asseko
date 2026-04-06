## 2024-05-15 - XSS in ArticleDetail PDF Generation
**Vulnerability:** XSS vulnerability through `window.open().document.write()` when generating PDF version of articles. The content and metadata were not sanitized.
**Learning:** Functions that generate raw HTML strings for new windows must explicitly escape user input, as this pattern bypasses React's built-in XSS protection.
**Prevention:** Use an escapeHtml utility function to sanitize any dynamic data embedded in raw HTML strings.
