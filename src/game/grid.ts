// Grundbausteine für das 8x8-Spielfeld.

const GRID_SIZE = 8

// Eine Zelle ist entweder leer (null) oder gefüllt mit einer Farb-ID (Zahl).
export type Cell = null | number

// Das Spielfeld ist eine 8x8-Matrix aus Zellen: Grid[row][col].
export type Grid = Cell[][]

// Erzeugt ein neues, komplett leeres 8x8-Grid.
export function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null as Cell),
  )
}

// Erzeugt eine tiefe Kopie des Grids, damit das Original unverändert bleibt.
export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row])
}

// Zählt, wie viele Zellen im Grid gefüllt (nicht null) sind.
export function countFilledCells(grid: Grid): number {
  let count = 0
  for (const row of grid) {
    for (const cell of row) {
      if (cell !== null) {
        count += 1
      }
    }
  }
  return count
}
