## 2024-10-25 - Secure Firebase Rules Activation
**Vulnerability:** Firebase Realtime Database and Firestore were configured with globally permissive development rules (`".write": true` and `allow read, write: if true;`), allowing unauthorized public write access to sensitive data collections.
**Learning:** The development rules were left active instead of the production rules, highlighting the risk of deploying with overly permissive configurations.
**Prevention:** Ensure production rules are strictly enforced and require proper authentication (e.g., `auth != null`) before deploying Firebase applications.
