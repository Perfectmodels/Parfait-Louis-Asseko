## 2024-05-13 - Focus Styles on Toasts
**Learning:** Found that toast close buttons lacked both `aria-label` and `focus-visible` styles, and the `focus-visible` needs to use `ring-current` to adapt to the dynamic colors of success/error/warning states.
**Action:** Always add `aria-label="Fermer la notification"` to toast close buttons and use `focus-visible:ring-current` for colored background elements.
