// Zieht Formen aus dem Katalog, gesteuert über einen übergebenen RNG.

import { SHAPES, shapeSize, type Shape } from './shapes'

// Ab dieser Zellenzahl gilt eine Form als "groß" (seltener), darunter als "klein" (häufiger).
const SMALL_SHAPE_MAX_CELLS = 3

// Zentrale Balancing-Konstante fürs Formen-Ziehen: kleine Formen kommen
// häufiger als große. Hier ändern, um die Verteilung anzupassen.
export const SHAPE_WEIGHTS = {
  small: 3,
  large: 1,
}

type WeightedShape = { shape: Shape; weight: number }

const WEIGHTED_SHAPES: WeightedShape[] = SHAPES.map((shape) => ({
  shape,
  weight: shapeSize(shape) <= SMALL_SHAPE_MAX_CELLS ? SHAPE_WEIGHTS.small : SHAPE_WEIGHTS.large,
}))

const TOTAL_WEIGHT = WEIGHTED_SHAPES.reduce((sum, entry) => sum + entry.weight, 0)

// Zieht eine einzelne Form, gewichtet nach SHAPE_WEIGHTS.
function pickWeightedShape(rng: () => number): Shape {
  let threshold = rng() * TOTAL_WEIGHT

  for (const entry of WEIGHTED_SHAPES) {
    threshold -= entry.weight
    if (threshold < 0) {
      return entry.shape
    }
  }

  // Fallback für Fließkomma-Rundungsfehler am oberen Rand.
  return WEIGHTED_SHAPES[WEIGHTED_SHAPES.length - 1].shape
}

// Zieht "count" Formen aus dem Katalog.
export function dealShapes(rng: () => number, count = 3): Shape[] {
  return Array.from({ length: count }, () => pickWeightedShape(rng))
}
