## 2024-06-26 - Fix Overly Permissive Firebase Rules
**Vulnerability:** Firebase Realtime Database and Firestore rules were globally configured with `.write: true` and `allow read, write: if true;`, respectively.
**Learning:** The application was deployed with permissive development rules active, allowing unauthenticated users full read/write access to all database collections.
**Prevention:** Ensure development rules are commented out and production rules (which validate `request.auth` and `request.auth.token.admin`) are activated prior to any production deployment.
