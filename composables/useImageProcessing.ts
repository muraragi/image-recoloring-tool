import { ref, watch, computed } from 'vue'
import { hexToRgb } from '~/utils/colorUtils'
import { processColorChangeAsync } from '~/utils/imageProcessing'
import { useImageCanvas } from '~/composables/useImageCanvas'

export function useImageProcessing(imageUrl: string) {
  const isProcessing = ref(false)
  const processingProgress = ref(0)
  const originalImageData = ref<ImageData | null>(null)
  const lastProcessedImageData = ref<ImageData | null>(null)

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
    }
  }, { immediate: true })

  const applyColorChange = (originalColorKey: string, newColorHex: string, isPreview: boolean) => {
    if (!imageData.value) return
    const { r, g, b } = hexToRgb(newColorHex)
    const pixelsToUpdate = colorMap.value.get(originalColorKey) || []
    const pixelsToProcess = isPreview 
      ? pixelsToUpdate.filter((_, i) => i % 10 === 0)
      : pixelsToUpdate
    const baseImageData = lastProcessedImageData.value || originalImageData.value || imageData.value

    if (isPreview) {
      const newImageData = new ImageData(
        new Uint8ClampedArray(baseImageData.data),
        baseImageData.width,
        baseImageData.height
      )
      for (const pixel of pixelsToProcess) {
        const pixelIndex = (pixel.y * newImageData.width + pixel.x) * 4
        newImageData.data[pixelIndex] = r
        newImageData.data[pixelIndex + 1] = g
        newImageData.data[pixelIndex + 2] = b
      }
      updateCanvas(newImageData)
      isProcessing.value = false
    } else {
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