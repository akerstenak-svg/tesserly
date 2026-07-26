# Projekt: Tesserly

Block-Puzzle-Spiel (Stil: Block Blast / 1010!) für iOS und Android via Capacitor.
Solo-Projekt eines Programmier-Anfängers, der mit Claude Code lernt.

Marke/App-Name: Tesserly.
Store-Titel: "Tesserly – Block Puzzle".
Bundle-ID: com.tesserlygame.app

## Stack

Vite, React, TypeScript, Vitest, Zustand, Framer Motion, Howler.js, später Capacitor.

## Architektur-Regeln (immer einhalten)

1. Spiellogik liegt ausschließlich in `src/game/` und importiert NIEMALS React.
2. Alle Funktionen in `src/game/` sind Pure Functions: gleiche Eingabe → gleiche Ausgabe,
   keine Seiteneffekte. Zufall wird immer über einen übergebenen Seed/RNG gesteuert,
   nie über `Math.random()` direkt in der Logik.
3. Jede Logik-Funktion bekommt Vitest-Tests in `src/game/__tests__/`.
4. Vor jeder Antwort auf einen neuen Auftrag: kurz den Plan nennen (3-5 Zeilen), dann umsetzen.
5. Nach jeder Änderung: `npm test` ausführen und bestätigen, dass alles grün ist.
6. Code-Kommentare auf Deutsch, kurz und für Anfänger verständlich.
7. Keine zusätzlichen Libraries installieren ohne zu fragen.

## Spielregeln (Fachlogik)

- Spielfeld: 8x8 Grid. Zelle = leer oder gefüllt (mit Farb-ID).
- Pro Runde erhält der Spieler 3 Formen aus dem Formen-Katalog.
- Formen werden frei platziert, wenn alle ihre Zellen auf leere Grid-Zellen passen.
- Volle Reihen UND volle Spalten werden gleichzeitig geräumt.
- Erst wenn alle 3 Formen platziert sind, kommen 3 neue.
- Game Over: keine der verbleibenden Formen passt mehr irgendwo hin.

## Scoring

- Pro platzierter Zelle: 1 Punkt.
- Pro Räum-Aktion: 10 × N² Punkte, wobei N = Anzahl gleichzeitig geräumter
  Linien (quadratisch, damit große Combos überproportional belohnt werden).
  Beispiel: 1 Linie = 10, 2 Linien = 40, 3 Linien = 90, 4 Linien = 160.
- Streak-Bonus: Räumt der Spieler mit aufeinanderfolgenden Platzierungen jeweils
  mindestens 1 Linie, steigt ein Streak-Multiplikator (+0.5 pro Stufe, max 3x).

## Design-Philosophie: Easy to access, hard to master

- Niedrigschwelliger Einstieg: kein Tutorial nötig, kein Zeitdruck.
- KEINE künstliche Schwierigkeitskurve. Die Formen-Wahrscheinlichkeit ist
  über das ganze Spiel konstant (Prinzip Block Blast / 1010!).
- Schwierigkeit entsteht emergent durch das sich füllende Feld und die
  eigenen Entscheidungen des Spielers — jeder Game Over ist selbstverschuldet.
  Das erhält die Fairness und damit den Wiederspielreiz.
- Der "hard to master"-Anspruch kommt aus zwei Quellen:
  1. Formen-Balance: schwer platzierbare Formen (3x3-Quadrat, 5er-Linie)
     kommen regelmäßig genug, um zu fordern, aber nicht so oft, dass es
     unfair wird. Diese Gewichtung ist ein zentraler, klar benannter und
     leicht änderbarer Parameter (Balancing-Konstante).
  2. Combo-/Streak-System als Skill-Ceiling: Könner bauen bewusst
     Mehrfach-Linien-Situationen für hohe Multiplikatoren.
