import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Select } from "@headlessui/react";
import axios from "axios";
import { useLoaderData, useSearchParams } from "react-router";
import { useState } from "react";

export interface Poli {
  id_poli: string;
  nama_poli: string;
}

export interface PoliApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Poli[];
}

export interface Schedule {
  id_dokter: string;
  nama_dokter: string;
  gambar_dokter: string;
  poli: {
    id_poli: string;
    nama_poli: string;
  };
  pelayanan: {
    id_pelayanan: string;
    nama_pelayanan: string;
    jadwal: {
      hari: string;
      sesi: string;
      jam_mulai: string;
      jam_selesai: string;
    }[];
  }[];
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    dokter: Schedule[];
    pagination: Pagination;
  };
}

export interface ApiResponseAndPoli extends ApiResponse {
  poli: Poli[];
}

export async function loader({
  request,
}: {
  request: Request;
}): Promise<ApiResponseAndPoli> {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const poli = url.searchParams.get("poli") ?? "";
  const date = url.searchParams.get("date") ?? "";
  console.log("poli", poli);
  console.log("date", date);

  const poliRequest = new URL(`https://rs-balung-cp.vercel.app/poli/`);

  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/jadwal-dokter/`);
  // const urlRequest = new URL(
  //   `https://rs-balung-cp.vercel.app/jadwal-dokter/search?id_poli=2f68199c-08f3-4664-bd0e-7131c84be212&tanggal=2025-04-14`,
  // );
  if (poli) {
    urlRequest.pathname = "/jadwal-dokter/search";
    urlRequest.searchParams.set("id_poli", poli);
  }
  if (date) {
    urlRequest.pathname = "/jadwal-dokter/search";
    urlRequest.searchParams.set("tanggal", date);
  }
  urlRequest.searchParams.set("page", page);

  try {
    const response = await axios.get<ApiResponse>(urlRequest.href);
    const poliResponse = await axios.get<PoliApiResponse>(poliRequest.href);

    if (!poliResponse.data.success) {
      poliResponse.data.data = [];
    }

    // console.log("poliResponse", poliResponse.data);

    const data = response.data;
    if (!data.success || !data.data.dokter.length) {
      return {
        success: false,
        statusCode: 404,
        message: "No data found",
        data: {
          dokter: [],
          pagination: {
            currentPage: 1,
            pageSize: 0,
            totalItems: 0,
            totalPages: 0,
          },
        },
        poli: [],
      };
    }

    return {
      ...data,
      poli: poliResponse.data.data,
    };

    // return data;
  } catch (error: any) {
    // console.error("Error fetching data:", error);
    return {
      ...error.response.data,
      data: {
        dokter: [],
        pagination: {
          currentPage: 1,
          pageSize: 0,
          totalItems: 0,
          totalPages: 0,
        },
      },
    };
  }
}
export default function Schedule() {
  const tableHeader = ["No", "Dokter", "Layanan", "Hari", "Jam", "Sesi"];
  const nCols = tableHeader.length;
  const response = useLoaderData() as ApiResponseAndPoli;
  // console.log("response", response);
  const { dokter: schedules, pagination } = response.data;
  console.log("schedules", schedules);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchDate, setSearchDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [searchPoli, setSearchPoli] = useState<string>("");

  const { poli } = response;

  const handleSearch = () => {
    console.log("searchPoli", searchPoli);
    console.log("searchDate", searchDate);
    if (searchPoli.trim() !== "" && searchDate.trim() !== "") {
      setSearchParams({ poli: searchPoli, date: searchDate });
    } else {
      setSearchParams({});
      // setSearchParams({ poli: "" });
      // setSearchParams({ date: "" });
    }
  };

  return (
    <main className="mt-4 flex flex-col items-center lg:mt-8">
      <h1 className="mt-2 text-2xl font-extrabold uppercase">Jadwal Dokter</h1>
      <p className="px-4 py-2 text-center text-gray-600">
        Jadwal dapat berubah sewaktu-waktu, Silakan periksa secara berkala
      </p>
      <div className="items-centers my-4 flex w-screen flex-col justify-center gap-2 lg:max-w-full lg:flex-row">
        <div className="flex w-screen flex-wrap items-center justify-center gap-2 px-8 lg:max-w-3/5">
          <Select
            className="max-w-full flex-1 rounded-md border-1 border-gray-300 px-4 py-2 focus:border-green-600 focus:outline-none lg:max-w-2xl"
            value={searchPoli}
            onChange={(e) => setSearchPoli(e.target.value)}
          >
            {poli.length > 0 ? (
              poli.map((item, index) => (
                <option key={index} value={item.id_poli}>
                  {item.nama_poli}
                </option>
              ))
            ) : (
              <option value="">Tidak ada data</option>
            )}
          </Select>
          <input
            className="flex-1 rounded-md border-1 border-gray-300 px-4 py-2 focus:border-green-600 focus:outline-none lg:max-w-2xl"
            type="date"
            placeholder="Pilih Tanggal"
            name="date"
            id="schedule-date-search"
            value={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <button
            className="rounded-lg bg-green-600 px-6 py-2 text-white max-lg:w-full"
            type="button"
            onClick={handleSearch}
          >
            Cari
          </button>
        </div>
      </div>
      <section className="max-w-[90vw] overflow-auto">
        <table className="border-collapse border border-gray-300">
          <thead>
            <tr className="bg-sky-700 text-white">
              {tableHeader.map((header, index) => (
                <th key={index} className="border border-gray-300 px-4 py-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedules.length > 0 && Array.from(searchParams.keys()).length > 0 ? (
              schedules.map((item, index) => (
                <tr key={index} className="bg-sky-50 even:bg-sky-200">
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.nama_dokter}
                  </td>
                  {item.pelayanan != null && (
                    <>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.pelayanan[0].nama_pelayanan}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.pelayanan[0]?.jadwal[0].hari ?? ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.pelayanan[0]?.jadwal[0].jam_mulai ?? ""} -{" "}
                        {item.pelayanan[0]?.jadwal[0].jam_selesai ?? ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 capitalize">
                        {item.pelayanan[0]?.jadwal[0].sesi ?? ""}
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={nCols}
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
