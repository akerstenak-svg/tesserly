// Deterministischer Zufallsgenerator: gleicher Seed -> immer gleiche Zahlenfolge.

// xmur3: wandelt einen String-Seed in einen 32-Bit-Startwert-Generator um.
// (Standard-Hilfsfunktion, um Text-Seeds für mulberry32 nutzbar zu machen.)
function xmur3(seed: string): () => number {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return h >>> 0
  }
}

// mulberry32: schneller, deterministischer PRNG. Liefert bei jedem Aufruf
// eine Zahl im Bereich [0, 1).
function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Erzeugt aus einem String-Seed einen deterministischen Zufallsgenerator.
export function createRng(seed: string): () => number {
  const seedToNumber = xmur3(seed)
  return mulberry32(seedToNumber())
}

// Erzeugt aus einem Datum einen Seed im Format "tesserly-YYYY-MM-DD".
export function dateSeed(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `tesserly-${year}-${month}-${day}`
}
