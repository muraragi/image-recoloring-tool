<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { hexToRgb } from '~/utils/colorUtils'

const props = defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'color-change': [rgb: { r: number, g: number, b: number }]
}>()

const hue = ref(0)
const saturation = ref(100)
const value = ref(100)
const pickerArea = ref<HTMLDivElement | null>(null)
const hueSlider = ref<HTMLDivElement | null>(null)
const isDraggingSatVal = ref(false)
const isDraggingHue = ref(false)
const pickerIndicatorPosition = ref({ x: 0, y: 0 })
const hexValue = ref(props.modelValue)

const hueColor = computed(() => {
  return `hsl(${hue.value}, 100%, 50%)`
})

const satValBackground = computed(() => {
  return `linear-gradient(to top, #000, transparent), 
          linear-gradient(to right, #fff, ${hueColor.value})`
})

const hueSliderPosition = computed(() => {
  return `${(hue.value / 360) * 100}%`
})

const rgbValues = computed(() => {
  const rgb = hexToRgb(hexValue.value)
  return rgb
})

const hsvToRgb = (h: number, s: number, v: number) => {
  s = s / 100
  v = v / 100
  
  let r = 0, g = 0, b = 0
  const i = Math.floor(h / 60)
  const f = h / 60 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

const rgbToHsv = (r: number, g: number, b: number) => {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  
  let h = max === 0 ? 0 : delta / max
  const s = max === 0 ? 0 : delta / max
  const v = max
  
  if (delta === 0) {
    h = 0
  } else if (max === r) {
    h = ((g - b) / delta) % 6
  } else if (max === g) {
    h = (b - r) / delta + 2
  } else {
    h = (r - g) / delta + 4
  }
  
  h = Math.round(h * 60)
  if (h < 0) h += 360
  
  return {
    h,
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  }
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const updateHsvFromHex = () => {
  const rgb = hexToRgb(hexValue.value)
  const { h, s, v } = rgbToHsv(rgb.r, rgb.g, rgb.b)
  hue.value = h
  saturation.value = s
  value.value = v
  updatePickerPosition()
}

const updateHexFromHsv = () => {
  const rgb = hsvToRgb(hue.value, saturation.value, value.value)
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
  hexValue.value = hex
  emit('update:modelValue', hex)
  emit('color-change', rgb)
}

const updatePickerPosition = () => {
  if (pickerArea.value) {
    const width = pickerArea.value.clientWidth
    const height = pickerArea.value.clientHeight
    
    pickerIndicatorPosition.value = {
      x: (saturation.value / 100) * width,
      y: (1 - value.value / 100) * height
    }
  }
}

const handleSatValMouseDown = (e: MouseEvent) => {
  if (!pickerArea.value || props.disabled) return
  
  isDraggingSatVal.value = true
  handleSatValMouseMove(e)
  
  const handleMouseUp = () => {
    isDraggingSatVal.value = false
    window.removeEventListener('mousemove', handleSatValMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }
  
  window.addEventListener('mousemove', handleSatValMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

const handleSatValMouseMove = (e: MouseEvent) => {
  if (!isDraggingSatVal.value || !pickerArea.value) return
  
  const rect = pickerArea.value.getBoundingClientRect()
  let x = e.clientX - rect.left
  let y = e.clientY - rect.top
  
  x = Math.max(0, Math.min(x, rect.width))
  y = Math.max(0, Math.min(y, rect.height))
  
  saturation.value = Math.round((x / rect.width) * 100)
  value.value = Math.round((1 - y / rect.height) * 100)
  
  pickerIndicatorPosition.value = { x, y }
  updateHexFromHsv()
}

const handleHueMouseDown = (e: MouseEvent) => {
  if (!hueSlider.value || props.disabled) return
  
  isDraggingHue.value = true
  handleHueMouseMove(e)
  
  const handleMouseUp = () => {
    isDraggingHue.value = false
    window.removeEventListener('mousemove', handleHueMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }
  
  window.addEventListener('mousemove', handleHueMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

const handleHueMouseMove = (e: MouseEvent) => {
  if (!isDraggingHue.value || !hueSlider.value) return
  
  const rect = hueSlider.value.getBoundingClientRect()
  let x = e.clientX - rect.left
  
  x = Math.max(0, Math.min(x, rect.width))
  
  hue.value = Math.round((x / rect.width) * 360)
  updateHexFromHsv()
}

const handleHexInput = (newHexValue: string) => {
  if (newHexValue.match(/^#[0-9A-Fa-f]{6}$/)) {
    hexValue.value = newHexValue
    updateHsvFromHex()
    emit('update:modelValue', newHexValue)
    emit('color-change', hexToRgb(newHexValue))
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue !== hexValue.value) {
    hexValue.value = newValue
    updateHsvFromHex()
  }
}, { immediate: true })

onMounted(() => {
  updateHsvFromHex()
})
</script>

<template>
  <div class="color-picker bg-gray-900/50 rounded-lg p-4 border border-gray-700">
    <div class="mb-4">
      <div 
        ref="pickerArea"
        class="w-full h-40 rounded-lg cursor-crosshair relative mb-4"
        :class="{ 'opacity-50 pointer-events-none': disabled }"
        :style="{ background: satValBackground }"
        @mousedown="handleSatValMouseDown"
      >
        <div 
          class="w-4 h-4 rounded-full border-2 border-white absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          :style="{ 
            left: `${pickerIndicatorPosition.x}px`, 
            top: `${pickerIndicatorPosition.y}px`,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3)'
          }"
        />
      </div>
      
      <div 
        ref="hueSlider"
        class="w-full h-6 rounded-lg cursor-pointer relative mb-4"
        :class="{ 'opacity-50 pointer-events-none': disabled }"
        style="background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);"
        @mousedown="handleHueMouseDown"
      >
        <div 
          class="absolute w-4 h-6 -translate-x-1/2 top-0 pointer-events-none"
          :style="{ 
            left: hueSliderPosition,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
            border: '2px solid white',
            borderRadius: '4px'
          }"
        />
      </div>
    </div>
    
    <div class="flex items-center gap-4">
      <div class="flex-1">
        <UInput
          v-model="hexValue"
          placeholder="#RRGGBB"
          class="font-mono"
          :disabled="disabled"
          @change="handleHexInput(hexValue)"
        />
      </div>
      <div class="flex gap-2">
        <UBadge color="red" variant="subtle">R: {{ rgbValues.r }}</UBadge>
        <UBadge color="green" variant="subtle">G: {{ rgbValues.g }}</UBadge>
        <UBadge color="blue" variant="subtle">B: {{ rgbValues.b }}</UBadge>
      </div>
    </div>
  </div>
</template>
