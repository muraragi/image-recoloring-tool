import { ref, watch, computed } from 'vue'

export function useImageCanvas(imageUrlRef: Ref<string>) {
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const ctx = ref<CanvasRenderingContext2D | null>(null)
  const imageData = ref<ImageData | null>(null)
  const isCanvasReady = ref(false)
  
  // History stack for undo functionality
  const imageHistory = ref<ImageData[]>([])
  const canUndo = computed(() => imageHistory.value.length > 0)

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
      
      // Clear history when loading a new image
      imageHistory.value = []
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
      imageHistory.value = []
      if (canvasRef.value && ctx.value) {
        ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
      }
    }
  })

  // Save current state to history
  const saveToHistory = () => {
    if (!imageData.value) return
    
    const currentImageData = new ImageData(
      new Uint8ClampedArray(imageData.value.data),
      imageData.value.width,
      imageData.value.height
    )
    imageHistory.value.push(currentImageData)
  }
  
  // Undo to previous state
  const undo = (onUndo?: () => void) => {
    if (!canUndo.value) {
      console.log('Cannot undo: history is empty')
      return
    }
    
    console.log('Undoing, history length:', imageHistory.value.length)
    const previousImageData = imageHistory.value.pop()
    if (previousImageData) {
      console.log('Applying previous image data')
      updateCanvas(previousImageData)
      
      // Call the callback function if provided
      if (onUndo) {
        console.log('Calling onUndo callback')
        onUndo()
        console.log('onUndo callback completed')
      }
    }
  }

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
    updateCanvas,
    imageHistory,
    canUndo,
    saveToHistory,
    undo
  }
}
