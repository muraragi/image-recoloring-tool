import { ref, watch } from 'vue'

export function useImageCanvas(imageUrlRef: Ref<string>) {
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const ctx = ref<CanvasRenderingContext2D | null>(null)
  const imageData = ref<ImageData | null>(null)
  const isCanvasReady = ref(false)

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

  const updateCanvas = (newImageData: ImageData | null = null) => {
    if (!canvasRef.value || !ctx.value) return

    if (newImageData) {
      imageData.value = newImageData
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
    initCanvas,
    loadImageToCanvas,
    updateCanvas
  }
}
