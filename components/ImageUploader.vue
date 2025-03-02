<script setup lang="ts">
defineProps<{
  isProcessing: boolean
}>()

const emit = defineEmits<{
  fileSelected: [event: Event]
}>()

// Extract drag and drop handlers from the composable
const { handleDrop, handleDragOver } = useImageUpload()

const isDragging = ref(false)

const handleFileSelect = (event: Event) => {
  emit('fileSelected', event)
}

const onDrop = (event: DragEvent) => {
  isDragging.value = false
  handleDrop(event)
  emit('fileSelected', event)
}

const onDragOver = (event: DragEvent) => {
  isDragging.value = true
  handleDragOver(event)
}

const onDragLeave = () => {
  isDragging.value = false
}
</script>

<template>
  <UCard class="w-full max-w-5xl mx-auto bg-gray-800 text-white border-gray-700 shadow-xl">
    <template #header>
      <div class="text-xl font-semibold text-white py-1">Upload an Image</div>
    </template>
    
    <div 
      class="p-6 border-2 border-dashed rounded-lg text-center bg-gray-800 transition-all duration-200"
      :class="[
        isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600',
        { 'opacity-50 cursor-not-allowed': isProcessing }
      ]"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    >
      <input 
        id="image-upload" 
        type="file" 
        accept="image/*"
        class="hidden"
        :disabled="isProcessing" 
        @change="handleFileSelect"
      >
      <label 
        for="image-upload" 
        class="cursor-pointer block p-12"
        :class="{ 'opacity-50 cursor-not-allowed': isProcessing }"
      >
        <UIcon name="i-heroicons-photo" class="text-7xl mb-4 text-gray-300" />
        <div class="text-xl text-gray-300">Click to select an image or drag and drop</div>
        <div class="text-sm text-blue-300 mt-2">Simple images and illustrations work best</div>
        <div v-if="isDragging" class="text-blue-400 mt-3 font-medium text-lg">Drop to upload</div>
      </label>
    </div>
    
    <template #footer>
      <div class="flex flex-col gap-1">
        <div class="text-sm text-gray-400 py-1">
          Supported formats: JPEG, PNG, WebP, GIF
        </div>
        <div class="text-sm text-gray-400 py-1 flex gap-1 items-center">
          <UIcon name="i-heroicons-information-circle" />
          For best results, use simple images with clear shapes and distinct colors
        </div>
      </div>
    </template>
  </UCard>
</template>
