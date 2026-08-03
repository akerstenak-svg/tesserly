// Zeigt das 8x8-Spielfeld als CSS-Grid an, inkl. optionaler Ghost-Vorschau
// fürs Drag & Drop (grün = platzierbar, rot = nicht platzierbar).

import { forwardRef } from 'react'
import type { Grid } from '../game/grid'
import { colorForCell } from './colors'
import './GridBoard.css'

export type GhostCell = { row: number; col: number }
export type Ghost = { cells: GhostCell[]; isValid: boolean } | null

type GridBoardProps = {
  grid: Grid
  ghost?: Ghost
}

// forwardRef, damit App.tsx die tatsächliche Bildschirm-Position/-Größe des
// Grids messen kann (getBoundingClientRect), um Finger-Position -> Zelle umzurechnen.
export const GridBoard = forwardRef<HTMLDivElement, GridBoardProps>(function GridBoard(
  { grid, ghost },
  ref,
) {
  return (
    <div ref={ref} className="grid-board">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="grid-board__cell"
            style={{ backgroundColor: colorForCell(cell) }}
          />
        )),
      )}
      {ghost && (
        // Eigene, absolut positionierte Ebene über dem Grid: nimmt NICHT am
        // Grid-Layout des Eltern-Containers teil, kann also nie eine
        // zusätzliche Zeile im Haupt-Grid erzeugen (siehe GridBoard.css).
        <div className="grid-board__ghost-overlay">
          {ghost.cells.map(({ row, col }) => (
            <div
              key={`ghost-${row}-${col}`}
              className={`grid-board__ghost-cell${
                ghost.isValid ? ' grid-board__ghost-cell--valid' : ' grid-board__ghost-cell--invalid'
              }`}
              style={{ gridRow: row + 1, gridColumn: col + 1 }}
            />
          ))}
        </div>
      )}
    </div>
  )
})
