## 2024-05-18 - Hardcoded Plaintext Admin Password
**Vulnerability:** A hardcoded plaintext admin password ("admin2025") was present in the frontend client (`src/pages/Login.tsx` and `src/hooks/useRealtimeDB.tsx`), exposing full administrative access to anyone inspecting the built bundle.
**Learning:** Hardcoding plaintext credentials in client-side applications allows trivial extraction and account takeover. Fallbacks should never use plaintext secrets, even for convenience or initial setup.
**Prevention:** Always use a cryptographic hash (e.g., SHA-256) for static credentials and ensure authentication logic explicitly verifies the input against the hash to prevent 'pass-the-hash' vulnerabilities.
