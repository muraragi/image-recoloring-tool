<script setup lang="ts">
import { onMounted } from 'vue'
import { useImageCanvas } from '~/composables/useImageCanvas'

const props = defineProps<{
  imageUrl: string
}>()

const emit = defineEmits<{
  reset: []
}>()

const isEditMode = ref(false)

const handleReset = () => {
  emit('reset')
}

const { canvasRef, isCanvasReady, initCanvas, colorMap } = useImageCanvas(
  computed(() => props.imageUrl)
)

onMounted(() => {
  initCanvas()
})
</script>

<template>
  <UCard class="max-w-2xl mx-auto bg-gray-800 border-gray-700 overflow-hidden shadow-xl">
    <template #header>
      <div class="flex justify-between items-center">
        <div class="text-xl font-medium text-white">Image Preview</div>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark"
          size="md"
          aria-label="Close preview"
          @click="handleReset"
        />
      </div>
    </template>

    <div class="relative bg-gray-900 flex justify-center">
      <canvas ref="canvasRef" class="max-w-full max-h-[55vh] object-contain py-4" />

      <div v-if="!isCanvasReady" class="absolute inset-0 flex items-center justify-center">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-10 w-10 text-gray-400" />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center py-2">
        <ColorPicker v-if="isEditMode" :color-map="colorMap" />
        <UTooltip v-else text="Edit this image">
          <UButton
            color="white"
            variant="ghost"
            icon="i-heroicons-adjustments-horizontal"
            label="Edit"
            size="lg"
            @click="isEditMode = true"
          />
        </UTooltip>

        <UButton
          color="black"
          icon="i-heroicons-arrow-path"
          label="Upload new"
          size="lg"
          @click="handleReset"
        />
      </div>
    </template>
  </UCard>
</template>
