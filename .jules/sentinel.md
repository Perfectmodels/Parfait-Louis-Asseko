## 2024-06-24 - Unauthenticated Firebase Database Access
**Vulnerability:** Firestore and Realtime Database rules were configured with globally permissive development rules (`allow read, write: if true;`), allowing anyone to read and write all database contents.
**Learning:** Development environments often leave databases fully open for convenience, but these configurations are dangerous if left active in a production or publicly accessible repository.
**Prevention:** Always ensure production security rules are enforced in the main branch and require authentication for write operations.
