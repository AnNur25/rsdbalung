import { Form, useFetcher, useNavigate } from "react-router";
import type { Route } from "./+types";
import { handleAction } from "~/utils/handleAction";
import { useEffect, useState } from "react";
import formatDigits from "~/utils/formatDigits";
import toast from "react-hot-toast";
import { createAuthenticatedClient } from "~/utils/auth-client";

export async function action({ request }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);

  const formData = await request.formData();

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/pelayanan`);
  return handleAction(() =>
    client.post(urlRequest.href, {
      ...Object.fromEntries(formData.entries()),
      // Biaya: parseInt(formData.get("Biaya") as string, 10),
    }),
  );
}

export default function CreateService() {
  const navigate = useNavigate();
  const [displayValue, setDisplayValue] = useState("");
  const [numberValue, setNumberValue] = useState(0);
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
        <Form method="post" action="/humasbalung/pelayanan/create">
          <div className="mb-4">
            <label htmlFor="nama_pelayanan" className="text-lg font-bold">
              Nama Pelayanan <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              placeholder="Isi nama layanan di sini"
              name="nama_pelayanan"
              id="nama_pelayanan"
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
              name="JangkaWaktu"
              id="JangkaWaktu"
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
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
              {/* <p className="absolute left-3">Rp</p> */}
              <input
                onInput={(e) => {
                  const input = e.currentTarget;
                  if (input.value === " " || input.value === "0") {
                    input.value = "";
                  }
                }}
                // value={displayValue}
                name="Biaya"
                type="text"
                placeholder="Isi jumlah biaya di sini"
                id="Biaya"
                required
                className={`${
                  fetcherData.message && !fetcherData.success
                    ? "border-red-500 focus:outline-red-500"
                    : "border-gray-300 focus:outline-blue-500"
                } w-full rounded border border-gray-300 p-2`}
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
            {/* <input
              type="number"
              name="Biaya"
              hidden
              readOnly
              value={numberValue}
            /> */}
          </div>
          <div className="mb-4">
            <label htmlFor="Persyaratan" className="text-lg font-bold">
              Persyaratan <span className="text-red-600">*</span>
            </label>
            <textarea
              name="Persyaratan"
              id="Persyaratan"
              placeholder="Isi persyaratan di sini"
              required
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
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
              name="Prosedur"
              id="Prosedur"
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
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
        </Form>
      </div>
    </>
  );
}
