import type { Route } from "./+types/home";
import { useFetcher, type HTMLFormMethod } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { handleLoader } from "~/utils/handleLoader";
import {
  MinusIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { handleAction } from "~/utils/handleAction";
import type { BannerModel } from "~/models/Banner";
import type {
  ExistingImage,
  ImageCaption,
  Unggulan,
  UnggulanRequest,
} from "~/models/Unggulan";
import ConfirmDialog from "~/components/ConfirmDialog";
import { createAuthenticatedClient } from "~/utils/auth-client";

export async function loader({ params }: Route.LoaderArgs) {
  const bannerRequest = new URL(`${import.meta.env.VITE_API_URL}/banner/`);
  const unggulanRequest = new URL(
    `${import.meta.env.VITE_API_URL}/layanan-unggulan/`,
  );
  const bannerResponse = await handleLoader(() =>
    axios.get(bannerRequest.href),
  );
  const unggulanResponse = await handleLoader(() =>
    axios.get(unggulanRequest.href),
  );
  const data = {
    banners: bannerResponse.data,
    unggulan: unggulanResponse.data,
  };
  console.log(data);
  return {
    success: true,
    message: "Selesai mendapatkan data",
    data,
  };
}

export async function action({ request, params }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);

  const formData = await request.formData();
  console.log("formData", formData);
  const method = request.method;
  console.log("method", method);
  const feature = formData.get("feat");
  console.log("feature", feature);
  const maxMb = 1;

  if (feature === "banner") {
    const bannerRequest = new URL(`${import.meta.env.VITE_API_URL}/banner/`);
    if (method === "POST") {
      const files = formData.getAll("banner");
      if (files.length > 4) {
        return { success: false, message: "Maksimal upload 4 foto." };
      }
      console.log(files);
      if (
        files.length === 0 ||
        files.every((file) => !(file instanceof File) || file.size === 0)
      ) {
        return { success: false, message: "Mohon upload minimal 1 foto" };
      }

      if (
        files.every(
          (file) => file instanceof File && file.size > maxMb * 1024 * 1024,
        )
      ) {
        return { success: false, message: `Ukuran file maksimal ${maxMb}MB` };
      }

      return handleAction(
        () =>
          client.post(bannerRequest.href, formData, {
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
          client.delete(bannerRequest.href, { data: { ids: [...deleteData] } }),
        "Foto berhasil dihapus.",
      );
    }
  }

  // Action Layanan Unggulan
  if (feature === "unggulan") {
    const unggulanRequest = new URL(
      `${import.meta.env.VITE_API_URL}/layanan-unggulan/`,
    );

    if (method === "POST") {
      return handleAction(
        () =>
          client.post(unggulanRequest.href, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
        "Berhasil",
      );
    }
    if (method === "PUT") {
      unggulanRequest.pathname = `/api/v1/layanan-unggulan/${formData.get("id")}`;
      return handleAction(
        () =>
          client.put(unggulanRequest.href, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
        "Berhasil",
      );
    }
  }
  return { error: "Permintaan tidak dikenal." };
}

export default function AdminHome({ loaderData }: Route.ComponentProps) {
  const banners = Array.isArray(loaderData?.data?.banners)
    ? (loaderData?.data?.banners as BannerModel[])
    : [];

  // console.log("fetcher", fetcher.data);
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

  // Selected Banner Data
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const unggulanData: Unggulan = loaderData?.data?.unggulan ?? {};

  const transformedUnggulanData: UnggulanRequest = {
    id_layanan_unggulan: unggulanData.id_layanan_unggulan,
    judul: unggulanData.judul,
    deskripsi: unggulanData.deskripsi,
    existingImages: unggulanData.gambar_captions?.map((img) => ({
      id: img.id,
      caption: img.caption,
      gambar: img.gambar,
      nama_file: img.nama_file,
    })),
  };

  // Layanan Unggulan Data
  const [disableUnggulanForm, setDisableUnggulanForm] = useState<boolean>(true);
  const [unggulanMethod, setUnggulanMethod] = useState<HTMLFormMethod>("put");
  const [unggulanTitle, setUnggulanTitle] = useState<string>(
    transformedUnggulanData?.judul || "",
  );
  const [unggulanDescription, setUnggulanDescription] = useState<string>(
    transformedUnggulanData?.deskripsi || "",
  );

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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteSelected = () => {
    const formData = new FormData();
    selectedIds.forEach((id) => formData.append("ids", id));
    // console.log("form delete", formData);
    formData.append("feat", "banner");
    fetcher.submit(formData, {
      method: "delete",
    });
    setSelectedIds([]);
    setSelectAll(false);
    setDeleteDialogOpen(false);
  };

  const [existingImagesData, setExistingImagesData] = useState<ImageCaption[]>(
    transformedUnggulanData.existingImages || [],
  );

  const [newUnggulanData, setNewUnggulanData] = useState<{ caption: string }[]>(
    [
      {
        caption: "",
      },
    ],
  );
  // const [newUnggulanData, setNewUnggulanData] = useState<
  //   { caption: string }[] | null
  // >(null);

  const handleAddUnggulan = () => {
    const max = 4;
    const nExisting = existingImagesData.length;
    const nNew = newUnggulanData.length;
    const total = nExisting + nNew;
    if (total < 4) {
      setNewUnggulanData([
        ...(newUnggulanData || []),
        {
          caption: "",
        },
      ]);
    } else {
      toast.error("Maksimal 4");
    }
  };

  const handleRemoveExistingUnggulan = (index: number) => {
    if (existingImagesData.length <= 1) {
      // setExistingImagesData([
      //   {
      //     id: "",
      //     caption: "",
      //     gambar: "",
      //     nama_file: "",
      //   },
      // ]);
      setExistingImagesData(existingImagesData.filter((_, i) => i !== index));
      setNewUnggulanData([{ caption: "" }]);
    } else {
      setExistingImagesData(existingImagesData.filter((_, i) => i !== index));
    }
  };
  const handleRemoveNewUnggulan = (index: number) => {
    if (newUnggulanData && newUnggulanData.length === 1) {
      setNewUnggulanData([
        {
          caption: "",
        },
      ]);
    } else {
      if (newUnggulanData) {
        setNewUnggulanData(newUnggulanData.filter((_, i) => i !== index));
      }
    }
  };

  console.log("existingImagesData", existingImagesData);
  console.log("newImagesData", newUnggulanData);
  const handleUnggulanChange = (
    index: number,
    field: keyof ExistingImage,
    value: string,
  ) => {
    const editedUnggulan = [...existingImagesData];
    editedUnggulan[index][field] = value;
    setExistingImagesData(editedUnggulan);
  };

  const handleNewUnggulanChange = (
    index: number,
    field: keyof { caption: string },
    value: string,
  ) => {
    const newUnggulan = [...(newUnggulanData || [])];
    newUnggulan[index][field] = value;
    setNewUnggulanData(newUnggulan);
  };

  const handleUnggulan = () => {
    const formData = new FormData();

    formData.append("id", unggulanData.id_layanan_unggulan);
    formData.append("feat", "unggulan");

    formData.append("judul", unggulanTitle);
    formData.append("deskripsi", unggulanDescription);
    formData.append("existingImages", JSON.stringify(existingImagesData));
    const fileInputs = document.querySelectorAll<HTMLInputElement>(
      'input[type="file"][name="file"]',
    );
    const captionInputs = document.querySelectorAll<HTMLInputElement>(
      'input[type="text"][name="caption"]',
    );
    // console.log(fileInputs)
    // console.log(captionInputs)

    fileInputs.forEach((fileInput) => {
      if (fileInput.files && fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach((file) => {
          console.log(file);
          formData.append("file", file);
        });
      }
    });

    const captionsArray: { caption: string }[] = [];
    captionInputs.forEach((captionInput) => {
      console.log({ caption: captionInput.value });

      captionsArray.push({ caption: captionInput.value });
    });

    formData.append("gambarCaption", JSON.stringify([...captionsArray]));

    console.log(formData);

    console.log("form unggulan", formData);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    // return;
    fetcher.submit(formData, {
      encType: "multipart/form-data",
      method: "put",
    });
    // fetcher.load(window.location.pathname);
    setDisableUnggulanForm(true);
  };

  return (
    <>
      {/* Banner */}
      <h2 className="mb-4 w-max text-2xl font-bold uppercase">Banner</h2>
      <div className="w-full rounded-lg border border-gray-400/50 p-4 shadow-2xl">
        <div className="flex items-center justify-center gap-2 lg:max-w-3/5">
          <fetcher.Form
            // onSubmit={() => fetcher.load(window.location.pathname)}
            method="post"
            encType="multipart/form-data"
            className="flex w-full shrink gap-2"
          >
            <input
              required
              type="text"
              name="feat"
              hidden
              value="banner"
              readOnly
            />
            <input
              required
              type="file"
              name="banner"
              multiple
              accept="image/*"
              className="w-full rounded border border-gray-500 px-2 py-1.5 hover:cursor-pointer"
            />
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white"
            >
              Tambah
            </button>
          </fetcher.Form>
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
            onClick={() => setDeleteDialogOpen(true)}
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
        {/* <p className="mt-2 w-max text-sm text-red-500">NB: Maksimal 4 Foto</p> */}
        <ul className="ms-4 mt-2 list-decimal text-sm text-red-500">
          <li>Maksimal 4 foto</li>
          <li>Resolusi 2172 x 857 pixel</li>
          <li>Masing-masing gambar besarnya maksimal 5 mb</li>
          <li>Tipe file png dan jpg</li>
        </ul>
      </div>

      {/* Layanan Unggulan */}
      <div className="mt-12 mb-4 flex items-center justify-between">
        <h2 className="w-min text-2xl font-bold uppercase min-md:w-max">
          Layanan Unggulan
        </h2>
        <button
          onClick={() => setDisableUnggulanForm(false)}
          className={`h-min rounded p-2 text-white ${disableUnggulanForm ? "bg-green-600" : "bg-gray-500"}`}
          title="Edit"
        >
          <PencilSquareIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-8 w-full rounded-lg border border-gray-400/50 p-4 shadow-2xl">
        <div className="flex items-center justify-center gap-2">
          <div
            // method={unggulanMethod}
            // encType="multipart/form-data"
            className="flex w-full shrink flex-col gap-2"
          >
            <input
              required
              type="text"
              name="feat"
              hidden
              value="unggulan"
              readOnly
            />
            <div className="flex flex-col gap-2">
              <label
                htmlFor="judul"
                className={`text-md font-semibold ${disableUnggulanForm && "text-gray-500"}`}
              >
                Judul{" "}
                <span
                  className={`${disableUnggulanForm ? "text-gray-500" : "text-red-600"}`}
                >
                  *
                </span>
              </label>
              <input
                required
                type="text"
                placeholder="Isi judul di sini"
                className={`rounded-lg border border-gray-400 px-4 py-2 ${disableUnggulanForm && "text-gray-500"}`}
                name="judul"
                id="judul"
                disabled={disableUnggulanForm}
                value={unggulanTitle}
                onChange={(e) => setUnggulanTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="deskripsi"
                className={`text-md font-semibold ${disableUnggulanForm && "text-gray-500"}`}
              >
                Deskripsi{" "}
                <span
                  className={`${disableUnggulanForm ? "text-gray-500" : "text-red-600"}`}
                >
                  *
                </span>
              </label>
              <textarea
                required
                placeholder="Isi deskripsi di sini"
                className={`rounded-lg border border-gray-400 px-4 py-2 ${disableUnggulanForm && "text-gray-500"}`}
                name="deskripsi"
                id="deskripsi"
                disabled={disableUnggulanForm}
                value={unggulanDescription}
                onChange={(e) => setUnggulanDescription(e.target.value)}
              ></textarea>
              {/* <input
                required
                placeholder="Isi deskripsi di sini"
                type="text"
                className={`rounded-lg border border-gray-400 px-4 py-2 ${disableUnggulanForm && "text-gray-500"}`}
                name="deskripsi"
                id="deskripsi"
                disabled={disableUnggulanForm}
                value={unggulanDescription}
                onChange={(e) => setUnggulanDescription(e.target.value)}
              /> */}
            </div>

            <div className="mt-6 flex gap-17">
              <h2
                className={`text-md font-semibold ${disableUnggulanForm && "text-gray-500"}`}
              >
                Gambar Layanan Unggulan{" "}
                <span
                  className={`${disableUnggulanForm ? "text-gray-500" : "text-red-600"}`}
                >
                  *
                </span>
              </h2>
              {/* <h2
                className={`text-md font-semibold max-md:hidden ${disableUnggulanForm && "text-gray-500"}`}
              >
                Caption{" "}
                <span
                  className={`${disableUnggulanForm ? "text-gray-500" : "text-red-600"}`}
                >
                  *
                </span>
              </h2> */}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {(existingImagesData ?? []).length > 0 &&
              (existingImagesData ?? []).length <= 4 ? (
                existingImagesData.map((u, index) => (
                  <>
                    <div className="flex flex-col items-center gap-2">
                      {/* {u.id ? ( */}
                      <img
                        src={u.gambar}
                        className={`aspect-[2/3] h-full w-full rounded border border-gray-400 p-1 min-md:max-w-64 ${disableUnggulanForm && "text-gray-500 grayscale"}`}
                      />
                      {/* ) : (
                        <input
                          required
                          disabled={disableUnggulanForm}
                          type="file"
                          name="file"
                          accept="image/*"
                          className={`h-full w-full rounded border border-gray-400 p-1 min-md:max-w-64 ${disableUnggulanForm && "text-gray-500"}`}
                        />
                      )} */}

                      <input
                        value={u.caption}
                        onChange={(e) =>
                          handleUnggulanChange(index, "caption", e.target.value)
                        }
                        required
                        disabled={disableUnggulanForm}
                        placeholder="Isi caption di sini"
                        type="text"
                        // name="caption"
                        className={`w-full grow rounded border border-gray-400 px-2 py-1.5 ${disableUnggulanForm && "text-gray-500"}`}
                      />
                      {/* Add / Remove Buttons */}
                      {/* <div className="col-span-2 flex gap-2"> */}
                      {/* {index == 0 ? (
                        <div className="flex w-full gap-2 min-md:w-min">
                          <button
                            disabled={disableUnggulanForm}
                            type="button"
                            onClick={() => handleRemoveExistingUnggulan(index)}
                            className={`flex h-min w-full justify-center rounded p-2 text-white min-md:w-min ${disableUnggulanForm ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"}`}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <button
                            disabled={disableUnggulanForm}
                            type="button"
                            onClick={handleAddUnggulan}
                            className={`flex h-min w-full justify-center rounded p-2 text-white min-md:w-min ${disableUnggulanForm ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"}`}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ) : ( */}
                      <button
                        disabled={disableUnggulanForm}
                        type="button"
                        onClick={() => handleRemoveExistingUnggulan(index)}
                        className={`flex h-min w-full justify-center rounded p-2 text-white ${disableUnggulanForm ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"}`}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      {/* )} */}
                      {/* </div> */}
                    </div>
                  </>
                ))
              ) : (
                <>
                  {/* <div className="flex items-center gap-2 max-md:flex-col">
                    <input
                      required
                      disabled={disableUnggulanForm}
                      type="file"
                      name="file"
                      accept="image/*"
                      className={`h-full w-full rounded border border-gray-400 p-1 min-md:max-w-64 ${disableUnggulanForm && "text-gray-500"}`}
                    />
                    <input
                      required
                      disabled={disableUnggulanForm}
                      placeholder="Isi caption di sini"
                      type="text"
                      name="caption"
                      className="w-full grow rounded border border-gray-400 px-2 py-1.5 "
                    />

                    <button
                      onClick={handleAddUnggulan}
                      disabled={disableUnggulanForm}
                      className={`flex h-min w-full grow justify-center rounded p-1.5 text-white min-md:w-min ${disableUnggulanForm ? "bg-gray-500" : "bg-green-600"}`}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div> */}
                </>
              )}
              {(newUnggulanData ?? []).length >= 0 &&
                (newUnggulanData ?? []).length + existingImagesData.length <=
                  4 &&
                (newUnggulanData ?? [{ caption: "" }]).map((u, index) => (
                  <>
                    <div className="flex flex-col items-center gap-2">
                      <label
                        className={`flex aspect-[2/3] w-full flex-col items-center justify-center rounded border-2 border-dashed border-gray-400 bg-gray-50 transition-colors hover:border-gray-600 min-md:max-w-64 ${disableUnggulanForm ? "cursor-not-allowed bg-gray-100 text-gray-400" : "text-gray-500"}`}
                        // style={{ minHeight: "160px" }}
                      >
                        {/* <span className="text-sm text-gray-400">
                          Pilih gambar
                        </span> */}
                      </label>
                      <input
                        required
                        disabled={disableUnggulanForm}
                        type="file"
                        name="file"
                        accept="image/*"
                        className="hover:cursor-pointer"
                      />
                      <input
                        value={u.caption}
                        onChange={(e) =>
                          handleNewUnggulanChange(
                            index,
                            "caption",
                            e.target.value,
                          )
                        }
                        required
                        disabled={disableUnggulanForm}
                        placeholder="Isi caption di sini"
                        type="text"
                        name="caption"
                        className={`w-full grow rounded border border-gray-400 px-2 py-1.5 ${disableUnggulanForm && "text-gray-500"}`}
                      />
                      {/* {index == 0 && (existingImagesData ?? []).length <= 0 ? (
                        <div className="flex w-full gap-2 min-md:w-min">
                          <button
                            disabled={disableUnggulanForm}
                            type="button"
                            onClick={() => handleRemoveNewUnggulan(index)}
                            className={`flex h-min w-full justify-center rounded p-2 text-white min-md:w-min ${disableUnggulanForm ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"}`}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <button
                            disabled={disableUnggulanForm}
                            type="button"
                            onClick={handleAddUnggulan}
                            className={`flex h-min w-full justify-center rounded p-2 text-white min-md:w-min ${disableUnggulanForm ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"}`}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ) : ( */}
                      <button
                        disabled={disableUnggulanForm}
                        type="button"
                        onClick={() => handleRemoveNewUnggulan(index)}
                        className={`flex h-min w-full justify-center rounded p-2 text-white ${disableUnggulanForm ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"}`}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      {/* )} */}
                    </div>
                  </>
                ))}
            </div>
            <button
              disabled={disableUnggulanForm}
              type="button"
              onClick={handleAddUnggulan}
              className={`flex h-min w-full flex-1 justify-center rounded p-2 text-white ${disableUnggulanForm ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"}`}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleUnggulan}
              type="button"
              className={`mt-3 rounded px-8 py-2 text-white ${disableUnggulanForm ? "bg-gray-500" : "bg-green-600"}`}
            >
              Simpan
            </button>
          </div>
        </div>

        {/* <p className="mt-2 w-max text-sm text-red-500">NB: Maksimal 4 Foto</p> */}
        <ul className="ms-4 mt-2 list-decimal text-sm text-red-500">
          <li>Maksimal 4 foto</li>
          <li>Rasio 2:3</li>
          <li>Masing-masing gambar besarnya maksimal 5 mb</li>
          <li>Tipe file png dan jpg</li>
        </ul>
      </div>
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        cancelOnClick={() => setDeleteDialogOpen(false)}
        confirmOnClick={handleDeleteSelected}
        // title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin menghapus data ini?"
        cancelLabel="Tidak"
        confirmLabel="Iya"
      />
    </>
  );
}
