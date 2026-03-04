## 2026-03-04 - App out-of-the-box build state
**Learning:** The out-of-the-box `pnpm build` fails due to many missing dependencies/files (like `utils/pwa`, `pages/ModelDetail`).
**Action:** When attempting to verify changes in this codebase, rely on `pnpm dev` to check for obvious runtime errors rather than fighting the broken `pnpm build` unless the task specifically calls for fixing the build.
