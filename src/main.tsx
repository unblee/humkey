import React from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// biome-ignore lint/style/noNonNullAssertion:
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <MantineProvider defaultColorScheme="auto">
        <Notifications />
        <RouterProvider router={router} />
      </MantineProvider>
    </React.StrictMode>,
  );
}
