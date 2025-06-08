import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router";

export default function HeaderSearch() {
  const navigate = useNavigate();
  return (
    <div className="relative flex items-center">
      <MagnifyingGlassIcon className="absolute left-3 h-4 w-4 text-gray-400" />

      <input
        className="w-full min-md:min-w-32 rounded-full border-1 border-gray-300 py-2 ps-10 pe-2 focus:border-dark-blue-950 focus:outline-none"
        type="search"
        placeholder="Cari"
        name="search"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const value = (e.target as HTMLInputElement).value.trim();
            if (value) {
              console.log(`Searching for: ${value}`);
              navigate(`/${value}`);
            }
          }
        }}
        // onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
