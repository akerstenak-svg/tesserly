// Zentrale Spielsteuerung als Pure-Function-Statemachine.
// applyMove nimmt einen State + einen Zug entgegen und gibt einen NEUEN State zurück.

import { dealShapes } from './deal'
import { createEmptyGrid, type Grid } from './grid'
import { clearLines, findFullLines } from './lines'
import { canPlace, hasAnyValidPlacement, place } from './placement'
import { createRng } from './rng'
import { calculateScore, nextStreakLevel } from './scoring'
import { shapeSize, type Shape } from './shapes'

export type GameState = {
  grid: Grid
  // Aktuell verfügbare Formen (max. 3). Platzierte Formen werden entfernt.
  currentShapes: Shape[]
  score: number
  streakLevel: number
  // Anzahl bereits gespielter Züge. Dient zugleich als Zähler fürs
  // deterministische Nachdealen (siehe dealNextBatch).
  movesPlayed: number
  isGameOver: boolean
  seed: string
  // Zellen, die im letzten Zug geräumt wurden (für UI-Animationen). null = keine Räumung.
  lastClear: [row: number, col: number][] | null
}

// Erzeugt die nächsten 3 Formen deterministisch aus Seed + Zähler.
// Damit muss kein RNG-Objekt im State gespeichert werden - der State
// bleibt einfach zu serialisieren (z.B. für Speichern/Laden).
function dealNextBatch(seed: string, movesPlayed: number): Shape[] {
  const dealIndex = Math.floor(movesPlayed / 3)
  const rng = createRng(`${seed}-deal-${dealIndex}`)
  return dealShapes(rng, 3)
}

// Startet ein neues Spiel: leeres Grid, 3 gedealte Formen.
export function newGame(seed: string): GameState {
  return {
    grid: createEmptyGrid(),
    currentShapes: dealNextBatch(seed, 0),
    score: 0,
    streakLevel: 0,
    movesPlayed: 0,
    isGameOver: false,
    seed,
    lastClear: null,
  }
}

// Führt einen kompletten Zug aus und gibt einen neuen State zurück.
// Wirft einen Fehler bei ungültigen Zügen (Form nicht verfügbar, Position ungültig).
export function applyMove(state: GameState, shapeId: string, row: number, col: number): GameState {
  if (state.isGameOver) {
    throw new Error('Das Spiel ist bereits vorbei.')
  }

  const shapeIndex = state.currentShapes.findIndex((shape) => shape.id === shapeId)
  if (shapeIndex === -1) {
    throw new Error(`Form "${shapeId}" ist aktuell nicht verfügbar.`)
  }
  const shape = state.currentShapes[shapeIndex]

  if (!canPlace(state.grid, shape, row, col)) {
    throw new Error(`Form "${shapeId}" kann nicht an Position (${row}, ${col}) platziert werden.`)
  }

  // 1. Platzieren
  const gridAfterPlacement = place(state.grid, shape, row, col)

  // 2. Volle Linien finden und räumen
  const fullLines = findFullLines(gridAfterPlacement)
  const clearedLineCount = fullLines.rows.length + fullLines.cols.length
  const { grid: gridAfterClear, clearedCells } = clearLines(gridAfterPlacement, fullLines)

  // 3. Score & Streak aktualisieren
  const placedCells = shapeSize(shape)
  const scoreGain = calculateScore({ placedCells, clearedLineCount, streakLevel: state.streakLevel })
  const streakLevel = nextStreakLevel(state.streakLevel, clearedLineCount)
  const movesPlayed = state.movesPlayed + 1

  // Verbrauchte Form aus dem Array entfernen (nur diese eine Instanz, falls
  // mehrere Formen mit gleicher ID im Katalog-Angebot stecken).
  const remainingShapes = [
    ...state.currentShapes.slice(0, shapeIndex),
    ...state.currentShapes.slice(shapeIndex + 1),
  ]

  // 4. Wenn alle 3 Formen verbraucht sind: neue dealen
  const currentShapes = remainingShapes.length === 0 ? dealNextBatch(state.seed, movesPlayed) : remainingShapes

  // 5. Game Over prüfen: passt keine der verbleibenden Formen mehr irgendwo hin?
  const isGameOver = currentShapes.every((remainingShape) => !hasAnyValidPlacement(gridAfterClear, remainingShape))

  return {
    grid: gridAfterClear,
    currentShapes,
    score: state.score + scoreGain,
    streakLevel,
    movesPlayed,
    isGameOver,
    seed: state.seed,
    lastClear: clearedCells.length > 0 ? clearedCells : null,
  }
}
