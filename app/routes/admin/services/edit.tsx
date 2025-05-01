import axios from "axios";
import type { Route } from "./+types/edit";
import { Form, useNavigate } from "react-router";
import { handleLoader } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";
import type { PelayananDetail } from "~/models/Pelayanan";
import { useState } from "react";

export async function loader({ params }: Route.LoaderArgs) {
  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/pelayanan/${params.id}`,
  );
  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request, params }: Route.ActionArgs) {
  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/pelayanan/${params.id}`,
  );

  const formData = await request.formData();
  return handleAction(() =>
    axios.put(urlRequest.href, {
      ...Object.fromEntries(formData.entries()),
      Biaya: parseInt(formData.get("Biaya") as string, 10),
    }),
  );
}

export default function EditService({ loaderData }: Route.ComponentProps) {
  console.log(loaderData);
  const pelayanan: PelayananDetail = loaderData.data;
  const navigate = useNavigate();

  const [name, setName] = useState<string>(pelayanan.nama_pelayanan || "");
  const [duration, setDuration] = useState<string>(pelayanan.JangkaWaktu || "");
  const [cost, setCost] = useState<number>(pelayanan.Biaya || 0);
  const [requirement, setRequirement] = useState<string>(
    pelayanan.Persyaratan || "",
  );
  const [procedure, setProcedure] = useState<string>(pelayanan.Prosedur || "");

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold uppercase">
        Form Pengisian Layanan RS
      </h1>
      <div className="mb-4 rounded-xl border border-gray-300 p-4 text-sm shadow-lg">
        <Form method="put">
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
              required
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="JangkaWaktu" className="text-lg font-bold">
              Jangka Waktu <span className="text-red-600">*</span>
            </label>
            <textarea
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              name="JangkaWaktu"
              id="JangkaWaktu"
              placeholder="Isi jangka waktu di sini"
              required
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="Biaya" className="text-lg font-bold">
              Biaya <span className="text-red-600">*</span>
            </label>
            <input
              value={cost}
              onChange={(e) => setCost(parseInt(e.target.value, 10))}
              type="number"
              placeholder="Isi jumlah biaya di sini"
              name="Biaya"
              id="Biaya"
              required
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Persyaratan" className="text-lg font-bold">
              Persyaratan <span className="text-red-600">*</span>
            </label>
            <textarea
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              name="Persyaratan"
              id="Persyaratan"
              placeholder="Isi persyaratan di sini"
              required
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="Prosedur" className="text-lg font-bold">
              Prosedur <span className="text-red-600">*</span>
            </label>
            <textarea
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              name="Prosedur"
              id="Prosedur"
              placeholder="Isi prosedur di sini"
              required
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
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
              onClick={() => navigate("/admin/pelayanan")}
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
