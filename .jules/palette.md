## 2025-04-25 - Fix keyboard accessibility for hover-reveal interactive elements
**Learning:** Elements hidden behind hover states (like `opacity-0 group-hover:opacity-100`) become invisible and un-actionable for keyboard users navigating via Tab unless explicitly handled.
**Action:** Always pair `opacity-0 group-hover:opacity-100` with `focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-gold` when applied to interactive elements like buttons.
