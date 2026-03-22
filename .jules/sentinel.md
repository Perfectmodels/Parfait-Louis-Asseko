## 2024-05-24 - Exposing Hardcoded API Key

**Vulnerability:** A Firebase API key was hardcoded in `src/firebaseConfig.ts` and `firebaseConfig.ts`.
**Learning:** This repo lacked proper environment variable setup to protect API keys.
**Prevention:** Always use `import.meta.env` for accessing secrets and document the need for a `.env` file in the README.
