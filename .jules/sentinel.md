## 2024-05-24 - Default Firestore Rules Left in Insecure Development Mode
**Vulnerability:** The `firestore.rules` file was actively using globally permissive development rules (`allow read, write: if true;`), exposing the database to unauthorized access, while the secure production rules requiring admin authentication for sensitive endpoints were commented out.
**Learning:** Default development configurations with `allow read, write: if true` are frequently left active when deploying to production, creating a critical data exposure risk.
**Prevention:** Always verify and enforce strict production rules (e.g., checking `request.auth.token.admin`) before finalizing database schema setups, ensuring development rules are explicitly commented out or removed prior to commits.
