<script setup>
import { Analytics } from '@vercel/analytics/nuxt'

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ]
})
</script>

<template>
  <Analytics />
  <div class="min-h-screen bg-gray-900 text-white">
    <ImageRecolorApp />
  </div>
</template>
