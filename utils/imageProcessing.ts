/**
 * Creates a new ImageData object by applying a color replacement
 * 
 * @param imageData The source image data
 * @param pixelsToUpdate Array of pixel coordinates to update
 * @param newColor New RGB color values
 * @param onProgress Optional progress callback
 * @returns New ImageData with updated pixels
 */
export async function createColorReplacedImageData(
  imageData: ImageData,
  pixelsToUpdate: Array<{ x: number; y: number }>,
  newColor: { r: number; g: number; b: number },
  onProgress?: (progress: number) => void
): Promise<ImageData> {
  const newImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  )
  
  const { r, g, b } = newColor
  const { width } = newImageData
  const data = newImageData.data
  
  // Process in batches for better UI responsiveness
  const batchSize = 5000
  const totalPixels = pixelsToUpdate.length
  
  for (let i = 0; i < totalPixels; i += batchSize) {
    const end = Math.min(i + batchSize, totalPixels)
    
    for (let j = i; j < end; j++) {
      const pixel = pixelsToUpdate[j]
      const pixelIndex = (pixel.y * width + pixel.x) * 4
      
      data[pixelIndex] = r
      data[pixelIndex + 1] = g
      data[pixelIndex + 2] = b
    }
    
    if (onProgress) {
      onProgress(end / totalPixels)
    }
    
    // Allow UI to update
    if (i + batchSize < totalPixels) {
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }
  
  return newImageData
}

export async function processColorChange(
  imageData: ImageData,
  pixelsToUpdate: Array<{ x: number; y: number }>,
  newColor: { r: number; g: number; b: number },
  onProgress?: (progress: number) => void
): Promise<ImageData> {
  return createColorReplacedImageData(imageData, pixelsToUpdate, newColor, onProgress)
} 