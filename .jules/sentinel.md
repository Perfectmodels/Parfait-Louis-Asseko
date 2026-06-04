## 2024-05-24 - [CRITICAL] Fix Hardcoded Admin Password

**Vulnerability:** A hardcoded, plaintext admin password (`admin2025`) was present in both `src/hooks/useRealtimeDB.tsx` and `src/pages/Login.tsx`. This exposed the primary administrative credential in the frontend source code and client-side memory, allowing any user with access to the source code to log in as the administrator.

**Learning:** Initializing the default administrator profile in the application's default state and fallback authentication logic with plaintext passwords introduces a critical security risk. Frontend applications should not handle or store plaintext administrative passwords directly in source code.

**Prevention:** Always use securely hashed passwords (e.g., SHA-256) when seeding default administrative accounts. Implement client-side hashing if transferring the hash to the server for authentication or comparison. Provide fallback mechanisms that maintain security if web cryptography APIs are unavailable.
