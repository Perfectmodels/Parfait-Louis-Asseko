## 2024-06-05 - Plaintext Admin Password Storage

**Vulnerability:** The application stores the default admin password (`admin2025`) and updates to the admin password in plaintext within the fallback initialization data (`src/hooks/useRealtimeDB.tsx`), default login credentials (`src/pages/Login.tsx`), and Realtime Database records (via `saveProfile` in `src/pages/Admin.tsx`).
**Learning:** Storing authentication credentials in plaintext allows anyone with access to the source code or database (even with restricted or read-only access) to immediately compromise the primary administrator account, escalating privileges across the entire system.
**Prevention:** Always hash passwords (e.g., using SHA-256 via `window.crypto.subtle.digest`) before storing them in code, memory, or databases. Compare user input against the hash during authentication rather than verifying plaintext strings directly.
