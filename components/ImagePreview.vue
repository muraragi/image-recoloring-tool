<script setup lang="ts">
import { onMounted } from 'vue'
import { useImageCanvas } from '~/composables/useImageCanvas'
import { hexToRgb } from '~/utils/colorUtils'
import { processColorChange } from '~/utils/imageProcessing'

const props = defineProps<{
  imageUrl: string
}>()

const emit = defineEmits<{
  reset: []
}>()

const isProcessing = ref(false)
const processingProgress = ref(0)

const handleReset = () => {
  emit('reset')
}

const { 
  canvasRef, 
  isCanvasReady, 
  initCanvas, 
  colorMap,
  imageData,
  updateCanvas
} = useImageCanvas(
  computed(() => props.imageUrl)
)

onMounted(() => {
  initCanvas()
})

// Store original image data to allow for quick resets
const originalImageData = ref<ImageData | null>(null)

// Store the last processed image data for performance
const lastProcessedImageData = ref<ImageData | null>(null)

// Watch for when image data is ready and store a copy
watch(imageData, (newImageData) => {
  if (newImageData) {
    originalImageData.value = new ImageData(
      new Uint8ClampedArray(newImageData.data),
      newImageData.width,
      newImageData.height
    )
  }
}, { immediate: true })

const handleColorChanged = async (originalColorKey: string, newColorHex: string) => {
  if (!imageData.value) return
  
  isProcessing.value = true
  processingProgress.value = 0
  
  const { r, g, b } = hexToRgb(newColorHex)
  const pixelsToUpdate = colorMap.value.get(originalColorKey) || []
  const baseImageData = lastProcessedImageData.value || originalImageData.value || imageData.value

  const newImageData = await processColorChange(
    baseImageData,
    pixelsToUpdate,
    { r, g, b },
    (progress) => {
      processingProgress.value = progress
    }
  )

  updateCanvas(newImageData)
  lastProcessedImageData.value = newImageData
  isProcessing.value = false
  processingProgress.value = 0
}
</script>

<template>
  <div class="max-w-[90rem] mx-auto grid grid-cols-[1fr_400px]">
    <UCard class="bg-gray-800 border-gray-700 rounded-r-none overflow-hidden shadow-xl">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="text-xl font-medium text-white">Image Preview</div>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="md"
            aria-label="Close preview"
            @click="handleReset"
          />
        </div>
      </template>

      <div class="relative bg-gray-900 flex justify-center">
        <canvas ref="canvasRef" class="max-w-full max-h-[70vh] object-contain py-6" />

        <div v-if="!isCanvasReady" class="absolute inset-0 flex items-center justify-center bg-black/30">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin h-10 w-10 text-gray-400" />
        </div>
        
        <div v-if="isProcessing" class="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin h-10 w-10 text-gray-400 mb-2" />
          <div class="text-sm text-gray-200">Processing image...</div>
          <UProgress v-if="processingProgress > 0" class="mt-2 w-1/2" :value="processingProgress * 100" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end items-center py-2">
          <UButton
            color="black"
            icon="i-heroicons-arrow-path"
            label="Upload new"
            size="lg"
            @click="handleReset"
          />
        </div>
      </template>
    </UCard>

    <UCard class="bg-gray-800 border-gray-700 !rounded-l-none shadow-xl h-full">
      <template #header>
        <div class="text-xl font-medium text-white py-1">Color Editor</div>
      </template>
      <ColorPicker
        :color-map="colorMap"
        @color-changed="handleColorChanged"
      />
    </UCard>
  </div>
</template>
