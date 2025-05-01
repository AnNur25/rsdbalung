import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface SearchBarProps {
  onSearchChange: (keyword: string) => void;
  handleSearch: () => void;
}
export default function SearchBar({
  onSearchChange,
  handleSearch,
}: SearchBarProps) {
  return (
    <div className="items-centers my-4 flex justify-center gap-2">
      <div className="relative flex items-center">
        <MagnifyingGlassIcon className="absolute left-3 h-4 w-4 text-gray-400" />

        <input
          className="max-w-[60vw] rounded-md border-1 border-gray-300 py-2 ps-10 pe-2 focus:border-green-600 focus:outline-none lg:w-2xl"
          type="search"
          placeholder="Cari Nama Dokter"
          name="doctor"
          id="doctor-search"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button
        className="rounded-lg bg-green-600 px-6 py-2 text-white"
        type="button"
        onClick={handleSearch}
      >
        Cari
      </button>
    </div>
  );
}
