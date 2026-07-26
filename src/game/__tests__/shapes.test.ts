import { describe, expect, it } from 'vitest'
import { getShapeById, shapeSize, SHAPES } from '../shapes'

describe('SHAPES', () => {
  it('hat ausschließlich eindeutige IDs', () => {
    const ids = SHAPES.map((shape) => shape.id)
    const uniqueIds = new Set(ids)

    expect(uniqueIds.size).toBe(ids.length)
  })

  it('enthält keine Form mit doppelten Zellkoordinaten', () => {
    for (const shape of SHAPES) {
      const keys = shape.cells.map(([row, col]) => `${row},${col}`)
      const uniqueKeys = new Set(keys)

      expect(uniqueKeys.size).toBe(keys.length)
    }
  })

  it('jede Form hat mindestens 1 und höchstens 9 Zellen', () => {
    for (const shape of SHAPES) {
      expect(shapeSize(shape)).toBeGreaterThanOrEqual(1)
      expect(shapeSize(shape)).toBeLessThanOrEqual(9)
    }
  })

  it('alle Zellkoordinaten sind >= 0', () => {
    for (const shape of SHAPES) {
      for (const [row, col] of shape.cells) {
        expect(row).toBeGreaterThanOrEqual(0)
        expect(col).toBeGreaterThanOrEqual(0)
      }
    }
  })
})

describe('getShapeById', () => {
  it('findet eine existierende Form', () => {
    expect(getShapeById('single-1')).toBeDefined()
  })

  it('gibt undefined zurück, wenn die ID nicht existiert', () => {
    expect(getShapeById('does-not-exist')).toBeUndefined()
  })
})
