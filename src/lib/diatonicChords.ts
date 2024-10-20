export const DiatonicChords = {
  C: "C",
  CsharpDflat: "C#/D♭",
  D: "D",
  DsharpEflat: "D#/E♭",
  E: "E",
  F: "F",
  FsharpGflat: "F#/G♭",
  G: "G",
  GsharpAflat: "G#/A♭",
  A: "A",
  AsharpBflat: "A#/B♭",
  B: "B",
} as const;
export type DiatonicChords = (typeof DiatonicChords)[keyof typeof DiatonicChords];
