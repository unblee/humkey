const HALF_STEP = 1; // 半音
const WHOLE_STEP = HALF_STEP * 2; // 全音
const OCTAVE = HALF_STEP * 12;

function isNoteNumber(n: number): boolean {
  return 0 <= n && n <= 127 && Number.isInteger(n);
}

function isOctaveNumber(n: number): boolean {
  return -2 <= n && n <= 8 && Number.isInteger(n);
}

function isOctaveShiftRange(n: number): boolean {
  return -10 <= n && n <= 10 && Number.isInteger(n);
}

function parseOctaveNumber(noteNumber: number): number | undefined {
  if (!isNoteNumber(noteNumber)) return undefined;

  return Math.trunc(noteNumber / OCTAVE) - 2;
}

const NOTE_NAME_C = "C";
const NOTE_NAME_CSHARP_DFLAT = "C#/D♭";
const NOTE_NAME_D = "D";
const NOTE_NAME_DSHARP_EFLAT = "D#/E♭";
const NOTE_NAME_E = "E";
const NOTE_NAME_F = "F";
const NOTE_NAME_FSHARP_GFLAT = "F#/G♭";
const NOTE_NAME_G = "G";
const NOTE_NAME_GSHARP_AFLAT = "G#/A♭";
const NOTE_NAME_A = "A";
const NOTE_NAME_ASHARP_BFLAT = "A#/B♭";
const NOTE_NAME_B = "B";

class Note {
  readonly name: string;
  readonly noteNumber: number; // 0 ~ 127
  readonly octaveNumber: number; // -2 ~ 8

  constructor(noteNumber: number) {
    if (isNoteNumber(noteNumber)) {
      throw new Error(`${noteNumber} is invalid MIDI note number (required 0 <= n <= 127)`);
    }
    this.noteNumber = noteNumber;
    // biome-ignore lint/style/noNonNullAssertion: 事前に noteNumber の validation をしているので non-null assertions できる
    this.octaveNumber = parseOctaveNumber(noteNumber)!;
    this.name = this.parseNoteName(noteNumber);
  }

  private parseNoteName(n: number): string {
    // biome-ignore format:
    switch (n % OCTAVE) {
      case 0: return NOTE_NAME_C;
      case 1: return NOTE_NAME_CSHARP_DFLAT;
      case 2: return NOTE_NAME_D;
      case 3: return NOTE_NAME_DSHARP_EFLAT;
      case 4: return NOTE_NAME_E;
      case 5: return NOTE_NAME_F;
      case 6: return NOTE_NAME_FSHARP_GFLAT;
      case 7: return NOTE_NAME_G;
      case 8: return NOTE_NAME_GSHARP_AFLAT;
      case 9: return NOTE_NAME_A;
      case 10: return NOTE_NAME_ASHARP_BFLAT;
      default: return NOTE_NAME_B;
    }
  }

  // オクターブ番号は YAMAHA 式の C-2=0, C3=60, G8=127 を用いる
  setOctave(n: number): Note | undefined {
    if (!isOctaveNumber(n)) return undefined;

    const baseNoteNumber = this.toBase().noteNumber;
    const setOctaveNoteNumber = (n + 2) * OCTAVE + baseNoteNumber;
    if (!isNoteNumber(setOctaveNoteNumber)) return undefined;

    return new Note(setOctaveNoteNumber);
  }

  shiftOctave(n: number): Note | undefined {
    if (!isOctaveShiftRange(n)) return undefined;

    const shiftedNoteNumber = n * OCTAVE + this.noteNumber;
    if (!isNoteNumber(shiftedNoteNumber)) return undefined;

    return new Note(shiftedNoteNumber);
  }

