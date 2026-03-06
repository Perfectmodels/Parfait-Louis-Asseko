## 2024-05-20 - Hardcoded Admin Password Removal
**Vulnerability:** The admin password was hardcoded in the source code as `admin2025` inside `Login.tsx` and `useRealtimeDB.tsx`.
**Learning:** Hardcoding credentials exposes sensitive information to anyone with access to the source code, leading to unauthorized access.
**Prevention:** Use environment variables (e.g., `import.meta.env.VITE_ADMIN_PASSWORD`) to store secrets and ensure they are not committed to version control. Set fallback values securely where applicable.
