import { useState } from 'react'
import { applyMove, newGame } from './game/engine'
import { GridBoard } from './ui/GridBoard'
import { ShapeTray } from './ui/ShapeTray'
import './App.css'

// Test-Setup fürs statische Rendering: ein paar Formen vorab platzieren,
// damit man im Grid tatsächlich Farben sieht (kein Interaktions-Code).
function createPreviewState() {
  let state = newGame('ui-preview-seed')

  const firstShape = state.currentShapes[0]
  if (firstShape) {
    state = applyMove(state, firstShape.id, 0, 0)
  }

  const secondShape = state.currentShapes[0]
  if (secondShape) {
    state = applyMove(state, secondShape.id, 2, 3)
  }

  return state
}

function App() {
  const [gameState] = useState(createPreviewState)

  return (
    <main className="app">
      <h1>Tesserly</h1>
      <p className="app__score">Score: {gameState.score}</p>
      <GridBoard grid={gameState.grid} />
      <ShapeTray shapes={gameState.currentShapes} />
    </main>
  )
}

export default App
