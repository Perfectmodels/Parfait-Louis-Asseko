## 2024-05-18 - Mobile Menu Toggle Accessibility
**Learning:** Icon-only interactive elements like the mobile menu toggle in the header require explicit ARIA attributes for screen reader accessibility and `focus-visible` styling for keyboard users.
**Action:** Added `aria-label="Toggle menu"`, `aria-expanded={isOpen}`, and `className="focus-visible:ring-2 focus-visible:ring-pm-gold"` to the mobile menu toggle button in `src/components/icons/Header.tsx`.
