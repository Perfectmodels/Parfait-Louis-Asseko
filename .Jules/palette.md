## 2026-03-05 - Added proper aria-labels to Header/Footer
**Learning:** Found that social link SVGs and the mobile hamburger menu icon lacked readable screen-reader tags (`aria-label`, `aria-expanded`). Additionally, the Newsletter input form in the Footer lacked an accessible name since it relied only on a visual placeholder.
**Action:** When adding icon-only buttons or forms without explicit visual `<label>` tags, ensure `aria-label` attributes are always included. For interactive toggles like hamburger menus, bind `aria-expanded` to the state.
