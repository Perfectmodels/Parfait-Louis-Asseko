## 2024-10-25 - Fix plaintext password storage and hardcoded credentials
**Vulnerability:** Admin passwords were hardcoded and stored as plaintext, enabling easy unauthorized access if source code or data was exposed.
**Learning:** Storing and transmitting passwords in plaintext is a critical security vulnerability that compromises authentication integrity.
**Prevention:** Always implement secure hashing algorithms (e.g., SHA-256) when handling passwords. Never store or verify credentials using plaintext comparisons. Ensure that existing plaintext passwords are intentionally handled to maintain backward compatibility during security migrations.
