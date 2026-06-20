## 2025-02-23 - Focus States on Hover-Reveal Elements
**Learning:** Elements relying on `opacity-0 group-hover:opacity-100` remain invisible during keyboard navigation.
**Action:** Always add `focus-visible:opacity-100` and visual focus rings (e.g., `focus-visible:ring-2`) to interactive elements hidden by opacity, or use `focus-within:opacity-100` on their parent wrapper.