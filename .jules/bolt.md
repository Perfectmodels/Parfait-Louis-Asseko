## 2024-03-11 - React.FC and React.memo Type Conflict
**Learning:** When wrapping components in `React.memo()` in this application, using the `React.FC` type annotation causes TypeScript compilation (`tsc --noEmit`) to fail because `React.memo()` returns a `React.NamedExoticComponent` which conflicts with `React.FC`.
**Action:** Always remove the explicit `React.FC` type annotation when applying `React.memo()` to components to ensure CI deployment checks pass.
