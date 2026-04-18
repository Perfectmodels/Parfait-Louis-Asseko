
## 2025-02-13 - Focus states on rounded floating buttons
**Learning:** Floating utility buttons (like AI Concierge or Back to Top) require the rounding class (e.g., `rounded-full`) to be explicitly on the outermost interactive element (the `<button>` or `<Link>`) when adding focus rings. Otherwise, the focus ring is rectangular.
**Action:** Always check the bounding radius of the element receiving focus when adding keyboard accessibility to circular or custom-shaped buttons.
