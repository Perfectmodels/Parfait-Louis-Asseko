## 2024-05-24 - Fix XSS in printable article view
**Vulnerability:** XSS vulnerability in `src/pages/ArticleDetail.tsx` where user-controlled article content was directly injected into raw HTML and evaluated using `document.write()` for generating printable PDFs.
**Learning:** React's built-in XSS protection is bypassed when generating raw HTML strings for new windows. This is a critical security gap in the application's architecture for generating printable views.
**Prevention:** Always use an HTML escape helper function to sanitize user input before injecting it into raw HTML strings, especially when using `document.write()`.
