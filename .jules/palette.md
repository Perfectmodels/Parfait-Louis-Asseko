## 2026-04-28 - Focus States on Hover-Reveal Elements
**Learning:** Components that rely on hover to reveal interactive elements (e.g., `opacity-0 group-hover:opacity-100` for file deletion buttons) are completely invisible to keyboard-only users who navigate via the Tab key unless explicitly handled.
**Action:** Always append `focus-visible:opacity-100` alongside visual focus indicators (e.g., `focus-visible:ring-2`) to ensure these elements become visible and properly outlined during keyboard navigation.
