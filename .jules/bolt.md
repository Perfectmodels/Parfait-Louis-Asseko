## 2024-03-23 - React.memo and React.FC Type Conflict
**Learning:** When using `React.memo()` on components previously typed with `React.FC` in this codebase, TypeScript compilation checks (`tsc --noEmit`) will fail because `React.memo()` returns a `React.NamedExoticComponent` which conflicts with `React.FC`.
**Action:** Always remove the explicit `React.FC` type annotation when wrapping an existing component in `React.memo()`. Let TypeScript infer the return type or use `(props: ComponentProps) => JSX.Element` if explicit typing is needed.
