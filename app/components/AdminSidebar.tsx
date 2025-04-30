import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  UserIcon,
  NewspaperIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";
import logo from "~/assets/logo-text-white.png";
import logoBlack from "~/assets/logo-black.png";
import { NavLink } from "react-router";

const navigation = [
  { name: "Akun", href: "/admin/akun", icon: UserIcon },
  { name: "Berita", href: "/admin/berita", icon: NewspaperIcon },
  { name: "Layanan RS", href: "/admin/pelayanan", icon: BuildingOffice2Icon },
  { name: "Daftar Dokter", href: "/admin/dokter", icon: UserGroupIcon },
  { name: "Poli/Klinik", href: "/admin/poli", icon: BuildingLibraryIcon },
  {
    name: "Jadwal Praktek",
    href: "/admin/jadwal-dokter",
    icon: CalendarDaysIcon,
  },
  { name: "Aduan", href: "/admin/aduan", icon: ChatBubbleBottomCenterTextIcon },
];

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-950 to-blue-700 p-4 text-white lg:hidden">
        <button onClick={() => setSidebarOpen(true)}>
          <Bars3Icon className="h-6 w-6" />
        </button>
        <img src={logo} alt="Logo" className="h-8" />
      </div>

      {/* Mobile Drawer */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="lg:hidden">
        <div className="bg-opacity-25 fixed inset-0 z-40 bg-black" />
        <DialogPanel className="fixed top-0 left-0 z-50 h-full w-64 bg-white p-4 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <img src={logoBlack} alt="Logo" className="h-8" />
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-blue-100 text-blue-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </NavLink>
            ))}
            <button className="mt-4 flex w-full items-center gap-3 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600">
              <ArrowLeftEndOnRectangleIcon className="h-4 w-4" />
              Keluar
            </button>
          </nav>
        </DialogPanel>
      </Dialog>

      {/* Desktop Sidebar */}
      <aside className="hidden bg-gradient-to-r from-blue-950 to-blue-700 p-4 text-white lg:fixed lg:inset-y-0 lg:flex lg:w-54 lg:flex-col">
        <div className="mb-8 flex items-center justify-center">
          <img src={logo} alt="Logo" className="h-10" />
        </div>
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-white text-blue-800"
                    : "text-white hover:bg-blue-800"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <button className="mt-6 flex items-center gap-3 rounded-md bg-red-500 px-3 py-2 text-sm font-medium hover:bg-red-600">
          <ArrowLeftEndOnRectangleIcon className="h-4 w-4" />
          Keluar
        </button>
      </aside>

      {/* Offset for content */}
      <div className="lg:ml-54" />
    </>
  );
}
