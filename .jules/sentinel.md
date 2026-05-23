## 2025-02-14 - Fix Cross-Site Scripting (XSS) in ArticleDetail
**Vulnerability:** Unsanitized user data (article title, content text, etc.) was interpolated directly into raw HTML strings meant for a `document.write()` output when downloading an article as a PDF in `generateArticleHtml` inside `src/pages/ArticleDetail.tsx`.
**Learning:** React safely handles escaping within the virtual DOM, but manually building raw HTML using template literals and injecting it directly via `document.write()` creates a significant DOM-based XSS surface.
**Prevention:** Always implement a dedicated `escapeHtml` function (handling `&`, `<`, `>`, `"`, `'`) for variables when manually creating HTML payloads client-side if a dedicated sanitizer or robust HTML generation library isn't practical.
