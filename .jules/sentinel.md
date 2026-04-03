## 2024-05-18 - [Fix ArticleDetail XSS during PDF download]
**Vulnerability:** Raw unescaped HTML data from the database was concatenated into an HTML template string directly, leading to a Cross-Site Scripting (XSS) vulnerability.
**Learning:** Using `window.open().document.write()` to generate downloadable PDF templates circumvents React's automatic DOM injection escaping mechanism. This is a subtle architecture gap where developers might rely on framework-level protections without realizing that concatenating strings bypasses them entirely.
**Prevention:** Always write or use a dedicated helper function (like `escapeHtml`) to sanitize dynamic, user-sourced variables *before* manually interpolating them into HTML strings outside of the standard React rendering tree.
