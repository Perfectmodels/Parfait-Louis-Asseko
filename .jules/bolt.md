## 2024-11-20 - O(1) Lookups for List-Heavy Frontend Components
**Learning:** In list-heavy or highly nested UI components (like Candidates x Passages in beauty contests), repeatedly filtering arrays via `.filter()` inside render loops causes severe O(N³) rendering bottlenecks.
**Action:** When working with nested relational data in the frontend, precompute lookup dictionaries (`Map` or nested `Record` types) via `useMemo` before entering the render loop to achieve O(1) lookup times and prevent sluggish UI performance.
