import { useNavigation, useNavigate, useFetcher } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

import type { Poli } from "~/models/Poli";
import type { Route } from "./+types";
import { handleLoader } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";
import toast from "react-hot-toast";
import { createAuthenticatedClient } from "~/utils/auth-client";

export async function loader() {
  const poliRequest = new URL(`${import.meta.env.VITE_API_URL}/poli/`);
  return handleLoader(() => axios.get(poliRequest.href));
}

export async function action({ request }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);
  const formData = await request.formData();
  const defaultImageUrl = `http://localhost:5173/logosquare.jpg`;
  // console.log("formData", formData);
  const file = formData.get("file") as File;
  // const maxMb = 1;
  // if (file.size > maxMb * 1024 * 1024) {
  //   return { success: false, message: `Ukuran file maksimal ${maxMb}MB` };
  // }
  // Check if no file uploaded
  // if (!file || file.size === 0) {
  //   // Create a default image file
  //   const defaultImageResponse = await fetch(defaultImageUrl); // you must have this image in your public folder
  //   const blob = await defaultImageResponse.blob();
  //   const defaultFile = new File([blob], "logosquare.jpg", { type: blob.type });
  //   formData.delete("file");
  //   formData.append("file", defaultFile);
  // }
  // console.log("formData", formData);

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/dokter/`);
  return handleAction(() =>
    client.post(urlRequest.href, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
}

export default function CreateDoctor({ loaderData }: Route.ComponentProps) {
  const poliList: Poli[] = loaderData.data || [];

  const [selectedPoli, setSelectedPoli] = useState<Poli>(poliList[0]);
  const navigation = useNavigation();
  const [preview, setPreview] = useState<string | null>(null);
  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
    // console.log(file);
  };

  const navigate = useNavigate();
  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };
  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
        setTimeout(() => {
          navigate("/humasbalung/dokter");
        }, 2000);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold uppercase">
        Form Pengisian Daftar Dokter
      </h1>
      <div className="mb-4 rounded-xl border border-gray-300 p-4 text-sm shadow-lg">
        <fetcher.Form method="post" encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="file" className="text-lg font-bold">
              Gambar Dokter
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="my-2 h-24 rounded object-cover"
              />
            )}
            <input
              id="file"
              type="file"
              name="file"
              accept="image/*"
              onChange={handleImagePreview}
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="biodata_singkat" className="text-lg font-bold">
              Biodata Singkat <span className="text-red-600">*</span>
            </label>
            <textarea
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              name="biodata_singkat"
              id="biodata_singkat"
              placeholder="Isi biodata singkat di sini"
              required
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="id_poli" className="text-lg font-bold">
              Poli <span className="text-red-600">*</span>
            </label>
            <select
              required
              name="id_poli"
              id="id_poli"
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
            >
              {poliList.map((poli, index) => (
                <option key={index} value={poli.id_poli}>
                  {poli.nama_poli}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="nama" className="text-lg font-bold">
              Nama Dokter<span className="text-red-600">*</span>
            </label>
            <input
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              type="text"
              placeholder="Isi nama dokter di sini"
              name="nama"
              id="nama"
              required
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="link_instagram" className="text-lg font-bold">
              Instagram
            </label>

            <input
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              type="text"
              name="link_instagram"
              id="link_instagram"
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Isi link instagram di sini"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="link_linkedin" className="text-lg font-bold">
              LinkendIn
            </label>

            <input
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              type="text"
              name="link_linkedin"
              id="link_linkedin"
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Isi link linkedin di sini"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="link_facebook" className="text-lg font-bold">
              Facebook
            </label>

            <input
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              type="text"
              name="link_facebook"
              id="link_facebook"
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Isi link facebook di sini"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => navigate("/humasbalung/dokter")}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Batal
            </button>
          </div>
        </fetcher.Form>
        {/* 
      <button
        type="submit"
        disabled={navigation.state === "submitting"}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        {navigation.state === "submitting" ? "Submitting..." : "Create Doctor"}
      </button> */}
      </div>
    </>
  );
}
