// Erkennt volle Zeilen/Spalten und räumt sie.

import { cloneGrid, type Grid } from './grid'

export type FullLines = { rows: number[]; cols: number[] }
export type ClearResult = { grid: Grid; clearedCells: [row: number, col: number][] }

// Findet alle Zeilen- und Spaltenindizes, die komplett gefüllt sind.
export function findFullLines(grid: Grid): FullLines {
  const rows: number[] = []
  for (let row = 0; row < grid.length; row++) {
    if (grid[row].every((cell) => cell !== null)) {
      rows.push(row)
    }
  }

  const colCount = grid[0].length
  const cols: number[] = []
  for (let col = 0; col < colCount; col++) {
    const isFull = grid.every((row) => row[col] !== null)
    if (isFull) {
      cols.push(col)
    }
  }

  return { rows, cols }
}

// Leert die übergebenen Zeilen/Spalten in einem neuen Grid. Zellen, die in
// einer vollen Zeile UND einer vollen Spalte liegen, tauchen in clearedCells
// nur einmal auf.
export function clearLines(grid: Grid, lines: FullLines): ClearResult {
  const newGrid = cloneGrid(grid)
  const seen = new Set<string>()
  const clearedCells: [number, number][] = []

  const markCleared = (row: number, col: number) => {
    const key = `${row},${col}`
    if (!seen.has(key)) {
      seen.add(key)
      clearedCells.push([row, col])
    }
  }

  for (const row of lines.rows) {
    for (let col = 0; col < newGrid[row].length; col++) {
      markCleared(row, col)
    }
  }
  for (const col of lines.cols) {
    for (let row = 0; row < newGrid.length; row++) {
      markCleared(row, col)
    }
  }

  for (const [row, col] of clearedCells) {
    newGrid[row][col] = null
  }

  return { grid: newGrid, clearedCells }
}
