import { describe, expect, it } from 'vitest'
import { createEmptyGrid, type Grid } from '../grid'
import { canPlace, hasAnyValidPlacement, place } from '../placement'
import { getShapeById } from '../shapes'

const single = getShapeById('single-1')!
const lineH2 = getShapeById('line-h-2')!
const lineH3 = getShapeById('line-h-3')!

// Füllt ein komplettes 8x8-Grid mit einer festen Farb-ID.
function createFullGrid(): Grid {
  const grid = createEmptyGrid()
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      grid[row][col] = 1
    }
  }
  return grid
}

describe('canPlace', () => {
  it('erlaubt Platzieren auf leerem Grid', () => {
    const grid = createEmptyGrid()

    expect(canPlace(grid, lineH3, 0, 0)).toBe(true)
  })

  it('verbietet Platzieren außerhalb des Rands', () => {
    const grid = createEmptyGrid()

    // line-h-3 an Spalte 6 würde Spalte 8 brauchen -> außerhalb des 8x8-Grids.
    expect(canPlace(grid, lineH3, 0, 6)).toBe(false)
  })

  it('verbietet Platzieren auf eine belegte Zelle', () => {
    const grid = createEmptyGrid()
    grid[0][0] = 1

    expect(canPlace(grid, single, 0, 0)).toBe(false)
  })
})

describe('place', () => {
  it('platziert die Form korrekt auf leerem Grid', () => {
    const grid = createEmptyGrid()

    const result = place(grid, lineH2, 0, 0)

    expect(result[0][0]).toBe(lineH2.colorId)
    expect(result[0][1]).toBe(lineH2.colorId)
  })

  it('verändert das Original-Grid nicht', () => {
    const grid = createEmptyGrid()

    place(grid, lineH2, 0, 0)

    expect(grid[0][0]).toBeNull()
    expect(grid[0][1]).toBeNull()
  })

  it('wirft einen Fehler, wenn die Position ungültig ist', () => {
    const grid = createEmptyGrid()
    grid[0][0] = 1

    expect(() => place(grid, single, 0, 0)).toThrow()
  })
})

describe('hasAnyValidPlacement', () => {
  it('ist false auf einem vollen Grid', () => {
    const grid = createFullGrid()

    expect(hasAnyValidPlacement(grid, single)).toBe(false)
  })

  it('ist true auf einem leeren Grid', () => {
    const grid = createEmptyGrid()

    expect(hasAnyValidPlacement(grid, single)).toBe(true)
  })

  it('ist true, wenn genau eine einzige Position frei ist', () => {
    const grid = createFullGrid()
    grid[3][4] = null

    expect(hasAnyValidPlacement(grid, single)).toBe(true)

    // Eine Form mit 2 Zellen passt trotzdem nirgends, da die freie Zelle
    // vollständig von belegten Nachbarn umgeben ist.
    expect(hasAnyValidPlacement(grid, lineH2)).toBe(false)
  })
})
