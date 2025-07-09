import {
  Form,
  redirect,
  useFetcher,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import type { Route } from "./+types";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { handleAction } from "~/utils/handleAction";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import ConfirmDialog from "~/components/ConfirmDialog";
import logo from "~/assets/logoonly.png";
import { createAuthenticatedClient } from "~/utils/auth-client";
import { handleLoader } from "~/utils/handleLoader";

export async function loader({ request }: Route.LoaderArgs) {
  const client = await createAuthenticatedClient(request);

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/profil/`);
  return handleLoader(() => client.get(urlRequest.href));
}
export async function action({ request }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/profil`);
  const formData = await request.formData();

  return handleAction(() => client.put(urlRequest.href, formData), "Berhasil");
}

export default function AdminAccount({ loaderData }: Route.ComponentProps) {
  // console.log(loaderData);
  const { data } = loaderData || {
    data: { id_user: "admin", nama: "Admin", email: "admin@admin.com" },
  };
  const { id_user, nama, email } = data;
  const [visibleChangeForm, setVisibleChangeForm] = useState(false);

  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };
  // console.log("fetcherData", fetcherData);
  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
        setVisibleChangeForm(false);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);
  const formRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleChangePassword = () => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    fetcher.submit(formData, { method: "PUT" });
    setDialogOpen(false);
  };
  return (
    <>
      <h1 className="w-max text-2xl font-bold uppercase">Informasi Akun</h1>
      <div className="flex w-full flex-col justify-center gap-4 p-4 min-md:flex-row min-md:px-20">
        <div className="flex flex-none flex-col justify-center gap-4 rounded-lg border border-gray-400 px-12 py-6 shadow-lg">
          <div className="mx-auto my-4 w-fit rounded-full border bg-white p-8">
            <img
              className="w-20"
              src={logo}
              alt="Logo Rumah Sakit Daerah Balung"
            />
          </div>
          <h2 className="text-center text-xl font-bold uppercase">
            RSD Balung
          </h2>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-4 rounded-lg border border-gray-400 px-8 pt-8 pb-6 shadow-lg lg:px-12">
          {!visibleChangeForm ? (
            <>
              <div>
                <h2 className="text-center text-xl font-bold">Halo Admin!</h2>
                <p className="text-center text-sm text-gray-500">
                  Kelola informasi pribadi Anda dengan mudah melalui halaman ini
                </p>
              </div>
              <div className="flex w-full flex-col">
                <label className="text-md font-semibold">Email</label>
                <input
                  type="text"
                  readOnly
                  value={email}
                  disabled
                  className="rounded-lg border border-gray-400 px-4 py-2 text-gray-400"
                />
              </div>
              <div className="flex w-full flex-col">
                <label className="text-md font-semibold">Username</label>
                <input
                  type="text"
                  readOnly
                  value={nama}
                  disabled
                  className="rounded-lg border border-gray-400 px-4 py-2 text-gray-400"
                />
              </div>
              <button
                className="rounded-lg border bg-green-700 px-6 py-3 text-white shadow"
                onClick={() => setVisibleChangeForm(true)}
                type="button"
              >
                Ubah Password
              </button>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-center text-xl font-bold">Ubah Password</h2>
                <p className="text-center text-sm text-gray-500">
                  Ubah password Anda dengan mengisi data di bawah ini
                </p>
              </div>
              <fetcher.Form
                ref={formRef}
                className="flex w-full flex-col items-center gap-4"
                method="PUT"
              >
                <div className="flex w-full flex-col">
                  <label className="text-md font-semibold">Password Lama</label>
                  <div className="relative">
                    <input
                      onInput={(e) => {
                        const input = e.currentTarget;
                        if (input.value === " " || input.value === "0") {
                          input.value = "";
                        }
                      }}
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
                <div className="flex w-full flex-col">
                  <label className="text-md font-semibold">Password Baru</label>
                  <div className="relative">
                    <input
                      onInput={(e) => {
                        const input = e.currentTarget;
                        if (input.value === " " || input.value === "0") {
                          input.value = "";
                        }
                      }}
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
                <div className="flex w-full gap-2">
                  <button
                    className="w-full min-w-30 rounded-lg border bg-green-700 px-6 py-3 text-white shadow"
                    onClick={() => setDialogOpen(true)}
                    type="button"
                  >
                    Simpan
                  </button>
                  <button
                    className="w-full min-w-30 rounded-lg border bg-red-700 px-6 py-3 text-white shadow"
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
      <ConfirmDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        cancelOnClick={() => setDialogOpen(false)}
        confirmOnClick={handleChangePassword}
        description="Apakah Anda yakin ingin mengubah password?"
        cancelLabel="Tidak"
        confirmLabel="Iya"
        cancelBtnStyle="bg-red-500 hover:bg-red-600 text-white"
        confirmBtnStyle="bg-green-600 hover:bg-green-700 text-white"
      />
    </>
  );
}
