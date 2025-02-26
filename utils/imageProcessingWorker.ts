type WorkerMessage = {
  type: 'processColorChange'
  imageData: ImageData
  pixelIndices: Uint32Array
  newColor: { r: number; g: number; b: number }
}

type WorkerResponse = {
  type: 'progress' | 'complete'
  data: ImageData | number
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, imageData, pixelIndices, newColor } = e.data

  if (type === 'processColorChange') {
    const newImageData = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    )

    const { r, g, b } = newColor
    const data = newImageData.data
    const totalPixels = pixelIndices.length
    const batchSize = 10000

    for (let i = 0; i < totalPixels; i += batchSize) {
      const end = Math.min(i + batchSize, totalPixels)

      for (let j = i; j < end; j++) {
        const pixelIndex = pixelIndices[j]
        data[pixelIndex] = r
        data[pixelIndex + 1] = g
        data[pixelIndex + 2] = b
      }

      const progress = (end / totalPixels)
      self.postMessage({ type: 'progress', data: progress })
    }

    self.postMessage({ type: 'complete', data: newImageData }, [newImageData.data.buffer])
  }
} 