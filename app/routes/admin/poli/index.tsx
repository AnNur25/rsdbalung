import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useLoaderData } from "react-router";
import Table from "~/components/Table";
import type { PoliApiResponse } from "~/routes/schedule";
import type { Poli } from "~/models/Poli";
import { alternatingRowColor } from "~/utils/styles";
import type { Route } from "./+types";
import { handleLoader, type LoaderResult } from "~/utils/handleLoader";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<LoaderResult> {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/poli/`);
  return handleLoader(() => axios.get(urlRequest.href));
}

export default function AdminPoli({ loaderData }: Route.ComponentProps) {
  const headers = ["No", "Poli", "Aksi"];
  const poliList = (loaderData.data as Poli[]) || [];

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
          {poliList.map((item, index) => (
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
