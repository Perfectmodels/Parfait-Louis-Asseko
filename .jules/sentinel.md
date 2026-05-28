## 2025-05-28 - Fix DOM-based XSS in Article PDF Generation

**Vulnerability:** Found a DOM-based Cross-Site Scripting (XSS) vulnerability in `src/pages/ArticleDetail.tsx`. The `generateArticleHtml` function constructs an HTML string for PDF/print generation by directly interpolating user-generated article content (titles, categories, authors, paragraphs, quotes, alt texts, captions) without proper sanitization. This allowed execution of malicious scripts if a user managed to input script tags into article fields.

**Learning:** When building HTML strings manually using template literals, standard React sanitization (which happens automatically in JSX) does not apply. We have a utility `escapeHtml` in `src/utils/sanitize.ts` specifically built to handle this, but it was bypassed when generating HTML for the print functionality.

**Prevention:** Always explicitly use `escapeHtml` (or a similar sanitization mechanism) when directly interpolating user-provided data into manually constructed HTML strings, even for internal or seemingly secondary features like generating a print/PDF view.
