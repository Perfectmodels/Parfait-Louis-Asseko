
## 2024-05-28 - DOM XSS in Article PDF Export
**Vulnerability:** A classic DOM-based Cross-Site Scripting (XSS) vulnerability was found in `src/pages/ArticleDetail.tsx`. The `generateArticleHtml` function generated raw HTML strings by directly interpolating user-controlled properties (e.g., `article.title`, `content.text`) and passed them unsanitized to `printWindow.document.write()`.
**Learning:** This vulnerability bypassed React's built-in XSS protections because the HTML was constructed manually as a raw string and injected directly into the DOM of a newly opened window context (`_blank`). The typical defense of using JSX was not applicable here.
**Prevention:** Always explicitly sanitize dynamic user data when constructing raw HTML strings outside of React's render lifecycle (such as for PDF exports or printing). A robust `escapeHtml` utility should be used to replace special characters (`&`, `<`, `>`, `"`, `'`) with safe HTML entities before concatenation.
