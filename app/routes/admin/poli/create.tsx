import { useFetcher, useNavigate } from "react-router";
import type { Route } from "./+types/create";
import { handleAction } from "~/utils/handleAction";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { createAuthenticatedClient } from "~/utils/auth-client";

export async function action({ request }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/poli`);

  let formData = await request.formData();
  let namaPoli = formData.get("nama_poli");

  return handleAction(() =>
    client.post(urlRequest.href, { nama_poli: namaPoli }),
  );
}

export default function CreatePoli() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };
  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
        setTimeout(() => {
          navigate("/humasbalung/poli");
        }, 2000);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold uppercase">
        Form Pengisian Poli/Klinik
      </h1>
      <div className="mb-4 rounded-xl border border-gray-300 p-4 text-sm shadow-lg">
        <fetcher.Form method="post">
          <div className="mb-4">
            <label htmlFor="nama_poli" className="text-lg font-bold">
              Nama Poli/Klinik <span className="text-red-600">*</span>
            </label>
            <input
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              type="text"
              placeholder="Isi nama layanan di sini"
              name="nama_poli"
              id="nama_poli"
              required
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
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
              onClick={() => navigate("/humasbalung/poli")}
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
