## 2025-02-14 - Mobile Menu Toggle Accessibility
**Learning:** Icon-only interactive elements, specifically the mobile navigation toggle in this application, lacked explicit ARIA attributes and focus styles, making keyboard and screen reader navigation difficult.
**Action:** Always add `aria-expanded`, `aria-controls`, and `focus-visible` styles (using standard Tailwind utility classes like `focus-visible:ring-2` and `focus-visible:outline-none`) to mobile menu toggle buttons, ensuring the `aria-controls` target possesses a matching `id`.
