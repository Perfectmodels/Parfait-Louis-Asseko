## 2025-05-29 - O(N^3) Matrix Rendering Bottleneck in Beauty Contest Admin
**Learning:** Using `Array.find()` inside highly nested React rendering loops (e.g., iterating through candidates, juries, and passages simultaneously) causes severe O(N^3) performance bottlenecks and can lock up the main thread when data scales.
**Action:** When building complex matrices or large lists, always shift expensive array operations (`.find()`, `.filter()`) to O(1) hash map lookups by precomputing lookup dictionaries (`Map`) with composite keys via `useMemo` before entering the render loop.
