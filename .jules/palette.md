## 2024-10-26 - Dynamic ARIA Roles for Toasts
**Learning:** Hardcoding `role="alert"` for all Toast notifications is semantically incorrect and can disrupt screen reader users for non-critical updates. Toast notifications require dynamic `role` (`alert` vs `status`) and `aria-live` (`assertive` vs `polite`) attributes based on the severity of the notification.
**Action:** Always dynamically set the `role` and `aria-live` attributes when building temporary notification components based on the notification type or severity.
