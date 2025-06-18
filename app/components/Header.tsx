import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import "~/scroll.css";
import logo from "~/assets/logo.png";
import whatsappIcon from "~/assets/whatsappWhite.svg";
import phoneIcon from "~/assets/call.svg";
import type { Pelayanan } from "~/models/Pelayanan";
import HeaderSearch from "./HeaderSearch";
import { useNavigate } from "react-router";
import ConfirmDialog from "./ConfirmDialog";

interface PelayananResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Pelayanan[];
}

const contacts = [
  { icon: whatsappIcon, name: "IGD", contact: "+62 814-5900-0183" },
  { icon: phoneIcon, name: "IGD", contact: "0336 621595" },
  { icon: phoneIcon, name: "Manajemen", contact: "0336 621017" },
  { icon: phoneIcon, name: "CS dan Aduan", contact: "+62 82233444722" },
];

export default function Header({
  pelayanan = [],
  isLogin = false,
}: {
  pelayanan?: Pelayanan[];
  isLogin?: boolean;
}) {
  const redirectUrl = "http://localhost:5173/google";
  const navigation = [
    { name: "Beranda", href: "/" },
    { name: "Profil", href: "/profile" },
    { name: "Berita", href: "/berita" },
    {
      name: "Informasi RS",
      submenu: [
        { name: "Dokter", href: "/dokter" },
        { name: "Jadwal Praktek", href: "/jadwal-dokter" },
        {
          name: "Ketersediaan Tempat Tidur",
          href: "https://rsdbalung.simkeskhanza.com/index.php?act=FasilitasKamar",
        },
      ],
    },
    {
      name: "Pelayanan",
      submenu: pelayanan.map((item) => ({
        name: item.nama_pelayanan,
        href: `/pelayanan/${item.id_pelayanan}`,
      })),
    },
    { name: "Aduan", href: "/aduan" },
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loopedContacts = [...contacts, ...contacts, ...contacts, ...contacts];
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/logout");
    console.log("Logout");
    setLogoutDialogOpen(false);
  };
  return (
    <>
      <header className="sticky inset-x-0 top-0 z-50 bg-white shadow-md">
        <div className="flex w-full overflow-x-hidden bg-dark-blue-900 p-2 text-white">
          <div className="flex gap-4">
            <div className="scroll-left flex w-max gap-4">
              {loopedContacts.map((contact, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <img
                    src={contact.icon}
                    alt={contact.name}
                    className="fill-white"
                  />
                  <p>
                    {contact.name}: {contact.contact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-4 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Rumah Sakit Daerah Balung</span>
              <img alt="" src={logo} className="h-8 w-auto" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden items-center lg:flex lg:flex-2 lg:gap-x-12">
            {navigation.map((item, index) =>
              item.submenu ? (
                <Popover
                  as="div"
                  className="relative -mx-3 block rounded-lg px-3 py-2 text-left text-base/7 font-semibold text-gray-900 hover:cursor-pointer hover:text-dark-blue-900"
                  key={index}
                >
                  <PopoverButton className="flex w-max items-center gap-2 outline-none hover:cursor-pointer">
                    {item.name}
                    <ChevronDownIcon className="h-4 w-4" />
                  </PopoverButton>
                  <PopoverPanel className="ring-opacity-5 absolute left-0 z-100 mt-2 w-56 rounded-md bg-white shadow-2xl ring-1 ring-gray-200 focus:outline-none">
                    {item.submenu.map((subitem, subindex) => (
                      <a
                        key={subindex}
                        href={subitem.href}
                        className="block w-full px-4 py-2 text-sm font-medium hover:text-dark-blue-950"
                      >
                        {subitem.name}
                      </a>
                    ))}
                  </PopoverPanel>
                </Popover>
              ) : (
                <a
                  key={index}
                  href={item.href}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:text-dark-blue-950"
                >
                  {item.name}
                </a>
              ),
            )}

            <HeaderSearch />

            {isLogin ? (
              <>
                <Popover as="div" className="relative">
                  <PopoverButton>
                    <UserCircleIcon className="h-8 w-8 text-gray-700 hover:text-dark-blue-900" />
                  </PopoverButton>
                  {/* <PopoverPanel className="ring-opacity-5 absolute right-0 z-100 mt-2 w-56 rounded-md bg-white shadow-2xl ring-1 ring-gray-200 focus:outline-none"> */}
                  <PopoverPanel className="absolute right-0 z-100 mt-2 flex w-fit flex-col rounded border border-gray-200 bg-white shadow-2xl">
                    <a
                      className="px-4 py-2 text-sm font-medium hover:text-dark-blue-950"
                      href="/akun"
                    >
                      Akun
                    </a>
                    <hr className="border-gray-200" />
                    <button
                      onClick={() => setLogoutDialogOpen(true)}
                      type="button"
                      className="-mx-3 block rounded-lg from-dark-blue-900 to-dark-blue-950 px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gradient-to-b hover:text-white"
                    >
                      Logout
                    </button>
                  </PopoverPanel>
                </Popover>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  target="_blank"
                  className="font-semibold hover:text-dark-blue-900"
                >
                  Masuk/Daftar
                </a>
              </>
            )}
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Rumah Sakit Daerah Balung</span>
                <img alt="Logo RSD Balung" src={logo} className="h-8 w-auto" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <HeaderSearch
                    setMobileMenuOpen={() => setMobileMenuOpen(false)}
                  />
                  {isLogin ? (
                    <>
                      <a
                        href="/akun"
                        className="-mx-3 block rounded-lg from-dark-blue-900 to-dark-blue-950 px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gradient-to-b hover:text-white"
                      >
                        Akun
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        href="/login"
                        target="_blank"
                        className="-mx-3 block rounded-lg from-dark-blue-900 to-dark-blue-950 px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gradient-to-b hover:text-white"
                      >
                        Masuk/Daftar
                      </a>
                    </>
                  )}

                  {navigation.map((item, index) =>
                    item.submenu ? (
                      <Menu
                        as="div"
                        className="group relative -mx-3 block rounded-lg from-dark-blue-900 to-dark-blue-950 px-3 py-2 text-left text-base/7 font-semibold text-gray-900 hover:cursor-pointer hover:bg-gradient-to-b hover:text-white"
                        key={index}
                      >
                        <MenuButton
                          // className="flex w-max items-center gap-2 outline-none hover:cursor-pointer"
                          className="flex w-full items-center justify-between gap-2 from-dark-blue-900 to-dark-blue-950 text-base font-semibold text-gray-900 group-hover:text-white hover:bg-gradient-to-b"
                        >
                          {item.name}
                          <ChevronDownIcon className="h-4 w-4" />
                        </MenuButton>
                        <MenuItems
                          anchor="bottom"
                          className="ring-opacity-5 absolute left-0 z-100 ms-5 mt-4 w-56 origin-top-left rounded-md bg-white font-semibold shadow-2xl ring-1 ring-gray-200 focus:outline-none"
                        >
                          {item.submenu.map((subitem, subindex) => (
                            <MenuItem key={subindex}>
                              {({ active }) => (
                                <a
                                  href={subitem.href}
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } block px-4 py-2 text-sm font-medium`}
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
                        className="-mx-3 block rounded-lg from-dark-blue-900 to-dark-blue-950 px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gradient-to-b hover:text-white"
                      >
                        {item.name}
                      </a>
                    ),
                  )}

                  {isLogin && (
                    <button
                      onClick={() => setLogoutDialogOpen(true)}
                      type="button"
                      className="-mx-3 block rounded-lg from-dark-blue-900 to-dark-blue-950 px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gradient-to-b hover:text-white"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
      <ConfirmDialog
        isOpen={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        cancelOnClick={() => setLogoutDialogOpen(false)}
        confirmOnClick={handleLogout}
        // title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar?"
        cancelLabel="Tidak"
        confirmLabel="Iya"
      />
    </>
  );
}
