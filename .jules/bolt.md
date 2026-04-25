## 2024-05-18 - Avoiding N+1 filtering in React render loops
**Learning:** When rendering lists that rely on related data (like rendering candidates and filtering their associated scores), using `array.filter()` inside the `.map()` loop results in an O(N*M) complexity (where N is candidates and M is total scores) on every render.
**Action:** Use `useMemo` to pre-compute a `Map` or `Record` of related data (e.g. `scoresByCandidate`) before the render loop. This reduces the complexity to O(N + M) and provides O(1) lookups during the render phase.
