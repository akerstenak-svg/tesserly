// Zentrale Zuordnung von Farb-ID (aus dem Formen-Katalog) zu CSS-Farbe.
// Die eigentlichen Farbwerte stehen als CSS-Variablen in theme.css - hier
// nur die Zuordnung, damit Board und Formen-Vorschau dieselbe Quelle nutzen.

const SHAPE_COLORS_BY_ID: Record<number, string> = {
  1: 'var(--shape-color-1)',
  2: 'var(--shape-color-2)',
  3: 'var(--shape-color-3)',
  4: 'var(--shape-color-4)',
  5: 'var(--shape-color-5)',
  6: 'var(--shape-color-6)',
}

export const EMPTY_CELL_COLOR = 'var(--cell-empty-bg)'

// Gibt die CSS-Farbe für eine Grid-Zelle zurück: colorId -> Formen-Farbe, null -> neutral.
export function colorForCell(colorId: number | null): string {
  if (colorId === null) {
    return EMPTY_CELL_COLOR
  }
  return SHAPE_COLORS_BY_ID[colorId] ?? EMPTY_CELL_COLOR
}
