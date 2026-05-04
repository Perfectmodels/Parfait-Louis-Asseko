## 2024-05-24 - O(N³) Rendering Bottleneck with Synchronous Array Methods
**Learning:** Calling synchronous array methods like `.find()` inside nested React rendering loops (e.g., looping over passages, candidates, and juries) leads to an O(N³) or O(N⁴) performance bottleneck, drastically slowing down rendering when the data size grows.
**Action:** Always use `useMemo` to pre-compute lookups (e.g., using a `Map` with composite keys) before the rendering loops to convert O(N) linear searches within nested iterations into O(1) hash map lookups.
