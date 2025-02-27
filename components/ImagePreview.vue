<script setup lang="ts">
import { onMounted } from 'vue'
import { useImageCanvas } from '~/composables/useImageCanvas'
import { useDirectColorProcessing } from '~/composables/useDirectColorProcessing'
import { useImageDownload } from '~/composables/useImageDownload'
import { useColorSelection } from '~/composables/useColorSelection'
import { hexToRgb } from '~/utils/colorUtils'

const props = defineProps<{
  imageUrl: string
}>()

const emit = defineEmits<{
  reset: []
}>()

const isProcessing = ref(false)

const handleReset = () => {
  emit('reset')
}

const { downloadCanvasAsImage } = useImageDownload()

const handleDownload = () => {
  if (!canvasRef.value) return
  downloadCanvasAsImage(canvasRef.value, 'recolored-image.png')
}

const { 
  canvasRef, 
  isCanvasReady, 
  initCanvas,
  imageData,
  updateCanvas,
  canUndo,
  saveToHistory,
  undo
} = useImageCanvas(computed(() => props.imageUrl))

const {
  quantizedColors,
  applyColorChange
} = useDirectColorProcessing(imageData)

const { resetSelection } = useColorSelection()

onMounted(() => {
  initCanvas()
})

const handleUndo = () => {
  undo(resetSelection)
}

const handleColorChanged = async (
  originalColor: { r: number, g: number, b: number },
  newColorHex: string,
  includeSimilar: boolean,
  similarityThreshold: number
) => {
  isProcessing.value = true
  
  saveToHistory()
  
  const newColor = hexToRgb(newColorHex)
  const newImageData = await applyColorChange(
    originalColor,
    newColor,
    includeSimilar,
    similarityThreshold,
    (progress) => {
      processingProgress.value = progress
    }
  )
  if (newImageData) {
    updateCanvas(newImageData)
  }
  isProcessing.value = false
}

const processingProgress = ref(0)
</script>

<template>
  <div class="max-w-[90rem] mx-auto grid grid-cols-[1fr_400px]">
    <UCard class="bg-gray-800 border-gray-700 rounded-r-none overflow-hidden shadow-xl">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="text-xl font-medium text-white">Image Preview</div>
          <div class="flex items-center gap-2">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-uturn-left"
              size="md"
              :disabled="!canUndo || isProcessing"
              aria-label="Undo changes"
              @click="handleUndo"
            />
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-down-tray"
              size="md"
              :disabled="!isCanvasReady || isProcessing"
              aria-label="Download image"
              @click="handleDownload"
            />
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              size="md"
              aria-label="Close preview"
              @click="handleReset"
            />
          </div>
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
    </UCard>

    <UCard class="bg-gray-800 border-gray-700 !rounded-l-none shadow-xl h-full">
      <template #header>
        <div class="text-xl font-medium text-white py-1">Color Editor</div>
      </template>
      <ColorPicker
        :colors="quantizedColors"
        @color-changed="handleColorChanged"
      />
    </UCard>
  </div>
</template>
