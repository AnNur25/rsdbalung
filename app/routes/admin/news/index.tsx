import { useEffect, useRef, useState } from "react";
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
import toast from "react-hot-toast";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import ConfirmDialog from "~/components/ConfirmDialog";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<LoaderResult> {
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/berita`);

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
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/berita`);

  if (method === "DELETE") {
    const newsId = formData.get("id");
    urlRequest.pathname = `/berita/${newsId}`;
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
  const fetcherData = fetcher.data || { message: "", success: false };
  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteNewsId, setDeleteNewsId] = useState("");

  const deleteOnClick = (id: string) => {
    setDeleteNewsId(id);
    console.log(deleteNewsId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    fetcher.submit(
      { id: deleteNewsId },
      {
        method: "delete",
      },
    );
    setDeleteDialogOpen(false);
  };
  console.log(loaderData);
  // const hasShownLoaderToastRef = useRef(false);
  // useEffect(() => {
  //   if (!hasShownLoaderToastRef.current && loaderData?.message) {
  //     if (loaderData.success) {
  //       toast.success(loaderData.message);
  //     } else {
  //       toast.error(loaderData.message);
  //     }
  //     hasShownLoaderToastRef.current = true;
  //   }
  // }, [loaderData]);
  // useEffect(() => {
  //   if (loaderData?.success) toast.success(loaderData.message);
  //   else toast.error(loaderData.message);
  // }, []);

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
      <div className="mb-4 flex items-center justify-between">
        <h1 className="w-max text-2xl font-bold uppercase">Berita</h1>
        <a
          href="/admin/berita/create"
          className="flex w-fit items-center gap-2 rounded-lg bg-green-600 py-2 ps-2 pe-4 text-white"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Tambah</span>
        </a>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border-1 border-gray-300 px-6 py-4 shadow-xl">
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
                <td className="border border-gray-300 px-4 py-2">
                  {item.judul}
                </td>
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
                      onClick={() => deleteOnClick(item.id)}
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
      </div>
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        cancelOnClick={() => setDeleteDialogOpen(false)}
        confirmOnClick={handleDelete}
        // title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus data ini?"
        cancelLabel="Batal"
        confirmLabel="Hapus"
      />
      {/* <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-gray-600/90" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <DialogTitle className="text-lg font-bold text-gray-900">
              Konfirmasi Hapus
            </DialogTitle>
            <Description className="mt-2 text-sm text-gray-600">
              Apakah Anda yakin ingin menghapus?
            </Description>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog> */}
    </>
  );
}
