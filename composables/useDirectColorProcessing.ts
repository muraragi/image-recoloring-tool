import { ref, computed } from 'vue'
import { quantizeColor, colorDistance } from '~/utils/colorUtils'

export type ColorCount = {
  color: string
  count: number
}

export function useDirectColorProcessing(imageData: Ref<ImageData | null>) {
  const colorQuantizationLevel = ref(8)

  const quantizedColors = computed(() => {
    if (!imageData.value) return []

    const colorCounts = new Map<string, number>()
    const data = imageData.value.data
    const levels = colorQuantizationLevel.value

    for (let i = 0; i < data.length; i += 4) {
      const r = quantizeColor(data[i], levels)
      const g = quantizeColor(data[i + 1], levels)
      const b = quantizeColor(data[i + 2], levels)
      const colorKey = `${r},${g},${b}`

      colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1)
    }

    return Array.from(colorCounts.entries())
      .map(([color, count]) => ({ color, count }))
      .sort((a, b) => b.count - a.count)
  })

  const applyColorChange = async (
    originalColor: { r: number; g: number; b: number },
    newColor: { r: number; g: number; b: number },
    includeSimilar = false,
    similarityThreshold = 30,
    onProgress?: (progress: number) => void
  ) => {
    if (!imageData.value) return null

    const newImageData = new ImageData(
      new Uint8ClampedArray(imageData.value.data),
      imageData.value.width,
      imageData.value.height
    )

    const data = newImageData.data
    const levels = colorQuantizationLevel.value
    const totalPixels = data.length / 4
    const batchSize = 5000

    const targetR = quantizeColor(originalColor.r, levels)
    const targetG = quantizeColor(originalColor.g, levels)
    const targetB = quantizeColor(originalColor.b, levels)

    for (let i = 0; i < data.length; i += batchSize * 4) {
      const end = Math.min(i + batchSize * 4, data.length)

      for (let j = i; j < end; j += 4) {
        const currentR = quantizeColor(data[j], levels)
        const currentG = quantizeColor(data[j + 1], levels)
        const currentB = quantizeColor(data[j + 2], levels)

        const isExactMatch = currentR === targetR && currentG === targetG && currentB === targetB
        const isSimilar = includeSimilar && colorDistance(
          currentR, currentG, currentB,
          targetR, targetG, targetB
        ) <= similarityThreshold

        if (isExactMatch || isSimilar) {
          data[j] = newColor.r
          data[j + 1] = newColor.g
          data[j + 2] = newColor.b
        }
      }

      if (onProgress) {
        onProgress((end / 4) / totalPixels)
      }

      await new Promise(resolve => setTimeout(resolve, 0))
    }

    return newImageData
  }

  return {
    quantizedColors,
    colorQuantizationLevel,
    applyColorChange
  }
} 