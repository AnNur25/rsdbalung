import { PencilSquareIcon } from "@heroicons/react/24/outline";
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
      <section className="overflow-x-auto">
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
                  href={`/admin/services/edit/${item.id_pelayanan}`}
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
