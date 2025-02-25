// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxtjs/seo'],
  
  app: {
    head: {
      title: 'Image Recoloring Tool',
      meta: [
        { name: 'description', content: 'A tool to recolor and transform images' }
      ]
    }
  }
})