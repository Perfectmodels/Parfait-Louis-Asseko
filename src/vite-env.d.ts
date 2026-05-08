/// <reference types="vite/client" />

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
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  readonly VITE_CLOUDINARY_API_KEY?: string;
  readonly VITE_CLOUDINARY_API_SECRET?: string;
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_FIREBASE_VAPID_KEY?: string;
  readonly VITE_CHATBOT_ID?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_DATABASE_URL?: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
