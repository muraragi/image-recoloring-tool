import { ref, watch, computed } from 'vue'
import { hexToRgb } from '~/utils/colorUtils'
import { processColorChange } from '~/utils/imageProcessing'
import { useImageCanvas } from '~/composables/useImageCanvas'

export function useImageProcessing(imageUrl: string) {
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

  const applyColorChange = async (originalColorKey: string, newColorHex: string) => {
    if (!imageData.value) return
    
    const { r, g, b } = hexToRgb(newColorHex)
    const pixelsToUpdate = colorMap.value.get(originalColorKey) || []
    const baseImageData = lastProcessedImageData.value || originalImageData.value || imageData.value

    const newImageData = await processColorChange(
      baseImageData,
      pixelsToUpdate,
      { r, g, b }
    )

    updateCanvas(newImageData)
    lastProcessedImageData.value = newImageData
  }

  return {
    applyColorChange,
    canvasRef,
    isCanvasReady,
    initCanvas,
    colorMap
  }
} 