import { useEffect, useState } from "react";
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
import type { Poli } from "~/models/Poli";
import toast from "react-hot-toast";
import ConfirmDialog from "~/components/ConfirmDialog";
import { createAuthenticatedClient } from "~/utils/auth-client";
import SearchBar from "~/components/SearchBar";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<LoaderResult> {
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/jadwal-dokter/`);

  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const keyword = url.searchParams.get("keyword");

  const poliRequest = new URL(`${import.meta.env.VITE_API_URL}/poli/`);

  if (keyword) {
    urlRequest.pathname = "/api/v1/jadwal-dokter/search-nama";
    urlRequest.searchParams.set("nama", keyword);
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
  const client = await createAuthenticatedClient(request);

  const method = request.method;
  const formData = await request.formData();
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/jadwal-dokter/`);

  if (method === "DELETE") {
    const id = formData.get("id");
    urlRequest.pathname = `/api/v1/jadwal-dokter/${id}`;
    return handleAction(() => client.delete(urlRequest.href));
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

  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const [searchDate, setSearchDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const [searchPoli, setSearchPoli] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState("");
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDoctorId, setDeleteDoctorId] = useState("");
  const fetcherData = fetcher.data || { message: "", success: false };
  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);
  const deleteOnClick = (id: string) => {
    setDeleteDoctorId(id);
    console.log(deleteDoctorId);
    setDeleteDialogOpen(true);
  };
  const handleDelete = () => {
    fetcher.submit(
      { id: deleteDoctorId },
      {
        method: "delete",
      },
    );
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="w-max text-2xl font-bold uppercase">
          Daftar Jadwal Praktek
        </h1>

        <a
          href="/humasbalung/jadwal-dokter/create"
          className="flex w-fit items-center gap-2 rounded-lg bg-green-600 py-2 ps-2 pe-4 text-white"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Tambah</span>
        </a>
      </div>
      <div className="w-full overflow-x-auto rounded-lg border-1 border-gray-300 px-6 py-4 shadow-xl">
        <SearchBar
          handleSearch={handleSearch}
          onSearchChange={setSearchKeyword}
        />

        <section className="w-full overflow-x-auto">
          <Table headers={headers}>
            {doctors.map((doctor, index) => {
              // Total number of schedule rows for this doctor
              const totalRows = doctor.layananList.reduce(
                (sum, layanan) => sum + layanan.jadwal.length,
                0,
              );

              return doctor.layananList.map((layanan, lIndex) =>
                layanan.jadwal.map((jadwal, jIndex) => (
                  <tr
                    key={`${index}-${lIndex}-${jIndex}`}
                    className={alternatingRowColor}
                  >
                    {lIndex === 0 && jIndex === 0 && (
                      <>
                        <td
                          rowSpan={totalRows}
                          className="border border-gray-300 px-4 py-2 text-center"
                        >
                          {index + 1}
                        </td>
                        <td
                          rowSpan={totalRows}
                          className="border border-gray-300 px-4 py-2"
                        >
                          {doctor.nama_dokter}
                        </td>
                        <td
                          rowSpan={totalRows}
                          className="border border-gray-300 px-4 py-2"
                        >
                          {doctor.poli.nama_poli}
                        </td>
                      </>
                    )}

                    {jIndex === 0 && (
                      <td
                        rowSpan={layanan.jadwal.length}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {layanan.nama_pelayanan}
                      </td>
                    )}

                    {/* Hari & Jam */}
                    <td className="border border-gray-300 px-4 py-2">
                      {jadwal.hari}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {jadwal.jam_mulai} - {jadwal.jam_selesai}
                    </td>

                    {/* Actions */}
                    {lIndex === 0 && jIndex === 0 && (
                      <td
                        rowSpan={totalRows}
                        className="border border-gray-300 px-4 py-2"
                      >
                      <div className="flex justify-center gap-0.5">
                          <a
                            href={`/humasbalung/jadwal-dokter/edit/${doctor.id_dokter}`}
                            className="mx-auto block w-min rounded bg-green-600 p-2 text-white hover:cursor-pointer"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => deleteOnClick(doctor.id_dokter)}
                            className="block w-min rounded bg-red-600 p-2 text-white hover:cursor-pointer"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )),
              );
            })}
          </Table>
        </section>

        <div className="flex w-full justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        cancelOnClick={() => setDeleteDialogOpen(false)}
        confirmOnClick={handleDelete}
        description="Apakah Anda yakin ingin menghapus data ini?"
        cancelLabel="Tidak"
        confirmLabel="Iya"
      />
    </>
  );
}
