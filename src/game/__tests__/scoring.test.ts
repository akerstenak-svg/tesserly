import { describe, expect, it } from 'vitest'
import { calculateScore, MAX_STREAK_LEVEL, nextStreakLevel } from '../scoring'

describe('calculateScore', () => {
  it('zählt nur Zell-Punkte, wenn keine Linie geräumt wird', () => {
    const score = calculateScore({ placedCells: 5, clearedLineCount: 0, streakLevel: 0 })

    expect(score).toBe(5)
  })

  it('Beispiel aus CLAUDE.md: 2 Linien gleichzeitig ohne Streak = 40 Punkte', () => {
    const score = calculateScore({ placedCells: 0, clearedLineCount: 2, streakLevel: 0 })

    expect(score).toBe(40)
  })

  it('kombiniert Zell-Punkte und Linien-Punkte', () => {
    // 4 platzierte Zellen + 2 Linien gleichzeitig (ohne Streak) = 4 + 40
    const score = calculateScore({ placedCells: 4, clearedLineCount: 2, streakLevel: 0 })

    expect(score).toBe(44)
  })

  it('skaliert die Linien-Punkte mit dem Streak-Multiplikator', () => {
    // 1 Linie = 10 Basis-Punkte, Streak-Stufe 4 = 3x Multiplikator -> 30
    // plus 6 Zell-Punkte = 36
    const score = calculateScore({ placedCells: 6, clearedLineCount: 1, streakLevel: MAX_STREAK_LEVEL })

    expect(score).toBe(36)
  })

  it('deckelt den Streak-Multiplikator bei 3x, auch über MAX_STREAK_LEVEL hinaus', () => {
    const atCap = calculateScore({ placedCells: 0, clearedLineCount: 1, streakLevel: MAX_STREAK_LEVEL })
    const beyondCap = calculateScore({ placedCells: 0, clearedLineCount: 1, streakLevel: MAX_STREAK_LEVEL + 10 })

    expect(atCap).toBe(30)
    expect(beyondCap).toBe(30)
  })
})

describe('nextStreakLevel', () => {
  it('steigt um 1, wenn mindestens 1 Linie geräumt wurde', () => {
    expect(nextStreakLevel(0, 1)).toBe(1)
    expect(nextStreakLevel(2, 1)).toBe(3)
  })

  it('steigt bei mehreren gleichzeitig geräumten Linien trotzdem nur um 1', () => {
    expect(nextStreakLevel(1, 3)).toBe(2)
  })

  it('deckelt bei MAX_STREAK_LEVEL', () => {
    expect(nextStreakLevel(MAX_STREAK_LEVEL, 1)).toBe(MAX_STREAK_LEVEL)
  })

  it('fällt auf 0 zurück, wenn keine Linie geräumt wurde', () => {
    expect(nextStreakLevel(3, 0)).toBe(0)
  })
})
