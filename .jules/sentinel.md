## 2025-03-04 - Unrestricted Database Rules
**Vulnerability:** Development database rules were deployed and active, granting public read and write access to all firestore collections and the Realtime Database.
**Learning:** Default or development rules are frequently committed during the early stages of a project and overlooked before going to production, creating severe data exposure and tampering risks.
**Prevention:** Always verify `firestore.rules` and `database.rules.json` for proper authentication and authorization checks before committing security-sensitive configuration files, and establish a strict deny-by-default baseline.
