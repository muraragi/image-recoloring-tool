import { ref, watch, computed } from 'vue'
import { hexToRgb } from '~/utils/colorUtils'
import { processColorChange } from '~/utils/imageProcessing'
import { useImageCanvas } from '~/composables/useImageCanvas'

export function useImageProcessing(imageUrl: string) {
  const originalImageData = ref<ImageData | null>(null)
  const lastProcessedImageData = ref<ImageData | null>(null)
  const processingProgress = ref(0)

  const {
    canvasRef,
    isCanvasReady,
    initCanvas,
    colorMap,
    imageData,
    updateCanvas,
    generateColorMap
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

  const applyColorChange = async (originalColorKey: string, newColorHex: string) => {
    if (!imageData.value) return
    
    const { r, g, b } = hexToRgb(newColorHex)
    const pixelsToUpdate = colorMap.value[originalColorKey] || []
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
    generateColorMap()
  }

  return {
    applyColorChange,
    canvasRef,
    isCanvasReady,
    initCanvas,
    colorMap,
    processingProgress
  }
} 