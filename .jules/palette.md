## 2024-04-12 - Floating Utility Buttons Focus Rings
**Learning:** When adding focus states (`focus-visible`) to floating utility buttons (like Back to Top or AI Assistants), the focus ring defaults to a square outline.
**Action:** Apply the bounding radius class (e.g., `rounded-full`) directly to the interactive parent element (`<button>` or `<Link>`) alongside the focus ring classes so the focus ring properly follows the element's visual contour.
