import { useEffect, useMemo, useRef, useState } from 'react'
import { applyMove, newGame, type GameState } from './game/engine'
import { canPlace } from './game/placement'
import { dateSeed } from './game/rng'
import type { Shape } from './game/shapes'
import { GridBoard, type Ghost } from './ui/GridBoard'
import { ShapeTray } from './ui/ShapeTray'
import './App.css'

// Feste Grid-Größe laut CLAUDE.md (Spielregeln: 8x8-Grid).
const GRID_SIZE = 8

type DragState = {
  shape: Shape
  // Slot-Index in currentShapes, NICHT nur die Form-ID: dieselbe Form kann
  // mehrfach gleichzeitig im Angebot sein, daher braucht es den Slot, um
  // eindeutig zu wissen, welche der (identischen) Formen gerade gezogen wird.
  slotIndex: number
  // null, solange der Finger/Cursor gerade nicht über dem Grid ist.
  targetRow: number | null
  targetCol: number | null
} | null

function App() {
  const [gameState, setGameState] = useState<GameState>(() => newGame(dateSeed(new Date())))
  const [drag, setDrag] = useState<DragState>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Source of Truth für den laufenden Drag: Refs werden SOFORT/synchron
  // aktualisiert (State-Updates sind async/batched). Bei einem schnellen
  // Zug-und-Loslassen (pointermove direkt gefolgt von pointerup, typisch bei
  // Touch) könnte ein Event-Handler sonst noch die Closure eines älteren
  // Renders sehen. Der State `drag` dient nur noch fürs Rendering (Ghost/Tray).
  const dragRef = useRef<DragState>(null)

  function setDragState(next: DragState) {
    dragRef.current = next
    setDrag(next)
  }

  // Rechnet eine Bildschirm-Position in eine Grid-Zelle um, basierend auf der
  // tatsächlichen Position/Größe des Grids. null, wenn außerhalb des Grids.
  function cellFromPointer(clientX: number, clientY: number): { row: number; col: number } | null {
    const gridEl = gridRef.current
    if (!gridEl) {
      return null
    }

    const rect = gridEl.getBoundingClientRect()
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      return null
    }

    const col = Math.floor(((clientX - rect.left) / rect.width) * GRID_SIZE)
    const row = Math.floor(((clientY - rect.top) / rect.height) * GRID_SIZE)

    return {
      row: Math.min(Math.max(row, 0), GRID_SIZE - 1),
      col: Math.min(Math.max(col, 0), GRID_SIZE - 1),
    }
  }

  function handleShapeDragStart(shape: Shape, slotIndex: number, clientX: number, clientY: number) {
    const cell = cellFromPointer(clientX, clientY)
    setDragState({ shape, slotIndex, targetRow: cell?.row ?? null, targetCol: cell?.col ?? null })
  }

  function handleShapeDragMove(clientX: number, clientY: number) {
    if (!dragRef.current) {
      return
    }
    const cell = cellFromPointer(clientX, clientY)
    setDragState({ ...dragRef.current, targetRow: cell?.row ?? null, targetCol: cell?.col ?? null })
  }

  // Beim Loslassen: finale Pointer-Position auswerten (nicht nur die letzte
  // pointermove-Position) und den aktiven Drag aus dem Ref lesen (immer aktuell).
  //
  // Die Updater-Funktion ist bewusst REIN: nur eine Berechnung aus prev, keine
  // Seiteneffekte (keine Logs, keine Mutationen). Das ist Pflicht laut React-
  // Regeln für setState-Updater und macht sie automatisch sicher gegenüber
  // Strict Modes Doppel-Aufruf zur Reinheits-Prüfung - canPlace/applyMove sind
  // rein und deterministisch (RNG hängt nur an seed + movesPlayed aus prev),
  // ein zweiter Aufruf mit demselben prev liefert also garantiert dasselbe Ergebnis.
  function handleShapeDragEnd(clientX: number, clientY: number) {
    const activeDrag = dragRef.current
    const cell = cellFromPointer(clientX, clientY)

    if (activeDrag && cell) {
      const { shape } = activeDrag
      setGameState((prev) =>
        canPlace(prev.grid, shape, cell.row, cell.col) ? applyMove(prev, shape.id, cell.row, cell.col) : prev,
      )
    }

    setDragState(null)
  }

  function handleShapeDragCancel() {
    setDragState(null)
  }

  const isDragging = drag !== null

  // Solange gezogen wird: pointermove/pointerup/pointercancel GLOBAL auf window
  // abfangen statt nur auf dem Formen-Button. setPointerCapture allein verlässt
  // sich auf React, das Event am selben DOM-Knoten zuzustellen - bei sehr vielen
  // Re-Renders während des Ziehens (jede Bewegung löst setState aus) kann dabei
  // ein pointerup "verloren gehen". window-Listener sind davon unabhängig: sie
  // feuern garantiert, egal wo der Pointer losgelassen wird (auch außerhalb des
  // Grids oder über einem anderen Element).
  useEffect(() => {
    if (!isDragging) {
      return
    }

    function onWindowPointerMove(event: PointerEvent) {
      handleShapeDragMove(event.clientX, event.clientY)
    }
    function onWindowPointerUp(event: PointerEvent) {
      handleShapeDragEnd(event.clientX, event.clientY)
    }
    function onWindowPointerCancel() {
      handleShapeDragCancel()
    }

    window.addEventListener('pointermove', onWindowPointerMove)
    window.addEventListener('pointerup', onWindowPointerUp)
    window.addEventListener('pointercancel', onWindowPointerCancel)

    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove)
      window.removeEventListener('pointerup', onWindowPointerUp)
      window.removeEventListener('pointercancel', onWindowPointerCancel)
    }
    // handleShapeDragMove/-End/-Cancel lesen den Drag-Stand ausschließlich über
    // dragRef/gridRef (Refs) bzw. rufen reine Funktionen auf - sie hängen nicht
    // von State aus einem bestimmten Render ab. Daher reicht isDragging als
    // einzige Abhängigkeit; der Effect muss nicht bei jeder Zielzellen-Änderung
    // neu aufgesetzt werden.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  // Ghost-Vorschau aus dem aktuellen Drag-State ableiten: welche Zellen
  // würden belegt, und ist die Position gültig (canPlace)?
  const ghost: Ghost = useMemo(() => {
    if (!drag || drag.targetRow === null || drag.targetCol === null) {
      return null
    }

    const { shape, targetRow, targetCol } = drag
    const isValid = canPlace(gameState.grid, shape, targetRow, targetCol)
    const cells = shape.cells
      .map(([row, col]) => ({ row: targetRow + row, col: targetCol + col }))
      .filter((cell) => cell.row >= 0 && cell.row < GRID_SIZE && cell.col >= 0 && cell.col < GRID_SIZE)

    return { cells, isValid }
  }, [drag, gameState.grid])

  return (
    <main className="app">
      <h1>Tesserly</h1>
      <p className="app__score">Score: {gameState.score}</p>
      <GridBoard ref={gridRef} grid={gameState.grid} ghost={ghost} />
      <ShapeTray
        shapes={gameState.currentShapes}
        draggingSlotIndex={drag?.slotIndex ?? null}
        onShapeDragStart={handleShapeDragStart}
      />
    </main>
  )
}

export default App
