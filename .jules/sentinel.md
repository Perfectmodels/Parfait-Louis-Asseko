## 2026-05-05 - Prevent XSS in HTML String Rendering
**Vulnerability:** XSS vulnerability through improperly sanitized user-generated content (like titles, author names, content snippets) injected directly into HTML strings for generating PDFs or previews using `window.open` and `document.write`.
**Learning:** Even though the site uses React (which typically prevents XSS inherently), constructing raw HTML strings dynamically via string templates explicitly requires manual sanitization. Missing this can allow cross-site scripting when those raw strings are subsequently parsed.
**Prevention:** Always explicitly run user inputs through a sanitization function (like `escapeHtml`) when constructing raw HTML strings outside of the standard React component render cycle.
