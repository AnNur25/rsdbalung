import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="mt-4 flex w-fit max-w-full justify-center gap-2">
      <button
        className="flex-none px-4 py-2 text-black disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="h-4" />
      </button>
      <div className="flex w-fit flex-auto gap-2 overflow-auto p-2">
        {[...Array(totalPages).keys()].map((index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              className={`aspect-square h-8 rounded-full text-base text-center text-white ${
                page === currentPage
                  ? "bg-persian-blue-950 shadow-md"
                  : "bg-gray-400"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
      </div>
      <button
        className="flex-none px-4 py-2 text-black disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRightIcon className="h-4" />
      </button>
    </div>
  );
}
