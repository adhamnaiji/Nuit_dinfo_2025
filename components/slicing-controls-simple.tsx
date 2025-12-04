'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SlicingControlsProps {
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  currentLayer: number
  onLayerChange: (layer: number) => void
  totalLayers: number
  layerHeight: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  volume: number
  overhangs: number
}

export default function SlicingControls({
  enabled,
  onEnabledChange,
  currentLayer,
  onLayerChange,
  totalLayers,
  layerHeight,
  dimensions,
  volume,
  overhangs,
}: SlicingControlsProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handlePlayAnimation = () => {
    setIsAnimating(true)
    let layer = 0
    const interval = setInterval(() => {
      if (layer >= totalLayers) {
        clearInterval(interval)
        setIsAnimating(false)
        return
      }
      onLayerChange(layer)
      layer++
    }, 30) // 30ms per layer
  }

  // Calculate print time estimate
  const printTimeMinutes = Math.round(
    (dimensions.width * dimensions.depth * totalLayers) / 50 / 60
  )

  // Calculate weight (assuming PLA density ~1.24 g/cm³)
  const weight = volume * 1.24

  // Calculate filament (1.75mm diameter)
  const filamentMeters = (volume * 1000) / (Math.PI * 0.875 * 0.875)

  const sliceZ = dimensions.height * (currentLayer / Math.max(totalLayers, 1))
  const progress = totalLayers > 0 ? ((currentLayer / totalLayers) * 100).toFixed(1) : '0'

  return (
    <Card className="p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">🔪 Slicing Visualization</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            className="rounded w-4 h-4"
          />
          <span className="text-xs font-medium">Enable</span>
        </label>
      </div>

      {enabled && (
        <>
          {/* Layer Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Layer</span>
              <Badge variant="outline" className="text-xs">
                {currentLayer} / {totalLayers}
              </Badge>
            </div>
            <input
              type="range"
              min={0}
              max={totalLayers}
              value={currentLayer}
              onChange={(e) => onLayerChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Layer Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-600">Height</div>
              <div className="font-bold text-blue-600">{sliceZ.toFixed(2)} mm</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-600">Progress</div>
              <div className="font-bold text-blue-600">{progress}%</div>
            </div>
          </div>

          {/* Play Animation Button */}
          <Button
            onClick={handlePlayAnimation}
            disabled={isAnimating}
            variant="outline"
            className="w-full text-xs"
          >
            {isAnimating ? '▶️ Playing...' : '▶️ Play Animation'}
          </Button>

          {/* Print Statistics */}
          <div className="border-t pt-3 space-y-2">
            <h4 className="font-semibold text-xs">📊 Print Estimates</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-gray-600">Layers</div>
                <div className="font-bold">{totalLayers}</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="text-gray-600">Time</div>
                <div className="font-bold">{printTimeMinutes} min</div>
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <div className="text-gray-600">Weight</div>
                <div className="font-bold">{weight.toFixed(1)}g</div>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <div className="text-gray-600">Filament</div>
                <div className="font-bold">{(filamentMeters / 100).toFixed(1)}m</div>
              </div>
            </div>
          </div>

          {/* Support Detection */}
          {overhangs > 0 && (
            <div className="border-t pt-3 bg-red-50 p-3 rounded">
              <h4 className="font-semibold text-xs text-red-900 mb-1">⚠️ Support Needed</h4>
              <p className="text-[11px] text-red-800">
                {overhangs} overhang regions detected. Support material will be required.
              </p>
            </div>
          )}

          {/* Layer Height Info */}
          <div className="border-t pt-2 text-[11px] text-gray-600">
            <p>Layer Height: <span className="font-semibold">{layerHeight}mm</span></p>
            <p>Model Height: <span className="font-semibold">{dimensions.height.toFixed(1)}mm</span></p>
          </div>
        </>
      )}
    </Card>
  )
}