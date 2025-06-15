import { useFetcher } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/solid";
import type { Route } from "./+types/director";
import { handleAction } from "~/utils/handleAction";

import { toast } from "react-hot-toast";
import { handleLoader } from "~/utils/handleLoader";
import type { GalleryModel } from "~/models/Gallery";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { createAuthenticatedClient } from "~/utils/auth-client";

export async function loader({ params }: Route.LoaderArgs) {
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/direktur`);
  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request, params }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/direktur`);
  const formData = await request.formData();
  console.log("formData direktur", formData);
  const method = request.method;
  if (method === "POST") {
    const file = formData.get("gambar");

    console.log("file direktur", file);
    if (!(file instanceof File) || file.size === 0) {
      return { success: false, message: "Mohon upload minimal 1 foto" };
    }

    return handleAction(
      () =>
        client.post(urlRequest.href, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      "Foto berhasil diupload.",
    );
  }

  if (method === "PUT") {
    const id = formData.get("id");

    return handleAction(
      () =>
        client.put(`${urlRequest.href}/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      "Foto berhasil dihapus.",
    );
  }

  return { error: "Method tidak dikenal." };
}

export default function Director({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const photos = Array.isArray(loaderData?.data)
    ? (loaderData.data as { id_direktur: string; gambar: string }[])
    : [];
  console.log("photos direktur", photos);
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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!photos || photos.length === 0) {
      fetcher.submit(formData, {
        method: "post",
        encType: "multipart/form-data",
      });
    } else {
      fetcher.submit(formData, {
        method: "put",
        encType: "multipart/form-data",
      });
    }
  };

  return (
    <>
      <div className="w-[100%] p-4 shadow-2xl">
        <h1 className="mb-4 w-max text-2xl font-bold">Foto Direktur</h1>

        <div className="flex items-center justify-center gap-2 lg:max-w-3/5">
          <fetcher.Form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="flex w-full shrink gap-2"
          >
            {photos && photos.length > 0 && (
              <input type="hidden" name="id" value={photos[0].id_direktur} />
            )}
            <input
              type="file"
              name="gambar"
              accept="image/*"
              className="w-full rounded border border-gray-500 p-2"
            />
            <button
              type="submit"
              className="rounded bg-green-500 px-4 py-2 text-white"
            >
              Tambah
            </button>
          </fetcher.Form>
        </div>

        <div className="mt-3 grid min-h-[40vh] w-full grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
          {photos?.map((photo) => (
            // <div key={photo.id_direktur} className="relative aspect-[9/16]">
            <img
              key={photo.id_direktur}
              src={photo.gambar}
              alt="Gallery"
              className="aspect-auto rounded-lg object-cover"
            />
            // </div>
          ))}
        </div>

        <p className="mt-2 w-max text-sm text-red-500">NB: Maksimal 1 Foto</p>
      </div>
    </>
  );
}
