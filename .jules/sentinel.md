## 2025-05-31 - Initial Security Review
**Vulnerability:** Initial run, reviewing existing issues.
**Learning:** Found several hardcoded API keys.
**Prevention:** Avoid hardcoding keys.
## 2025-05-31 - Remove Hardcoded Secrets
**Vulnerability:** Hardcoded API keys found in codebase files.
**Learning:** Hardcoding API keys exposes them to version control and potential unauthorized access. Using environment variables is the standard prevention.
**Prevention:** Always use environment variables for keys and credentials.
