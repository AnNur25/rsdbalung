import React from 'react';
import {
  Popover,
  PopoverButton,
  PopoverPanel
} from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';

interface SubMenuItem {
  name: string;
  href: string;
}

interface NavItemProps {
  name: string;
  href?: string;
  submenu?: SubMenuItem[];
}

const NavItem: React.FC<NavItemProps> = ({ name, href, submenu }) => {
  if (submenu) {
    return (
      <Popover className="relative">
        <PopoverButton className="flex items-center gap-1 font-medium text-gray-700 hover:text-blue-600 outline-none">
          {name}
          <ChevronDownIcon className="h-4 w-4" />
        </PopoverButton>
        <PopoverPanel className="absolute left-0 z-10 mt-2 w-56 rounded-md bg-white p-1 shadow-lg ring-1 ring-gray-200 focus:outline-none">
          <div className="py-1">
            {submenu.map((subitem, subindex) => (
              <a
                key={subindex}
                href={subitem.href}
                className="block w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md"
              >
                {subitem.name}
              </a>
            ))}
          </div>
        </PopoverPanel>
      </Popover>
    );
  }

  return (
    <a
      href={href}
      className="font-medium text-gray-700 hover:text-blue-600"
    >
      {name}
    </a>
  );
};

export default NavItem;