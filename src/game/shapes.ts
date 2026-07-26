// Formen-Katalog: jede Form ist ein fester Eintrag, keine Rotation zur Laufzeit.

// Eine Zellkoordinate innerhalb einer Form: [row, col], relativ zur linken
// oberen Ecke der Form (0, 0).
type ShapeCell = [row: number, col: number]

export type Shape = {
  id: string
  cells: ShapeCell[]
  colorId: number
}

// Baut die Zellen einer horizontalen Linie der gegebenen Länge.
function horizontalLine(length: number): ShapeCell[] {
  return Array.from({ length }, (_, col) => [0, col])
}

// Baut die Zellen einer vertikalen Linie der gegebenen Länge.
function verticalLine(length: number): ShapeCell[] {
  return Array.from({ length }, (_, row) => [row, 0])
}

// Baut die Zellen eines Quadrats mit gegebener Kantenlänge.
function square(sideLength: number): ShapeCell[] {
  const cells: ShapeCell[] = []
  for (let row = 0; row < sideLength; row++) {
    for (let col = 0; col < sideLength; col++) {
      cells.push([row, col])
    }
  }
  return cells
}

export const SHAPES: Shape[] = [
  // Einzelblock
  { id: 'single-1', cells: [[0, 0]], colorId: 1 },

  // Linien horizontal (2 bis 5 Zellen)
  { id: 'line-h-2', cells: horizontalLine(2), colorId: 2 },
  { id: 'line-h-3', cells: horizontalLine(3), colorId: 2 },
  { id: 'line-h-4', cells: horizontalLine(4), colorId: 2 },
  { id: 'line-h-5', cells: horizontalLine(5), colorId: 2 },

  // Linien vertikal (2 bis 5 Zellen)
  { id: 'line-v-2', cells: verticalLine(2), colorId: 2 },
  { id: 'line-v-3', cells: verticalLine(3), colorId: 2 },
  { id: 'line-v-4', cells: verticalLine(4), colorId: 2 },
  { id: 'line-v-5', cells: verticalLine(5), colorId: 2 },

  // Quadrate
  { id: 'square-2x2', cells: square(2), colorId: 3 },
  { id: 'square-3x3', cells: square(3), colorId: 3 },

  // L-Formen klein (3 Zellen), zwei Varianten
  {
    id: 'l-small-a',
    cells: [
      [0, 0],
      [1, 0],
      [1, 1],
    ],
    colorId: 4,
  },
  {
    id: 'l-small-b',
    cells: [
      [0, 0],
      [0, 1],
      [1, 1],
    ],
    colorId: 4,
  },

  // L-Formen groß (4 Zellen), zwei Varianten
  {
    id: 'l-large-a',
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ],
    colorId: 4,
  },
  {
    id: 'l-large-b',
    cells: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
    ],
    colorId: 4,
  },

  // T-Form
  {
    id: 't-shape',
    cells: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 1],
    ],
    colorId: 5,
  },

  // S/Z-Form
  {
    id: 'sz-shape',
    cells: [
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
    ],
    colorId: 6,
  },
]

// Findet eine Form anhand ihrer ID im Katalog.
export function getShapeById(id: string): Shape | undefined {
  return SHAPES.find((shape) => shape.id === id)
}

// Gibt die Anzahl der belegten Zellen einer Form zurück.
export function shapeSize(shape: Shape): number {
  return shape.cells.length
}
