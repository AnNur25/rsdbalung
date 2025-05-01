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
  type HTMLFormMethod,
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
  MinusIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { handleAction } from "~/utils/handleAction";
import type { Banner } from "~/models/Banner";
import type {
  ExistingImage,
  ImageCaption,
  Unggulan,
  UnggulanRequest,
} from "~/models/Unggulan";

export async function loader({ params }: Route.LoaderArgs) {
  const bannerRequest = new URL("https://rs-balung-cp.vercel.app/banner/");
  const unggulanRequest = new URL(
    "https://rs-balung-cp.vercel.app/layanan-unggulan/",
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
  // console.log(data);
  return {
    success: true,
    message: "Selesai mendapatkan data",
    data,
  };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  console.log("formData", formData);
  const method = request.method;
  console.log("method", method);
  const feature = formData.get("feat");
  console.log("feature", feature);

  if (feature === "banner") {
    const bannerRequest = new URL("https://rs-balung-cp.vercel.app/banner/");
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

  // Action Layanan Unggulan
  if (feature === "unggulan") {
    const unggulanRequest = new URL(
      "https://rs-balung-cp.vercel.app/layanan-unggulan/",
    );

    if (method === "POST") {
      return handleAction(
        () =>
          axios.post(unggulanRequest.href, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
        "Berhasil",
      );
    }
    if (method === "PUT") {
      unggulanRequest.pathname = `/layanan-unggulan/${formData.get("id")}`;
      return handleAction(
        () =>
          axios.put(unggulanRequest.href, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
        "Berhasil",
      );
    }
  }
  return { error: "Permintaan tidak dikenal." };
}

export default function AdminHome({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const loaderToastData = getDataForToast(loaderData);
  const actionToastData = actionData as { error?: string; success?: string };

  console.log("actionToastData", actionToastData);

  const banners = Array.isArray(loaderData?.data?.banners)
    ? (loaderData?.data?.banners as Banner[])
    : [];

  // useEffect(() => {
  //   if (actionToastData?.success) toast.success(actionToastData.success);
  //   if (actionToastData?.error) toast.error(actionToastData.error);
  // }, [actionToastData]);

  // useEffect(() => {
  //   if (loaderToastData?.success) toast.success(loaderToastData.success);
  //   if (loaderToastData?.error) toast.error(loaderToastData.error);
  // }, []);

  // const showToast = (message?: string) => {
  //   toast.success(message || "Default");
  // };

  const fetcher = useFetcher();

  // Selected Banner Data
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const unggulanData: Unggulan = loaderData?.data?.unggulan ?? {};

  const transformedUnggulanData: UnggulanRequest = {
    id_layanan_unggulan: unggulanData.id_layanan_unggulan,
    judul: unggulanData.judul,
    deskripsi: unggulanData.deskripsi,
    existingImages: unggulanData.gambarCaptions.map((img) => ({
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
  };

  const [existingImagesData, setExistingImagesData] = useState<ImageCaption[]>(
    transformedUnggulanData.existingImages || [],
  );

  // const [newUnggulanData, setNewUnggulanData] = useState<{ caption: string }[]>(
  //   [
  //     {
  //       caption: "",
  //     },
  //   ],
  // );
  const [newUnggulanData, setNewUnggulanData] = useState<
    { caption: string }[] | null
  >(null);

  const handleAddUnggulan = () => {
    setNewUnggulanData([
      ...(newUnggulanData || []),
      {
        caption: "",
      },
    ]);
  };

  const handleRemoveExistingUnggulan = (index: number) => {
    if (existingImagesData.length === 1) {
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

    formData.append("id", transformedUnggulanData.id_layanan_unggulan);
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

    formData.append("gambarCaptions", JSON.stringify(captionsArray));

    console.log(formData);

    console.log("form unggulan", formData);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    // return;
    fetcher.submit(formData, {
      encType: "multipart/form-data",
      method: unggulanMethod,
    });
    // setDisableUnggulanForm(true);
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
              className="w-full rounded border border-gray-500 px-2 py-1.5"
            />
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white"
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
      <div className="mt-12 mb-4 flex items-center justify-between">
        <h2 className="w-min text-2xl font-bold uppercase min-md:w-max">
          Layanan Unggulan
        </h2>
        <button
          onClick={() => setDisableUnggulanForm(false)}
          className={`h-min rounded p-2 text-white ${disableUnggulanForm ? "bg-green-600" : "bg-gray-500"}`}
        >
          <PencilSquareIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-8 w-full p-4 shadow-2xl">
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
                className="rounded-lg border border-gray-400 px-4 py-2"
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
              <input
                required
                placeholder="Isi deskripsi di sini"
                type="text"
                className="rounded-lg border border-gray-400 px-4 py-2"
                name="deskripsi"
                id="deskripsi"
                disabled={disableUnggulanForm}
                value={unggulanDescription}
                onChange={(e) => setUnggulanDescription(e.target.value)}
              />
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
              <h2
                className={`text-md font-semibold max-md:hidden ${disableUnggulanForm && "text-gray-500"}`}
              >
                Caption{" "}
                <span
                  className={`${disableUnggulanForm ? "text-gray-500" : "text-red-600"}`}
                >
                  *
                </span>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {(existingImagesData ?? []).length > 0 &&
              (existingImagesData ?? []).length <= 4 ? (
                existingImagesData.map((u, index) => (
                  <>
                    <div className="flex items-center gap-2 max-md:flex-col">
                      {/* {u.id ? ( */}
                      <img
                        src={u.gambar}
                        className={`h-full w-full rounded border border-gray-400 p-1 min-md:max-w-64 ${disableUnggulanForm && "text-gray-500"}`}
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
                        className="w-full grow rounded border border-gray-400 px-2 py-1.5 min-md:ms-4"
                      />
                      {/* Add / Remove Buttons */}
                      {/* <div className="col-span-2 flex gap-2"> */}
                      {index == 0 ? (
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
                      ) : (
                        <button
                          disabled={disableUnggulanForm}
                          type="button"
                          onClick={() => handleRemoveExistingUnggulan(index)}
                          className={`flex h-min w-full justify-center rounded p-2 text-white min-md:w-min ${disableUnggulanForm ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"}`}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                      )}
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
                      className="w-full grow rounded border border-gray-400 px-2 py-1.5 min-md:ms-4"
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
              {(newUnggulanData ?? []).length > 0 &&
                (newUnggulanData ?? []).length + existingImagesData.length <=
                  4 &&
                (newUnggulanData ?? []).map((u, index) => (
                  <>
                    <div className="flex items-center gap-2 max-md:flex-col">
                      n
                      <input
                        required
                        disabled={disableUnggulanForm}
                        type="file"
                        name="file"
                        accept="image/*"
                        className={`h-full w-full rounded border border-gray-400 p-1 min-md:max-w-64 ${disableUnggulanForm && "text-gray-500"}`}
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
                        className="w-full grow rounded border border-gray-400 px-2 py-1.5 min-md:ms-4"
                      />
                      {index == 0 ? (
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
                      ) : (
                        <button
                          disabled={disableUnggulanForm}
                          type="button"
                          onClick={() => handleRemoveNewUnggulan(index)}
                          className={`flex h-min w-full justify-center rounded p-2 text-white min-md:w-min ${disableUnggulanForm ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"}`}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </>
                ))}
            </div>
            <button
              onClick={handleUnggulan}
              type="button"
              className={`mt-3 rounded px-8 py-2 text-white min-md:w-min ${disableUnggulanForm ? "bg-gray-500" : "bg-green-600"}`}
            >
              Simpan
            </button>
          </div>
        </div>

        <p className="mt-2 w-max text-sm text-red-500">NB: Maksimal 4 Foto</p>
      </div>

      <div className="p-0.5" />
    </>
  );
}
