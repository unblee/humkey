import { describe, expect, test } from "vitest";
import { Note, normalizeNotesSequence } from "./note.ts";

describe("normalizeNotesSequence", () => {
  test("normal case", () => {
    expect(normalizeNotesSequence([Note.C, Note.D, Note.E])).toStrictEqual([0, 2, 4]);
  });

  test("octave changes", () => {
    expect(normalizeNotesSequence([Note.C, Note.D, Note.C, Note.D, Note.C, Note.D])).toStrictEqual([
      0, 2, 12, 14, 24, 26,
    ]);
  });

  test("length is 0", () => {
    expect(normalizeNotesSequence([])).toStrictEqual([]);
  });
});
