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
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
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
      // console.log(files);
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
      // console.log("action delete");
      // console.log("action delete", deleteData);
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

  // Selected Banner Data
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Layanan Unggulan Data
  const [disableLayananForm, setDisableLayananForm] = useState<boolean>(true);
  const [layananTitle, setLayananTitle] = useState<string>("");
  const [layananDescription, setLayananDescription] = useState<string>("");

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
  // console.log("ids delete", selectedIds);

  const handleDeleteSelected = () => {
    const formData = new FormData();
    selectedIds.forEach((id) => formData.append("ids", id));
    // console.log("form delete", formData);
    formData.append("feat", "banner");
    fetcher.submit(formData, {
      method: "DELETE",
    });
    setSelectedIds([]);
    setSelectAll(false);
  };

  return (
    <>
      {/* Banner */}
      <div className="w-full p-4 shadow-2xl">
        <h2 className="mb-4 w-max text-2xl font-bold">Banner</h2>

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
              className="w-full rounded border border-gray-500 px-2 py-1.5"
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
            className={`ms-auto me-2 flex items-center rounded px-2 py-1.5 text-white ${selectedIds.length <= 0 ? "bg-gray-500" : "bg-red-600"}`}
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

      {/* Layanan Unggulan */}
      <div className="mt-12 mb-4 flex justify-between items-center">
        <h2 className="w-min text-2xl font-bold uppercase">Layanan Unggulan</h2>
        <button
          onClick={() => setDisableLayananForm(false)}
          className={`h-min rounded p-2 text-white ${disableLayananForm ? "bg-green-600" : "bg-gray-500"}`}
        >
          <PencilSquareIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-8 w-full p-4 shadow-2xl">
        <div className="flex items-center justify-center gap-2">
          <Form
            method="post"
            encType="multipart/form-data"
            className="flex w-full shrink flex-col gap-2"
          >
            <input type="text" name="feat" hidden value="unggulan" readOnly />
            <div className="flex flex-col gap-2">
              <label
                htmlFor="judul"
                className={`text-md font-semibold ${disableLayananForm && "text-gray-500"}`}
              >
                Judul{" "}
                <span
                  className={`${disableLayananForm ? "text-gray-500" : "text-red-600"}`}
                >
                  *
                </span>
              </label>
              <input
                type="text"
                placeholder="Isi judul di sini"
                className="rounded-lg border border-gray-400 px-4 py-2"
                name="judul"
                id="judul"
                disabled={disableLayananForm}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="deskripsi"
                className={`text-md font-semibold ${disableLayananForm && "text-gray-500"}`}
              >
                Deskripsi{" "}
                <span
                  className={`${disableLayananForm ? "text-gray-500" : "text-red-600"}`}
                >
                  *
                </span>
              </label>
              <input
                placeholder="Isi deskripsi di sini"
                type="text"
                className="rounded-lg border border-gray-400 px-4 py-2"
                name="deskripsi"
                id="deskripsi"
                disabled={disableLayananForm}
              />
            </div>

            <div className="mt-6 flex gap-17">
              <h2
                className={`text-md font-semibold ${disableLayananForm && "text-gray-500"}`}
              >
                Gambar Layanan Unggulan{" "}
                <span
                  className={`${disableLayananForm ? "text-gray-500" : "text-red-600"}`}
                >
                  *
                </span>
              </h2>
              <h2
                className={`text-md font-semibold max-md:hidden ${disableLayananForm && "text-gray-500"}`}
              >
                Caption{" "}
                <span
                  className={`${disableLayananForm ? "text-gray-500" : "text-red-600"}`}
                >
                  *
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-2 max-md:flex-col">
              <input
                disabled={disableLayananForm}
                type="file"
                name="file"
                accept="image/*"
                className="h-full w-full rounded border border-gray-400 p-1 min-md:max-w-64"
              />
              <input
                disabled={disableLayananForm}
                placeholder="Isi caption di sini"
                type="text"
                name="caption"
                className="w-full grow rounded border border-gray-400 px-2 py-1.5 min-md:ms-4"
              />

              <button
                disabled={disableLayananForm}
                className="flex h-min w-full justify-center rounded bg-green-500 p-1.5 text-white min-md:w-min"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => setDisableLayananForm(true)}
              className="rounded bg-green-500 px-8 py-2 text-white min-md:w-min"
            >
              Simpan
            </button>
          </Form>
        </div>

        <p className="mt-2 w-max text-sm text-red-500">NB: Maksimal 4 Foto</p>
      </div>

      <div className="p-0.5" />
    </>
  );
}
