## 2024-03-19 - Fix XSS vulnerability in PDF download
**Vulnerability:** Cross-Site Scripting (XSS) vulnerability was present in `src/pages/ArticleDetail.tsx` where dynamic content (article title, content blocks, image URLs, etc.) was rendered using `window.open().document.write()` without HTML escaping, allowing potential script injection.
**Learning:** `window.open().document.write()` bypasses React's built-in XSS protection because it manipulates the DOM directly with raw HTML strings. It's necessary to manually escape strings when dealing with raw HTML injection.
**Prevention:** Always manually sanitize and escape variables representing user input or external data using a utility like `escapeHtml` when generating strings meant to be interpreted as HTML.
