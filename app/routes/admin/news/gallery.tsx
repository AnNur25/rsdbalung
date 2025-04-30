import { Form, useActionData, useFetcher } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/solid";
import type { Route } from "./+types/gallery";
import { handleAction } from "~/utils/handleAction";
import {
  getDataForToast,
  useToast,
  useToastFromAction,
  useToastFromLoader,
} from "~/hooks/useToast";
import { toast } from "react-hot-toast";
import { handleLoader, type LoaderResult } from "~/utils/handleLoader";

// Load existing gallery photos
export async function loader({ params }: Route.LoaderArgs) {
  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/berita/${params.id}/galeri-berita`,
  );
  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request, params }: Route.ActionArgs) {
  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/berita/${params.id}/galeri-berita`,
  );
  const formData = await request.formData();
  const method = request.method;
  if (method === "POST") {
    const files = formData.getAll("gambar_tambahan");
    if (files.length > 4) {
      return { error: "Maksimal upload 4 foto." };
    }
    console.log(files);
    if (
      files.length === 0 ||
      files.every((file) => !(file instanceof File) || file.size === 0)
    ) {
      return { error: "Mohon upload minimal 1 foto" };
    }

    return handleAction(
      () =>
        axios.post(urlRequest.href, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      "Foto berhasil diupload.",
    );
  }

  if (method === "DELETE") {
    const deleteData = formData.getAll("ids");

    return handleAction(
      () => axios.delete(urlRequest.href, { data: { ids: [...deleteData] } }),
      "Foto berhasil dihapus.",
    );
  }

  return { error: "Method tidak dikenal." };
}

type Gallery = { id: string; url: string }[];

export default function GalleryNews({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const photos = Array.isArray(loaderData?.data)
    ? (loaderData.data as Gallery)
    : [];
  const fetcher = useFetcher();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  console.log("ActionData:", actionData);
  const actionToastData = actionData as { error?: string; success?: string };
  const loaderToastData = getDataForToast(loaderData);
  useEffect(() => {
    if (loaderToastData?.success) toast.success(loaderToastData.success);
    if (loaderToastData?.error) toast.error(loaderToastData.error);
  }, [loaderToastData]);
  // useEffect(() => {
  //   if (actionToastData?.success) toast.success(actionToastData.success);
  //   if (actionToastData?.error) toast.error(actionToastData.error);
  // }, [actionToastData]);
  const handleCheckboxChange = (photoId: string) => {
    setSelectedIds((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId],
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(photos.map((photo) => photo.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    const formData = new FormData();
    selectedIds.forEach((id) => formData.append("ids", id));
    fetcher.submit(formData, {
      method: "delete",
    });
    setSelectedIds([]);
    setSelectAll(false);
  };

  return (
    <div className="w-[100%] p-4 shadow-2xl">
      <h1 className="mb-4 w-max text-2xl font-bold">Form Galeri Berita</h1>

      <div className="flex items-center justify-center gap-2 lg:max-w-3/5">
        <Form
          method="post"
          encType="multipart/form-data"
          className="flex w-full shrink gap-2"
        >
          <input
            type="file"
            name="gambar_tambahan"
            multiple
            accept="image/*"
            className="w-full rounded border border-gray-500 p-2"
          />
          <button
            type="submit"
            className="rounded bg-green-500 px-4 py-2 text-white"
          >
            Tambah
          </button>
        </Form>
      </div>

      <div className="mt-6 flex w-full">
        {photos?.length > 0 && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAllChange}
              className="h-4 w-4"
            />
            <label className="text-sm">Pilih Semua</label>
          </div>
        )}

        <button
          disabled={selectedIds.length <= 0}
          onClick={handleDeleteSelected}
          className={`ms-auto me-2 flex items-center rounded p-2 text-white ${selectedIds.length <= 0 ? "bg-red-600/50" : "bg-red-600"}`}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid min-h-[40vh] w-full grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
        {photos?.map((photo) => (
          <div key={photo.id} className="relative aspect-video h-auto w-full">
            <img
              src={photo.url}
              alt="Gallery"
              className="aspect-video h-auto w-full rounded-lg object-cover"
            />
            <div className="absolute top-2 right-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(photo.id)}
                onChange={() => handleCheckboxChange(photo.id)}
                className="h-4 w-4"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-2 w-max text-sm text-red-500">NB: Maksimal 4 Foto</p>
    </div>
  );
}
