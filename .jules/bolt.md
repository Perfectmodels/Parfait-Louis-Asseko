## 2025-03-09 - Precomputing maps to eliminate nested O(N³) rendering loops
**Learning:** In highly nested list loops (e.g., Candidates x Passages x Juries), using O(N) operations like `scores.find` and `criteria.filter` on every render cell causes severe performance degradation, manifesting as an O(N³) bottleneck.
**Action:** Always precompute lookups using `useMemo` with `Map` before the rendering loops to change array iterations into O(1) map lookups, ensuring high performance in complex data grids.
