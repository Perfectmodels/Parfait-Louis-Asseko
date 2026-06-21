
## 2024-05-20 - Raw HTML Generation XSS Vulnerability
**Vulnerability:** Found a Cross-Site Scripting (XSS) vulnerability in `src/pages/ArticleDetail.tsx` where dynamic user-provided data (like article title, author, content blocks, image URLs, etc.) was being concatenated directly into a raw HTML string for the PDF download feature without any sanitization. This could allow an attacker to inject malicious scripts.
**Learning:** This existed because the HTML string was constructed manually via string interpolation instead of relying on React's built-in XSS protections (like JSX), and no generic sanitization utility was available in the project to scrub the raw data.
**Prevention:** Always explicitly sanitize or escape dynamic data when manually constructing raw HTML strings or when injecting data into HTML attributes, using a utility function (like `escapeHtml` created here) or a library like DOMPurify. Do not rely solely on React's protections when bypassing JSX.
