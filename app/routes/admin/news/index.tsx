import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
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
      <section className="overflow-x-auto">
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
              <td className="border border-gray-300 px-4 py-2">PPID</td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex gap-0.5 justify-center">
                  <a
                    href={`/admin/news/edit/${item.id}`}
                    className=" block w-min rounded bg-green-600 p-2 text-white hover:underline"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </a>
                  <a
                    className=" block w-min rounded bg-red-600 p-2 text-white hover:underline"
                  >
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
