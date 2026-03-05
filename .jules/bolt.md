## 2024-05-17 - Missing lazy loading on critical image components
**Learning:** `ModelCard` is used heavily on pages listing multiple models (like Home or Models page), but it's missing native lazy loading for the images. This impacts performance for pages with many items.
**Action:** Adding `loading="lazy"` attribute to heavy grid elements such as `img` inside `ModelCard.tsx`.
