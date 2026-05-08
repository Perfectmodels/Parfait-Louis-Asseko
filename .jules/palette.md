## 2025-05-08 - Added accessible and visible focus indicators in Toast dismiss button
**Learning:** Hardcoded ring colors on transparent dismiss buttons inside dynamic-color Toasts (like 'success' vs 'error') can cause contrast issues.
**Action:** Use `focus-visible:ring-current` to inherit the text color of the specific toast variant, ensuring high contrast focus indicators regardless of the Toast's state.
