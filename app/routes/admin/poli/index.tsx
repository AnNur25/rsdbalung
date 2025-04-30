import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useLoaderData } from "react-router";
import Table from "~/components/Table";
import type { Poli, PoliApiResponse } from "~/routes/schedule";
import { getSession } from "~/sessions.server";
import { alternatingRowColor } from "~/utils/styles";
import type { Route } from "./+types";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<PoliApiResponse> {
  const session = await getSession(request.headers.get("Cookie"));

  // session.get("token");

  const poliRequest = new URL(`https://rs-balung-cp.vercel.app/poli/`);

  try {
    const poliResponse = await axios.get<PoliApiResponse>(poliRequest.href);
    if (!poliResponse.data.success) {
      poliResponse.data.data = [];
    }
    return poliResponse.data;
  } catch (error: any) {
    // console.error("Error fetching data:", error.response);
    return {
      success: false,
      statusCode: error.response?.status ?? 500,
      message: "Failed to fetch data",
      data: [],
    };
  }
}

export default function AdminPoli() {
  const data = useLoaderData() as PoliApiResponse;
  const { data: poli } = data;
  //   const poli: Poli[] = [];
  const headers = ["No", "Poli", "Aksi"];
  return (
    <>
      <a
        href="/admin/poli/create"
        className="ms-auto mb-6 flex w-fit items-center gap-2 rounded-lg bg-green-600 py-2 ps-2 pe-4 text-white"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Tambah</span>
      </a>
      <section className="w-full overflow-x-auto">
        <Table headers={headers}>
          {poli.map((item, index) => (
            <tr key={index} className={alternatingRowColor}>
              <td className="w-min border border-gray-300 px-4 py-2 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.nama_poli}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <a
                  href={`/admin/poli/edit/${item.id_poli}`}
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
