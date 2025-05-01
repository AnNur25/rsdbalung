import { useState } from "react";
import { useFetcher, useSearchParams } from "react-router";
import axios from "axios";

import type { Route } from "./+types/index";
import { handleLoader, type LoaderResult } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";

import { paginationDefault, type Pagination } from "~/models/Pagination";
import type { Dokter } from "~/models/Schedule";

import { alternatingRowColor } from "~/utils/styles";
import Table from "~/components/Table";
import PaginationControls from "~/components/PaginationControl";

import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<LoaderResult> {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/jadwal-dokter/`);

  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const id_poli = url.searchParams.get("id_poli");
  const tanggal = url.searchParams.get("tanggal");

  if (id_poli && tanggal) {
    urlRequest.pathname = "/jadwal-dokter/search";
    urlRequest.searchParams.set("id_poli", id_poli);
    urlRequest.searchParams.set("tanggal", tanggal);
  }

  urlRequest.searchParams.set("page", page);

  return handleLoader(() => axios.get(urlRequest.href));
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

  const data = loaderData.data;
  const { dokter: doctors = [], pagination = paginationDefault } = data as {
    dokter: Dokter[];
    pagination: Pagination;
  };

  const flattenedSchedules = doctors.flatMap((doctor) =>
    doctor.layananList.map((layanan) => ({
      id_dokter: doctor.id_dokter,
      dokter: doctor.nama_dokter,
      poli: doctor.poli.nama_poli,
      layanan: layanan.nama_pelayanan,
      jadwal: layanan.jadwal,
    })),
  );

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
        href="/admin/jadwal-dokter/create"
        className="ms-auto mb-6 flex w-fit items-center gap-2 rounded-lg bg-green-600 py-2 ps-2 pe-4 text-white"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Tambah</span>
      </a>
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
