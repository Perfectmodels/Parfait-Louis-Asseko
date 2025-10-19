/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID: string
  readonly VITE_RESEND_API_KEY: string
  readonly VITE_FORMSPREE_ENDPOINT: string
  readonly VITE_IMGBB_API_KEY: string
  readonly VITE_STORACHA_API_KEY: string
  readonly VITE_DDOWNLOAD_API_KEY: string
  readonly VITE_GOOGLE_AI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}