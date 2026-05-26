1. **Identify the Bottleneck**: The `getScore` function in `src/pages/JuryContest.tsx` and similar functions in `src/pages/BeautyContest.tsx` and `src/pages/AdminBeautyContest.tsx` use `Array.prototype.find()` or `Array.prototype.filter()` inside deeply nested loops or map operations (O(n²) or worse) for evaluating beauty contest scores.
2. **Optimize with `useMemo`**: Create lookup maps (e.g. `scoresByCandidatePassage`, `passageScoresMap`) using `useMemo` in `JuryContest.tsx` and `BeautyContest.tsx` to pre-calculate and index scores. This transforms O(n) array searches into O(1) Map/Record lookups.
   - In `JuryContest.tsx`:
     ```typescript
     const scoreMap = useMemo(() => {
       const map = new Map<string, Score>();
       scores.forEach(s => map.set(`${s.candidateId}-${s.passageId}`, s));
       return map;
     }, [scores]);
     const getScore = (candidateId: string, passageId: string) => scoreMap.get(`${candidateId}-${passageId}`);
     ```
   - In `BeautyContest.tsx` (for `getAvg` and `getCriteriaAvg`):
     ```typescript
     const scoresByCandidate = useMemo(() => {
       const map = new Map<string, Score[]>();
       scores.forEach(s => {
         if (!map.has(s.candidateId)) map.set(s.candidateId, []);
         map.get(s.candidateId)!.push(s);
       });
       return map;
     }, [scores]);
     ```
3. **Verify Functionality**: Run `pnpm exec tsc --noEmit` and build to ensure types and production readiness are not broken.
4. **Log the Learning**: Create `.jules/bolt.md` with an entry about shifting from `find/filter` inside render loops to `useMemo` hash map lookups.
5. **Commit the Change**: Open a PR presenting the optimizations.
