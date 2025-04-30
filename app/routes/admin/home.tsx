import type { Route } from "./+types/home";
// import { getSession } from "~/sessions.server";
import {
  data,
  Form,
  isRouteErrorResponse,
  redirect,
  useFetcher,
  useRouteError,
  useSubmit,
} from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  getDataForToast,
  useToastFromAction,
  useToastFromLoader,
} from "~/hooks/useToast";
import { handleLoader } from "~/utils/handleLoader";
import { TrashIcon } from "@heroicons/react/24/solid";
import { handleAction } from "~/utils/handleAction";

type Banner = {
  id_banner: string;
  gambar: string;
};

export async function loader({ params }: Route.LoaderArgs) {
  const urlRequest = new URL("https://rs-balung-cp.vercel.app/banner/");
  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request, params }: Route.ActionArgs) {
  const bannerRequest = new URL("https://rs-balung-cp.vercel.app/banner/");
  const formData = await request.formData();
  const method = request.method;

  const feature = formData.get("feat");
  console.log("feature", feature);

  if (feature === "banner") {
    if (method === "POST") {
      const files = formData.getAll("banner");
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
          axios.post(bannerRequest.href, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
        "Foto berhasil diupload.",
      );
    }

    if (method === "DELETE") {
      const deleteData = formData.getAll("ids");
      console.log("action delete");
      console.log("action delete", deleteData);
      return handleAction(
        () =>
          axios.delete(bannerRequest.href, { data: { ids: [...deleteData] } }),
        "Foto berhasil dihapus.",
      );
    }
  }
  return { error: "Method tidak dikenal." };
}

export default function AdminHome({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const loaderToastData = getDataForToast(loaderData);
  const actionToastData = actionData as { error?: string; success?: string };
  console.log("actionToastData", actionToastData);
  const banners = Array.isArray(loaderData?.data)
    ? (loaderData.data as Banner[])
    : [];
  useEffect(() => {
    if (actionToastData?.success) toast.success(actionToastData.success);
    if (actionToastData?.error) toast.error(actionToastData.error);
  }, [actionToastData]);

  useEffect(() => {
    if (loaderToastData?.success) toast.success(loaderToastData.success);
    if (loaderToastData?.error) toast.error(loaderToastData.error);
  }, []);

  const showToast = (message?: string) => {
    toast.success(message || "Default");
  };

  const fetcher = useFetcher();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (bannerId: string) => {
    setSelectedIds((prev) =>
      prev.includes(bannerId)
        ? prev.filter((id) => id !== bannerId)
        : [...prev, bannerId],
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(banners.map((banner) => banner.id_banner));
    }
    setSelectAll(!selectAll);
  };
  console.log("ids delete", selectedIds);

  const handleDeleteSelected = () => {
    const formData = new FormData();
    selectedIds.forEach((id) => formData.append("ids", id));
    console.log("form delete", formData);
    formData.append("feat", "banner");
    fetcher.submit(formData, {
      method: "DELETE",
    });
    setSelectedIds([]);
    setSelectAll(false);
  };

  return (
    <div className="w-[100%] p-4 shadow-2xl">
      <h1 className="mb-4 w-max text-2xl font-bold">Banner</h1>
      <button
        onClick={() =>
          fetcher.submit({ message: "Test Action" }, { method: "POST" })
        }
      >
        Test
      </button>

      <div className="flex items-center justify-center gap-2 lg:max-w-3/5">
        <Form
          method="post"
          encType="multipart/form-data"
          className="flex w-full shrink gap-2"
        >
          <input type="text" name="feat" hidden value="banner" readOnly />
          <input
            type="file"
            name="banner"
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
        {banners?.length > 0 && (
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
          className={`ms-auto me-2 flex items-center rounded p-2 text-white ${selectedIds.length <= 0 ? "bg-gray-600" : "bg-red-600"}`}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 grid min-h-[40vh] w-full grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
        {banners?.map((banner) => (
          <div
            key={banner.id_banner}
            className="relative aspect-video h-auto w-full"
          >
            <img
              src={banner.gambar}
              alt="Gallery"
              className="aspect-video h-auto w-full rounded-lg object-cover"
            />
            <div className="absolute top-2 right-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(banner.id_banner)}
                onChange={() => handleCheckboxChange(banner.id_banner)}
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
