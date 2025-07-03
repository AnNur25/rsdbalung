import axios from "axios";
import type { Route } from "./+types/index";

import { handleLoader, type LoaderResult } from "~/utils/handleLoader";
import { alternatingRowColor } from "~/utils/styles";

import type { Pelayanan } from "~/models/Pelayanan";

import Table from "~/components/Table";

import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/solid";

export async function loader(): Promise<LoaderResult> {
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/pelayanan`);
  return handleLoader(() => axios.get(urlRequest.href));
}

export default function AdminServices({ loaderData }: Route.ComponentProps) {
  const headers = ["No", "Layanan", "Aksi"];
  const pelayananList = (loaderData.data as Pelayanan[]) || [];

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="w-max text-2xl font-bold uppercase">Layanan RS</h1>
        <a
          href="/humasbalung/pelayanan/create"
          className="flex w-fit items-center gap-2 rounded-lg bg-green-600 py-2 ps-2 pe-4 text-white"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Tambah</span>
        </a>
      </div>
      <section className="w-full overflow-x-auto rounded-xl border-1 border-gray-300 p-5 shadow-xl">
        <Table headers={headers}>
          {pelayananList.map((item, index) => (
            <tr key={index} className={alternatingRowColor}>
              <td className="w-min border-gray-300 px-4 py-2 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.nama_pelayanan}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <a
                  href={`/humasbalung/pelayanan/edit/${item.slug}`}
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
