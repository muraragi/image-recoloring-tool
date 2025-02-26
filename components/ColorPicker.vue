<script lang="ts" setup>
import { parseColorKey, rgbToHex } from '~/utils/colorUtils'

const props = defineProps<{
  colors: Set<string>
}>()

const emit = defineEmits<{
  colorChanged: [originalColor: { r: number, g: number, b: number }, newColor: string]
}>()

const selectedColor = ref<string | null>(null)
const newColorValue = ref({ r: 0, g: 0, b: 0 })

const colorList = computed(() => {
  return Array.from(props.colors).map(colorKey => {
    const { r, g, b } = parseColorKey(colorKey)
    return {
      key: colorKey,
      rgb: { r, g, b },
      hexColor: rgbToHex(r, g, b)
    }
  })
})

const handleColorSelect = (colorKey: string) => {
  selectedColor.value = colorKey
  const { r, g, b } = parseColorKey(colorKey)
  newColorValue.value = { r, g, b }
}

const selectedColorHex = computed(() => {
  if (!newColorValue.value) return '#000000'
  return rgbToHex(newColorValue.value.r, newColorValue.value.g, newColorValue.value.b)
})

const handleColorChange = () => {
  if (selectedColor.value) {
    const newHex = selectedColorHex.value
    const originalColor = parseColorKey(selectedColor.value)
    emit('colorChanged', originalColor, newHex)
    const newColorKey = `${newColorValue.value.r},${newColorValue.value.g},${newColorValue.value.b}`
    selectedColor.value = newColorKey
  }
}

const updateRgbValue = (channel: 'r' | 'g' | 'b', value: number) => {
  newColorValue.value[channel] = value
  handleColorChange()
}
</script>

<template>
  <div class="w-full flex flex-col h-full">
    <div class="flex-1 max-h-[512px] overflow-y-auto">
      <div class="flex flex-wrap gap-3">
        <UTooltip v-for="color in colorList" :key="color.key" :text="`RGB(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`">
          <button
            class="w-10 h-10 rounded-full border-2 transition-colors relative"
            :class="[
              selectedColor === color.key 
                ? 'border-white ring-2 ring-white/50' 
                : 'border-gray-600 hover:border-white/70'
            ]"
            :style="{ backgroundColor: color.hexColor }"
            :aria-label="`Select color ${color.hexColor}`"
            @click="handleColorSelect(color.key)"
          />
        </UTooltip>
      </div>
    </div>

    <div v-if="selectedColor">
      <div class="flex items-center gap-4 mb-4 mt-8">
        <div class="w-12 h-12 rounded-lg" :style="{ backgroundColor: selectedColorHex }" />
        <div>
          <div class="text-sm text-gray-300 mb-1">Selected Color</div>
          <div class="text-white font-mono">{{ selectedColorHex }}</div>
        </div>
      </div>

      <div class="space-y-4">
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
