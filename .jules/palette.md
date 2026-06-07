## 2025-03-01 - Dynamic Toast Accessibility Roles
**Learning:** Toasts need semantic roles and `aria-live` behaviors based on severity for proper screen reader announcements. Using a hardcoded `role="alert"` for all notifications is incorrect.
**Action:** Dynamically set the `role` and `aria-live` attributes based on the notification type (e.g., `role={type === 'error' ? 'alert' : 'status'}`) to ensure assertive announcements for errors and polite announcements for general information.
