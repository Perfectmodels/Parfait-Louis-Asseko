## 2024-06-17 - React.memo on Framer-Motion Lists
**Learning:** Components containing expensive `framer-motion` animations inside search/filter lists (like `Models.tsx`) cause noticeable input lag during rapid typing if they re-render on every state change.
**Action:** Always wrap child list components containing framer-motion animations (like `ModelCard`) in `React.memo()` to decouple their render cycle from the parent's filter state updates.
