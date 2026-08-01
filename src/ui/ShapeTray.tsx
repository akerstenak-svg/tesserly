// Zeigt die aktuell verfügbaren Formen nebeneinander an. Antippen wählt
// eine Form aus (nochmal antippen hebt die Auswahl wieder auf).

import type { Shape } from '../game/shapes'
import { colorForCell } from './colors'
import './ShapeTray.css'

type ShapeTrayProps = {
  shapes: Shape[]
  selectedShapeId?: string | null
  onSelectShape?: (shapeId: string) => void
}

export function ShapeTray({ shapes, selectedShapeId, onSelectShape }: ShapeTrayProps) {
  return (
    <div className="shape-tray">
      {shapes.map((shape) => {
        const isSelected = shape.id === selectedShapeId
        return (
          <button
            key={shape.id}
            type="button"
            className={`shape-tray__button${isSelected ? ' shape-tray__button--selected' : ''}`}
            onClick={() => onSelectShape?.(shape.id)}
            aria-pressed={isSelected}
          >
            <ShapePreview shape={shape} />
          </button>
        )
      })}
    </div>
  )
}

function ShapePreview({ shape }: { shape: Shape }) {
  // Bounding Box der Form ermitteln, damit das Mini-Raster genau passt.
  const rowCount = Math.max(...shape.cells.map(([row]) => row)) + 1
  const colCount = Math.max(...shape.cells.map(([, col]) => col)) + 1
  const filledCells = new Set(shape.cells.map(([row, col]) => `${row},${col}`))

  return (
    <div
      className="shape-tray__shape"
      style={{
        gridTemplateColumns: `repeat(${colCount}, var(--tray-cell-size))`,
        gridTemplateRows: `repeat(${rowCount}, var(--tray-cell-size))`,
      }}
    >
      {Array.from({ length: rowCount }, (_, row) =>
        Array.from({ length: colCount }, (_, col) => {
          const isFilled = filledCells.has(`${row},${col}`)
          return (
            <div
              key={`${row}-${col}`}
              className="shape-tray__cell"
              style={{ backgroundColor: isFilled ? colorForCell(shape.colorId) : 'transparent' }}
            />
          )
        }),
      )}
    </div>
  )
}
