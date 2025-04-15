import { PencilSquareIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useLoaderData } from "react-router";
import Table from "~/components/Table";
import type { Pagination } from "~/routes/schedule";

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
  nama: string;
}

interface Layanan {
  id_pelayanan: string;
  nama_pelayanan: string;
  hariList: Hari[];
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
    return {
      ...error.response.data,
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
  console.log("response schedule", response);
  const { dokter: doctors, pagination } = response.data;

  const flattenedSchedules = doctors.flatMap((doctor) =>
    doctor.layananList.flatMap((layanan) =>
      layanan.hariList.map((hari) => ({
        dokter: doctor.nama_dokter,
        poli: doctor.poli.nama,
        layanan: layanan.nama_pelayanan,
        hari: hari.hari,
        jam: `${hari.jam_mulai} - ${hari.jam_selesai}`,
      })),
    ),
  );
  return (
    <>
      <section className="overflow-x-auto">
        <Table headers={headers}>
          {flattenedSchedules.map((item, index) => (
            <tr key={index}>
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
                <a
                  href={`/admin/schedule/edit/${item.dokter}`}
                  className="mx-auto block w-min rounded bg-green-600 p-2 text-white hover:underline"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </a>
              </td>
            </tr>
          ))}
        </Table>
      </section>
    </>
  );
}
