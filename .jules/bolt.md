## 2024-11-20 - Memoizing animated list items

**Learning:** `Models.tsx` keeps search input state (a simple text search filter) in the same component that renders the list of `ModelCard` components. Without memoization on `ModelCard`, every keystroke in the search bar triggers a re-render of *all* visible model cards. Since each `ModelCard` contains complex `framer-motion` animations and layout wrappers, this causes severe input lag and high JS thread blocking, especially as the number of models grows.

**Action:** When filtering lists where individual items have non-trivial render costs (like heavy animations or complex nested elements) and the filter state is kept in the same parent component, *always* wrap the item component in `React.memo()`. This ensures only the items whose props change (e.g. they're added or removed) are updated, leaving the unchanged ones un-rendered and keeping input fast.
