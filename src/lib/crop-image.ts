import type { Area } from "react-easy-crop"

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Impossible de lire cette image."))
    image.src = source
  })
}

export async function cropImage(source: string, crop: Area) {
  const image = await loadImage(source)
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  if (!context) throw new Error("Le recadrage n'est pas disponible.")

  const outputSize = 512
  canvas.width = outputSize
  canvas.height = outputSize
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, outputSize, outputSize)
  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputSize,
    outputSize
  )

  return canvas.toDataURL("image/jpeg", 0.92)
}
