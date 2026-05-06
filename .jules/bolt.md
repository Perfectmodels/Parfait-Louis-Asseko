## 2025-05-24 - Array.find in Render Loops
**Learning:** Calling `scores.find` or `array.find` inside render loops (like when calculating `scoredCells` or `avg` in JuryContest.tsx) introduces an O(N*M*S) operation, causing performance bottlenecks as datasets grow.
**Action:** Pre-compute lookups using a Map or nested Record (e.g., O(1) lookup map of scores keyed by `candidateId-passageId`) with `useMemo` before rendering.
