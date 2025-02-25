import { ref } from 'vue'

export function useImageUpload() {
  const imageFile = ref<File | null>(null)
  const isProcessing = ref(false)
  const hasImage = ref(false)
  const imageUrl = ref<string | null>(null)
  
  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      const file = target.files[0]
      
      if (file.type.startsWith('image/')) {
        isProcessing.value = true
        imageFile.value = file
        
        if (imageUrl.value) {
          URL.revokeObjectURL(imageUrl.value)
        }
        
        const url = URL.createObjectURL(file)
        imageUrl.value = url
        hasImage.value = true
        isProcessing.value = false
      }
    }
  }
  
  const resetImage = () => {
    if (imageUrl.value) {
      URL.revokeObjectURL(imageUrl.value)
    }
    imageUrl.value = null
    imageFile.value = null
    hasImage.value = false
  }
  
  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]
      
      if (file.type.startsWith('image/')) {
        const input = document.createElement('input')
        input.type = 'file'
        
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        input.files = dataTransfer.files
        
        handleFileUpload({ target: input } as unknown as Event)
      }
    }
  }
  
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
  }
  
  return {
    imageFile,
    imageUrl,
    isProcessing,
    hasImage,
    handleFileUpload,
    handleDrop,
    handleDragOver,
    resetImage
  }
}
