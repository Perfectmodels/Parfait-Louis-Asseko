## 2024-10-25 - Hashed Admin Credentials
**Vulnerability:** Hardcoded and plaintext admin password stored in code and database.
**Learning:** Hardcoding credentials makes them vulnerable to source code exposure, and storing them in plaintext leaves them vulnerable to database breaches.
**Prevention:** Use SHA-256 hashing (or stronger) and avoid hardcoding fallback credentials in plaintext.
