## 2024-05-24 - Fix XSS vulnerability in PDF download
**Vulnerability:** Raw HTML was being generated for the PDF print window using unescaped user inputs (`article.title`, `content.text`, etc.). This allowed an attacker who could modify article data to execute arbitrary JavaScript in the print window via XSS.
**Learning:** `window.open().document.write()` is a classic XSS sink that bypasses React's built-in protections against raw HTML injection. Any user data rendered directly into string-based HTML templates must be explicitly escaped.
**Prevention:** Always use a dedicated escaping function (e.g. `escapeHtml`) when manually building HTML strings that incorporate dynamic or user-controlled content, especially when interfacing with legacy APIs like `document.write`.
