## 2024-10-26 - Critical: Unrestricted Database Write Access
**Vulnerability:** Both Realtime Database and Firestore had development rules active (`.write: true` and `allow read, write: if true;`), allowing any unauthenticated user full write/delete access to all production data.
**Learning:** Default Firebase configurations often start with open rules for ease of development, but failing to lock them down before deploying exposes the entire database to critical manipulation and data loss.
**Prevention:** Always ensure `firestore.rules` and `database.rules.json` require authentication (`request.auth != null`) for write operations and strictly implement least-privilege access controls before pushing to production.
