/**
 * Quantizes a color value to reduce color precision
 * @param value The color channel value (0-255)
 * @param levels Number of levels to quantize to
 * @returns The quantized color value
 */
export function quantizeColor(value: number, levels: number): number {
  const step = 256 / levels
  return Math.floor(value / step) * step
}

/**
 * Calculates the Euclidean distance between two RGB colors
 * @param r1 Red component of first color
 * @param g1 Green component of first color
 * @param b1 Blue component of first color
 * @param r2 Red component of second color
 * @param g2 Green component of second color
 * @param b2 Blue component of second color
 * @returns Distance between the colors
 */
export function colorDistance(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): number {
  return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2))
}

/**
 * Parses a color key string into RGB components
 * @param colorKey Color key string in format "r,g,b"
 * @returns Object with r, g, b properties
 */
export function parseColorKey(colorKey: string): { r: number; g: number; b: number } {
  const [r, g, b] = colorKey.split(',').map(Number)
  return { r, g, b }
}
