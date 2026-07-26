import { describe, expect, it } from 'vitest'
import { createEmptyGrid } from '../grid'
import { clearLines, findFullLines } from '../lines'

describe('findFullLines', () => {
  it('erkennt eine volle Zeile', () => {
    const grid = createEmptyGrid()
    grid[3] = grid[3].map(() => 1)

    const lines = findFullLines(grid)

    expect(lines.rows).toEqual([3])
    expect(lines.cols).toEqual([])
  })

  it('erkennt eine volle Spalte', () => {
    const grid = createEmptyGrid()
    for (let row = 0; row < grid.length; row++) {
      grid[row][5] = 1
    }

    const lines = findFullLines(grid)

    expect(lines.rows).toEqual([])
    expect(lines.cols).toEqual([5])
  })

  it('hat keinen False Positive bei fast-vollen Linien', () => {
    const grid = createEmptyGrid()
    grid[2] = grid[2].map(() => 1)
    grid[2][7] = null // eine Zelle bleibt leer -> Zeile ist nicht voll

    const lines = findFullLines(grid)

    expect(lines.rows).toEqual([])
    expect(lines.cols).toEqual([])
  })
})

describe('clearLines', () => {
  it('räumt eine volle Zeile', () => {
    const grid = createEmptyGrid()
    grid[3] = grid[3].map(() => 1)

    const result = clearLines(grid, { rows: [3], cols: [] })

    expect(result.grid[3].every((cell) => cell === null)).toBe(true)
    expect(result.clearedCells).toHaveLength(8)
  })

  it('räumt eine volle Spalte', () => {
    const grid = createEmptyGrid()
    for (let row = 0; row < grid.length; row++) {
      grid[row][5] = 1
    }

    const result = clearLines(grid, { rows: [], cols: [5] })

    expect(result.grid.every((row) => row[5] === null)).toBe(true)
    expect(result.clearedCells).toHaveLength(8)
  })

  it('Kreuz-Fall: volle Zeile + volle Spalte, Schnittzelle nur 1x in clearedCells', () => {
    const grid = createEmptyGrid()
    grid[2] = grid[2].map(() => 1)
    for (let row = 0; row < grid.length; row++) {
      grid[row][5] = 1
    }

    const lines = findFullLines(grid)
    expect(lines.rows).toEqual([2])
    expect(lines.cols).toEqual([5])

    const result = clearLines(grid, lines)

    // 8 Zellen der Zeile + 8 Zellen der Spalte - 1 gemeinsame Schnittzelle
    expect(result.clearedCells).toHaveLength(15)

    const intersectionOccurrences = result.clearedCells.filter(
      ([row, col]) => row === 2 && col === 5,
    )
    expect(intersectionOccurrences).toHaveLength(1)

    expect(result.grid[2].every((cell) => cell === null)).toBe(true)
    expect(result.grid.every((row) => row[5] === null)).toBe(true)
  })
})
