import { ref, watch, computed } from 'vue'
import { hexToRgb } from '~/utils/colorUtils'
import { processColorChangeAsync, createColorReplacedImageData } from '~/utils/imageProcessing'
import { useImageCanvas } from '~/composables/useImageCanvas'

export function useImageProcessing(imageUrl: string) {
  const isProcessing = ref(false)
  const processingProgress = ref(0)
  const originalImageData = ref<ImageData | null>(null)
  const lastProcessedImageData = ref<ImageData | null>(null)
  const previewImageData = ref<ImageData | null>(null)

  const {
    canvasRef,
    isCanvasReady,
    initCanvas,
    colorMap,
    imageData,
    updateCanvas
  } = useImageCanvas(computed(() => imageUrl))

  watch(imageData, (newImageData) => {
    if (newImageData) {
      originalImageData.value = new ImageData(
        new Uint8ClampedArray(newImageData.data),
        newImageData.width,
        newImageData.height
      )
      previewImageData.value = new ImageData(
        new Uint8ClampedArray(newImageData.data),
        newImageData.width,
        newImageData.height
      )
    }
  }, { immediate: true })

  const applyColorChange = (originalColorKey: string, newColorHex: string, isPreview: boolean) => {
    if (!imageData.value) return
    const { r, g, b } = hexToRgb(newColorHex)
    const pixelsToUpdate = colorMap.value.get(originalColorKey) || []
    const baseImageData = lastProcessedImageData.value || originalImageData.value || imageData.value

    if (isPreview) {
      // For preview, update all pixels immediately in the main thread
      // since we're working with a separate preview buffer
      const newImageData = createColorReplacedImageData(
        baseImageData,
        pixelsToUpdate,
        { r, g, b }
      )
      previewImageData.value = newImageData
      updateCanvas(newImageData)
      isProcessing.value = false
    } else {
      isProcessing.value = true
      processColorChangeAsync(
        baseImageData,
        pixelsToUpdate,
        { r, g, b },
        (progress) => {
          processingProgress.value = progress
        },
        (newImageData) => {
          updateCanvas(newImageData)
          lastProcessedImageData.value = newImageData
          previewImageData.value = new ImageData(
            new Uint8ClampedArray(newImageData.data),
            newImageData.width,
            newImageData.height
          )
          isProcessing.value = false
          processingProgress.value = 0
        }
      )
    }
  }

  return {
    isProcessing,
    processingProgress,
    applyColorChange,
    canvasRef,
    isCanvasReady,
    initCanvas,
    colorMap
  }
} 