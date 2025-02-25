<script setup lang="ts">
defineProps<{
  imageUrl: string
}>()

const emit = defineEmits<{
  reset: []
}>()

const handleReset = () => {
  emit('reset')
}
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
      <img 
        :src="imageUrl" 
        alt="Uploaded image" 
        class="max-w-full max-h-[55vh] object-contain py-4"
      >
    </div>
    
    <template #footer>
      <div class="flex justify-between items-center py-2">
        <UTooltip text="Edit this image">
          <UButton
            color="white"
            variant="ghost"
            icon="i-heroicons-adjustments-horizontal"
            label="Edit"
            size="lg"
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
