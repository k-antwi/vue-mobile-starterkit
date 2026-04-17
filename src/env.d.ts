/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'framework7/lite-bundle'
declare module 'framework7/lite'
declare module 'framework7-vue/bundle'
declare module 'framework7-vue'
declare module 'konsta/vue'
