## 2024-04-01 - Fix XSS vulnerability in PDF download
**Vulnerability:** XSS vulnerability in PDF download via `document.write` in `src/pages/ArticleDetail.tsx`.
**Learning:** React's built-in XSS protections are bypassed when manually constructing raw HTML strings and inserting them into the DOM using `document.write()`.
**Prevention:** Always sanitize or escape user input when generating raw HTML strings, especially when dealing with data retrieved from external sources or databases. Use a utility like `escapeHtml` to encode special characters to safe HTML entities.
