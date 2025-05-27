import React from "react";

const SearchBar: React.FC = () => {
  return (
    <form className="relative">
      <input
        type="search"
        placeholder="Cari"
        className="w-full rounded-full border border-gray-300 py-2 pr-10 pl-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
