import {
  PaperAirplaneIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useLoaderData } from "react-router";
import Table from "~/components/Table";
import type { NewsApiResponse } from "~/routes/news";

export async function loader({
  request,
  
}: {
  request: Request;
}): Promise<NewsApiResponse> {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/berita`);

  try {
    const response = await axios.get<NewsApiResponse>(urlRequest.href);
    if (!response.data.success || !response.data.data.berita.length) {
      return {
        ...response.data,
        data: {
          berita: [],
          pagination: {
            currentPage: 1,
            pageSize: 15,
            totalItems: 0,
            totalPages: 1,
          },
        },
      };
    }

    return response.data;
  } catch (error: any) {
    return {
      // ...error.response.data,
      success: false,
      statusCode: error.response?.status ?? 500,
      message: error.response?.data?.message ?? "Internal Server Error",
      data: {
        berita: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 1,
        },
      },
    };
  }
}

export default function AdminNews() {
  const headers = ["No", "Judul Berita", "Tanggal Dibuat", "PPID", "Aksi"];
  const response = useLoaderData() as NewsApiResponse;
  const { berita: news, pagination } = response.data;

  return (
    <>
      <a
        href="/admin/berita/create"
        className="rounded-lg flex items-center gap-2 w-fit m-6 bg-green-600 ps-2 pe-4 ms-auto py-2 text-white"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Tambah</span>
      </a>
      <section className="overflow-x-auto m-6">
        <Table headers={headers}>
          {news.map((item, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="w-min border border-gray-300 px-4 py-2 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.judul}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.tanggal_dibuat}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="mx-auto w-fit rounded bg-blue-600 p-2 text-white">
                  <PaperAirplaneIcon className="h-5 w-5" />
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex justify-center gap-0.5">
                  <a
                    href={`/admin/berita/edit/${item.id}`}
                    className="block w-min rounded bg-green-600 p-2 text-white"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </a>
                  <a className="block w-min rounded bg-red-600 p-2 text-white">
                    <TrashIcon className="h-5 w-5" />
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
