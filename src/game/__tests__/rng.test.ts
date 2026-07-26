import { describe, expect, it } from 'vitest'
import { createRng, dateSeed } from '../rng'

describe('createRng', () => {
  it('liefert bei gleichem Seed die identische Zahlenfolge', () => {
    const rngA = createRng('test-seed')
    const rngB = createRng('test-seed')

    const sequenceA = Array.from({ length: 10 }, () => rngA())
    const sequenceB = Array.from({ length: 10 }, () => rngB())

    expect(sequenceA).toEqual(sequenceB)
  })

  it('liefert bei unterschiedlichen Seeds (fast sicher) unterschiedliche Folgen', () => {
    const rngA = createRng('seed-eins')
    const rngB = createRng('seed-zwei')

    const sequenceA = Array.from({ length: 10 }, () => rngA())
    const sequenceB = Array.from({ length: 10 }, () => rngB())

    expect(sequenceA).not.toEqual(sequenceB)
  })

  it('liefert Zahlen im Bereich [0, 1)', () => {
    const rng = createRng('bereich-test')

    for (let i = 0; i < 20; i++) {
      const value = rng()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe('dateSeed', () => {
  it('liefert für denselben Tag denselben String, egal zu welcher Uhrzeit', () => {
    const morning = new Date(2026, 6, 23, 6, 0, 0)
    const evening = new Date(2026, 6, 23, 23, 45, 0)

    expect(dateSeed(morning)).toBe(dateSeed(evening))
  })

  it('hat das Format tesserly-YYYY-MM-DD', () => {
    const date = new Date(2026, 0, 5)

    expect(dateSeed(date)).toBe('tesserly-2026-01-05')
  })
})
