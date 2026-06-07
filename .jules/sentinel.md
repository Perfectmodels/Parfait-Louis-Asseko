## 2025-02-14 - Secure Admin Authentication
**Vulnerability:** Admin passwords were hardcoded in plaintext and stored in plaintext in the database.
**Learning:** Storing and transmitting passwords in plaintext is a critical security vulnerability that allows easy compromise.
**Prevention:** Always hash passwords securely before storing them, and do not hardcode credentials in source code.