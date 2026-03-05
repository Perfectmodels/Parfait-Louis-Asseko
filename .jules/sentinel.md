## 2024-05-24 - [Remove Hardcoded Firebase API Keys]
**Vulnerability:** Found hardcoded Firebase configuration values, including the API key, embedded directly in source files (`src/firebaseConfig.ts`, `src/realtimedbConfig.ts`).
**Learning:** Hardcoding sensitive configuration in source files exposes them to version control and anyone with read access to the repository, potentially leading to unauthorized access and abuse of cloud resources.
**Prevention:** Use environment variables (e.g., `import.meta.env.VITE_FIREBASE_*`) to inject configuration at build/runtime. Provide a `.env.example` file to document the required environment variables without committing actual secrets.
