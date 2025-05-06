import {
  Form,
  redirect,
  useFetcher,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { getSession } from "~/sessions.server";
import type { Route } from "./+types";
import axios from "axios";
import { useEffect, useState } from "react";
import { handleAction } from "~/utils/handleAction";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

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

  return handleAction(() => axios.put(urlRequest.href, formData), "Berhasil");
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

  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };
  console.log("fetcherData", fetcherData);
  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);
  const [showPassword, setShowPassword] = useState(false);
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
              <fetcher.Form
                className="flex w-full flex-col items-center gap-4"
                method="PUT"
              >
                <div className="flex w-full flex-col">
                  <label className="text-lg font-semibold">Password Lama</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="oldPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${
                        fetcherData.message && !fetcherData.success
                          ? "outline-red-500 focus:outline-red-500"
                          : "outline-gray-300 focus:outline-blue-600"
                      } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
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
                </div>
                <div className="flex w-full flex-col">
                  <label className="text-lg font-semibold">Password Baru</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${
                        fetcherData.message && !fetcherData.success
                          ? "outline-red-500 focus:outline-red-500"
                          : "outline-gray-300 focus:outline-blue-600"
                      } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
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
              </fetcher.Form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
