import axios from "axios";
import type { Route } from "./+types/edit";
import { useFetcher, useNavigate } from "react-router";
import { handleLoader } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";
import type { PelayananDetail } from "~/models/Pelayanan";
import { useEffect, useState } from "react";
import formatDigits from "~/utils/formatDigits";
import toast from "react-hot-toast";
import { createAuthenticatedClient } from "~/utils/auth-client";

export async function loader({ params }: Route.LoaderArgs) {
  const urlRequest = new URL(
    `${import.meta.env.VITE_API_URL}/pelayanan/${params.id}`,
  );
  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request, params }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);

  const urlRequest = new URL(
    `${import.meta.env.VITE_API_URL}/pelayanan/${params.id}`,
  );

  const formData = await request.formData();
  return handleAction(() =>
    client.put(urlRequest.href, {
      ...Object.fromEntries(formData.entries()),
      Biaya: parseInt(formData.get("Biaya") as string, 10),
    }),
  );
}

export default function EditService({ loaderData }: Route.ComponentProps) {
  console.log(loaderData);
  const pelayanan: PelayananDetail = loaderData.data;

  const [name, setName] = useState<string>(pelayanan.nama_pelayanan || "");
  const [duration, setDuration] = useState<string>(pelayanan.JangkaWaktu || "");
  const [cost, setCost] = useState<number>(pelayanan.Biaya || 0);
  const [displayValue, setDisplayValue] = useState(
    formatDigits(cost.toString()) || "",
  );
  const [requirement, setRequirement] = useState<string>(
    pelayanan.Persyaratan || "",
  );
  const [procedure, setProcedure] = useState<string>(pelayanan.Prosedur || "");

  const navigate = useNavigate();
  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };
  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
        setTimeout(() => {
          navigate("/humasbalung/pelayanan");
        }, 2000);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold uppercase">
        Form Pengisian Layanan RS
      </h1>
      <div className="mb-4 rounded-xl border border-gray-300 p-4 text-sm shadow-lg">
        <fetcher.Form method="put">
          <div className="mb-4">
            <label htmlFor="nama_pelayanan" className="text-lg font-bold">
              Nama Pelayanan <span className="text-red-600">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Isi nama layanan di sini"
              name="nama_pelayanan"
              id="nama_pelayanan"
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              required
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
            />
            {fetcherData.message && (
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
            <label htmlFor="JangkaWaktu" className="text-lg font-bold">
              Jangka Waktu <span className="text-red-600">*</span>
            </label>
            <textarea
              value={duration}
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              onChange={(e) => setDuration(e.target.value)}
              name="JangkaWaktu"
              id="JangkaWaktu"
              placeholder="Isi jangka waktu di sini"
              required
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
            ></textarea>
            {fetcherData.message && (
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
            <label htmlFor="Biaya" className="text-lg font-bold">
              Biaya <span className="text-red-600">*</span>
            </label>
            <div className="relative flex items-center">
              <p className="absolute left-3">Rp</p>
              <input
                onInput={(e) => {
                  const input = e.currentTarget;
                  input.value = input.value.replace(/\D/g, "");
                  const formatted = formatDigits(input.value);
                  setDisplayValue(formatted);
                  setCost(input.value ? parseInt(input.value, 10) : 0);
                }}
                value={displayValue}
                type="text"
                placeholder="Isi jumlah biaya di sini"
                id="Biaya"
                required
                className={`${
                  fetcherData.message && !fetcherData.success
                    ? "border-red-500 focus:outline-red-500"
                    : "border-gray-300 focus:outline-blue-500"
                } w-full rounded border border-gray-300 py-2 ps-8`}
              />
            </div>
            {fetcherData.message && (
              <p
                className={`text-sm ${
                  fetcherData.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {fetcherData.message}
              </p>
            )}
            <input type="number" name="Biaya" hidden readOnly value={cost} />
          </div>
          <div className="mb-4">
            <label htmlFor="Persyaratan" className="text-lg font-bold">
              Persyaratan <span className="text-red-600">*</span>
            </label>
            <textarea
              value={requirement}
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              onChange={(e) => setRequirement(e.target.value)}
              name="Persyaratan"
              id="Persyaratan"
              placeholder="Isi persyaratan di sini"
              required
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
            ></textarea>
            {fetcherData.message && (
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
            <label htmlFor="Prosedur" className="text-lg font-bold">
              Prosedur <span className="text-red-600">*</span>
            </label>
            <textarea
              value={procedure}
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              onChange={(e) => setProcedure(e.target.value)}
              name="Prosedur"
              id="Prosedur"
              placeholder="Isi prosedur di sini"
              required
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
            ></textarea>
            {fetcherData.message && (
              <p
                className={`text-sm ${
                  fetcherData.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {fetcherData.message}
              </p>
            )}
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
              onClick={() => navigate("/humasbalung/pelayanan")}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Batal
            </button>
          </div>
        </fetcher.Form>
      </div>
    </>
  );
}
