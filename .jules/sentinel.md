## 2025-02-12 - Prevent XSS in Raw HTML Generation
**Vulnerability:** User-provided article data (title, author, content blocks) was directly embedded into raw HTML strings in `src/pages/ArticleDetail.tsx` for generating print/PDF content. This could allow an attacker to inject malicious scripts (XSS) if they control the article content.
**Learning:** Even internal features like generating HTML for printing or PDFs must sanitize dynamic inputs. Client-side features using `window.open().document.write()` are just as vulnerable to XSS as standard DOM injections.
**Prevention:** Always use a sanitization utility, like `escapeHtml` in `src/utils/sanitize.ts`, to encode user-controlled strings before interpolating them into HTML templates, regardless of the output medium.
