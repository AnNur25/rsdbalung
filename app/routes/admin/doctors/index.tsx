import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useFetcher, useSearchParams } from "react-router";

import { handleAction } from "~/utils/handleAction";
import { handleLoader } from "~/utils/handleLoader";

import type { Route } from "./+types/index";
import type { Doctor } from "~/models/Doctor";
import { paginationDefault, type Pagination } from "~/models/Pagination";

import PaginationControls from "~/components/PaginationControl";
import SearchBar from "~/components/SearchBar";
import DoctorCard from "~/components/DoctorCard";

import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import toast from "react-hot-toast";

export async function loader({ request }: Route.LoaderArgs) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/dokter`);

  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const keyword = url.searchParams.get("keyword");

  if (keyword) {
    urlRequest.pathname = "/dokter/search";
    urlRequest.searchParams.set("keyword", keyword);
  }
  urlRequest.searchParams.set("page", page);

  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request }: Route.ActionArgs) {
  const method = request.method;
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/dokter`);
  const formData = await request.formData();

  if (method === "DELETE") {
    const idDokter = formData.get("id") as string;
    urlRequest.pathname = `/dokter/${idDokter}`;
    return handleAction(() => axios.delete(urlRequest.href));
  }
}

export default function AdminDoctors({ loaderData }: Route.ComponentProps) {
  const data = loaderData.data;
  const { Dokter: doctors = [], pagination = paginationDefault } = data as {
    Dokter: Doctor[];
    pagination: Pagination;
  };

  const [currentPage, setCurrentPage] = useState(pagination.currentPage || 1);
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
    if (searchKeyword.trim() === "") {
      setSearchParams({ page: page.toString() });
      setIsSearching(false);
    } else {
      setSearchParams({ page: page.toString(), keyword: searchKeyword });
      setIsSearching(true);
    }
    setCurrentPage(page);
  };
  const fetcher = useFetcher();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDoctorId, setDeleteDoctorId] = useState("");
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
  const hasShownLoaderToastRef = useRef(false);
  useEffect(() => {
    if (!hasShownLoaderToastRef.current && loaderData?.message) {
      if (loaderData.success) {
        toast.success(loaderData.message);
      } else {
        toast.error(loaderData.message);
      }
      hasShownLoaderToastRef.current = true;
    }
  }, [loaderData]);
  const deleteOnClick = (id: string) => {
    setDeleteDoctorId(id);
    console.log(deleteDoctorId);
    setDeleteDialogOpen(true);
  };
  const handleDelete = () => {
    fetcher.submit(
      { id: deleteDoctorId },
      {
        method: "delete",
      },
    );
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="w-max text-2xl font-bold uppercase">Daftar Dokter</h1>
        <a
          href="/admin/dokter/create"
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

        <section className="flex flex-col flex-wrap justify-center gap-5 py-4 min-md:flex-row">
          {doctors.length > 0 ? (
            doctors.map((doctor, index) => (
              <>
                <div
                  className="flex flex-col items-center justify-between gap-4"
                  key={index}
                >
                  <div className="flex-1">
                    <DoctorCard
                      isAdmin
                      id={doctor.id_dokter}
                      name={doctor.nama}
                      specialty={doctor.poli.nama_poli}
                      image={doctor.gambar}
                    />
                  </div>
                  <div className="flex flex-none justify-center gap-0.5">
                    <a
                      href={`/admin/dokter/edit/${doctor.id_dokter}`}
                      className="block h-fit w-min rounded bg-green-600 p-2 text-white hover:underline"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </a>
                    <button
                      // onClick={() => handleDelete(doctor.id_dokter)}
                      onClick={() => deleteOnClick(doctor.id_dokter)}
                      className="block h-fit w-min cursor-pointer rounded bg-red-600 p-2 text-white hover:cursor-pointer"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ))
          ) : (
            <p className="text-gray-500 capitalize">{loaderData.message}</p>
          )}
        </section>

        <div className="flex w-full justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <Dialog
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
      </Dialog>
    </>
  );
}
