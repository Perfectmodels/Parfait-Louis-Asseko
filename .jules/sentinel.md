## 2026-06-09 - Hardcoded Admin Password in Realtime DB Initialization

**Vulnerability:** A critical vulnerability was found where the fallback default administrative password (`admin2025`) was hardcoded in plain text directly in `src/hooks/useRealtimeDB.tsx` and evaluated in plaintext for administrative logins in `src/pages/Login.tsx`.

**Learning:** Developers sometimes hardcode fallback credentials for setup or seeding tasks in client-side code, failing to realize these values are completely visible to anyone inspecting the frontend bundle. Even as a fallback, administrative passwords must never be stored in plaintext.

**Prevention:** Always rely on hashing (e.g., SHA-256 via `window.crypto.subtle`) for fallback credentials, keeping the plaintext version entirely out of source control. Prefix hashes (like `$sha256$`) so verification functions can clearly differentiate and securely compare them against user input without exposing the raw secret.