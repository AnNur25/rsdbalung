import axios from "axios";
import { useLoaderData, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import DoctorCard from "~/components/DoctorCard";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { handleLoader, type LoaderResult } from "~/utils/handleLoader";
import type { Doctor } from "~/models/Doctor";
import type { Route } from "./+types/doctors";
import type { Pagination } from "~/models/Pagination";

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    Dokter: Doctor[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  };
}

export async function loader({
  request,
}: {
  request: Request;
}): Promise<LoaderResult> {
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

export default function Doctors({ loaderData }: Route.ComponentProps) {
  const data = loaderData.data;

  const { Dokter: doctors, pagination } = data as {
    Dokter: Doctor[];
    pagination: Pagination;
  };

  // Access the data and pagination from the loader
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(pagination.currentPage || 1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

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
    // setSearchParams({ page: page.toString() });
    setCurrentPage(page);
  };

  return (
    <main className="mt-4 flex flex-col items-center">
      <h1 className="mt-2 text-2xl font-extrabold uppercase">Daftar Dokter</h1>
      <div className="items-centers mt-4 flex gap-2">
        <div className="relative flex items-center">
          <MagnifyingGlassIcon className="absolute left-3 h-4 w-4 text-gray-400" />

          <input
            className="max-w-[60vw] rounded-md border-1 border-gray-300 py-2 ps-10 pe-2 focus:border-green-600 focus:outline-none lg:w-2xl"
            type="search"
            placeholder="Cari Nama Dokter"
            name="doctor"
            id="doctor-search"
            onChange={(e) => setSearchKeyword(e.target.value)}
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

      <section className="flex flex-col flex-wrap justify-center gap-10 p-6 min-md:flex-row">
        {doctors.length > 0 ? (
          doctors.map((doctor, index) => (
            <div className="w-min">
              <DoctorCard
                key={index}
                name={doctor.nama}
                specialty={doctor.poli.nama_poli}
                image={doctor.gambar}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">{data.message}</p>
        )}
      </section>

      {/* Pagination Controls */}
      {/* {!isSearching && !searchParams.get("keyword") && ( */}
      <div className="mt-4 flex w-fit max-w-full justify-center gap-2">
        <button
          className="flex-none px-4 py-2 text-black disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-6" />
        </button>
        <div className="flex w-fit flex-auto gap-2 overflow-auto p-2">
          {[...Array(pagination.totalPages).keys()].map((index) => (
            <button
              key={index}
              className={`aspect-square h-12 rounded-full text-center text-white ${
                index + 1 === currentPage
                  ? "bg-persian-blue-950 shadow-md"
                  : "bg-gray-400"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          className="flex-none px-4 py-2 text-black disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pagination.totalPages}
        >
          <ChevronRightIcon className="h-6" />
        </button>
      </div>
      {/* )} */}
    </main>
  );
}
