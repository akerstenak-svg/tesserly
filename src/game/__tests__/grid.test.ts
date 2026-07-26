import { describe, expect, it } from 'vitest'
import { cloneGrid, countFilledCells, createEmptyGrid } from '../grid'

describe('createEmptyGrid', () => {
  it('hat 8 Zeilen à 8 Spalten, alle null', () => {
    const grid = createEmptyGrid()

    expect(grid).toHaveLength(8)
    for (const row of grid) {
      expect(row).toHaveLength(8)
      for (const cell of row) {
        expect(cell).toBeNull()
      }
    }
  })
})

describe('cloneGrid', () => {
  it('verändert das Original nicht, wenn man die Kopie ändert', () => {
    const original = createEmptyGrid()
    const copy = cloneGrid(original)

    copy[0][0] = 3

    expect(original[0][0]).toBeNull()
    expect(copy[0][0]).toBe(3)
  })
})

describe('countFilledCells', () => {
  it('zählt gefüllte Zellen korrekt', () => {
    const grid = createEmptyGrid()

    expect(countFilledCells(grid)).toBe(0)

    grid[0][0] = 1
    grid[2][5] = 2
    grid[7][7] = 1

    expect(countFilledCells(grid)).toBe(3)
  })
})
