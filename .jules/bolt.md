
## 2023-10-27 - Replace O(N³) rendering with O(1) score lookups
**Learning:** Performing multiple `Array.prototype.filter()` operations on a large dataset (e.g., `scores`) inside nested loops (`candidates.map` -> `passages.map` -> `scores.filter`) creates a severe performance bottleneck (O(N³)).
**Action:** Always precompute lookups using `useMemo` to group flat arrays into dictionaries (e.g., `Record<string, Score[]>`) using standard keys or composite keys (`${candidateId}-${passageId}`) before entering heavy render loops. This transforms expensive filtering into fast O(1) access.
