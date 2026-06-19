## 2025-02-23 - Avoid O(N³) rendering bottlenecks in matrix views
**Learning:** Highly nested matrix views (like beauty contests with Candidates × Passages × Juries) can cause severe O(N³) rendering bottlenecks if you rely on array `.filter()` or `.find()` inside the innermost render loops.
**Action:** When building list-heavy or nested UI components, precompute lookup maps/dictionaries using \`useMemo\` and \`Map\` before the render loops. This shifts expensive array operations to O(1) lookups and significantly improves rendering performance.
