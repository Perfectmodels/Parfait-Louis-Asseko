1.  **Analyze Current Bottleneck:**
    *   In `src/pages/BeautyContest.tsx`, `ContestView` renders a list of `candidates`.
    *   For each candidate, it computes averages via `getAvg(c.id)` and passage breakdowns.
    *   `getAvg` calls `scores.filter(s => s.candidateId === candidateId)` and maps/reduces over the subset. This is O(N) where N is the total number of scores.
    *   If there are many candidates, many juries, and many criteria/passages, calculating this dynamically during render (`ranked` array sorting and mapping inside JSX) scales poorly, resulting in O(C * S * K) time complexity where C=candidates, S=scores, K=criteria.
    *   The `useMemo` hook is missing. All this expensive filtering and calculation runs on *every render* (e.g., toggling stages or view modes).
2.  **Implementation Details:**
    *   Modify `src/pages/BeautyContest.tsx` to memoize the scores array grouped by `candidateId` and `passageId`.
    *   Wrap `ranked` sorting and derived average calculations in `useMemo`.
    *   Update `ContestView` component.
    *   Modify the file via a patch or replace block.
3.  **Run Tests/Type checks:**
    *   Run `pnpm exec tsc --noEmit` and `pnpm build` to verify no breaking changes.
4.  **Complete pre commit steps:**
    *   Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
5.  **Submit PR:**
    *   Create PR with Title, Description covering the optimization.
