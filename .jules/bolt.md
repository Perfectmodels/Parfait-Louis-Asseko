
## 2024-05-24 - React.FC and React.memo() type conflict
**Learning:** When wrapping components typed with `React.FC` in `React.memo()`, the explicit `React.FC` type annotation must be removed. `React.memo()` returns a `React.NamedExoticComponent`, which conflicts with `React.FC` and causes TypeScript compilation and CI deployment checks (`tsc --noEmit`) to fail.
**Action:** Always remove the explicit `React.FC` and use inline prop typing (`const Component = React.memo(({ prop1 }: Props) => { ... })`) when adding memoization to a React component in this codebase.
