<script lang="ts" setup>
import type { ColorCount } from '~/composables/useDirectColorProcessing'
import { useColorSelection, type ColorInfo } from '~/composables/useColorSelection'

const props = defineProps<{
  colors: ColorCount[]
  isProcessing?: boolean
}>()

const emit = defineEmits<{
  colorChanged: [originalColor: { r: number, g: number, b: number }, newColor: string, includeSimilar: boolean, similarityThreshold: number]
}>()

const {
  selectedColor,
  newColorValue,
  includeSimilarColors,
  similarityThreshold,
  selectedColorHex,
  formatColorList,
  selectColor,
  updateSelectedColorAfterChange
} = useColorSelection()

const colorList = computed(() => formatColorList(props.colors))

const handleColorSelect = (color: ColorInfo) => {
  selectColor(color)
}

const handleColorChange = () => {
  if (selectedColor.value) {
    emit('colorChanged', 
      selectedColor.value.rgb, 
      selectedColorHex.value, 
      includeSimilarColors.value, 
      similarityThreshold.value
    )
    updateSelectedColorAfterChange()
  }
}

const handlePickerColorChange = (rgb: { r: number, g: number, b: number }) => {
  if (selectedColor.value) {
    newColorValue.value = rgb
    handleColorChange()
  }
}

const formatPixelCount = (count: number) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M px`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K px`
  }
  return `${count} px`
}
</script>

<template>
  <div class="w-full flex flex-col h-full gap-3">
    <div class="flex-1 max-h-[600px] flex justify-center flex-wrap gap-2 overflow-y-auto p-1">
      <UTooltip v-for="color in colorList" :key="color.key" :text="`RGB(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}) - ${formatPixelCount(color.pixelCount)}`">
        <button
          class="w-10 h-10 rounded-full border-2 transition-colors relative"
          :class="[
            selectedColor?.key === color.key
              ? 'border-white ring-2 ring-white/50' 
              : 'border-gray-600 hover:border-white/70'
          ]"
          :style="{ backgroundColor: color.hexColor }"
          :aria-label="`Select color ${color.hexColor}`"
          :disabled="props.isProcessing"
          @click="handleColorSelect(color)"
        />
      </UTooltip>
    </div>

    <div v-if="selectedColor" :key="selectedColor ? selectedColor.key : 'no-selection'">
      <div class="space-y-4">        
        <ColorPicker 
          v-model="selectedColorHex" 
          :disabled="!selectedColor"
          :is-processing="props.isProcessing"
          @color-change="handlePickerColorChange"
        />

        <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <UCheckbox v-model="includeSimilarColors" class="h-5 w-5" :disabled="props.isProcessing" />
              <span class="text-sm font-medium text-gray-200">Recolor similar colors</span>
            </div>
            <UBadge v-if="includeSimilarColors" color="primary" variant="subtle" size="sm">
              Active
            </UBadge>
          </div>

          <div v-if="includeSimilarColors" class="space-y-2 mt-4">
            <URange
              v-model="similarityThreshold"
              :min="1"
              :max="100"
              :step="1"
              color="primary"
              class="flex-1"
              :disabled="props.isProcessing"
            />
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-400">Similarity Threshold</span>
              <UBadge color="white" variant="subtle" size="xs">{{ similarityThreshold }}%</UBadge>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-4 text-center text-gray-400">
      Select a color to edit
    </div>
  </div>
</template> 