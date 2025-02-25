<script setup lang="ts">
const { imageUrl, isProcessing, hasImage, handleFileUpload, resetImage } = useImageUpload()

const onFileSelected = (event: Event) => {
  handleFileUpload(event)
}

useHead({
  title: 'Image Recolor App - Transform Your Images',
  meta: [
    {
      name: 'description',
      content: 'Easily recolor and transform your images with our intuitive tool'
    }
  ]
})
</script>

<template>
  <div class="container mx-auto px-6 py-10 max-w-7xl">
    <h1 class="text-4xl font-bold text-center mb-8 text-white">Image Recoloring Tool</h1>

    <div v-if="!hasImage">
      <ImageUploader :is-processing="isProcessing" @file-selected="onFileSelected" />
    </div>

    <div v-else-if="imageUrl">
      <ImagePreview :image-url="imageUrl" @reset="resetImage" />
    </div>
  </div>
</template>
