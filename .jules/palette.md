## 2024-10-25 - Dynamic Loading Component Accessibility
**Learning:** Dynamic loading components need explicit ARIA roles for screen readers to announce them when they appear. Visually decorative spinners should be explicitly hidden.
**Action:** Always add `role="status"` and `aria-live="polite"` to the text container of loading indicators, and explicitly hide visual spinners using `aria-hidden="true"`.
