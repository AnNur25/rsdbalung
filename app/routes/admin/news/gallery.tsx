import { Form, useActionData, useFetcher } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { Route } from "./+types/gallery";
import { handleAction } from "~/utils/handleAction";
import { useToast, useToastFromAction } from "~/hooks/useToast";
import { getErrorMessage } from "~/utils/handleError";
import { toast } from "react-hot-toast";
import { handleLoader, type LoaderResult } from "~/utils/handleLoader";

// Load existing gallery photos
export async function loader({ params }: Route.LoaderArgs) {
  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/berita/${params.id}/galeri-berita`,
  );
  return handleLoader(() => axios.get(urlRequest.href));
  // try {
  //   const { data } = await axios.get(urlRequest.href);
  //   return data.data;
  // } catch (error: any) {}
}

// Handle uploads
// export async function action({ request, params }: Route.ActionArgs) {
//   const urlRequest = new URL(
//     `https://rs-balung-cp.vercel.app/berita/${params.id}/galeri-berita`,
//   );
//   const bannerUrl = new URL("https://rs-balung-cp.vercel.app/berita");
//   const formData = await request.formData();
//   console.log(request);
//   const method = request.method;
//   if (method === "POST") {
//     const files = formData.getAll("gambar_tambahan");
//     console.log("files", formData);

//     if (files.length > 4) {
//       return { message: "Maksimal 4 foto." };
//     }

//     const uploadForm = new FormData();
//     files.forEach((file) => {
//       uploadForm.append("gambar_tambahan", file);
//     });
//     console.log("uploadForm", uploadForm);

//     try {
//       const response = await axios.post(urlRequest.href, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       console.log(response);
//     } catch (error: any) {
//       console.error("error", error.response.data);
//     }
//   }
//   if (method === "DELETE") {
//     try {
//       const deleteData = formData.getAll("ids");
//       console.log("deleteData", formData);
//       console.log("deleteData", deleteData);

//       const response = await axios.delete(urlRequest.href, {
//         data: { ids: [...deleteData] },
//       });
//       console.log("res delete", response);
//     } catch (error: any) {
//       console.log("error", error.response.data);
//     }
//   }
// }

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
export default function GalleryNews({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  // const photos = (loaderData as unknown as { id: string; url: string }[]) || [];
  const photos = ((loaderData as LoaderResult)?.data || []) as {
    id: string;
    url: string;
  }[];

  const fetcher = useFetcher();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  console.log("ActionData:", actionData);
  const data = actionData as { error?: string; success?: string };
  useEffect(() => {
    if (data?.success) toast.success(data.success);
    if (data?.error) toast.error(data.error);
  }, [data]);
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
      method: "DELETE",
    });
    setSelectedIds([]);
    setSelectAll(false);
  };

  return (
    <div className="p-4 shadow-2xl">
      <h1 className="mb-4 text-2xl font-bold">Form Galeri Berita</h1>

      <Form
        method="post"
        encType="multipart/form-data"
        className="flex items-center gap-2"
      >
        <input
          type="file"
          name="gambar_tambahan"
          multiple
          accept="image/*"
          className="border p-2"
        />
        <button
          type="submit"
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          Tambah
        </button>
      </Form>

      {photos?.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAllChange}
            className="h-4 w-4"
          />
          <label className="text-sm">Pilih Semua</label>
        </div>
      )}

      {/* {selectedIds.length == 0 && ( */}
      <button
        disabled={selectedIds.length <= 0}
        onClick={handleDeleteSelected}
        className={`ms-auto me-2 mt-4 flex items-center rounded p-2 text-white ${selectedIds.length <= 0 ? "bg-red-600/50" : "bg-red-600"}`}
      >
        <TrashIcon className="h-4 w-4" />
      </button>
      {/* )} */}

      <div className="mt-6 grid min-h-[40vh] grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-4">
        {photos?.map((photo) => (
          <div key={photo.id} className="relative aspect-video">
            <img
              src={photo.url}
              alt="Gallery"
              className="rounded-lg object-cover"
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

      <p className="mt-2 text-sm text-red-500">NB: Maksimal 4 Foto</p>
    </div>
  );
}
