import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import PWABadge from "./PWABadge.tsx";
import { Header } from "./components/Header.tsx";
import { Navbar } from "./components/Navbar.tsx";

function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 150,
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

      <AppShell.Main>Main</AppShell.Main>

      <PWABadge />
    </AppShell>
  );
}

export default App;
