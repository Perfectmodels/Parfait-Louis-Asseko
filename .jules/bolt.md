
## 2025-04-14 - Replace O(N*M) lookups with Maps in List Rendering
**Learning:** In list-heavy Admin pages (like AdminGallery), computing derived data (e.g., getting the album for each item, or counting items per album) inside render loops using `.find()` or `.filter()` causes O(N*M) performance bottlenecks, as it runs those array functions for every rendered element on every render cycle.
**Action:** Always precompute these lookups using `useMemo` into Maps or Record objects, which turns the repetitive O(N) queries into O(1) direct lookups during rendering.
