import React from 'react';
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { X, ChevronDown } from 'lucide-react';

interface SubMenuItem {
  name: string;
  href: string;
}

interface NavigationItem {
  name: string;
  href?: string;
  submenu?: SubMenuItem[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
  logo: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navigation, logo }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="lg:hidden"
    >
      <div className="fixed inset-0 z-50 bg-black/20" aria-hidden="true" />
      <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Rumah Sakit Daerah Balung</span>
            <img alt="Logo RSD Balung" src={logo} className="h-8 w-auto" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Close menu</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              {navigation.map((item, index) =>
                item.submenu ? (
                  <Menu
                    as="div"
                    className="relative -mx-3 block rounded-lg px-3 py-2 text-left text-base font-semibold text-gray-900 hover:bg-gray-50"
                    key={index}
                  >
                    <MenuButton className="flex w-full items-center justify-between text-base font-semibold text-gray-900">
                      {item.name}
                      <ChevronDown className="h-4 w-4" />
                    </MenuButton>
                    <MenuItems
                      className="mt-1 ml-4 space-y-1"
                    >
                      {item.submenu.map((subitem, subindex) => (
                        <MenuItem key={subindex}>
                          {({ active }) => (
                            <a
                              href={subitem.href}
                              className={`${
                                active ? "bg-gray-100" : ""
                              } block px-4 py-2 text-sm font-medium rounded-md`}
                            >
                              {subitem.name}
                            </a>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                ) : (
                  <a
                    key={index}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ),
              )}
            </div>
            <div className="py-6">
              <div className="mb-4">
                <form className="relative">
                  <input
                    type="search"
                    placeholder="Cari"
                    className="w-full rounded-full border border-gray-300 py-2 pl-4 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </form>
              </div>
              <a
                href="/login"
                className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                Masuk/Daftar
              </a>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default MobileMenu;