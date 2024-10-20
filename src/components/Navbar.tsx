import { Burger, Group, NavLink } from "@mantine/core";
import { IconSearch, IconStack2 } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const navLinkItems: { icon: typeof IconSearch; label: string; to: string }[] = [
  {
    icon: IconSearch,
    label: "Scale Finder",
    to: "/scale-finder",
  },
  {
    icon: IconStack2,
    label: "Diatonic Chords",
    to: "/diatonic-chords",
  },
];

type navbarProps = {
  opened: boolean;
  toggle: () => void;
};

export function Navbar({ opened, toggle }: navbarProps) {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  return (
    <Group>
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      {navLinkItems.map((item, index) => (
        <NavLink
          key={item.label}
          active={index === active}
          label={item.label}
          leftSection={<item.icon size="1rem" />}
          onClick={() => {
            setActive(index);
            navigate({ to: item.to });
          }}
        />
      ))}
    </Group>
  );
}
