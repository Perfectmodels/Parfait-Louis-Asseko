## 2026-04-08 - React.memo Optimization and React.FC
**Learning:** When wrapping components typed with `React.FC` in `React.memo()`, the explicit `React.FC` type annotation must be removed. `React.memo()` returns a `React.NamedExoticComponent`, which conflicts with `React.FC` and can cause TypeScript compilation and CI deployment checks (`tsc --noEmit`) to fail.
**Action:** Remove `React.FC` and directly type the props in the function arguments when adding `React.memo()` to an existing component.
