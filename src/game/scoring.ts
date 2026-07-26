// Setzt die Scoring-Regeln aus CLAUDE.md um.

const POINTS_PER_CELL = 1
const POINTS_PER_LINE_BASE = 10
const STREAK_BONUS_PER_LEVEL = 0.5

// Max. Streak-Stufe: 1 + 0.5 × 4 = 3x, das laut CLAUDE.md maximale Multiplikator.
export const MAX_STREAK_LEVEL = 4

export type ScoreInput = {
  placedCells: number
  clearedLineCount: number
  streakLevel: number
}

// Rechnet die Streak-Stufe (0 bis MAX_STREAK_LEVEL) in den Multiplikator um.
function streakMultiplier(streakLevel: number): number {
  const level = Math.min(streakLevel, MAX_STREAK_LEVEL)
  return 1 + level * STREAK_BONUS_PER_LEVEL
}

// Punkte für einen Zug: Zell-Punkte fürs Platzieren + Linien-Punkte
// (10 × Anzahl² wegen Combo), Linien-Punkte werden mit dem
// Streak-Multiplikator skaliert.
export function calculateScore(input: ScoreInput): number {
  const { placedCells, clearedLineCount, streakLevel } = input

  const placementScore = placedCells * POINTS_PER_CELL

  const baseLineScore =
    clearedLineCount > 0 ? POINTS_PER_LINE_BASE * clearedLineCount * clearedLineCount : 0
  const lineScore = baseLineScore * streakMultiplier(streakLevel)

  return placementScore + lineScore
}

// Nächste Streak-Stufe: +1 wenn mindestens 1 Linie geräumt wurde
// (gedeckelt bei MAX_STREAK_LEVEL), sonst zurück auf 0.
export function nextStreakLevel(current: number, clearedLineCount: number): number {
  if (clearedLineCount >= 1) {
    return Math.min(current + 1, MAX_STREAK_LEVEL)
  }
  return 0
}
