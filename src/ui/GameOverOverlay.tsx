// Abdunkelndes Overlay über dem Spielfeld, wenn state.isGameOver true ist.
// Styling ist bewusst schlicht - Feinschliff kommt in Wochenende 3.

import './GameOverOverlay.css'

type GameOverOverlayProps = {
  score: number
  onNewGame: () => void
}

export function GameOverOverlay({ score, onNewGame }: GameOverOverlayProps) {
  return (
    <div className="game-over-overlay">
      <div className="game-over-overlay__content">
        <p className="game-over-overlay__title">Game Over</p>
        <p className="game-over-overlay__score">Score: {score}</p>
        <button type="button" className="game-over-overlay__button" onClick={onNewGame}>
          Neues Spiel
        </button>
      </div>
    </div>
  )
}
