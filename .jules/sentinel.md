## 2024-05-20 - DOM-based XSS in PDF Download
**Vulnerability:** Found a DOM-based XSS vulnerability in `src/pages/ArticleDetail.tsx` where unescaped user input (article title, content, author, etc.) was being directly interpolated into an HTML string for PDF generation.
**Learning:** Simple tag-stripping libraries or relying on React's built-in escaping are insufficient when generating raw HTML strings, as attributes and inline content remain vulnerable to injection if not explicitly escaped.
**Prevention:** Always use a robust `escapeHtml` function that replaces the 5 critical HTML entities (`&`, `<`, `>`, `"`, `'`) when dynamically generating raw HTML strings from user-controlled data.
