## 2024-05-18 - Admin Hardcoded Plaintext Password
**Vulnerability:** A hardcoded, plaintext fallback admin password existed in hooks and was compared in plaintext during login.
**Learning:** Legacy deployments relied on this fallback; transitioning to hashing requires backwards-compatible logic with a `$sha256$` prefix to avoid locking out non-admin users still on plaintext.
**Prevention:** Implement client-side hashing for new admin passwords and fallback securely.
