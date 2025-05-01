import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useLoaderData } from "react-router";
import Table from "~/components/Table";
import type { Pagination } from "~/models/Pagination";
import { alternatingRowColor } from "~/utils/styles";

interface JadwalDokterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    dokter: Dokter[];
    pagination: Pagination;
  };
}

interface Dokter {
  id_dokter: string;
  nama_dokter: string;
  poli: Poli;
  layananList: Layanan[];
}

interface Poli {
  id: string;
  nama_poli: string;
}

interface Layanan {
  id_pelayanan: string;
  nama_pelayanan: string;
  jadwal: Hari[];
}

interface Hari {
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

export async function loader(): Promise<JadwalDokterResponse> {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/jadwal-dokter/`);

  try {
    const response = await axios.get(urlRequest.href);

    if (!response.data.success) {
      return {
        ...response.data,
        data: {
          dokter: [],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0,
          },
        },
      };
    }

    return response.data;
  } catch (error: any) {
    console.log(error.response?.data);
    return {
      ...error.response?.data,
      data: {
        dokter: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        },
      },
    };
  }
}

export default function AdminSchedule() {
  const headers = ["No", "Dokter", "Poli", "Layanan", "Hari", "Jam", "Aksi"];

  const response = useLoaderData() as JadwalDokterResponse;
  const { dokter: doctors, pagination } = response.data;
  console.log(response);
  const flattenedSchedules = doctors.flatMap((doctor) =>
    doctor.layananList.flatMap((layanan) =>
      layanan.jadwal.map((hari) => ({
        id_dokter: doctor.id_dokter,
        dokter: doctor.nama_dokter,
        poli: doctor.poli.nama_poli,
        layanan: layanan.nama_pelayanan,
        hari: hari.hari,
        jam: `${hari.jam_mulai} - ${hari.jam_selesai}`,
      })),
    ),
  );

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
          {flattenedSchedules.map((item, index) => (
            <tr key={index} className={alternatingRowColor}>
              <td className="w-min border border-gray-300 px-4 py-2 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.dokter}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.poli}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.layanan}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.hari}</td>
              <td className="border border-gray-300 px-4 py-2">{item.jam}</td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex justify-center gap-0.5">
                  <a
                    href={`/admin/jadwal-dokter/edit/${item.id_dokter}`}
                    className="mx-auto block w-min rounded bg-green-600 p-2 text-white hover:underline"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </a>
                  <a className="block w-min rounded bg-red-600 p-2 text-white hover:underline">
                    <TrashIcon className="h-4 w-4" />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </section>
    </>
  );
}
