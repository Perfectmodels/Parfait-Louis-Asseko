## 2024-05-27 - Hardcoded Plaintext Fallback Password
**Vulnerability:** A fallback admin password was hardcoded in plaintext within the source code.
**Learning:** Hardcoding plaintext credentials, even as fallbacks, exposes them to anyone with access to the source code or the client-side bundle.
**Prevention:** Always use securely stored cryptographic hashes (e.g., SHA-256) instead of plaintext for client-side credential fallbacks, and ensure mutually exclusive hash comparisons.
