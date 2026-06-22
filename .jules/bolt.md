## 2025-02-28 - AdminGallery Render Loops O(N*M)
**Learning:** Calling array methods like `.filter()` and `.find()` inside a parent map loop (like `albums.map` or filtering categories over the full `gallery` data set) in list-heavy management pages results in O(N*M) rendering complexity. This is extremely inefficient when the list gets large.
**Action:** Use `useMemo` to precompute lookup maps (e.g., `albumMap` and count objects) from the list data before the render loop, which converts those repeated array operations into simple O(1) map lookups.
