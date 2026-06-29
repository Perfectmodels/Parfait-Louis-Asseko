## 2024-10-25 - Secure Admin Password Storage
**Vulnerability:** Admin passwords were saved in plaintext, and the login logic ignored the stored data.adminProfile, making password updates ineffective.
**Learning:** Hardcoded credentials and plaintext storage leave the system vulnerable, and disconnected logic between profile updates and login validation causes security features (like changing a password) to fail silently.
**Prevention:** Always hash passwords before storing them (e.g., using Web Crypto API), ensure authentication sources point to the stored profile rather than hardcoded objects, and explicitly await crypto digest operations before checking credentials.
