/**
 * Creates a new ImageData object by applying a color replacement
 * 
 * @param imageData The source image data
 * @param pixelsToUpdate Array of pixel coordinates to update
 * @param newColor New RGB color values
 * @returns New ImageData with updated pixels
 */
export function createColorReplacedImageData(
  imageData: ImageData,
  pixelsToUpdate: Array<{ x: number; y: number }>,
  newColor: { r: number; g: number; b: number }
): ImageData {
  // Create a copy of the image data
  const newImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  )
  
  // Destructure for performance
  const { r, g, b } = newColor
  const { width } = newImageData
  const data = newImageData.data
  
  // Batch processing for better performance
  const batchSize = 1000
  const totalPixels = pixelsToUpdate.length
  
  for (let i = 0; i < totalPixels; i += batchSize) {
    const end = Math.min(i + batchSize, totalPixels)
    
    // Process a batch of pixels
    for (let j = i; j < end; j++) {
      const pixel = pixelsToUpdate[j]
      const pixelIndex = (pixel.y * width + pixel.x) * 4
      
      data[pixelIndex] = r
      data[pixelIndex + 1] = g
      data[pixelIndex + 2] = b
    }
  }
  
  return newImageData
}

let worker: Worker | null = null

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./imageProcessingWorker.ts', import.meta.url), {
      type: 'module'
    })
  }
  return worker
}

/**
 * Converts pixel coordinates to a flat array of pixel indices
 */
function pixelCoordsToIndices(
  pixels: Array<{ x: number; y: number }>,
  width: number
): Uint32Array {
  const indices = new Uint32Array(pixels.length)
  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i]
    indices[i] = (pixel.y * width + pixel.x) * 4
  }
  return indices
}

/**
 * Optimized version that processes color changes in batches
 * to avoid blocking the main thread
 * 
 * @param imageData The source image data
 * @param pixelsToUpdate Array of pixel coordinates to update
 * @param newColor New RGB color values
 * @param onProgress Callback for progress updates
 * @param onComplete Callback when processing is complete
 */
export function processColorChangeAsync(
  imageData: ImageData,
  pixelsToUpdate: Array<{ x: number; y: number }>,
  newColor: { r: number; g: number; b: number },
  onProgress?: (progress: number) => void,
  onComplete?: (newImageData: ImageData) => void
): void {
  const worker = getWorker()
  const pixelIndices = pixelCoordsToIndices(pixelsToUpdate, imageData.width)

  worker.onmessage = (e: MessageEvent<{ type: string; data: any }>) => {
    if (e.data.type === 'progress' && onProgress) {
      onProgress(e.data.data)
    } else if (e.data.type === 'complete' && onComplete) {
      onComplete(e.data.data)
    }
  }

  worker.postMessage({
    type: 'processColorChange',
    imageData,
    pixelIndices,
    newColor
  }, [imageData.data.buffer, pixelIndices.buffer])
} 