import axios from "axios";
import { useLoaderData, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import DoctorCard from "~/components/DoctorCard";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export interface Doctor {
  id_dokter: string;
  nama: string;
  gambar: string;
  poli: {
    id_poli: string;
    nama_poli: string;
  };
}

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
}): Promise<ApiResponse> {
  const url = new URL(request.url);
  console.log(url);
  console.log(url.href);
  const page = url.searchParams.get("page") || "1";
  const keyword = url.searchParams.get("keyword");

  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/dokter`);
  if (keyword) {
    urlRequest.pathname = "/dokter/search";
    urlRequest.searchParams.set("keyword", keyword);
  }
  urlRequest.searchParams.set("page", page);
  console.log(urlRequest.href);

  try {
    console.log("sebelum response");
    const response = await axios.get(urlRequest.href);
    console.log("setelah response");
    // `https://rs-balung-cp.vercel.app/dokter?page=${page}`,
    // const data = response.data
    console.log(response.data);
    // const data = {
    //   success: response.data.success,
    //   statusCode: response.data.statusCode,
    //   message: response.data.message,
    //   data: {
    //     Dokter: keyword ? response.data.data : response.data.data.Dokter,
    //     pagination: {
    //       currentPage: response.data.data.pagination?.currentPage || 1,
    //       pageSize: response.data.data.pagination?.pageSize || 15,
    //       totalItems:
    //         response.data.data.pagination?.totalItems ||
    //         response.data.data.length,
    //       totalPages:
    //         response.data.data.pagination?.totalPages ||
    //         Math.ceil(response.data.data.length / 15),
    //     },
    //   },
    // };

    if (!response.data.success || !response.data.data.Dokter.length) {
      // Return empty data if no doctors are found
      return {
        ...response.data,
        data: {
          Dokter: [],
          pagination: {
            currentPage: 1,
            pageSize: 12,
            totalItems: 0,
            totalPages: 1,
          },
        },
      };
    }

    return response.data;
  } catch (error: any) {
    console.log(error.response);
    const data = {
      ...error.response.data,
      data: {
        Dokter: [],
        pagination: {
          currentPage: 1,
          pageSize: 12,
          totalItems: 0,
          totalPages: 1,
        },
      },
    };
    console.log(data);
    return data;
  }
}

export default function Doctors() {
  const response = useLoaderData() as ApiResponse;
  console.log(response);
  const { Dokter: doctors, pagination } = response.data;
  console.log(pagination);

  // Access the data and pagination from the loader
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(pagination.currentPage || 1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  console.log(searchParams.get("keyword"));

  // useEffect(() => {
  //   if (isSearching) {
  //     const data = response as unknown as SearchApiResponse;
  //     setFilteredDoctors((data?.data as Doctor[]) || []); // Fallback to empty array
  //   } else {
  //     setFilteredDoctors(doctors); // Reset to original doctors list
  //   }
  // }, [isSearching, response]);

  // console.log("sdfasdfa", filteredDoctors);

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
          <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-400" />

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

      <section className="flex flex-col flex-wrap justify-center gap-6 p-4 min-md:flex-row">
        {doctors.length > 0 ? (
          doctors.map((doctor, index) => (
            <div className="flex-1">
              <DoctorCard
                key={index}
                name={doctor.nama}
                specialty={doctor.poli.nama_poli}
                image={doctor.gambar}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">{response.message}</p>
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
