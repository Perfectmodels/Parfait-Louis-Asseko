## 2024-03-16 - XSS in PDF Generation Window
**Vulnerability:** User-generated content was being interpolated directly into an HTML string for the PDF generation print window (`window.open().document.write()`).
**Learning:** React's built-in XSS protection does not apply when generating raw HTML strings for new windows.
**Prevention:** Always explicitly escape user input before interpolating it into raw HTML strings, especially when using `document.write`.
