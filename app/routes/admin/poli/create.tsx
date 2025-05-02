import { Form, useActionData, useNavigate } from "react-router";
import axios from "axios";
import type { Route } from "./+types/create";
import { handleAction } from "~/utils/handleAction";

export async function action({ request }: Route.ActionArgs) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/poli`);

  let formData = await request.formData();
  let namaPoli = formData.get("nama_poli");

  // if (!namaPoli || typeof namaPoli !== "string") {
  //   return { error: "Nama Poli is required" };
  // }
  return handleAction(() =>
    axios.post(urlRequest.href, { nama_poli: namaPoli }),
  );
}

export default function CreatePoli({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold uppercase">
        Form Pengisian Poli/Klinik
      </h1>
      <div className="mb-4 rounded-xl border border-gray-300 p-4 text-sm shadow-lg">
        <Form method="post">
          <div className="mb-4">
            <label htmlFor="nama_poli" className="text-lg font-bold">
              Nama Poli <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Isi nama layanan di sini"
              name="nama_poli"
              id="nama_poli"
              required
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              onClick={() => navigate("/admin/poli")}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Batal
            </button>
          </div>
        </Form>
        {/* {actionData?.error && (
          <p className="mt-4 text-sm text-red-600">{actionData.error}</p>
        )}
        {actionData?.success && (
          <p className="mt-4 text-sm text-green-600">
            Poli "{actionData.nama_poli}" created successfully!
          </p>
        )} */}
      </div>
    </>
  );
}
