import axios from "axios";
import type { Route } from "./+types";
import { useFetcher, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { Doctor } from "~/models/Doctor";
import { handleLoader } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";
import type { Poli } from "~/models/Poli";
import toast from "react-hot-toast";
import { createAuthenticatedClient } from "~/utils/auth-client";

export async function loader({ params }: Route.LoaderArgs) {
  const doctorId = params.id;
  const urlRequest = new URL(
    `${import.meta.env.VITE_API_URL}/dokter/${doctorId}`,
  );
  const poliRequest = new URL(`${import.meta.env.VITE_API_URL}/poli/`);
  const poliResponse = await handleLoader(() => axios.get(poliRequest.href));
  const doctorResponse = await handleLoader(() => axios.get(urlRequest.href));
  const data = {
    poli: poliResponse.data,
    doctor: doctorResponse.data,
  };
  return {
    success: true,
    message: "Selesai mendapatkan data",
    data,
  };
}

export async function action({ request, params }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);
  const formData = await request.formData();
  const defaultImageUrl = formData.get("gambar") as string;
  console.log("formData", formData);
  const id = formData.get("id");
  const file = formData.get("file") as File;
  console.log(file);
  // Check if no file uploaded
  // if (!file || file.size === 0) {
  //   // Create a default image file
  //   const defaultImageResponse = await fetch(defaultImageUrl);
  //   const blob = await defaultImageResponse.blob();
  //   const defaultFile = new File([blob], "nochange.jpg", { type: blob.type });
  //   formData.delete("file");
  //   formData.append("file", defaultFile);
  // }
  const maxMb = 1;
  if (file.size > maxMb * 1024 * 1024) {
    return { success: false, message: `Ukuran file maksimal ${maxMb}MB` };
  }
  console.log("formData", formData);

  const urlRequest = new URL(
    `${import.meta.env.VITE_API_URL}/dokter/${id}`,
  );
  return handleAction(() =>
    client.put(urlRequest.href, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
}

export default function EditDoctor({ loaderData }: Route.ComponentProps) {
  const dokter: Doctor = loaderData.data.doctor.dokter;
  const poliList: Poli[] = loaderData.data.poli || [];

  const [doctorName, setDoctorName] = useState(dokter.nama);
  const [doctorImage, setDoctorImage] = useState(dokter.gambar);
  const [doctorBiodata, setDoctorBiodata] = useState(dokter.biodata_singkat);
  const [doctorLinkedIn, setDoctorLinkedIn] = useState(dokter.link_linkedin);
  const [doctorInstagram, setDoctorInstagram] = useState(dokter.link_instagram);
  const [doctorFacebook, setDoctorFacebook] = useState(dokter.link_facebook);
  const [poli, setPoli] = useState(dokter.poli.id_poli);

  const [preview, setPreview] = useState<string | null>(doctorImage);
  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
    console.log(file);
  };

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
          <input type="text" hidden name="id" value={dokter.id_dokter} />
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
            {fetcherData.message && !fetcherData.success && (
              <p
                className={`text-sm ${
                  fetcherData.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {fetcherData.message}
              </p>
            )}
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
              value={doctorBiodata}
              onChange={(e) => setDoctorBiodata(e.target.value)}
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
            {fetcherData.message && !fetcherData.success && (
              <p
                className={`text-sm ${
                  fetcherData.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {fetcherData.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="id_poli" className="text-lg font-bold">
              Poli <span className="text-red-600">*</span>
            </label>
            <select
              value={poli}
              onChange={(e) => setPoli(e.target.value)}
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
            {fetcherData.message && !fetcherData.success && (
              <p
                className={`text-sm ${
                  fetcherData.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {fetcherData.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="nama" className="text-lg font-bold">
              Nama <span className="text-red-600">*</span>
            </label>
            <input
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
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
            {fetcherData.message && !fetcherData.success && (
              <p
                className={`text-sm ${
                  fetcherData.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {fetcherData.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="link_instagram" className="text-lg font-bold">
              Link Instagram
            </label>

            <input
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              value={doctorInstagram}
              onChange={(e) => setDoctorInstagram(e.target.value)}
              type="text"
              name="link_instagram"
              id="link_instagram"
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Isi link instagram di sini"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="link_linkedin" className="text-lg font-bold">
              Link LinkendIn
            </label>

            <input
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              value={doctorLinkedIn}
              onChange={(e) => setDoctorLinkedIn(e.target.value)}
              type="text"
              name="link_linkedin"
              id="link_linkedin"
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Isi link linkedin di sini"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="link_facebook" className="text-lg font-bold">
              Link Facebook
            </label>

            <input
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              value={doctorFacebook}
              onChange={(e) => setDoctorFacebook(e.target.value)}
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
