import { Burger, Group, NavLink } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";

const navLinkItems = [
  {
    icon: IconSearch,
    label: "Scale Finder",
    href: "#fake",
  },
];

type navbarProps = {
  opened: boolean;
  toggle: () => void;
};

export function Navbar({ opened, toggle }: navbarProps) {
  const [active, setActive] = useState(0);

  return (
    <Group>
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      {navLinkItems.map((item, index) => (
        <NavLink
          href="#required-for-focus"
          key={item.label}
          active={index === active}
          label={item.label}
          leftSection={<item.icon size="1rem" />}
          onClick={() => setActive(index)}
        />
      ))}
    </Group>
  );
}
