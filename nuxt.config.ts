// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxtjs/seo'],
  
  site: {
    url: 'https://image-recoloring-tool.vercel.app/',
    name: 'Image Recoloring Tool',
    description: 'Transform your images with our user-friendly recoloring tool. Simple interface, powerful results. Works best with simple images and illustrations.',
    defaultLocale: 'en',
  },
  
  ogImage: {
    enabled: true,
  },
  
  sitemap: {
    enabled: true,
  },
  
  robots: {
    enabled: true,
  },
  
  app: {
    head: {
      title: 'Image Recoloring Tool - Simple & Intuitive UI',
      meta: [
        { name: 'description', content: 'Transform your images with our user-friendly recoloring tool. Simple interface, powerful results. Works best with simple images and illustrations.' },
        { name: 'keywords', content: 'image recolor, photo editor, simple UI, user-friendly, image transformation, simple images, illustrations' }
      ]
    }
  }
})