/// <reference types="vite/client" />

// Typing the VITE_ variables we rely on. Without this they are `any` (vite/client's index signature).
interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string
  readonly VITE_SUPPORT_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
