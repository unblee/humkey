import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import * as React from "react";
import { Header } from "../components/Header.tsx";
import { Navbar } from "../components/Navbar.tsx";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );

export const Route = createRootRoute({
  component: () => {
    const [opened, { toggle }] = useDisclosure();

    return (
      <>
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 200,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
          padding="md"
        >
          <AppShell.Header>
            <Header opened={opened} toggle={toggle} />
          </AppShell.Header>

          <AppShell.Navbar p="md">
            <Navbar opened={opened} toggle={toggle} />
          </AppShell.Navbar>

          <AppShell.Main>
            <Outlet />
          </AppShell.Main>
        </AppShell>
        <React.Suspense>
          <TanStackRouterDevtools />
        </React.Suspense>
      </>
    );
  },
});
