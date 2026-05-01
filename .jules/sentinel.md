## 2024-05-24 - Plaintext Admin Credentials
**Vulnerability:** Default admin credentials and test credentials were hardcoded in plaintext in `Login.tsx` and `useRealtimeDB.tsx`.
**Learning:** Hardcoding plaintext credentials allows attackers with source access to instantly compromise administrative accounts. It also leaves these default records in plaintext in the database initial state.
**Prevention:** Always use secure hashing algorithms (like SHA-256) even for fallback or default administrative credentials before checking them or writing defaults to the database.
