## 2025-02-28 - Hardcoded Admin Password Hash
**Vulnerability:** Found hardcoded plaintext admin password "admin2025" in `Login.tsx` and `useRealtimeDB.tsx` and plaintext password saving in `Admin.tsx`.
**Learning:** React native clients and frontend apps shouldn't store sensitive hashes in clear text logic. Web Crypto API provides a built-in asynchronous way to generate SHA-256 hashes (`window.crypto.subtle.digest`).
**Prevention:** Implement secure hashing algorithms before saving passwords. Prefix hashes (e.g. `$sha256$`) to distinguish between plaintext (for legacy) and secure storage strings, and resolve the Promise appropriately to compare.
