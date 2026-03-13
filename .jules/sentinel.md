## 2026-03-13 - XSS Vulnerability in Document Write
**Vulnerability:** XSS vulnerability in PDF download where unsanitized user input was passed to `window.open().document.write()`.
**Learning:** Generating HTML strings for new windows bypasses React's built-in XSS protection, requiring explicit sanitization.
**Prevention:** Always escape user input when manually constructing HTML strings to be inserted into the DOM.
