## 2025-02-14 - Fix DOM-based XSS in PDF Download
**Vulnerability:** Dynamic HTML generation using untrusted user input without escaping HTML entities.
**Learning:** Using raw string interpolation for printing allows arbitrary script injection inside the dynamically created popup window.
**Prevention:** Always use `escapeHtml` or a sanitization library before writing variables into custom raw HTML structures intended for the DOM.
