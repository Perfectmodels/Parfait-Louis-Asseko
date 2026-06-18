## 2024-10-25 - Dynamic Loading States Accessibility
**Learning:** The application uses a custom dynamic `Loading` component that renders text and an animated spinner, but it completely lacked ARIA roles, making it "invisible" to screen readers as a status update.
**Action:** Always add `role="status"` and `aria-live="polite"` to dynamic loading containers, and explicitly hide decorative visual spinners with `aria-hidden="true"`.
