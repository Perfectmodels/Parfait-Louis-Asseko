## 2025-02-23 - XSS in PDF Download Feature
**Vulnerability:** XSS via raw HTML string interpolation (`window.open().document.write()`) using unsanitized user inputs (`content.text`, `article.title`, etc.).
**Learning:** Even in React applications (where XSS is usually mitigated natively), using `document.write` with manually concatenated template strings bypasses all React security measures, making the app vulnerable if user-generated content is passed.
**Prevention:** Always use a helper function to HTML-escape special characters (`&`, `<`, `>`, `"`, `'`) before interpolating arbitrary text into raw HTML strings, especially when dynamically generating print or download views.
