import axios from "axios";
import { useState } from "react";
import { useSearchParams } from "react-router";

import { handleLoader, type LoaderResult } from "~/utils/handleLoader";

import type { Route } from "./+types/doctors";
import type { Doctor } from "~/models/Doctor";
import { paginationDefault, type Pagination } from "~/models/Pagination";

import DoctorCard from "~/components/DoctorCard";

import PaginationControls from "~/components/PaginationControl";
import SearchBar from "~/components/SearchBar";
import PageBanner from "~/components/PageBanner";

export async function loader({
  request,
}: {
  request: Request;
}): Promise<LoaderResult> {
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/dokter`);
  const url = new URL(request.url);

  const page = url.searchParams.get("page") || "1";
  const keyword = url.searchParams.get("keyword");

  if (keyword) {
    urlRequest.pathname = "/api/v1/dokter/search";
    urlRequest.searchParams.set("keyword", keyword);
  }

  urlRequest.searchParams.set("page", page);
  return handleLoader(() => axios.get(urlRequest.href));
}

export default function Doctors({ loaderData }: Route.ComponentProps) {
  const data = loaderData.data;

  const { Dokter: doctors = [], pagination = paginationDefault } = data as {
    Dokter: Doctor[];
    pagination: Pagination;
  };

  // Access the data and pagination from the loader
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

  return (
    <>
      <PageBanner title="Daftar Dokter" />
      <main className="mt-4 flex flex-col items-center">
        <div className="items-centers mt-4 flex gap-2">
          <SearchBar
            handleSearch={handleSearch}
            onSearchChange={setSearchKeyword}
          />
        </div>

        <section className="flex flex-col flex-wrap justify-center gap-10 p-6 min-md:flex-row">
          {doctors.length > 0 ? (
            doctors.map((doctor, index) => (
              <div className="relative w-min">
                <DoctorCard
                  id={doctor.slug}
                  key={index}
                  name={doctor.nama}
                  specialty={doctor.poli.nama_poli}
                  image={doctor.gambar}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 first-letter:capitalize">
              {loaderData.message}
            </p>
          )}
        </section>

        <div className="flex w-full justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </>
  );
}
