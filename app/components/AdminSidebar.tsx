import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftEndOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
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
import { NavLink, useNavigate } from "react-router";
import ConfirmDialog from "./ConfirmDialog";

const navigation = [
  { name: "Beranda", href: "/humasbalung/home", icon: HomeIcon },
  { name: "Akun", href: "/humasbalung/akun", icon: UserIcon },
  { name: "Berita", href: "/humasbalung/berita", icon: NewspaperIcon },
  {
    name: "Layanan RS",
    href: "/humasbalung/pelayanan",
    icon: BuildingOffice2Icon,
  },
  { name: "Daftar Dokter", href: "/humasbalung/dokter", icon: UserGroupIcon },
  { name: "Poli/Klinik", href: "/humasbalung/poli", icon: BuildingLibraryIcon },
  {
    name: "Jadwal Praktek",
    href: "/humasbalung/jadwal-dokter",
    icon: CalendarDaysIcon,
  },
  {
    name: "Aduan",
    href: "/humasbalung/aduan",
    icon: ChatBubbleBottomCenterTextIcon,
  },
];

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include", // penting supaya cookie juga dikirim & dihapus
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // Bisa tambahkan notifikasi error di sini jika mau
    } finally {
      setLogoutDialogOpen(false);
      navigate("/"); // redirect ke halaman utama
    }
  };

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
                onClick={() => setSidebarOpen(false)}
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
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
            <button
              onClick={() => setLogoutDialogOpen(true)}
              className="mt-4 flex w-full items-center gap-3 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
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
        <button
          onClick={() => setLogoutDialogOpen(true)}
          className="mt-6 flex items-center gap-3 rounded-md bg-red-500 px-3 py-2 text-sm font-medium hover:cursor-pointer hover:bg-red-600"
        >
          <ArrowLeftEndOnRectangleIcon className="h-4 w-4" />
          Keluar
        </button>
      </aside>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        cancelOnClick={() => setLogoutDialogOpen(false)}
        confirmOnClick={handleLogout}
        description="Apakah Anda yakin ingin keluar?"
        cancelLabel="Batal"
        confirmLabel="Keluar"
      />

      <div className="lg:ml-54" />
    </>
  );
}
