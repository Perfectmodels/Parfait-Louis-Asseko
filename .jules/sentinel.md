## 2024-05-24 - XSS via Unescaped PDF Download
**Vulnerability:** The `generateArticleHtml` function in `src/pages/ArticleDetail.tsx` used unsanitized user content (like `article.title`, `article.content.text`, etc.) to generate HTML directly written to a new window for printing (`window.open().document.write()`). This completely bypassed React's standard XSS protection.
**Learning:** Functions that generate raw HTML strings for new windows must explicitly escape user input, especially when relying on dynamic, unsanitized text from the database (e.g., article titles, paragraphs, quotes).
**Prevention:** Implement and use a standard utility like `escapeHtml` whenever dynamically building HTML strings outside of React's render lifecycle.
