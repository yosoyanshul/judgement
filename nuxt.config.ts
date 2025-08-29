// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-08-29',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui'
  ],
  css: ['~/assets/css/main.css'],
  ssr: false, // Enable SPA mode for GitHub Pages
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  app: {
    baseURL: '/', // Custom domain uses root path
    head: {
      title: 'Judgement Card Game',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Play the classic Judgement card game online' }
      ]
    }
  }
})
