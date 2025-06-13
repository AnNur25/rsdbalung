import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { div } from "motion/react-client";
import PageBanner from "~/components/PageBanner";
import TeamCard from "~/components/TeamCard";
import imageErrorHandler from "~/utils/imageErrorHandler";

export default function DeveloperPage() {
  const developers = [
    {
      name: "Defi Nugraheni",
      role: "PM + Tester",
      image: "/defi.png",
    },
    {
      name: "M. Ardhi Efendi",
      role: "System Analyst",
      image: "/ardhi.png",
    },
    {
      name: "Robet Turrahman",
      role: "UI & UX Designer",
      image: "/robet.png",
    },
    {
      name: "Ivan Try Wicaksono",
      role: "Front End",
      image: "/ivan.png",
      right: "right-24",
    },
    {
      name: "A. Farid Zainudin",
      role: "Back End",
      image: "/farid.png",
    },
  ];
  return (
    <>
      {/* <Popover>
        <PopoverButton>
          <UserCircleIcon className="h-8 w-8 text-gray-700 hover:text-dark-blue-900" />
        </PopoverButton>
        <PopoverPanel className="flex w-fit flex-col rounded border border-gray-400 bg-gray-200">
          <a
            className="px-4 py-2 text-sm font-medium hover:text-dark-blue-950"
            href="/akun"
          >
            Akun
          </a>
          <hr />
          <a
            className="px-4 py-2 text-sm font-medium hover:text-dark-blue-950"
            href="/logout"
          >
            Logout
          </a>
        </PopoverPanel>
      </Popover> */}
      <PageBanner title="Developer" />
      <section className="mt-8 flex w-full flex-col items-center justify-center">
        <h2 className="text-4xl font-extrabold text-gray-800">
          TEAM <span className="text-blue-600">AN-NUR</span>
        </h2>
        <div className="mt-12 flex max-lg:flex-col">
          {developers.map(
            (d, index) => index < 2 && <TeamCard team={d} key={index} />,
          )}
        </div>
        <div className="flex max-lg:flex-col">
          {developers.map(
            (d, index) => index >= 2 && <TeamCard team={d} key={index} />,
          )}
        </div>
      </section>
    </>
  );
}
