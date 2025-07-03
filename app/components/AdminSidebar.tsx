"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftEndOnRectangleIcon,
  HomeIcon,
  PhotoIcon,
  GlobeAltIcon,
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
import axios from "axios";
import type { ComplaintModel } from "~/models/Complaint";

const navigation = [
  {
    name: "Beranda",
    icon: HomeIcon,
    submenu: [
      {
        name: "Banner & L.Unggulan",
        href: "/humasbalung/home",
        icon: PhotoIcon,
      },
      { name: "Foto Direktur", href: "/humasbalung/direktur", icon: PhotoIcon },
      {
        name: "Media Sosial",
        href: "/humasbalung/media-sosial",
        icon: GlobeAltIcon,
      },
    ],
  },
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
  const handleLogout = () => {
    navigate("/humasbalung/logout");
    console.log("Logout");
    setLogoutDialogOpen(false);
  };
  const [complaints, setComplaints] = useState<ComplaintModel[]>([]);
  const nComplaints = complaints.length;
  console.log("nComplaints", nComplaints);
  const nComplaint = localStorage.getItem("nComplaint") ?? "0";
  const nComplaintInt = parseInt(nComplaint, 10);
  const isUnread = nComplaintInt < nComplaints;
  useEffect(() => {
    const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/aduan/all`);
    axios.get(urlRequest.href).then((res) => {
      console.log(res);
      setComplaints(res.data.data.data_aduan);
    });
  }, []);
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
            <div className="flex flex-col gap-2">
              <img src={logoBlack} alt="Logo" className="h-8 w-fit" />
              <p className="text-sm text-gray-800">Admin Dashboard</p>
            </div>

            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) =>
              item.submenu ? (
                <Disclosure key={item.name}>
                  {({ open }) => (
                    <>
                      <DisclosureButton
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                          open
                            ? "bg-blue-100 text-blue-800"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                        <svg
                          className={`ml-auto h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </DisclosureButton>
                      <DisclosurePanel className="space-y-1">
                        {item.submenu.map((sub) => (
                          <NavLink
                            key={sub.name}
                            to={sub.href}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium ${
                                isActive
                                  ? "bg-blue-100 text-blue-800"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`
                            }
                          >
                            <sub.icon className="h-4 w-4" />
                            {sub.name}
                          </NavLink>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              ) : (
                <NavLink
                  onClick={() => setSidebarOpen(false)}
                  key={item.name}
                  to={item.href}
                  className={({ isActive }: { isActive: boolean }) =>
                    `relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-blue-100 text-blue-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}{" "}
                  {isUnread && item.name == "Aduan" && (
                    <div className="absolute top-2 left-6 h-2 w-2 rounded-full bg-red-600"></div>
                  )}
                </NavLink>
              ),
            )}
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
        <div className="mb-8 flex flex-col items-center justify-center gap-2">
          <img src={logo} alt="Logo" className="h-10" />
          <p>Admin Dashboard</p>
        </div>
        <nav className="flex-1 space-y-2">
          {navigation.map((item) =>
            item.submenu ? (
              <Disclosure key={item.name}>
                {({ open }) => (
                  <>
                    <DisclosureButton
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        open
                          ? "bg-white text-blue-800"
                          : "text-white hover:bg-blue-800"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                      <svg
                        className={`ml-auto h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </DisclosureButton>
                    <DisclosurePanel className="space-y-1">
                      {item.submenu.map((sub) => (
                        <NavLink
                          key={sub.name}
                          to={sub.href}
                          className={({ isActive }) =>
                            `flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-white text-blue-800"
                                : "text-white hover:bg-blue-900"
                            }`
                          }
                        >
                          <sub.icon className="h-4 w-4" />
                          {sub.name}
                        </NavLink>
                      ))}
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            ) : (
              <NavLink
                key={item.name}
                to={item.href || "#"}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white text-blue-800"
                      : "text-white hover:bg-blue-800"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.name}{" "}
                {isUnread && item.name == "Aduan" && (
                  <div className="absolute top-2 left-6 h-2 w-2 rounded-full bg-red-600"></div>
                )}
              </NavLink>
            ),
          )}
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
        // title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar?"
        cancelLabel="Tidak"
        confirmLabel="Iya"
      />

      {/* Offset for content */}
      <div className="lg:ml-54" />
    </>
  );
}
