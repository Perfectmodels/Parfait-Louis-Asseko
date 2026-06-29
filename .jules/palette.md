## 2024-06-29 - Dynamic Loading Screen Reader Accessibility
**Learning:** The central Loading component used for async operations across the app lacked ARIA attributes, leaving screen reader users without context during state transitions.
**Action:** Always apply `role="status"` and `aria-live="polite"` to dynamic loading wrappers, and explicitly hide decorative loading spinners with `aria-hidden="true"`.
