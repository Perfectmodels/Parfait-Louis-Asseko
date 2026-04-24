## 2024-05-19 - Pre-computing aggregations with useMemo in nested renders
**Learning:** In list-heavy UI components (like rankings), mapping and sorting data by calling functions that filter across another large dataset (like a list of scores) creates hidden O(N * M) performance bottlenecks. This causes excessive lag when data scales or when React rapidly re-renders.
**Action:** Always precompute lookups or aggregated data using `useMemo` into an O(1) dictionary (e.g. `Record<string, number>`) before running render loops or array sort functions to maintain fast UI responsiveness.
