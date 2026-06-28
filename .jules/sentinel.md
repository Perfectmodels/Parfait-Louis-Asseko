## 2024-06-28 - Unrestricted Database Write Access
**Vulnerability:** Firebase Realtime Database and Firestore security rules were configured to allow public write access without any authentication.
**Learning:** Incomplete transitions from development to production environments can leave database rules dangerously permissive, exposing the entire database to unauthorized modification or deletion.
**Prevention:** Always verify Firebase security rules (`database.rules.json`, `firestore.rules`) before deployment to ensure production-level authentication checks (`auth != null`, `request.auth != null`) are enforced.
