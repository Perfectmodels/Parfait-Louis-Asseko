## 2025-02-28 - Precompute Nested Lookups in Rendering Loops
**Learning:** In highly nested components (e.g., Candidates x Passages x Juries), inline array filter/map operations (like `.filter(s => s.candidateId === id)`) lead to O(N³) or worse rendering performance. This causes severe lag on large contest score matrices.
**Action:** Always pre-compute lookups (e.g., using `Record<string, Score>`) inside a `useMemo` block before mapping over the data structure in JSX. This shifts complex queries to O(1) lookups during the render phase.
