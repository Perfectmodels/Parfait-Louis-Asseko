## 2024-05-08 - Accessible Icon Buttons in Admin Tables
**Learning:** Icon-only action buttons in admin data tables (like EyeIcon for view, TrashIcon for delete) often lack `aria-label` attributes and focus states for keyboard navigation. Without these, screen reader users cannot identify the button's purpose and keyboard users cannot see which button has focus.
**Action:** When adding or reviewing tables with actions, ensure icon-only buttons include `aria-label`, an optional `title` for mouse users, and `focus-visible:ring-2` styling.
