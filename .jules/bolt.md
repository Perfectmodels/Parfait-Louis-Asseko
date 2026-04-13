## 2024-05-18 - Avoid O(N*M) in Render Loops

**Learning:** When generating heavily categorized media pages like AdminGallery, using inline `array.filter(x => x.category === y).length` inside mapped array loops causes severe O(N*M) time complexity blocks, significantly hurting React rendering performance with large datasets.

**Action:** Precompute count statistics and entity lookup tables into an index dictionary/Record once at the top of the render logic or using `useMemo` so that lookups inside `.map` are instantaneous O(1) accessing.
