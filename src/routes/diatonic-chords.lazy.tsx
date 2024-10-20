import { createLazyFileRoute } from "@tanstack/react-router";
import { DiatonicChords } from "../components/DiatonicChords";

export const Route = createLazyFileRoute("/diatonic-chords")({
  component: () => <DiatonicChords />,
});
