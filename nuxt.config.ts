// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'shadcn-nuxt',
    '@nuxt/icon',
    '@nuxt/fonts'
  ],
  tailwindcss: {
    configPath: 'tailwind.config.js',
    cssPath: 'assets/scss/main.scss',
    exposeConfig: false,
    viewer: false,
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage',
    storageKey: 'nuxt-color-mode',
  },
  fonts: {
    defaults: {
      weights: [400, 700],
      styles: ["normal", "italic"],
    },
    families: [
      {
        name: "Roboto",
        provider: "google",
      },
    ],
  },
  runtimeConfig: {
    public: {
      appTitle: process.env.APP_TITLE ?? 'Nwuxt',
      apiUrl: process.env.API_URL 
    }
  }
})