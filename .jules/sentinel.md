## 2024-05-18 - Cross-Site Scripting (XSS) in PDF Generation

**Vulnerability:** The `generateArticleHtml` function in `src/pages/ArticleDetail.tsx` constructs an HTML string by concatenating unescaped user inputs, such as `article.title`, `article.author`, and `content.text`, potentially leading to XSS when this HTML is displayed or rendered.
**Learning:** This existed because the application generates PDF documents by rendering HTML strings directly and printing them, without escaping the dynamic user data. Simple tag stripping is insufficient as it doesn't protect against attribute injection.
**Prevention:** To avoid this next time, always escape HTML entities (like `<`, `>`, `&`, `"`, `'`) when building raw HTML strings using dynamic content. Use a dedicated `escapeHtml` function.
