export function useImageDownload() {
  const downloadCanvasAsImage = (canvas: HTMLCanvasElement, fileName = 'image.png') => {
    // Create a temporary link element
    const link = document.createElement('a')
    link.download = fileName
    link.href = canvas.toDataURL('image/png')
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    downloadCanvasAsImage
  }
} 