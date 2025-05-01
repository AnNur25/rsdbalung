import { useState } from "react";
import { useFetcher, useSearchParams } from "react-router";
import axios from "axios";

import type { Route } from "./+types";
import { handleLoader, type LoaderResult } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";

import { alternatingRowColor } from "~/utils/styles";
import type { News } from "~/models/News";
import { paginationDefault, type Pagination } from "~/models/Pagination";

import Table from "~/components/Table";
import SearchBar from "~/components/SearchBar";
import PaginationControls from "~/components/PaginationControl";

import {
  PaperAirplaneIcon,
  PencilSquareIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<LoaderResult> {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/berita`);

  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const keyword = url.searchParams.get("keyword");

  if (keyword) {
    urlRequest.pathname = "/berita/search";
    urlRequest.searchParams.set("keyword", keyword);
  }
  urlRequest.searchParams.set("page", page);

  return handleLoader(() => axios.get(urlRequest.href));
}
export async function action({ request }: Route.ActionArgs) {
  const method = request.method;
  const formData = await request.formData();
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/berita`);

  if (method === "DELETE") {
    const newsId = formData.get("id");
    urlRequest.pathname = `/dokter/${newsId}`;
    return handleAction(() => axios.delete(urlRequest.href));
  }
}

export default function AdminNews({ loaderData }: Route.ComponentProps) {
  const headers = ["No", "Judul Berita", "Tanggal Dibuat", "PPID", "Aksi"];
  const data = loaderData.data;
  const { berita: news = [], pagination = paginationDefault } = data as {
    berita: News[];
    pagination: Pagination;
  };

  const fetcher = useFetcher();
  const handleDelete = (id: string) => {
    fetcher.submit(
      { id },
      {
        method: "delete",
      },
    );
  };

  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (searchKeyword.trim() === "") {
      setSearchParams({});
      setIsSearching(false);
    } else {
      setSearchParams({ keyword: searchKeyword });
      setIsSearching(true);
    }
  };

  const handlePageChange = (page: number) => {
    if (searchKeyword.trim() !== "") {
      setSearchParams({ keyword: searchKeyword, page: page.toString() });
    } else {
      setSearchParams({ page: page.toString() });
    }
    setCurrentPage(page);
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

      <SearchBar
        handleSearch={handleSearch}
        onSearchChange={setSearchKeyword}
      />

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

      <div className="flex w-full justify-center">
        <PaginationControls
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
