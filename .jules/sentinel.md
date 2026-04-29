## 2025-05-01 - XSS in PDF Export (Raw HTML generation)
**Vulnerability:** Raw HTML strings were constructed using unsanitized user inputs (`article.title`, `content.text`, etc.) in `generateArticleHtml` for the PDF export feature, enabling Cross-Site Scripting (XSS).
**Learning:** Constructing raw HTML strings directly exposes the application to XSS vulnerabilities if user data is injected without prior sanitization, especially breaking out of HTML attributes with quotes.
**Prevention:** Always use a utility like `escapeHtml` to escape HTML entities (`&`, `<`, `>`, `"`, `'`) before interpolating user data into raw HTML strings, and prefer safer DOM manipulation or React rendering over raw HTML strings where possible.
