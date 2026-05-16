## 2025-02-18 - Nested Loop Rendering Optimization
**Learning:** Found an O(N³) rendering bottleneck in `JuryContest.tsx` because a nested Candidate x Passage mapping called `getScore`, which used `scores.find()` to locate the score in an array. This resulted in performance degradation as the number of candidates and passages increased.
**Action:** Always replace O(N) array `.find()` lookups with an O(1) `useMemo` Map/Dictionary lookup when used inside deeply nested list rendering or reduce loops to maintain snappy UI performance.
