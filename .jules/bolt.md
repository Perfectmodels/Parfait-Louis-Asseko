## 2025-05-23 - Optimize O(N^3) rendering bottleneck with Map lookup
**Learning:** Array `.find()` and `.filter()` operations inside nested rendering loops for many-to-many list structures (e.g., Candidates x Passages) cause O(N^3) performance bottlenecks.
**Action:** Precompute lookup dictionaries using `useMemo` with `Map` (with composite keys like `idA-idB`) before render loops to shift array operations to O(1) lookups.
