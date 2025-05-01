import axios from "axios";
import { Form, useNavigate } from "react-router";
import type { Route } from "./+types";
import { handleAction } from "~/utils/handleAction";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/pelayanan`);
  return handleAction(() =>
    axios.post(urlRequest.href, {
      ...Object.fromEntries(formData.entries()),
      Biaya: parseInt(formData.get("Biaya") as string, 10),
    }),
  );
}

export default function CreateService() {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold uppercase">
        Form Pengisian Layanan RS
      </h1>
      <div className="mb-4 rounded-xl border border-gray-300 p-4 text-sm shadow-lg">
        <Form method="post" action="/admin/pelayanan/create">
          <div className="mb-4">
            <label htmlFor="nama_pelayanan" className="text-lg font-bold">
              Nama Pelayanan <span className="text-red-600">*</span>
            </label>
            <input
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
              type="text"
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
