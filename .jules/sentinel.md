## 2024-11-28 - DOM XSS in PDF Generation
**Vulnerability:** DOM-based XSS via unsanitized user inputs in generated HTML strings.
**Learning:** Using raw template literals for generating HTML directly opens up injection vectors when creating print/PDF views.
**Prevention:** Explicitly escape HTML entities (`&`, `<`, `>`, `"`, `'`) for all dynamic variables interpolated into raw HTML templates.
