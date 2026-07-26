import { describe, expect, it } from 'vitest'
import { applyMove, newGame, type GameState } from '../engine'
import { countFilledCells, createEmptyGrid, type Grid } from '../grid'
import { canPlace } from '../placement'
import { getShapeById, type Shape } from '../shapes'

describe('newGame', () => {
  it('startet mit leerem Grid, 3 Formen und Score 0', () => {
    const state = newGame('start-seed')

    expect(countFilledCells(state.grid)).toBe(0)
    expect(state.currentShapes).toHaveLength(3)
    expect(state.score).toBe(0)
    expect(state.streakLevel).toBe(0)
    expect(state.movesPlayed).toBe(0)
    expect(state.isGameOver).toBe(false)
    expect(state.lastClear).toBeNull()
  })
})

describe('applyMove', () => {
  it('rechnet den Score bei einer Linien-Räumung exakt aus', () => {
    const singleShape = getShapeById('single-1')!
    const dummyShape = getShapeById('line-h-2')! // bleibt übrig, damit kein Nachdealen die Formen ändert

    const grid = createEmptyGrid()
    for (let col = 0; col < 7; col++) {
      grid[0][col] = 1 // Zeile 0 ist bis auf eine Zelle voll
    }

    const state: GameState = {
      grid,
      currentShapes: [singleShape, dummyShape],
      score: 0,
      streakLevel: 0,
      movesPlayed: 0,
      isGameOver: false,
      seed: 'score-test-seed',
      lastClear: null,
    }

    const result = applyMove(state, 'single-1', 0, 7)

    // 1 platzierte Zelle (1 Punkt) + 1 geräumte Linie (10 × 1² = 10 Punkte) = 11
    expect(result.score).toBe(11)
    expect(result.streakLevel).toBe(1)
    expect(result.currentShapes).toEqual([dummyShape])
    expect(result.lastClear).toHaveLength(8)
    expect(countFilledCells(result.grid)).toBe(0)
  })

  it('dealt nach 3 platzierten Formen automatisch 3 neue', () => {
    const shapeA = getShapeById('single-1')!
    const shapeB = getShapeById('line-h-2')!
    const shapeC = getShapeById('square-2x2')!

    const initialState: GameState = {
      grid: createEmptyGrid(),
      currentShapes: [shapeA, shapeB, shapeC],
      score: 0,
      streakLevel: 0,
      movesPlayed: 0,
      isGameOver: false,
      seed: 'refill-test-seed',
      lastClear: null,
    }

    const afterFirst = applyMove(initialState, 'single-1', 0, 0)
    expect(afterFirst.currentShapes).toHaveLength(2)

    const afterSecond = applyMove(afterFirst, 'line-h-2', 2, 0)
    expect(afterSecond.currentShapes).toHaveLength(1)

    const afterThird = applyMove(afterSecond, 'square-2x2', 4, 0)

    expect(afterThird.movesPlayed).toBe(3)
    expect(afterThird.currentShapes).toHaveLength(3)
  })

  it('erkennt Game Over, wenn keine verbleibende Form mehr passt', () => {
    // Schachbrett-Muster: keine zwei Zellen sind orthogonal benachbart leer,
    // daher passt eine 2er-Linie nirgends. Ein Einzelblock passt noch überall.
    const grid = createCheckerboardGrid()
    const singleShape = getShapeById('single-1')!
    const lineShape = getShapeById('line-h-2')!

    const state: GameState = {
      grid,
      currentShapes: [singleShape, lineShape],
      score: 0,
      streakLevel: 0,
      movesPlayed: 0,
      isGameOver: false,
      seed: 'gameover-test-seed',
      lastClear: null,
    }

    // (0, 1) ist im Schachbrett-Muster eine leere Zelle.
    const result = applyMove(state, 'single-1', 0, 1)

    expect(result.isGameOver).toBe(true)
    expect(result.currentShapes).toEqual([lineShape])
    expect(result.lastClear).toBeNull()
  })

  it('wirft einen Fehler bei ungültigem Zug', () => {
    const state = newGame('invalid-move-seed')
    const unavailableShape = 'does-not-exist'

    expect(() => applyMove(state, unavailableShape, 0, 0)).toThrow()
  })
})

describe('Determinismus', () => {
  it('liefert bei gleichem Seed und gleicher Zugfolge exakt den gleichen End-State', () => {
    const stateA = playDeterministicMoves('determinism-seed', 5)
    const stateB = playDeterministicMoves('determinism-seed', 5)

    expect(stateA).toEqual(stateB)
  })
})

// Baut ein 8x8-Schachbrett-Muster: (row+col) gerade -> gefüllt, ungerade -> leer.
function createCheckerboardGrid(): Grid {
  const grid = createEmptyGrid()
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if ((row + col) % 2 === 0) {
        grid[row][col] = 1
      }
    }
  }
  return grid
}

// Findet die erste gültige Position für eine Form (immer dieselbe bei
// gleichem Grid), damit der Determinismus-Test ohne Zufall auskommt.
function firstValidPosition(grid: Grid, shape: Shape): [number, number] {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (canPlace(grid, shape, row, col)) {
        return [row, col]
      }
    }
  }
  throw new Error('Keine gültige Position gefunden.')
}

// Spielt eine feste Anzahl Züge, indem immer die erste verfügbare Form an
// ihrer ersten gültigen Position platziert wird.
function playDeterministicMoves(seed: string, moveCount: number): GameState {
  let state = newGame(seed)

  for (let i = 0; i < moveCount; i++) {
    const shape = state.currentShapes[0]
    const [row, col] = firstValidPosition(state.grid, shape)
    state = applyMove(state, shape.id, row, col)
  }

  return state
}
