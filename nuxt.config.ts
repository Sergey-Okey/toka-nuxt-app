// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: [
    '@/assets/styles/main.scss',
    '@/assets/styles/base.scss',
    'material-icons/iconfont/material-icons.css',
  ],
  components: true,
  modules: ['@pinia/nuxt', '@primevue/nuxt-module'],
  build: {},
  plugins: [],
})
