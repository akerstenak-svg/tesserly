import { describe, expect, it } from 'vitest'
import { dealShapes } from '../deal'
import { createRng } from '../rng'
import { SHAPES } from '../shapes'

describe('dealShapes', () => {
  it('liefert bei gleichem Seed die identische Formen-Folge', () => {
    const shapesA = dealShapes(createRng('draw-seed'), 5)
    const shapesB = dealShapes(createRng('draw-seed'), 5)

    expect(shapesA.map((shape) => shape.id)).toEqual(shapesB.map((shape) => shape.id))
  })

  it('liefert bei unterschiedlichen Seeds (fast sicher) unterschiedliche Formen-Folgen', () => {
    const shapesA = dealShapes(createRng('seed-a'), 10)
    const shapesB = dealShapes(createRng('seed-b'), 10)

    expect(shapesA.map((shape) => shape.id)).not.toEqual(shapesB.map((shape) => shape.id))
  })

  it('liefert immer gültige Formen aus dem Katalog', () => {
    const rng = createRng('katalog-test')
    const shapes = dealShapes(rng, 50)

    const validIds = new Set(SHAPES.map((shape) => shape.id))
    for (const shape of shapes) {
      expect(validIds.has(shape.id)).toBe(true)
    }
  })

  it('liefert standardmäßig 3 Formen', () => {
    const shapes = dealShapes(createRng('default-count'))

    expect(shapes).toHaveLength(3)
  })
})
