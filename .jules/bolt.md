## 2025-02-14 - Optimize nested filtering in React render loops
**Learning:** In complex UI structures with multiple relational layers (e.g. Candidates x Passages x Juries), running array filtering `.filter()` on large lists repeatedly inside nested `map()` loops causes O(N³) rendering bottlenecks.
**Action:** Use `useMemo` to precompute grouped lookup maps (e.g., grouping `scores` by `candidateId` into a `Map`) before the render phase. This shifts expensive array iteration to O(1) property lookups, drastically reducing recalculations.
