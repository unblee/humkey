import { createLazyFileRoute } from "@tanstack/react-router";
import { ScaleFinder } from "../components/ScaleFinder";

export const Route = createLazyFileRoute("/scale-finder")({
  component: () => <ScaleFinder />,
});
