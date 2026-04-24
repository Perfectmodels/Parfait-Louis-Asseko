## 2026-04-24 - Prevent XSS in HTML Generation
**Vulnerability:** Raw HTML was being constructed dynamically in `src/pages/ArticleDetail.tsx` (`generateArticleHtml`) using user-generated content (like article titles and content) without sanitization.
**Learning:** Constructing raw HTML strings by directly injecting variables is highly vulnerable to Cross-Site Scripting (XSS), even if it's meant for a PDF download or a print window.
**Prevention:** Always sanitize dynamic content using a secure HTML escaping function (like `escapeHtml`) before injecting it into raw HTML strings, especially for attributes and text content.