  // e.g. C#3/D♭3
  nameWithOctaveNumber(): string {
    const pattern = /([#♭])/g;
    return this.name.replaceAll(pattern, `$1${this.octaveNumber}`);
  }

  toBase(): Note {
    return new Note(this.noteNumber % OCTAVE);
  }

  shiftHalfStep(n: number): Note | undefined {
    const noteNumber = this.noteNumber + HALF_STEP * n;
    if (!isNoteNumber(noteNumber)) return undefined;
    return new Note(noteNumber);
  }

  shiftWholeStep(n: number): Note | undefined {
    const noteNumber = this.noteNumber + WHOLE_STEP * n;
    if (!isNoteNumber(noteNumber)) return undefined;
    return new Note(noteNumber);
  }

  // --------------- Interval names ---------------

  // Add 0 half step
  unison(): Note | undefined {
    return this.shiftHalfStep(0);
  }
  diminishedSecond(): Note | undefined {
    return this.unison();
  }

  // Add 1 half step
  minorSecond(): Note | undefined {
    return this.shiftHalfStep(1);
  }
  augmentedUnison(): Note | undefined {
    return this.minorSecond();
  }

  // Add 2 half step
  majorSecond(): Note | undefined {
    return this.shiftHalfStep(2);
  }
  diminishedThird(): Note | undefined {
    return this.majorSecond();
  }

  // Add 3 half step
  minorThird(): Note | undefined {
    return this.shiftHalfStep(3);
  }
  augmentedSecond(): Note | undefined {
    return this.minorThird();
  }

  // Add 4 half step
  majorThird(): Note | undefined {
    return this.shiftHalfStep(4);
  }
  diminishedFourth(): Note | undefined {
    return this.majorThird();
  }

  // Add 5 half step
  perfectFourth(): Note | undefined {
    return this.shiftHalfStep(5);
  }
  augmentedThird(): Note | undefined {
    return this.perfectFourth();
  }

  // Add 6 half step
  diminishedFifth(): Note | undefined {
    return this.shiftHalfStep(6);
  }
  augmentedFourth(): Note | undefined {
    return this.diminishedFifth();
  }

  // Add 7 half step
  perfectFifth(): Note | undefined {
    return this.shiftHalfStep(7);
  }
  diminishedSixth(): Note | undefined {
    return this.perfectFifth();
  }

  // Add 8 half step
  minorSixth(): Note | undefined {
    return this.shiftHalfStep(8);
  }
  augmentedFifth(): Note | undefined {
    return this.minorSixth();
  }

  // Add 9 half step
  majorSixth(): Note | undefined {
    return this.shiftHalfStep(9);
  }
  diminishedSeventh(): Note | undefined {
    return this.majorSixth();
  }

  // Add 10 half step
  minorSeventh(): Note | undefined {
    return this.shiftHalfStep(10);
  }
  augmentedSixth(): Note | undefined {
    return this.minorSeventh();
  }

  // Add 11 half step
  majorSeventh(): Note | undefined {
    return this.shiftHalfStep(11);
  }
  diminishedOctave(): Note | undefined {
    return this.majorSeventh();
  }

  // Add 12 half step
  octave(): Note | undefined {
    return this.shiftHalfStep(12);
  }
  augmentedSeventh(): Note | undefined {
    return this.octave();
  }
  diminishedNinth(): Note | undefined {
    return this.octave();
  }

  // Add 13 half step
  minorNinth(): Note | undefined {
    return this.shiftHalfStep(13);
  }
  augmentedOctave(): Note | undefined {
    return this.minorNinth();
  }

  // Add 14 half step
  majorNinth(): Note | undefined {
    return this.shiftHalfStep(14);
  }
  diminishedTenth(): Note | undefined {
    return this.majorNinth();
  }

  // Add 15 half step
  minorTenth(): Note | undefined {
    return this.shiftHalfStep(15);
  }
  augmentedNinth(): Note | undefined {
    return this.minorTenth();
  }

  // Add 16 half step
  majorTenth(): Note | undefined {
    return this.shiftHalfStep(16);
  }
  diminishedEleventh(): Note | undefined {
    return this.majorTenth();
  }

  // Add 17 half step
  perfectEleventh(): Note | undefined {
    return this.shiftHalfStep(17);
  }
  augmentedTenth(): Note | undefined {
    return this.perfectEleventh();
  }

  // Add 18 half step
  diminishedTwelfth(): Note | undefined {
    return this.shiftHalfStep(18);
  }
  augmentedEleventh(): Note | undefined {
    return this.diminishedTwelfth();
  }

  // Add 19 half step
  perfectTwelfth(): Note | undefined {
    return this.shiftHalfStep(19);
  }
  tritave(): Note | undefined {
    return this.perfectTwelfth();
  }
  diminishedThirteenth(): Note | undefined {
    return this.perfectTwelfth();
  }

  // Add 20 half step
  minorThirteenth(): Note | undefined {
    return this.shiftHalfStep(20);
  }
  augmentedTwelfth(): Note | undefined {
    return this.minorThirteenth();
  }

  // Add 21 half step
  majorThirteenth(): Note | undefined {
    return this.shiftHalfStep(21);
  }
  diminishedFourteenth(): Note | undefined {
    return this.majorThirteenth();
  }
}

const NoteBaseC = new Note(0);
const NoteBaseCsharpDflat = new Note(1);
const NoteBaseD = new Note(2);
const NoteBaseDsharpEflat = new Note(3);
const NoteBaseE = new Note(4);
const NoteBaseF = new Note(5);
const NoteBaseFsharpGflat = new Note(6);
const NoteBaseG = new Note(7);
const NoteBaseGsharpAflat = new Note(8);
const NoteBaseA = new Note(9);
const NoteBaseAsharpBflat = new Note(10);
const NoteBaseB = new Note(11);

type ChordStructureNotes = [Note, Note, ...Note[]];

function parseChordStructureNotes(notes: (Note | undefined)[]): ChordStructureNotes | undefined {
  if (notes.length < 2) return undefined;

  const ret: Note[] = [];
  for (const note of notes) {
    if (!note) return undefined;
    ret.push(note);
  }
  ret.sort((a, b) => a.noteNumber - b.noteNumber);

  // biome-ignore lint/style/noNonNullAssertion:
  return [ret.at(0)!, ret.at(1)!, ...ret.slice(2)];
}

class Chord {
  constructor(
    readonly name: string,
    readonly structureNotes: ChordStructureNotes,
  ) {}

  root(): Note {
    // biome-ignore lint/style/noNonNullAssertion:
    return this.structureNotes.at(0)!;
  }

  private omit(chordName: string, omitNotes: (Note | undefined)[]): Chord | undefined {
    if (this.structureNotes.length <= 2) return undefined;

    const definedOmitNotes: Note[] = [];
    for (const omitNote of omitNotes) {
      if (!omitNote) return undefined;
      definedOmitNotes.push(omitNote);
    }

    const isOmit = (note: Note): boolean => {
      return definedOmitNotes.map((omitNote) => omitNote.noteNumber).includes(note.noteNumber);
    };

    const returnNotes: Note[] = [];
    for (const note of this.structureNotes) {
      if (isOmit(note)) continue;
      returnNotes.push(note);
    }

    const chordStructureNotes = parseChordStructureNotes(returnNotes);
    if (!chordStructureNotes) return undefined;

    return new Chord(chordName, chordStructureNotes);
  }

  omit3(): Chord | undefined {
    return this.omit(`${this.name}(omit3)`, [this.root().majorThird(), this.root().minorThird()]);
  }

  omit5(): Chord | undefined {
    return this.omit(`${this.name}(omit5)`, [this.root().perfectFifth()]);
  }

  // オクターブ番号は YAMAHA 式の C-2=0, C3=60, G8=127 を用いる
  octave(n: number): Chord | undefined {
    if (isOctaveNumber(n)) return undefined;

    const changedOctaveNotes: (Note | undefined)[] = [];
    for (const note of this.structureNotes) {
      changedOctaveNotes.push(note.setOctave(n));
    }
    const chordStructureNotes = parseChordStructureNotes(changedOctaveNotes);
    if (!chordStructureNotes) return undefined;
    return new Chord(this.name, chordStructureNotes);
  }

  // --------------- Dyad Chords ---------------

  static powerChord(base: Note): Chord | undefined {
    const name = base.name;
    const structureNotes = parseChordStructureNotes([base, base.perfectFifth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  // --------------- Triad Chords ---------------

  static majorTriad(base: Note): Chord | undefined {
    const name = base.name;
    const structureNotes = parseChordStructureNotes([base, base.majorThird(), base.perfectFifth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static minorTriad(base: Note): Chord | undefined {
    const name = `${base.name}m`;
    const structureNotes = parseChordStructureNotes([base, base.minorThird(), base.perfectFifth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static augmentedTriad(base: Note): Chord | undefined {
    const name = `${base.name}aug`;
    const structureNotes = parseChordStructureNotes([base, base.majorThird(), base.augmentedFifth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static diminishedTriad(base: Note): Chord | undefined {
    const name = `${base.name}dim`;
    const structureNotes = parseChordStructureNotes([base, base.minorThird(), base.diminishedFifth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  // --------------- Sixth Chords ---------------

  static majorSixth(base: Note): Chord | undefined {
    const name = `${base.name}6`;
    const structureNotes = parseChordStructureNotes([base, base.majorThird(), base.perfectFifth(), base.majorSixth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static minorSixth(base: Note): Chord | undefined {
    const name = `${base.name}m6`;
    const structureNotes = parseChordStructureNotes([base, base.minorThird(), base.perfectFifth(), base.majorSixth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  // --------------- Seventh Chords ---------------

  static diminishedSeventh(base: Note): Chord | undefined {
    const name = `${base.name}dim7`;
    const structureNotes = parseChordStructureNotes([
      base,
      base.minorThird(),
      base.diminishedFifth(),
      base.diminishedSeventh(),
    ]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static halfDiminishedSeventh(base: Note): Chord | undefined {
    const name = `${base.name}m7♭5`;
    const structureNotes = parseChordStructureNotes([
      base,
      base.minorThird(),
      base.diminishedFifth(),
      base.minorSeventh(),
    ]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static minorSeventh(base: Note): Chord | undefined {
    const name = `${base.name}m7`;
    const structureNotes = parseChordStructureNotes([
      base,
      base.minorThird(),
      base.perfectFifth(),
      base.minorSeventh(),
    ]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static minorMajorSeventh(base: Note): Chord | undefined {
    const name = `${base.name}m(M7)`;
    const structureNotes = parseChordStructureNotes([
      base,
      base.minorThird(),
      base.perfectFifth(),
      base.majorSeventh(),
    ]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static dominantSeventh(base: Note): Chord | undefined {
    const name = `${base.name}dom7`;
    const structureNotes = parseChordStructureNotes([
      base,
      base.majorThird(),
      base.perfectFifth(),
      base.minorSeventh(),
    ]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static majorSeventh(base: Note): Chord | undefined {
    const name = `${base.name}7`;
    const structureNotes = parseChordStructureNotes([
      base,
      base.majorThird(),
      base.perfectFifth(),
      base.majorSeventh(),
    ]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static augmentedSeventh(base: Note): Chord | undefined {
    const name = `${base.name}aug7`;
    const structureNotes = parseChordStructureNotes([
      base,
      base.majorThird(),
      base.augmentedFifth(),
      base.minorSeventh(),
    ]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static augmentedMajorSeventh(base: Note): Chord | undefined {
    const name = `${base.name}aug7(#5)`;
    const structureNotes = parseChordStructureNotes([
      base,
      base.majorThird(),
      base.augmentedFifth(),
      base.majorSeventh(),
    ]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  // --------------- Extended Chord ---------------

  static dominantNinth(base: Note): Chord | undefined {
    const name = `${base.name}dom9`;
    const dominantSeventh = Chord.dominantSeventh(base);
    if (!dominantSeventh) return undefined;
    const structureNotes = parseChordStructureNotes([...dominantSeventh.structureNotes, base.majorNinth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static dominantEleventh(base: Note): Chord | undefined {
    const name = `${base.name}dom11`;
    const dominantSeventh = Chord.dominantSeventh(base);
    if (!dominantSeventh) return undefined;
    const dominantSeventhOmit3 = dominantSeventh.omit3();
    if (!dominantSeventhOmit3) return undefined;
    const structureNotes = parseChordStructureNotes([
      ...dominantSeventhOmit3.structureNotes,
      base.majorNinth(),
      base.perfectEleventh(),
    ]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static dominantThirteenth(base: Note): Chord | undefined {
    const name = `${base.name}dom13`;
    const dominantSeventh = Chord.dominantSeventh(base);
    if (!dominantSeventh) return undefined;
    const structureNotes = parseChordStructureNotes([
      ...dominantSeventh.structureNotes,
      base.majorNinth(),
      base.majorThirteenth(),
    ]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  // --------------- Altered Chord ---------------

  static seventhAugmentedFifth(base: Note): Chord | undefined {
    const name = `${base.name}7#5`;
    const dominantSeventh = Chord.dominantSeventh(base);
    if (!dominantSeventh) return undefined;
    const dominantSeventhOmit5 = dominantSeventh.omit5();
    if (!dominantSeventhOmit5) return undefined;
    const structureNotes = parseChordStructureNotes([...dominantSeventhOmit5.structureNotes, base.augmentedFifth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static seventhMinorNinth(base: Note): Chord | undefined {
    const name = `${base.name}7♭9`;
    const dominantSeventh = Chord.dominantSeventh(base);
    if (!dominantSeventh) return undefined;
    const structureNotes = parseChordStructureNotes([...dominantSeventh.structureNotes, base.minorNinth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static seventhSharpNinth(base: Note): Chord | undefined {
    const name = `${base.name}7#9`;
    const dominantSeventh = Chord.dominantSeventh(base);
    if (!dominantSeventh) return undefined;
    const structureNotes = parseChordStructureNotes([...dominantSeventh.structureNotes, base.augmentedNinth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static seventhAugmentedEleventh(base: Note): Chord | undefined {
    const name = `${base.name}7#11`;
    const dominantSeventh = Chord.dominantSeventh(base);
    if (!dominantSeventh) return undefined;
    const structureNotes = parseChordStructureNotes([...dominantSeventh.structureNotes, base.augmentedEleventh()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static seventhDiminishedThirteenth(base: Note): Chord | undefined {
    const name = `${base.name}7♭13`;
    const dominantSeventh = Chord.dominantSeventh(base);
    if (!dominantSeventh) return undefined;
    const structureNotes = parseChordStructureNotes([...dominantSeventh.structureNotes, base.minorThirteenth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  // --------------- Added tone Chord ---------------

  static addNine(base: Note): Chord | undefined {
    const name = `${base.name}add9`;
    const majorTriad = Chord.majorTriad(base);
    if (!majorTriad) return undefined;
    const structureNotes = parseChordStructureNotes([...majorTriad.structureNotes, base.majorNinth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static addEleventh(base: Note): Chord | undefined {
    const name = `${base.name}add11`;
    const majorTriad = Chord.majorTriad(base);
    if (!majorTriad) return undefined;
    const structureNotes = parseChordStructureNotes([...majorTriad.structureNotes, base.perfectFourth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static sixNine(base: Note): Chord | undefined {
    const name = `${base.name}6/9`;
    const majorTriad = Chord.majorTriad(base);
    if (!majorTriad) return undefined;
    const structureNotes = parseChordStructureNotes([
      ...majorTriad.structureNotes,
      base.majorSixth(),
      base.majorNinth(),
    ]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static sevenSix(base: Note): Chord | undefined {
    const name = `${base.name}7/6`;
    const majorTriad = Chord.majorTriad(base);
    if (!majorTriad) return undefined;
    const structureNotes = parseChordStructureNotes([
      ...majorTriad.structureNotes,
      base.majorSixth(),
      base.minorSeventh(),
    ]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  // --------------- Suspended Chord ---------------

  static suspendedSecond(base: Note): Chord | undefined {
    const name = `${base.name}sus2`;
    const powerChord = Chord.powerChord(base);
    if (!powerChord) return undefined;
    const structureNotes = parseChordStructureNotes([...powerChord.structureNotes, base.majorSecond()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static suspendedFourth(base: Note): Chord | undefined {
    const name = `${base.name}sus4`;
    const powerChord = Chord.powerChord(base);
    if (!powerChord) return undefined;
    const structureNotes = parseChordStructureNotes([...powerChord.structureNotes, base.perfectFourth()]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }

  static ninthSuspendedFourth(base: Note): Chord | undefined {
    const name = `${base.name}9sus4`;
    const powerChord = Chord.powerChord(base);
    if (!powerChord) return undefined;
    const structureNotes = parseChordStructureNotes([
      ...powerChord.structureNotes,
      base.perfectFourth(),
      base.minorSeventh(),
      base.majorNinth(),
    ]);
    if (!structureNotes) return undefined;
    return new Chord(name, structureNotes);
  }
}

class Scale {
  readonly name: string;
  readonly key: Note;
  readonly intervals: Interval[];
  readonly notes: Note[];

  constructor(name: string, key: Note, intervals: Interval[]) {
    this.name = name;
    this.key = key.toBase(); // Scale でオクターブ位置を気にすることはほぼ無いと思われるので最低オクターブ位置にする
    this.intervals = intervals;
    this.notes = this.pickScaleNotes();
  }

  private pickScaleNotes(): Note[] {
    const ret = [this.key];
    for (const interval of this.intervals) {
      // biome-ignore lint/style/noNonNullAssertion: 事前に配列に要素を入れているので non-null assertions できる
      const lastNoteNumber = ret.at(-1)!.noteNumber;
      const nextNoteNumber = lastNoteNumber + interval;
      // NOTE: constructor で key note を最低オクターブ位置にしているので nextNoteNumber がノート番号の範囲は超えないため validation していない
      ret.push(new Note(nextNoteNumber));
    }
    return ret;
  }

  degree(n: number): Note | undefined {
    return this.notes.at(n);
  }

  diatonicChords(): Chord[] {
    return [
      new Chord("", [NoteBaseC, NoteBaseC]),
      new Chord("", [NoteBaseC, NoteBaseC]),
      new Chord("", [NoteBaseC, NoteBaseC]),
      new Chord("", [NoteBaseC, NoteBaseC]),
      new Chord("", [NoteBaseC, NoteBaseC]),
      new Chord("", [NoteBaseC, NoteBaseC]),
      new Chord("", [NoteBaseC, NoteBaseC]),
    ];
  }

  // diatonicChords(): Chord[] {
  //   return this.notes.map(note=>)
  // }
  //
  // triad(key:number): Chord {
  //   return[]
  // }
}

// // biome-ignore format: the array should not be formatted
// export const commonScales: Scale[] = [
//   // Major Scale
//   { name: "C Major", tonality: Tonality.Major, notes: [ Note.C, Note.D, Note.E, Note.F, Note.G, Note.A, Note.B ] },
//   { name: "C#/D♭ Major", tonality: Tonality.Major, notes: [ Note.CsharpDflat, Note.DsharpEflat, Note.F, Note.FsharpGflat, Note.GsharpAflat, Note.AsharpBflat, Note.C ] },
//   { name: "D Major", tonality: Tonality.Major, notes: [ Note.D, Note.E, Note.FsharpGflat, Note.G, Note.A, Note.B, Note.CsharpDflat ] },
//   { name: "D#/E♭ Major", tonality: Tonality.Major, notes: [ Note.DsharpEflat, Note.F, Note.G, Note.GsharpAflat, Note.AsharpBflat, Note.C, Note.D ] },
//   { name: "E Major", tonality: Tonality.Major, notes: [ Note.E, Note.FsharpGflat, Note.GsharpAflat, Note.A, Note.B, Note.CsharpDflat, Note.DsharpEflat ] },
//   { name: "F Major", tonality: Tonality.Major, notes: [ Note.F, Note.G, Note.A, Note.AsharpBflat, Note.C, Note.D, Note.E ] },
//   { name: "F#/G♭ Major", tonality: Tonality.Major, notes: [ Note.FsharpGflat, Note.GsharpAflat, Note.AsharpBflat, Note.B, Note.CsharpDflat, Note.DsharpEflat, Note.F ] },
//   { name: "G Major", tonality: Tonality.Major, notes: [ Note.G, Note.A, Note.B, Note.C, Note.D, Note.E, Note.FsharpGflat ] },
//   { name: "G#/A♭ Major", tonality: Tonality.Major, notes: [ Note.GsharpAflat, Note.AsharpBflat, Note.C, Note.CsharpDflat, Note.DsharpEflat, Note.F, Note.G ] },
//   { name: "A Major", tonality: Tonality.Major, notes: [ Note.A, Note.B, Note.CsharpDflat, Note.D, Note.E, Note.FsharpGflat, Note.GsharpAflat ] },
//   { name: "A#/B♭ Major", tonality: Tonality.Major, notes: [ Note.AsharpBflat, Note.C, Note.D, Note.DsharpEflat, Note.F, Note.G, Note.A ] },
//   { name: "B Major", tonality: Tonality.Major, notes: [ Note.B, Note.CsharpDflat, Note.DsharpEflat, Note.E, Note.FsharpGflat, Note.GsharpAflat, Note.AsharpBflat ] },
//
//   // Natural Minor Scale
//   { name: "A Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.A, Note.B, Note.C, Note.D, Note.E, Note.F, Note.G ] },
//   { name: "B Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.B, Note.CsharpDflat, Note.D, Note.E, Note.FsharpGflat, Note.G, Note.A ] },
//   { name: "C Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.C, Note.D, Note.DsharpEflat, Note.F, Note.G, Note.GsharpAflat, Note.AsharpBflat ] },
//   { name: "D Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.D, Note.E, Note.F, Note.G, Note.A, Note.AsharpBflat, Note.C ] },
//   { name: "E Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.E, Note.FsharpGflat, Note.G, Note.A, Note.B, Note.C, Note.D ] },
//   { name: "F Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.F, Note.G, Note.GsharpAflat, Note.AsharpBflat, Note.C, Note.CsharpDflat, Note.DsharpEflat ] },
//   { name: "G Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.G, Note.A, Note.AsharpBflat, Note.C, Note.D, Note.DsharpEflat, Note.F ] },
//   { name: "A#/B♭ Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.AsharpBflat, Note.C, Note.CsharpDflat, Note.DsharpEflat, Note.F, Note.FsharpGflat, Note.GsharpAflat ] },
//   { name: "C#/D♭ Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.CsharpDflat, Note.DsharpEflat, Note.E, Note.FsharpGflat, Note.GsharpAflat, Note.A, Note.B ] },
//   { name: "D#/E♭ Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.DsharpEflat, Note.F , Note.FsharpGflat, Note.GsharpAflat, Note.AsharpBflat, Note.B, Note.CsharpDflat ] },
//   { name: "F#/G♭ Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.FsharpGflat, Note.GsharpAflat , Note.A, Note.B, Note.CsharpDflat, Note.D, Note.E ] },
//   { name: "G#/A♭ Natural Minor", tonality: Tonality.NaturalMinor, notes: [ Note.GsharpAflat, Note.AsharpBflat , Note.B, Note.CsharpDflat, Note.DsharpEflat, Note.E, Note.FsharpGflat ] },
// ];

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
