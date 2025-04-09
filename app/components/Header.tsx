"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import "~/scroll.css";
import logo from "~/assets/logo.png";
import whatsappIcon from "~/assets/whatsapp.svg";
import phoneIcon from "~/assets/call.svg";
const navigation = [
  { name: "Home", href: "/" },
  { name: "Profil", href: "/profile" },
  { name: "Berita", href: "/berita" },
  { name: "Pelayanan", href: "/pelayanan" },
  { name: "Jadwal Dokter", href: "#" },
  { name: "Aduan", href: "#" },
];
const contacts = [
  { icon: whatsappIcon, name: "IGD", contact: "+62 814-5900-0183" },
  { icon: phoneIcon, name: "IGD", contact: "0336 621595" },
  { icon: phoneIcon, name: "Manajemen", contact: "0336 621017" },
  { icon: phoneIcon, name: "CS dan Aduan", contact: "+62 82233444722" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loopedContacts = [...contacts, ...contacts, ...contacts, ...contacts];
  // const loopedContacts = [...contacts, ...contacts, ...contacts];

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-white shadow-md">
      <div className="flex w-full overflow-x-hidden bg-blue-500 p-2 text-white">
        <div className="flex gap-4">
          <div className="scroll-left flex w-max gap-4">
            {loopedContacts.map((contact) => (
              <div className="flex items-center gap-1.5">
                <img src={contact.icon} alt="WhatsApp" />
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
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
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
        <div className="hidden lg:flex lg:flex-2 lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm/6 font-semibold text-gray-900"
            >
              {item.name}
            </a>
          ))}
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
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Rumah Sakit Daerah Balung</span>
              <img alt="" src={logo} className="h-8 w-auto" />
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
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
