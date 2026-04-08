## 2024-05-24 - Cross-Site Scripting (XSS) in Raw HTML Generation for PDF Export
**Vulnerability:** XSS vulnerability found in `src/pages/ArticleDetail.tsx` where dynamic user input (article title, author, content) was directly interpolated into raw HTML strings during PDF generation (`generateArticleHtml`).
**Learning:** Generating raw HTML strings via string concatenation or template literals bypasses React's built-in XSS protection, making it easy to accidentally introduce XSS vulnerabilities when handling user-provided data.
**Prevention:** Always explicitly sanitize or escape dynamic data using utilities like `escapeHtml` whenever manually constructing raw HTML strings outside of the standard React rendering lifecycle.
