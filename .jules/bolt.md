## 2025-02-18 - Precomputing Lookups in List-Heavy Admin Pages
**Learning:** Using inline `.filter()` or `.find()` methods inside rendering `.map()` loops causes $O(N \times M)$ complexity. In pages with potentially hundreds of items like the Gallery or Admin Data lists, this will visibly degrade UI performance (e.g., rendering lag when switching tabs or modifying state).
**Action:** When designing or refactoring list-heavy management pages, precompute summary counts and reference maps using `useMemo` in a single $O(N)$ pass, then perform $O(1)$ lookups within the render loop.
