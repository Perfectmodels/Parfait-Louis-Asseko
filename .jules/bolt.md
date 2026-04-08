## 2024-05-15 - React.memo() vs React.FC typing
**Learning:** Wrapping a component typed as `React.FC` with `React.memo()` returns a `React.NamedExoticComponent`, which conflicts with the explicit `React.FC` return type and causes TypeScript compilation/CI pipeline checks (`tsc --noEmit`) to fail.
**Action:** When memoizing a functional component to optimize repeated renders, always remove the explicit `React.FC` annotation and rely on inline prop typing (e.g., `const MyComponent = React.memo(({ prop }: MyComponentProps) => { ... })`).
