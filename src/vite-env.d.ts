/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_PASSWORD?: string;
  readonly VITE_RESEND_API_KEY?: string;
  readonly VITE_FORMSPREE_ENDPOINT?: string;
  readonly VITE_FIREBASE_DYNAMIC_LINKS_API_KEY?: string;
  readonly VITE_FIREBASE_DYNAMIC_LINKS_DOMAIN?: string;
  readonly VITE_IMGBB_API_KEY?: string;
  readonly VITE_BREVO_API_KEY?: string;
  readonly VITE_DROPBOX_APP_KEY?: string;
  readonly VITE_DROPBOX_ACCESS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
