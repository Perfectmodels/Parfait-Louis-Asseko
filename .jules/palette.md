## 2024-06-14 - Ajout aria-label aux icônes seules
**Learning:** Les boutons contenant uniquement une icône (comme `<CloseIcon />`) dans des composants génériques de modales (ex: AIAssistant) ne sont pas lus correctement par les lecteurs d écran sans un attribut explicite.
**Action:** Toujours ajouter un `aria-label` aux boutons qui ne contiennent pas de texte visible pour s assurer qu ils restent accessibles.
