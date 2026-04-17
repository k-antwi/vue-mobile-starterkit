/// <reference types="vite/client" />

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
