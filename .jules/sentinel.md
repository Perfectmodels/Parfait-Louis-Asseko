## 2024-03-24 - Fix XSS vulnerability in raw HTML generation for PDF download
**Vulnerability:** XSS vulnerability in the PDF download feature where raw HTML strings were generated using unescaped user inputs and then injected into a new window using `window.open().document.write()`.
**Learning:** Functions that generate raw HTML strings for new windows bypass React's built-in XSS protection and are highly vulnerable if user input is directly concatenated.
**Prevention:** Dynamic user data must be explicitly sanitized using the `escapeHtml` utility function to replace special characters (`&`, `<`, `>`, `"`, `'`) with safe HTML entities before interpolating them into raw HTML strings.
