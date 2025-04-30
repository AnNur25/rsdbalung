import {
  Form,
  redirect,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { getSession } from "~/sessions.server";
import type { Route } from "./+types";
import axios from "axios";
import { useEffect, useState } from "react";
import { handleAction } from "~/utils/handleAction";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  if (!token) {
    return redirect("/admin/login");
  }
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/profil`);
  try {
    const response = await axios.get(urlRequest.href);
    const data = response.data;
    return data;
  } catch (error: any) {
    // console.error("Error fetching data:", error.response);
    // return redirect("/admin/login");
  }
}
export async function action({ request }: Route.ActionArgs) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/profil`);
  const formData = await request.formData();

  handleAction(() => axios.put(urlRequest.href, formData), "Berhasil");
}

export default function AdminAccount({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { data } = loaderData || {
    data: { id_user: "admin", nama: "Admin", email: "admin@admin.com" },
  };
  const { id_user, nama, email } = data;
  const [visibleChangeForm, setVisibleChangeForm] = useState(false);

  useEffect(() => {}, []);

  return (
    <>
      <div className="flex h-full items-center justify-center">
        <div className="m-auto flex w-full flex-1 flex-col items-center justify-center gap-4 rounded-2xl px-8 pt-8 pb-6 shadow-lg min-md:max-w-96 lg:px-12">
          {!visibleChangeForm ? (
            <>
              <h1 className="text-2xl font-extrabold">Halo Admin!</h1>
              <div className="flex w-full flex-col">
                <label className="text-lg font-semibold">Nama</label>
                <input
                  type="text"
                  readOnly
                  value={nama}
                  disabled
                  className="rounded-lg border border-gray-400 px-4 py-2 text-gray-400"
                />
              </div>
              <div className="flex w-full flex-col">
                <label className="text-lg font-semibold">Email</label>
                <input
                  type="text"
                  readOnly
                  value={email}
                  disabled
                  className="rounded-lg border border-gray-400 px-4 py-2 text-gray-400"
                />
              </div>
              <button
                className="rounded-lg border bg-blue-700 px-6 py-3 text-white shadow"
                onClick={() => setVisibleChangeForm(true)}
                type="button"
              >
                Ubah Password
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold">Isi Password Anda!</h1>
              <Form
                className="flex w-full flex-col items-center gap-4"
                method="PUT"
              >
                <div className="flex w-full flex-col">
                  <label className="text-lg font-semibold">Password Lama</label>
                  <input
                    type="text"
                    name="oldPassword"
                    placeholder="Isi password lama di sini"
                    className="rounded-lg border border-gray-400 px-4 py-2"
                  />
                </div>
                <div className="flex w-full flex-col">
                  <label className="text-lg font-semibold">Password Baru</label>
                  <input
                    type="text"
                    name="newPassword"
                    placeholder="Isi password baru di sini"
                    className="rounded-lg border border-gray-400 px-4 py-2"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    className="min-w-30 rounded-lg border bg-green-700 px-6 py-3 text-white shadow"
                    // onClick={() => setVisibleChangeForm(false)}
                    type="submit"
                  >
                    Simpan
                  </button>
                  <button
                    className="min-w-30 rounded-lg border bg-red-700 px-6 py-3 text-white shadow"
                    onClick={() => setVisibleChangeForm(false)}
                    type="button"
                  >
                    Batal
                  </button>
                </div>
              </Form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
