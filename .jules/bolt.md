## 2024-05-15 - Precomputing Lookups for Nested Loops
**Learning:** When generating complex matrices in React (like Juries × Candidates × Passages in `AdminBeautyContest.tsx` and `JuryContest.tsx`), using an O(N) array `.find()` operation inside nested map/reduce rendering loops results in severe O(N³) rendering performance bottlenecks.
**Action:** Shift expensive array operations to O(1) dictionary lookups. Use `useMemo` to pre-compute a `Map` representation of the array (e.g., mapping composite keys to scores) before iterating through large datasets during renders.
