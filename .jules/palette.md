## 2025-04-26 - Accessible Hover Actions
**Learning:** Icon-only removal buttons using `opacity-0 group-hover:opacity-100` are invisible during keyboard navigation.
**Action:** Always pair `opacity-0 group-hover:opacity-100` with `focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2` to ensure visibility and focus clarity for keyboard users.
