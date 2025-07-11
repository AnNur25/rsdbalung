import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router";

export default function HeaderSearch({
  setMobileMenuOpen,
}: {
  setMobileMenuOpen?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center">
      <MagnifyingGlassIcon className="absolute left-3 h-4 w-4 text-gray-400" />

      <input
        className="w-full rounded-full border-1 border-gray-300 py-2 ps-10 pe-2 transition-all duration-300 focus:border-dark-blue-950 focus:outline-none min-lg:w-10 min-lg:min-w-32 min-lg:focus:w-56"
        type="search"
        placeholder="Cari"
        name="search"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const value = (e.target as HTMLInputElement).value.trim();
            if (value) {
              // console.log(`Searching for: ${value}`);
              navigate(`/cari?q=${value}`);
            }
          }
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            setMobileMenuOpen?.();
          }
        }}
      />
    </div>
  );
}
