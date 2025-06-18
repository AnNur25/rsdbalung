import { Select } from "@headlessui/react";
import axios from "axios";
import { useSearchParams } from "react-router";
import { useState } from "react";
import { alternatingRowColor } from "~/utils/styles";
import { paginationDefault, type Pagination } from "~/models/Pagination";
import type { Poli } from "~/models/Poli";
import { handleLoader, type LoaderResult } from "~/utils/handleLoader";
import type { Route } from "./+types/schedule";
import type { DokterSchedule } from "~/models/Schedule";
import Table from "~/components/Table";
import PaginationControls from "~/components/PaginationControl";
import PageBanner from "~/components/PageBanner";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<LoaderResult> {
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/jadwal-dokter/`);

  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const poli = url.searchParams.get("poli") ?? "";
  const date = url.searchParams.get("date") ?? "";

  const poliRequest = new URL(`${import.meta.env.VITE_API_URL}/poli/`);

  if (poli) {
    urlRequest.pathname = "/api/v1/jadwal-dokter/search";
    urlRequest.searchParams.set("id_poli", poli);
  }
  if (date) {
    urlRequest.pathname = "/api/v1/jadwal-dokter/search";
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

export default function Schedule({ loaderData }: Route.ComponentProps) {
  const headers = ["No", "Dokter", "Layanan", "Hari", "Jam", "Sesi"];

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

  return (
    <>
      <PageBanner title="Jadwal Dokter" />
      <main className="mt-4 flex flex-col items-center">
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
              lang="id-ID"
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

        <section className="max-w-[90vw] overflow-auto">
          <Table headers={headers}>
            {doctors
              .map((doctor, index) => {
                const days = [
                  "Minggu",
                  "Senin",
                  "Selasa",
                  "Rabu",
                  "Kamis",
                  "Jumat",
                  "Sabtu",
                ];
                const dateObj = new Date(searchDate);
                const today = days[dateObj.getDay()];
                const layananListToday = doctor.layananList
                  .map((layanan) => ({
                    ...layanan,
                    jadwal: layanan.jadwal.filter(
                      (jadwal) => jadwal.hari === today,
                    ),
                  }))
                  .filter((layanan) => layanan.jadwal.length > 0);

                if (layananListToday.length === 0) return null;

                const totalRows = layananListToday.reduce(
                  (sum, layanan) => sum + layanan.jadwal.length,
                  0,
                );

                return layananListToday.map((layanan, lIndex) =>
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
                      <td className="border border-gray-300 px-4 py-2 capitalize">
                        {jadwal.sesi}
                      </td>
                    </tr>
                  )),
                );
              })
              .filter(Boolean)}
          </Table>
        </section>

        <PaginationControls
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </>
  );
}
