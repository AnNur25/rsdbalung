import { BeakerIcon } from "@heroicons/react/24/outline";

interface HomeShortcutProps {
  icon: string;
  name: string;
  url: string;
}

export default function HomeShortcut({ icon, name, url }: HomeShortcutProps) {
  return (
    <>
      <a
        href={url}
        className="group flex flex-1 flex-col items-center gap-2 rounded-tr-[36px] rounded-bl-[36px] border-2 border-dark-blue-950 from-dark-blue-900 to-dark-blue-950 p-4 text-sm text-dark-blue-950 hover:bg-gradient-to-r hover:text-white min-md:w-40"
      >
        <div className="inset-0 rounded-full bg-dark-blue-950 p-2.5 group-hover:bg-white">
          <img
            src={icon}
            className="h-6 w-6 text-white group-hover:fill-dark-blue-950 group-hover:text-dark-blue-950"
          />
          {/* <BeakerIcon className="h-6 w-6 text-white group-hover:text-dark-blue-950" /> */}
        </div>
        <p className="w-max text-center font-bold uppercase min-md:w-max">
          {name}
        </p>
      </a>
    </>
  );
}
