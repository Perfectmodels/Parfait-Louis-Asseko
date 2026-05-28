## 2025-05-28 - Precompute O(N³) rendering bottlenecks in Beauty Contest
**Learning:** Heavy O(N³) calculations inside `.sort()` and nested render loops (`.map()` calling `.filter()`) for Candidates x Passages x Juries cause severe performance drops as dataset grows.
**Action:** Precompute lookup dictionaries (`Map`) using `useMemo` prior to render loops to shift array iterations into O(1) lookups.
