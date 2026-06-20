## 2025-05-18 - Avoid O(N³) rendering bottlenecks in React

**Learning:** When building list-heavy or highly nested UI components (e.g., Candidates x Passages x Juries in beauty contests), performing array operations like `.filter()` or `.find()` inside the render loops can cause severe O(N³) bottlenecks during React rendering, particularly when calculating averages or verifying score existence.
**Action:** Precompute lookup dictionaries using `useMemo` with `Map` (often using composite string keys like `idA-idB`) or nested `Record` types before the render loops. This shifts expensive array operations to O(1) lookups and significantly improves rendering performance.
