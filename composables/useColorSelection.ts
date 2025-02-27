import { ref, computed } from 'vue'
import { parseColorKey, rgbToHex } from '~/utils/colorUtils'
import type { ColorCount } from '~/composables/useDirectColorProcessing'

export type ColorInfo = {
  key: string
  rgb: { r: number; g: number; b: number }
  hexColor: string
  pixelCount: number
}

export const DEFAULT_SIMILARITY_THRESHOLD = 100

const selectedColor = ref<ColorInfo | null>(null)
const newColorValue = ref({ r: 0, g: 0, b: 0 })
const includeSimilarColors = ref(false)
const similarityThreshold = ref(DEFAULT_SIMILARITY_THRESHOLD)

export function useColorSelection() {
  const selectedColorHex = computed(() => {
    if (!newColorValue.value) return '#000000'
    return rgbToHex(newColorValue.value.r, newColorValue.value.g, newColorValue.value.b)
  })

  const formatColorList = (colors: ColorCount[]) => {
    return colors.map(({ color, count }) => {
      const { r, g, b } = parseColorKey(color)
      return {
        key: color,
        rgb: { r, g, b },
        hexColor: rgbToHex(r, g, b),
        pixelCount: count
      }
    })
  }

  const selectColor = (color: ColorInfo) => {
    selectedColor.value = color
    newColorValue.value = { ...color.rgb }
  }

  const updateColorValue = (channel: 'r' | 'g' | 'b', value: number) => {
    newColorValue.value[channel] = value
  }

  const updateSelectedColorAfterChange = () => {
    if (selectedColor.value) {
      const newHex = selectedColorHex.value
      const newColorKey = `${newColorValue.value.r},${newColorValue.value.g},${newColorValue.value.b}`
      selectedColor.value = {
        key: newColorKey,
        rgb: { ...newColorValue.value },
        hexColor: newHex,
        pixelCount: selectedColor.value.pixelCount
      }
    }
  }

  const resetSelection = () => {
    selectedColor.value = null
    Object.assign(newColorValue.value, { r: 0, g: 0, b: 0 })
    includeSimilarColors.value = false
    similarityThreshold.value = DEFAULT_SIMILARITY_THRESHOLD
  }

  return {
    selectedColor,
    newColorValue,
    includeSimilarColors,
    similarityThreshold,
    selectedColorHex,
    formatColorList,
    selectColor,
    updateColorValue,
    updateSelectedColorAfterChange,
    resetSelection
  }
} 