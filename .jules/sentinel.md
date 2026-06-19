## 2024-10-25 - Async Crypto Trap in Array Find
**Vulnerability:** Weak hardcoded admin password in plaintext.
**Learning:** Replacing a plaintext comparison with a SHA-256 hash requires an async `crypto.subtle.digest` call. Using async callbacks directly inside `Array.prototype.find()` creates a callback trap where it always returns a truthy Promise.
**Prevention:** Pre-compute the hash before synchronous array searches, or use an async `for...of` loop.