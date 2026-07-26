// Prüft und führt das Platzieren einer Form auf dem Grid aus.

import { cloneGrid, type Grid } from './grid'
import type { Shape } from './shapes'

// Prüft, ob eine Form an Position (row, col) passt: alle Zellen müssen
// innerhalb des Grids liegen und leer sein.
export function canPlace(grid: Grid, shape: Shape, row: number, col: number): boolean {
  const rowCount = grid.length
  const colCount = grid[0].length

  for (const [cellRow, cellCol] of shape.cells) {
    const targetRow = row + cellRow
    const targetCol = col + cellCol

    if (targetRow < 0 || targetRow >= rowCount || targetCol < 0 || targetCol >= colCount) {
      return false
    }
    if (grid[targetRow][targetCol] !== null) {
      return false
    }
  }

  return true
}

// Platziert eine Form auf dem Grid und gibt ein NEUES Grid zurück.
// Das übergebene Grid bleibt unverändert.
export function place(grid: Grid, shape: Shape, row: number, col: number): Grid {
  if (!canPlace(grid, shape, row, col)) {
    throw new Error(`Form "${shape.id}" kann nicht an Position (${row}, ${col}) platziert werden.`)
  }

  const newGrid = cloneGrid(grid)
  for (const [cellRow, cellCol] of shape.cells) {
    newGrid[row + cellRow][col + cellCol] = shape.colorId
  }

  return newGrid
}

// Prüft, ob es irgendeine Position auf dem Grid gibt, an der die Form passt.
export function hasAnyValidPlacement(grid: Grid, shape: Shape): boolean {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (canPlace(grid, shape, row, col)) {
        return true
      }
    }
  }

  return false
}
