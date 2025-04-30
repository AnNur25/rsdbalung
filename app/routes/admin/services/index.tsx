import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useLoaderData } from "react-router";
import Table from "~/components/Table";
import { alternatingRowColor } from "~/utils/styles";

export interface PelayananResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Pelayanan[];
}

export interface Pelayanan {
  id_pelayanan: string;
  nama_pelayanan: string;
}

export async function loader(): Promise<PelayananResponse> {
  const pelayananRequest = new URL(
    `https://rs-balung-cp.vercel.app/pelayanan/`,
  );
  try {
    const response = await axios.get<PelayananResponse>(pelayananRequest.href);

    if (!response.data.success || !response.data.data.length) {
      return {
        ...response.data,
        data: [],
      };
    }
    return response.data;
  } catch (error: any) {
    // console.error("Error fetching data:", error.response);
    return {
      //   ...error.response.data,
      success: false,
      statusCode: error.response?.status ?? 500,
      message: "Failed to fetch data",
      data: [],
    };
  }
}

export default function AdminServices() {
  const headers = ["No", "Layanan", "Aksi"];
  const data = useLoaderData() as PelayananResponse;
  const pelayanan = data.data;

  return (
    <>
      <a
        href="/admin/pelayanan/create"
        className="ms-auto mb-6 flex w-fit items-center gap-2 rounded-lg bg-green-600 py-2 ps-2 pe-4 text-white"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Tambah</span>
      </a>
      <section className="w-full overflow-x-auto rounded-xl border-1 border-gray-300 px-12 py-8 shadow-xl">
        <div className="relative mb-8 flex items-center">
          <MagnifyingGlassIcon className="absolute left-3 h-4 w-4 text-gray-400" />

          <input
            className="w-full rounded-md border-1 border-gray-300 py-2 ps-10 pe-2 focus:border-green-600 focus:outline-none"
            type="search"
            placeholder="Cari Nama Dokter"
            name="doctor"
            id="doctor-search"
            // onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        <Table headers={headers}>
          {pelayanan.map((item, index) => (
            <tr key={index} className={alternatingRowColor}>
              <td className="w-min border border-gray-300 px-4 py-2 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.nama_pelayanan}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <a
                  href={`/admin/pelayanan/edit/${item.id_pelayanan}`}
                  className="mx-auto block w-min rounded bg-green-600 p-2 text-white hover:underline"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </a>
              </td>
            </tr>
          ))}
        </Table>
      </section>
    </>
  );
}
