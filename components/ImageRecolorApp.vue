<script setup lang="ts">
const { imageUrl, isProcessing, hasImage, handleFileUpload, resetImage } = useImageUpload()

const onFileSelected = (event: Event) => {
  handleFileUpload(event)
}

useSeoMeta({
  title: 'Image Recolor App - Transform Your Images Easily',
  description: 'Easily recolor and transform your images with our intuitive, user-friendly interface. Works best with simple images and illustrations.',
  ogTitle: 'Image Recolor App - Simple & Intuitive UI',
  ogDescription: 'Transform your images with our user-friendly recoloring tool. Simple interface, powerful results. Ideal for simple images and illustrations.',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Image Recolor App - Simple & Intuitive UI',
  twitterDescription: 'Transform your images with our user-friendly recoloring tool. Works best with simple images and illustrations.',
})
</script>

<template>
  <div class="container mx-auto px-8 py-12 max-w-[90rem]">
    <h1 class="text-4xl font-bold text-center mb-8 text-white">Image Recoloring Tool</h1>

    <div v-if="!hasImage">
      <ImageUploader :is-processing="isProcessing" @file-selected="onFileSelected" />
    </div>

    <div v-else-if="imageUrl">
      <ImagePreview :image-url="imageUrl" @reset="resetImage" />
    </div>
  </div>
</template>
