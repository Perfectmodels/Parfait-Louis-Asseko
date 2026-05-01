
## 2025-02-28 - Replace nested array finding with O(1) Map lookup
**Learning:** In complex React reporting dashboards like `AdminBeautyContest.tsx` with nested matrix rendering loops (e.g. Iterating passages × candidates × juries), using array `.find()` or `.filter()` inside inner loop iterations introduces severe O(N³) or O(N⁴) bottlenecks as array sizes grow.
**Action:** Always pre-compute flat data into hierarchical structures (`Map` or nested `Record` objects) outside the render loops or inside `useMemo`, shifting expensive repeated operations to efficient O(1) property/hash lookups.
