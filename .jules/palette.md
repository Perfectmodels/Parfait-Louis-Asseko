## 2024-05-18 - Mobile Menu Toggle Accessibility
**Learning:** It is crucial to remember to add corresponding container `id` when using `aria-controls`. I noticed the mobile menu toggle button lacked a complete ARIA set.
**Action:** In future UX/A11y improvements, ensure both the controller and the controlled element share the correct linkage attributes, especially in heavily animated components like Framer Motion overlays.
