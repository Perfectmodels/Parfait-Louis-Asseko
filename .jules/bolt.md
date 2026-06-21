## 2024-06-11 - React.memo() on Framer Motion list items
**Learning:** List items containing expensive render operations like `framer-motion` animations can cause input lag and block the main thread when their parent component's state (like search/filter text) updates frequently.
**Action:** Always wrap child list item components containing expensive render operations (like `framer-motion` animations) in `React.memo()` to prevent input lag and thread blocking in parent components managing search/filter state.
