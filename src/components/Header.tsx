import { ActionIcon, Burger, Group, Text, Tooltip, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

type headerProps = {
  opened: boolean;
  toggle: () => void;
};

export function Header({ opened, toggle }: headerProps) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Group h="100%" px="md" justify="space-between">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Text size="xl" fw={900} variant="gradient" gradient={{ from: "blue", to: "cyan", deg: 90 }}>
        humkey
      </Text>
      <Tooltip label={colorScheme === "dark" ? "Light mode" : "Dark mode"}>
        <ActionIcon
          variant="default"
          onClick={() => {
            setColorScheme(colorScheme === "dark" ? "light" : "dark");
          }}
        >
          {colorScheme === "dark" ? <IconSun size="1rem" /> : <IconMoon size="1rem" />}
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
