import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { Form, useFetcher, useLoaderData, useSearchParams } from "react-router";
import DoctorCard from "~/components/DoctorCard";
import type { Doctor } from "~/models/Doctor";
import type { Route } from "./+types/index";
import { handleAction } from "~/utils/handleAction";
import { handleLoader } from "~/utils/handleLoader";
import type { Pagination } from "~/models/Pagination";
import { useState } from "react";
import PaginationControls from "~/components/PaginationControl";
import SearchBar from "~/components/SearchBar";

// interface ApiResponse {
//   success: boolean;
//   statusCode: number;
//   message: string;
//   data: {
//     Dokter: Doctor[];
//     pagination: {
//       currentPage: number;
//       pageSize: number;
//       totalItems: number;
//       totalPages: number;
//     };
//   };
// }
export async function loader({ request }: Route.LoaderArgs) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/dokter`);
  const url = new URL(request.url);

  const page = url.searchParams.get("page") || "1";
  const keyword = url.searchParams.get("keyword");
  if (keyword) {
    urlRequest.pathname = "/dokter/search";
    urlRequest.searchParams.set("keyword", keyword);
  }
  urlRequest.searchParams.set("page", page);
  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request }: Route.ActionArgs) {
  const method = request.method;
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/dokter`);
  const formData = await request.formData();

  if (method === "DELETE") {
    const idDokter = formData.get("id") as string;
    urlRequest.pathname = `/dokter/${idDokter}`;
    return handleAction(() => axios.delete(urlRequest.href));
  }
}

export default function AdminDoctors({ loaderData }: Route.ComponentProps) {
  const data = loaderData.data;
  const {
    Dokter: doctors = [],
    pagination = { currentPage: 1, totalPages: 1, pageSize: 0, totalItems: 0 },
  } = data as { Dokter: Doctor[]; pagination: Pagination };

  const [currentPage, setCurrentPage] = useState(pagination.currentPage || 1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (searchKeyword.trim() === "") {
      setSearchParams({});
      setIsSearching(false);
    } else {
      setSearchParams({ keyword: searchKeyword });
      setIsSearching(true);
    }
  };

  const handlePageChange = (page: number) => {
    if (searchKeyword.trim() === "") {
      setSearchParams({ page: page.toString() });
      setIsSearching(false);
    } else {
      setSearchParams({ page: page.toString(), keyword: searchKeyword });
      setIsSearching(true);
    }
    setCurrentPage(page);
  };

  const fetcher = useFetcher();
  const handleDelete = (id: string) => {
    fetcher.submit(
      { id },
      {
        method: "delete",
      },
    );
  };
  return (
    <>
      <a
        href="/admin/dokter/create"
        className="ms-auto mb-6 flex w-fit items-center gap-2 rounded-lg bg-green-600 py-2 ps-2 pe-4 text-white"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Tambah</span>
      </a>

      <SearchBar
        handleSearch={handleSearch}
        onSearchChange={setSearchKeyword}
      />

      <section className="flex flex-col flex-wrap justify-center gap-5 py-4 min-md:flex-row">
        {doctors.length > 0 ? (
          doctors.map((doctor, index) => (
            <div
              className="flex flex-col items-center justify-between gap-4"
              key={index}
            >
              <div className="flex-1">
                <DoctorCard
                  name={doctor.nama}
                  specialty={doctor.poli.nama_poli}
                  image={doctor.gambar}
                />
              </div>
              <div className="flex flex-none justify-center gap-0.5">
                <a
                  href={`/admin/dokter/edit/${doctor.id_dokter}`}
                  className="block h-fit w-min rounded bg-green-600 p-2 text-white hover:underline"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </a>
                <button
                  onClick={() => handleDelete(doctor.id_dokter)}
                  className="block h-fit w-min cursor-pointer rounded bg-red-600 p-2 text-white hover:cursor-pointer"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 capitalize">{loaderData.message}</p>
        )}
      </section>

      <div className="flex w-full justify-center">
        <PaginationControls
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
