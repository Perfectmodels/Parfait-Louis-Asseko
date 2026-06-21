## 2024-10-25 - Securing Firebase Rules
**Vulnerability:** Firebase Realtime Database and Firestore rules were set to globally permissive development mode (`allow read, write: if true;`), allowing any unauthenticated user to read, modify, or delete all data in the database.
**Learning:** Development rules were left active in the codebase, posing a critical risk of complete database compromise, data loss, data tampering, and unauthorized access.
**Prevention:** Always verify and enforce production rules requiring admin authentication (`auth != null` and `request.auth.token.admin == true`) for write access across both databases before deploying or keeping the code in the repository.
