## 2024-06-09 - Accessible hover-reveal elements
**Learning:** Components using `opacity-0 group-hover:opacity-100` for visual polish hide elements from keyboard users completely, as they can never trigger the hover state while tabbing through the UI.
**Action:** When implementing hover-reveal interactive elements, explicitly add `focus-visible:opacity-100` alongside visual focus rings (e.g., `focus-visible:ring-2`) directly to the element to ensure they become visible and identifiable during keyboard navigation.
