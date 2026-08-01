import { useRef, useState } from 'react'
import { applyMove, newGame, type GameState } from './game/engine'
import { canPlace } from './game/placement'
import { dateSeed } from './game/rng'
import { GridBoard } from './ui/GridBoard'
import { ShapeTray } from './ui/ShapeTray'
import './App.css'

type InvalidCell = { row: number; col: number }

// Wie lange die "ungültiger Zug"-Blink-Animation sichtbar bleibt.
// Sollte zur CSS-Animationsdauer in GridBoard.css passen.
const INVALID_FEEDBACK_MS = 300

function App() {
  const [gameState, setGameState] = useState<GameState>(() => newGame(dateSeed(new Date())))
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null)
  const [invalidCell, setInvalidCell] = useState<InvalidCell | null>(null)
  const invalidTimeoutRef = useRef<number | null>(null)

  // Wählt eine Form aus der Tray aus - nochmaliges Antippen hebt die Auswahl auf.
  function handleSelectShape(shapeId: string) {
    setSelectedShapeId((current) => (current === shapeId ? null : shapeId))
  }

  function flashInvalidCell(row: number, col: number) {
    if (invalidTimeoutRef.current !== null) {
      window.clearTimeout(invalidTimeoutRef.current)
    }
    setInvalidCell({ row, col })
    invalidTimeoutRef.current = window.setTimeout(() => {
      setInvalidCell(null)
      invalidTimeoutRef.current = null
    }, INVALID_FEEDBACK_MS)
  }

  // Zielzelle für die gewählte Form: bei gültiger Position wird der Zug
  // ausgeführt, sonst blinkt die Zelle kurz rot und es passiert nichts weiter.
  function handleCellClick(row: number, col: number) {
    if (!selectedShapeId) {
      return
    }

    const shape = gameState.currentShapes.find((candidate) => candidate.id === selectedShapeId)
    if (!shape) {
      return
    }

    if (!canPlace(gameState.grid, shape, row, col)) {
      flashInvalidCell(row, col)
      return
    }

    setGameState((state) => applyMove(state, selectedShapeId, row, col))
    setSelectedShapeId(null)
  }

  return (
    <main className="app">
      <h1>Tesserly</h1>
      <p className="app__score">Score: {gameState.score}</p>
      <GridBoard grid={gameState.grid} onCellClick={handleCellClick} invalidCell={invalidCell} />
      <ShapeTray
        shapes={gameState.currentShapes}
        selectedShapeId={selectedShapeId}
        onSelectShape={handleSelectShape}
      />
    </main>
  )
}

export default App
