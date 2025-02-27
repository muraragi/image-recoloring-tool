<script lang="ts" setup>
import { parseColorKey, rgbToHex } from '~/utils/colorUtils'
import type { ColorCount } from '~/composables/useDirectColorProcessing'
import { useColorSelection, type ColorInfo } from '~/composables/useColorSelection'

const props = defineProps<{
  colors: ColorCount[]
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
  updateColorValue,
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

const updateRgbValue = (channel: 'r' | 'g' | 'b', value: number) => {
  updateColorValue(channel, value)
  handleColorChange()
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
  <div class="w-full flex flex-col h-full">
    <div class="flex-1 max-h-[512px] overflow-y-auto">
      <div class="flex flex-wrap gap-3">
        <UTooltip v-for="color in colorList" :key="color.key" :text="`RGB(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}) - ${formatPixelCount(color.pixelCount)}`">
          <button
            class="w-10 h-10 rounded-full border-2 transition-colors relative"
            :class="[
              selectedColor === color 
                ? 'border-white ring-2 ring-white/50' 
                : 'border-gray-600 hover:border-white/70'
            ]"
            :style="{ backgroundColor: color.hexColor }"
            :aria-label="`Select color ${color.hexColor}`"
            @click="handleColorSelect(color)"
          />
        </UTooltip>
      </div>
    </div>

    <div v-if="selectedColor" :key="selectedColor ? selectedColor.key : 'no-selection'">
      <div class="flex items-center gap-4 mb-4 mt-8">
        <div class="w-12 h-12 rounded-lg" :style="{ backgroundColor: selectedColorHex }" />
        <div>
          <div class="text-sm text-gray-300 mb-1">Selected Color</div>
          <div class="text-white font-mono">{{ selectedColorHex }}</div>
          <div class="text-sm text-gray-400">
            {{ formatPixelCount(selectedColor.pixelCount) }}
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <UCheckbox v-model="includeSimilarColors" class="h-5 w-5" />
              <span class="text-sm font-medium text-gray-200">Include similar colors</span>
            </div>
            <UBadge v-if="includeSimilarColors" color="primary" variant="subtle" size="sm">
              Active
            </UBadge>
          </div>

          <div v-if="includeSimilarColors" class="space-y-2 mt-4">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-400">Similarity Threshold</span>
              <UBadge color="white" variant="subtle" size="xs">{{ similarityThreshold }}%</UBadge>
            </div>
            <URange
              v-model="similarityThreshold"
              :min="1"
              :max="100"
              :step="1"
              color="primary"
              class="flex-1"
            />
          </div>
        </div>

        <UFormGroup label="Red">
          <div class="flex items-center gap-4">
            <URange
              v-model="newColorValue.r"
              :min="0"
              :max="255"
              :step="1"
              color="red"
              class="flex-1"
              @update:model-value="value => updateRgbValue('r', value)"
            />
            <span class="text-base font-medium text-right text-red-500">{{ newColorValue.r }}</span>
          </div>
        </UFormGroup>

        <UFormGroup label="Green">
          <div class="flex items-center gap-4">
            <URange
              v-model="newColorValue.g"
              :min="0"
              :max="255"
              :step="1"
              color="green"
              class="flex-1"
              @update:model-value="value => updateRgbValue('g', value)"
            />
            <span class="text-base font-medium text-right text-green-500">{{ newColorValue.g }}</span>
          </div>
        </UFormGroup>

        <UFormGroup label="Blue">
          <div class="flex items-center gap-4">
            <URange
              v-model="newColorValue.b"
              :min="0"
              :max="255"
              :step="1"
              color="blue"
              class="flex-1"
              @update:model-value="value => updateRgbValue('b', value)"
            />
            <span class="text-base font-medium text-right text-blue-500">{{ newColorValue.b }}</span>
          </div>
        </UFormGroup>
      </div>
    </div>

    <div v-else class="p-4 text-center text-gray-400">
      Select a color to edit
    </div>
  </div>
</template>
