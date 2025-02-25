import { ref, watch } from 'vue'

export type ColorMap = Map<string, Array<{ x: number; y: number }>>

export function useImageCanvas(imageUrlRef: Ref<string>) {
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const ctx = ref<CanvasRenderingContext2D | null>(null)
  const imageData = ref<ImageData | null>(null)
  const isCanvasReady = ref(false)
  const colorMap = ref<ColorMap>(new Map())
  const colorQuantizationLevel = ref(8) // 8 levels per channel (reduces 16M+ colors to ~4k)

  const loadImageToCanvas = async () => {
    if (!canvasRef.value || !imageUrlRef.value) return

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      if (!canvasRef.value || !ctx.value) return

      canvasRef.value.width = img.width
      canvasRef.value.height = img.height

      ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
      ctx.value.drawImage(img, 0, 0)

      imageData.value = ctx.value.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)

      isCanvasReady.value = true

      generateColorMap()
    }

    img.src = imageUrlRef.value
  }

  const initCanvas = () => {
    if (!canvasRef.value) return

    ctx.value = canvasRef.value.getContext('2d')
    if (imageUrlRef.value) {
      loadImageToCanvas()
    }
  }

  watch(imageUrlRef, () => {
    if (imageUrlRef.value) {
      loadImageToCanvas()
    } else {
      isCanvasReady.value = false
      imageData.value = null
      if (canvasRef.value && ctx.value) {
        ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
      }
    }
  })

  // Helper function to quantize a color value to reduce precision
  const quantizeColor = (value: number, levels: number): number => {
    const step = 256 / levels
    return Math.floor(value / step) * step
  }

  const generateColorMap = () => {
    if (!imageData.value) return

    const newColorMap = new Map<string, Array<{ x: number; y: number }>>()
    const data = imageData.value.data
    const width = imageData.value.width
    const levels = colorQuantizationLevel.value

    for (let y = 0; y < imageData.value.height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4

        // Quantize the RGB values to reduce color precision
        const r = quantizeColor(data[pixelIndex], levels)
        const g = quantizeColor(data[pixelIndex + 1], levels)
        const b = quantizeColor(data[pixelIndex + 2], levels)

        const colorKey = `${r},${g},${b}`

        if (!newColorMap.has(colorKey)) {
          newColorMap.set(colorKey, [])
        }

        newColorMap.get(colorKey)!.push({ x, y })
      }
    }

    colorMap.value = newColorMap
    console.log(`Color map generated with ${newColorMap.size} unique colors`, newColorMap)
  }

  const updateCanvas = (newImageData: ImageData | null = null) => {
    if (!canvasRef.value || !ctx.value) return

    if (newImageData) {
      imageData.value = newImageData
      generateColorMap()
    }

    if (imageData.value) {
      ctx.value.putImageData(imageData.value, 0, 0)
    }
  }

  return {
    canvasRef,
    ctx,
    imageData,
    isCanvasReady,
    colorMap,
    colorQuantizationLevel,
    initCanvas,
    loadImageToCanvas,
    updateCanvas,
    generateColorMap
  }
}
