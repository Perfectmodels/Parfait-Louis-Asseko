
## $(date +%Y-%m-%d) - Prevent Hardcoded AI API Keys on the Client Side
**Vulnerability:** A hardcoded `process.env.API_KEY` was exposed or intended for use directly in frontend components (e.g., `src/components/AIAssistant.tsx`, `src/components/ArticleGenerator.tsx`). Although relying on an environment variable, using this via `process.env` in the Vite client build either crashes or leaks the API key into the client bundle if incorrectly substituted, exposing sensitive Gemini API credentials.
**Learning:** React/Vite applications should never handle sensitive API keys (like Google Generative AI keys) directly on the client side because the bundle is public. Serverless functions or backend proxies should be used instead.
**Prevention:** Always proxy AI API requests through a serverless backend function (e.g., `/api/...`) using secure environment variables. Never use `import.meta.env.VITE_...` for private keys like `GEMINI_API_KEY` and ensure all AI generation code resides safely on the server.

## $(date +%Y-%m-%d) - Secure Hashing for Fallback Admin Password
**Vulnerability:** The default fallback admin password (`admin2025`) was hardcoded in plaintext within `src/hooks/useRealtimeDB.tsx` and validated directly in plaintext in `src/pages/Login.tsx`. This exposed the root administrative password in source control and client-side code.
**Learning:** Even default fallback credentials should be hashed when populated into a mock or fallback database. The login flow must be able to recognize and safely compare these hashes (using `window.crypto.subtle.digest`) rather than exposing plaintext comparisons.
**Prevention:** Always initialize fallback or seed database credentials using secure hashes (e.g., SHA-256). Ensure authentication mechanisms support prefixed hash comparisons (`$sha256$...`) and correctly hash user input at login before comparison.
