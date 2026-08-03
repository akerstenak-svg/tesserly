// Zeigt die aktuell verfügbaren Formen nebeneinander an. Ziehen (Pointer
// Events, funktioniert für Maus UND Touch) startet Drag & Drop aufs Grid.

import type { Shape } from '../game/shapes'
import { colorForCell } from './colors'
import './ShapeTray.css'

type ShapeTrayProps = {
  shapes: Shape[]
  // Index des Slots (nicht die Form-ID!), der gerade gezogen wird - dieselbe
  // Form kann mehrfach gleichzeitig in shapes vorkommen, daher reicht die ID
  // allein nicht, um EINEN bestimmten Slot eindeutig zu identifizieren.
  draggingSlotIndex?: number | null
  onShapeDragStart: (shape: Shape, slotIndex: number, clientX: number, clientY: number) => void
}

// pointermove/pointerup/pointercancel werden NICHT hier auf dem Button
// behandelt, sondern global auf window (siehe App.tsx) - robuster gegenüber
// vielen Re-Renders während des Ziehens. Der Button startet den Drag nur.
export function ShapeTray({ shapes, draggingSlotIndex, onShapeDragStart }: ShapeTrayProps) {
  return (
    <div className="shape-tray">
      {shapes.map((shape, slotIndex) => {
        const isDragging = slotIndex === draggingSlotIndex
        return (
          <button
            // Slot-Index + Form-ID als Key: dieselbe Form kann mehrfach
            // gleichzeitig in shapes stehen, die ID allein wäre nicht eindeutig
            // (React-Warnung "two children with the same key" + falsche
            // Wiederverwendung von DOM-Knoten beim Reconciling).
            key={`${slotIndex}-${shape.id}`}
            type="button"
            className={`shape-tray__button${isDragging ? ' shape-tray__button--dragging' : ''}`}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              onShapeDragStart(shape, slotIndex, event.clientX, event.clientY)
            }}
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
