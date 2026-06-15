## 2025-05-24 - Insecure Firebase Database Rules
**Vulnerability:** The Firebase Realtime Database and Firestore rules were globally permissive, allowing unauthenticated users to read and write all data.
**Learning:** Development rules that allow public read/write access (`allow read, write: if true;` or `".write": true`) were left active in the repository, posing a critical risk of data tampering and unauthorized access.
**Prevention:** Always ensure production security rules require authentication (`auth != null` or `request.auth != null`) for write operations before committing rules files to the repository.
