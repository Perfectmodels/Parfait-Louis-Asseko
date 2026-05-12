## 2024-05-18 - Optimize nested loops array operations within render components
**Learning:** In a heavily nested loop or iterative render mapping (e.g. Candidates x Criteria), calling functions that execute `.filter()` or `.reduce()` inside the map functions degrades performance severely, resulting in O(N³) rendering bottlenecks.
**Action:** When working on complex UI lists or tables, identify expensive inline array operations and extract them out using `useMemo`. Construct O(1) lookup objects (`Record<string, ...>`) before the render cycle begins to keep rendering performance snappy.
