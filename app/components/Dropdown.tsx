import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export default function Dropdown({ name }: { name: string }) {
  const menu = [
    { name: "Home", href: "/" },
    { name: "Profile", href: "/profil" },
    { name: "Jadwal Dokter", href: "#" },
    { name: "Layanan", href: "#" },
    { name: "Aduan", href: "#" },
  ];
  return (
    <Menu>
      <MenuButton className="bg-white">{name}</MenuButton>
      <MenuItems anchor="bottom">
        {menu.map((nav,index) => (
          <MenuItem key={index}>
            <a className="block data-[focus]:bg-blue-100" href={nav.href}>
              {nav.name}
            </a>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
