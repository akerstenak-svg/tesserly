// Zeigt das 8x8-Spielfeld als CSS-Grid an. Zellen sind klickbar.

import type { Grid } from '../game/grid'
import { colorForCell } from './colors'
import './GridBoard.css'

type InvalidCell = { row: number; col: number }

type GridBoardProps = {
  grid: Grid
  onCellClick?: (row: number, col: number) => void
  // Zelle, die gerade kurz rot blinken soll (ungültiger Zug).
  invalidCell?: InvalidCell | null
}

export function GridBoard({ grid, onCellClick, invalidCell }: GridBoardProps) {
  return (
    <div className="grid-board">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isInvalid = invalidCell?.row === rowIndex && invalidCell?.col === colIndex
          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              className={`grid-board__cell${isInvalid ? ' grid-board__cell--invalid' : ''}`}
              style={{ backgroundColor: colorForCell(cell) }}
              onClick={() => onCellClick?.(rowIndex, colIndex)}
              aria-label={`Zeile ${rowIndex + 1}, Spalte ${colIndex + 1}`}
            />
          )
        }),
      )}
    </div>
  )
}
