## 2024-06-01 - Dynamic ARIA Roles for Toasts
**Learning:** Hardcoding 'role="alert"' on all toast notifications can overwhelm screen readers with non-critical updates. Temporary notifications need appropriate semantics based on severity.
**Action:** Dynamically map error toasts to 'role="alert"' ('aria-live="assertive"') and success/info toasts to 'role="status"' ('aria-live="polite"'). Ensure all icon-only dismiss buttons have localized 'aria-label's and 'focus-visible' styles.
