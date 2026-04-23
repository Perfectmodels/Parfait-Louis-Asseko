## 2024-03-24 - React.memo Optimization
**Learning:** React.FC type declaration combined with React.memo() causes a TypeScript NamedExoticComponent conflict and must be refactored to standard destructuring when memoizing list components.
**Action:** When memoizing functional components, always ensure explicit React.FC types are removed from the outer wrapper.
