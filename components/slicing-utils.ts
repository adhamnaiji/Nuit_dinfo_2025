export interface SlicingData {
  totalLayers: number
  printTimeMinutes: number
  weightGrams: number
  filamentMeters: number
  overhangRegions: number
  needsSupport: boolean
}

/**
 * Calculate slicing data from model dimensions
 */
export function calculateSlicingData(
  dimensions: { width: number; height: number; depth: number },
  volume: number,
  layerHeightMm: number,
  overhangCount: number
): SlicingData {
  // Total layers
  const totalLayers = Math.max(1, Math.round(dimensions.height / layerHeightMm))

  // Print time estimate (simplified formula)
  // Area * Layers / print speed / 60
  const printTimeMinutes = Math.round((dimensions.width * dimensions.depth * totalLayers) / 50 / 60)

  // Weight calculation (PLA density: 1.24 g/cm³)
  const weightGrams = volume * 1.24

  // Filament length (1.75mm diameter = 0.875mm radius)
  const filamentArea = Math.PI * 0.875 * 0.875
  const filamentMeters = (volume * 1000) / filamentArea

  return {
    totalLayers,
    printTimeMinutes,
    weightGrams,
    filamentMeters,
    overhangRegions: overhangCount,
    needsSupport: overhangCount > 0,
  }
}

/**
 * Detect overhangs in a geometry (simplified)
 * Returns count of triangles with downward-facing normals
 */
export function detectOverhangs(normals: Float32Array, threshold = 0.15): number {
  let count = 0

  // Check every 3 normals (one per face)
  for (let i = 0; i < normals.length; i += 9) {
    // Average Z component of the 3 vertices' normals
    const avgNz = (normals[i + 2] + normals[i + 5] + normals[i + 8]) / 3

    // If pointing downward more than threshold
    if (avgNz < -threshold) {
      count++
    }
  }

  return count
}

/**
 * Calculate layer height from model height and desired layer count
 */
export function calculateLayerHeight(modelHeightMm: number, desiredLayers: number): number {
  if (desiredLayers <= 0) return 0.2
  const height = modelHeightMm / desiredLayers
  // Snap to common values: 0.1, 0.15, 0.2, 0.25, 0.3
  const common = [0.1, 0.15, 0.2, 0.25, 0.3]
  return common.reduce((prev, curr) =>
    Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
  )
}

/**
 * Generate support material estimate
 */
export function calculateSupportMaterial(
  volume: number,
  overhangCount: number
): { volume: number; weight: number; type: string } {
  if (overhangCount === 0) {
    return { volume: 0, weight: 0, type: 'None' }
  }

  // Rough estimate: 15% of object volume for supports
  const supportVolume = volume * 0.15
  const supportWeight = supportVolume * 1.0 // PVA density

  return {
    volume: supportVolume,
    weight: supportWeight,
    type: 'PVA',
  }
}

/**
 * Estimate print cost
 */
export function estimatePrintCost(
  filamentGrams: number,
  electricityCost: number = 0.15 // $ per kWh
): number {
  const filamentCost = (filamentGrams / 1000) * 20 // $20 per kg of PLA
  const electricityKwh = (filamentGrams / 1000) * 0.05 // 0.05 kWh per gram
  const electricityCostTotal = electricityKwh * electricityCost
  return parseFloat((filamentCost + electricityCostTotal).toFixed(2))
}

/**
 * Validate model for printability
 */
export function validateModel(
  dimensions: { width: number; height: number; depth: number },
  volume: number,
  overhangs: number
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = []

  // Check model height
  if (dimensions.height < 5) {
    warnings.push('Model is very short (<5mm) - adhesion may be difficult')
  }
  if (dimensions.height > 300) {
    warnings.push('Model is very tall (>300mm) - ensure stable printing')
  }

  // Check model aspect ratio
  const minXY = Math.min(dimensions.width, dimensions.depth)
  const ratio = dimensions.height / minXY
  if (ratio > 10) {
    warnings.push('Model is very tall and thin - may topple during printing')
  }
  if (ratio < 0.1) {
    warnings.push('Model is very flat - may have warping issues')
  }

  // Check volume
  if (volume < 1) {
    warnings.push('Model is very small - may lose details')
  }
  if (volume > 500) {
    warnings.push('Model is very large - ensure bed can fit')
  }

  // Check overhangs
  if (overhangs > 100) {
    warnings.push('Many overhangs detected - will need extensive support material')
  }

  return {
    valid: warnings.length === 0,
    warnings,
  }
}