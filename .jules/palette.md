## 2024-05-18 - Dynamic Toast Roles
**Learning:** For accessibility in temporary notification components (e.g., Toasts), dynamically setting the `role` attribute based on the severity of the notification (e.g., `role={type === 'error' ? 'alert' : 'status'}`) is preferred over hardcoding `role="alert"` as it provides better semantic correctness and inherently maps to the expected `aria-live` behavior (`assertive` vs `polite`).
**Action:** Always map toast severity to the correct ARIA role instead of defaulting to alert for all notifications.
