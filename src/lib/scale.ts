export const Note = {
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
export type Note = (typeof Note)[keyof typeof Note];

export function stringsToNotes(strs: string[]): Note[] {
  return strs.map((str) => {
    switch (str.toUpperCase()) {
      case "B#":
      case "C":
        return Note.C;
      case "C#":
      case "D♭":
        return Note.CsharpDflat;
      case "D":
        return Note.D;
      case "D#":
      case "E♭":
        return Note.DsharpEflat;
      case "E":
      case "F♭":
        return Note.E;
      case "E#":
      case "F":
        return Note.F;
      case "F#":
      case "G♭":
        return Note.FsharpGflat;
      case "G":
        return Note.G;
      case "G#":
      case "A♭":
        return Note.GsharpAflat;
      case "A":
        return Note.A;
      case "A#":
      case "B♭":
        return Note.AsharpBflat;
      case "B":
      case "C♭":
        return Note.B;
      default:
        throw new Error("contains non-note character string");
    }
  });
}

export const Tonality = {
  Major: "Major",
  NaturalMinor: "NaturalMinor",
} as const;
type Tonality = (typeof Tonality)[keyof typeof Tonality];

export type Scale = {
  name: string;
  tonality: Tonality;
  notes: Note[];
};

export type ScaleWithSimilarity = {
  scale: Scale;
  similarity: number;
};

// biome-ignore format: the array should not be formatted
export const commonScales: Scale[] = [
  // Major Scale
  { name: "C Major", tonality: Tonality.Major, notes: [ Note.C, Note.D, Note.E, Note.F, Note.G, Note.A, Note.B ] },
  { name: "D Major", tonality: Tonality.Major, notes: [ Note.D, Note.E, Note.FsharpGflat, Note.G, Note.A, Note.B, Note.CsharpDflat ] },
  { name: "E Major", tonality: Tonality.Major, notes: [ Note.E, Note.FsharpGflat, Note.GsharpAflat, Note.A, Note.B, Note.CsharpDflat, Note.DsharpEflat ] },
  { name: "F Major", tonality: Tonality.Major, notes: [ Note.F, Note.G, Note.A, Note.AsharpBflat, Note.C, Note.D, Note.E ] },
  { name: "G Major", tonality: Tonality.Major, notes: [ Note.G, Note.A, Note.B, Note.C, Note.D, Note.E, Note.FsharpGflat ] },
  { name: "A Major", tonality: Tonality.Major, notes: [ Note.A, Note.B, Note.CsharpDflat, Note.D, Note.E, Note.FsharpGflat, Note.GsharpAflat ] },
  { name: "B Major", tonality: Tonality.Major, notes: [ Note.B, Note.CsharpDflat, Note.DsharpEflat, Note.E, Note.FsharpGflat, Note.GsharpAflat, Note.AsharpBflat ] },
  { name: "C#/D♭ Major", tonality: Tonality.Major, notes: [ Note.CsharpDflat, Note.DsharpEflat, Note.F, Note.FsharpGflat, Note.GsharpAflat, Note.AsharpBflat, Note.C ] },
  { name: "D#/E♭ Major", tonality: Tonality.Major, notes: [ Note.DsharpEflat, Note.F, Note.G, Note.GsharpAflat, Note.AsharpBflat, Note.C, Note.D ] },
  { name: "F#/G♭ Major", tonality: Tonality.Major, notes: [ Note.FsharpGflat, Note.GsharpAflat, Note.AsharpBflat, Note.B, Note.CsharpDflat, Note.DsharpEflat, Note.F ] },
  { name: "G#/A♭ Major", tonality: Tonality.Major, notes: [ Note.GsharpAflat, Note.AsharpBflat, Note.C, Note.CsharpDflat, Note.DsharpEflat, Note.F, Note.G ] },
  { name: "A#/B♭ Major", tonality: Tonality.Major, notes: [ Note.AsharpBflat, Note.C, Note.D, Note.DsharpEflat, Note.F, Note.G, Note.A ] },

  // Natural Minor Scale
  { name: "A Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.A, Note.B, Note.C, Note.D, Note.E, Note.F, Note.G ] },
  { name: "B Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.B, Note.CsharpDflat, Note.D, Note.E, Note.FsharpGflat, Note.G, Note.A ] },
  { name: "C Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.C, Note.D, Note.DsharpEflat, Note.F, Note.G, Note.GsharpAflat, Note.AsharpBflat ] },
  { name: "D Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.D, Note.E, Note.F, Note.G, Note.A, Note.AsharpBflat, Note.C ] },
  { name: "E Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.E, Note.FsharpGflat, Note.G, Note.A, Note.B, Note.C, Note.D ] },
  { name: "F Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.F, Note.G, Note.GsharpAflat, Note.AsharpBflat, Note.C, Note.CsharpDflat, Note.DsharpEflat ] },
  { name: "G Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.G, Note.A, Note.AsharpBflat, Note.C, Note.D, Note.DsharpEflat, Note.F ] },
  { name: "A#/B♭ Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.AsharpBflat, Note.C, Note.CsharpDflat, Note.DsharpEflat, Note.F, Note.FsharpGflat, Note.GsharpAflat ] },
  { name: "C#/D♭ Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.CsharpDflat, Note.DsharpEflat, Note.E, Note.FsharpGflat, Note.GsharpAflat, Note.A, Note.B ] },
  { name: "D#/E♭ Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.DsharpEflat, Note.F , Note.FsharpGflat, Note.GsharpAflat, Note.AsharpBflat, Note.B, Note.CsharpDflat ] },
  { name: "F#/G♭ Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.FsharpGflat, Note.GsharpAflat , Note.A, Note.B, Note.CsharpDflat, Note.D, Note.E ] },
  { name: "G#/A♭ Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.GsharpAflat, Note.AsharpBflat , Note.B, Note.CsharpDflat, Note.DsharpEflat, Note.E, Note.FsharpGflat ] },
];

// similarity が大きい順にソートされた Scale が返る
export function rankingSimilarScales(scales: Scale[], notes: Note[]): ScaleWithSimilarity[] {
  const ret: ScaleWithSimilarity[] = [];
  for (const scale of scales) {
    ret.push(calculateScaleSimilarity(scale, notes));
  }
  return ret.sort((a, b) => b.similarity - a.similarity);
}

function calculateScaleSimilarity(scale: Scale, notes: Note[]): ScaleWithSimilarity {
  let count = 0;
  for (const note of notes) {
    if (scale.notes.includes(note)) count++;
  }

  const similarity = count > 0 ? Number((count / scale.notes.length).toFixed(2)) : 0;

  return { scale, similarity };
}
