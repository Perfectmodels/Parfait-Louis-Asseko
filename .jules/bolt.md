## 2024-06-18 - Memoizing List Items
**Learning:** React.memo() on repeatedly rendered list components (like `ModelCard` inside `Models.tsx`) is an effective performance optimization pattern in this application to prevent unnecessary deep re-renders when parent states (like search or filter inputs) are updated. Removing explicit React.FC from the wrapper resolves TypeScript conflicts with React.NamedExoticComponent.
**Action:** When creating components that are heavily mapped in lists and rely on parent filter/search states, always memoize them and omit the `React.FC` type annotation.
