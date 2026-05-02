## 2024-05-18 - Client-Side Hashing in Array Iteration
**Vulnerability:** Synchronous password comparison logic breaking when asynchronous client-side hashing is introduced.
**Learning:** Using `await` inside synchronous array methods like `find()` results in unintended behavior by returning truthy Promises instead of boolean values.
**Prevention:** Pre-compute asynchronous hashes before iterating over arrays that perform conditional checks.
