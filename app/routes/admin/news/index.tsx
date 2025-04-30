import {
  PaperAirplaneIcon,
  PencilSquareIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useFetcher, useLoaderData } from "react-router";
import Table from "~/components/Table";
import type { NewsApiResponse } from "~/routes/news";
import type { Route } from "./+types";
import { alternatingRowColor } from "~/utils/styles";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<NewsApiResponse> {
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
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const method = request.method;

  if (method === "DELETE") {
    try {
      const newsId = formData.get("id");
      const urlRequest = new URL(
        `https://rs-balung-cp.vercel.app/berita/${newsId}`,
      );
      const response = await axios.delete(urlRequest.href);
      console.log("res delete", response);
    } catch (error: any) {
      console.log(error);
    }
  }
}

export default function AdminNews() {
  const headers = ["No", "Judul Berita", "Tanggal Dibuat", "PPID", "Aksi"];
  const response = useLoaderData() as NewsApiResponse;
  const { berita: news, pagination } = response.data;
  const fetcher = useFetcher();
  const handleDelete = (id: string) => {
    // const formData = new FormData();
    // formData.append("id", id);
    fetcher.submit(
      { id },
      {
        method: "DELETE",
      },
    );
  };

  return (
    <>
      <a
        href="/admin/berita/create"
        className="ms-auto mb-6 flex w-fit items-center gap-2 rounded-lg bg-green-600 py-2 ps-2 pe-4 text-white"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Tambah</span>
      </a>
      <section className="w-full overflow-x-auto text-base">
        <Table headers={headers}>
          {news.map((item, index) => (
            <tr key={index} className={alternatingRowColor}>
              <td className="w-min border border-gray-300 px-4 py-2 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.judul}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.tanggal_dibuat}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="mx-auto w-fit rounded bg-blue-600 p-2 text-white">
                  <PaperAirplaneIcon className="h-4 w-4" />
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex justify-center gap-0.5">
                  <a
                    href={`/admin/berita/galeri/${item.id}`}
                    className="block w-min rounded bg-blue-600 p-2 text-white"
                  >
                    <PhotoIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={`/admin/berita/edit/${item.id}`}
                    className="block w-min rounded bg-green-600 p-2 text-white"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="block w-min rounded bg-red-600 p-2 text-white hover:cursor-pointer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </section>
    </>
  );
}
