// Zeigt das 8x8-Spielfeld als CSS-Grid an. Noch keine Interaktion.

import type { Grid } from '../game/grid'
import { colorForCell } from './colors'
import './GridBoard.css'

type GridBoardProps = {
  grid: Grid
}

export function GridBoard({ grid }: GridBoardProps) {
  return (
    <div className="grid-board">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="grid-board__cell"
            style={{ backgroundColor: colorForCell(cell) }}
          />
        )),
      )}
    </div>
  )
}
