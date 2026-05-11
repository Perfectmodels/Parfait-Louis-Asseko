## 2025-03-02 - Toast Close Button Accessibility
**Learning:** Adding a focus-visible ring on dynamic colored components (like success/error Toasts) should utilize `ring-current` instead of hardcoded colors to maintain contrast regardless of the state. `aria-label` must reflect the localized French labels commonly found elsewhere in the UI to ensure consistency.
**Action:** Always include `focus-visible:ring-current` to ensure contrast and adapt to text colors on components styled with dynamic states. Maintain consistency with localized text content.
