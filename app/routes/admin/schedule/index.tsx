import { useState } from "react";
import { useFetcher, useSearchParams } from "react-router";
import axios from "axios";

import type { Route } from "./+types/index";
import { handleLoader, type LoaderResult } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";

import { paginationDefault, type Pagination } from "~/models/Pagination";
import type { DokterSchedule } from "~/models/Schedule";

import { alternatingRowColor } from "~/utils/styles";
import Table from "~/components/Table";
import PaginationControls from "~/components/PaginationControl";

import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Select } from "@headlessui/react";
import type { Poli } from "~/models/Poli";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<LoaderResult> {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/jadwal-dokter/`);

  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const poli = url.searchParams.get("poli") ?? "";
  const date = url.searchParams.get("date") ?? "";

  const poliRequest = new URL(`https://rs-balung-cp.vercel.app/poli/`);

  if (poli) {
    urlRequest.pathname = "/jadwal-dokter/search";
    urlRequest.searchParams.set("id_poli", poli);
  }
  if (date) {
    urlRequest.pathname = "/jadwal-dokter/search";
    urlRequest.searchParams.set("tanggal", date);
  }
  urlRequest.searchParams.set("page", page);

  const jadwalResponse = await handleLoader(() => axios.get(urlRequest.href));
  const poliResponse = await handleLoader(() => axios.get(poliRequest.href));

  const data = {
    schedules: jadwalResponse.data,
    poli: poliResponse.data,
  };

  return {
    success: jadwalResponse.success && poliResponse.success,
    message: "Selesai mendapatkan data",
    data,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const method = request.method;
  const formData = await request.formData();
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/jadwal-dokter/`);

  if (method === "DELETE") {
    const id = formData.get("id");
    urlRequest.pathname = `/jadwal-dokter/${id}`;
    return handleAction(() => axios.delete(urlRequest.href));
  }
}

export default function AdminSchedule({ loaderData }: Route.ComponentProps) {
  const headers = ["No", "Dokter", "Poli", "Layanan", "Hari", "Jam", "Aksi"];

  const poli: Poli[] = loaderData.data.poli || [];

  const scheduleData: {
    dokter: DokterSchedule[];
    pagination: Pagination;
  } = loaderData.data.schedules;

  const { dokter: doctors = [], pagination = paginationDefault } = scheduleData;

  const flattenedSchedules = doctors.flatMap((doctor) =>
    doctor.layananList.map((layanan) => ({
      id_dokter: doctor.id_dokter,
      dokter: doctor.nama_dokter,
      poli: doctor.poli.nama_poli,
      layanan: layanan.nama_pelayanan,
      jadwal: layanan.jadwal,
    })),
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const [searchDate, setSearchDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const [searchPoli, setSearchPoli] = useState<string>("");

  const handleSearch = () => {
    if (searchPoli.trim() !== "" && searchDate.trim() !== "") {
      setSearchParams({ poli: searchPoli, date: searchDate });
    } else {
      setSearchParams({});
    }
  };

  const handlePageChange = (page: number) => {
    if (searchPoli.trim() !== "" && searchDate.trim() !== "") {
      setSearchParams({
        date: searchDate,
        poli: searchPoli,
        page: page.toString(),
      });
    } else {
      setSearchParams({ page: page.toString() });
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
        href="/admin/jadwal-dokter/create"
        className="ms-auto mb-6 flex w-fit items-center gap-2 rounded-lg bg-green-600 py-2 ps-2 pe-4 text-white"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Tambah</span>
      </a>

    <div className="items-centers w-full my-4 flex justify-center">
      <div className="relative w-full gap-2 flex items-center">
      {/* <div className="items-centers my-4 flex w-screen flex-col justify-center gap-2 lg:max-w-full lg:flex-row"> */}
        {/* <div className="flex w-screen flex-wrap items-center justify-center gap-2 px-8 lg:max-w-3/5"> */}
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
            value={searchDate}
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

      <section className="w-full overflow-x-auto">
        <Table headers={headers}>
          {flattenedSchedules.map((doctor, index) =>
            doctor.jadwal.map((jadwal, jIndex) => (
              <tr key={index} className={alternatingRowColor}>
                {jIndex === 0 && (
                  <>
                    <td
                      rowSpan={doctor.jadwal.length}
                      className="w-min border border-gray-300 px-4 py-2 text-center"
                    >
                      {index + 1}
                    </td>
                    <td
                      rowSpan={doctor.jadwal.length}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {doctor.dokter}
                    </td>
                    <td
                      rowSpan={doctor.jadwal.length}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {doctor.poli}
                    </td>
                    <td
                      rowSpan={doctor.jadwal.length}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {doctor.layanan}
                    </td>
                  </>
                )}
                <td className="border border-gray-300 px-4 py-2">
                  {jadwal.hari}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {jadwal.jam_mulai} - {jadwal.jam_selesai}
                </td>
                {jIndex === 0 && (
                  <td
                    rowSpan={doctor.jadwal.length}
                    className="border border-gray-300 px-4 py-2"
                  >
                    <div className="flex justify-center gap-0.5">
                      <a
                        href={`/admin/jadwal-dokter/edit/${doctor.id_dokter}`}
                        className="mx-auto block w-min rounded bg-green-600 p-2 text-white hover:cursor-pointer"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(doctor.id_dokter)}
                        className="block w-min rounded bg-red-600 p-2 text-white hover:cursor-pointer"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            )),
          )}
        </Table>
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
