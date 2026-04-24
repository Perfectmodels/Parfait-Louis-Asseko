## 2024-05-18 - Keyboard Accessibility for Hover-Reveal Icons
**Learning:** Icon buttons that appear only on hover (e.g., using `opacity-0 group-hover:opacity-100`) become invisible but focusable traps for keyboard users unless they also reveal on focus.
**Action:** Always add `focus-visible:opacity-100` alongside visual focus rings (`focus-visible:ring-2`) and an `aria-label` to ensure interactive hover-reveal elements are fully accessible via keyboard navigation.
