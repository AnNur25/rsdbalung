import { handleLoader } from "~/utils/handleLoader";
import type { Route } from "./+types/account";
import { createAuthenticatedClient } from "~/utils/auth-client";
import {
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { handleAction } from "~/utils/handleAction";
import ConfirmDialog from "~/components/ConfirmDialog";
import toast from "react-hot-toast";

export async function loader({ request }: Route.LoaderArgs) {
  const client = await createAuthenticatedClient(request);

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/profil/`);
  return handleLoader(() => client.get(urlRequest.href));
}
export async function action({ request }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);

  const formData = await request.formData();
  const feature = formData.get("feat");

  const profilRequest = new URL(`${import.meta.env.VITE_API_URL}/profil`);
  const passwordRequest = new URL(
    `${import.meta.env.VITE_API_URL}/profil/ubah-password`,
  );

  if (feature === "password") {
    formData.delete("feat");
    console.log(formData);
    return handleAction(
      () => client.put(passwordRequest.href, formData),
      "Berhasil",
    );
  }
  if (feature === "profil") {
    formData.delete("feat");
    return handleAction(
      () => client.put(profilRequest.href, formData),
      "Berhasil",
    );
  }
}
export default function UserAccount({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData || {};
  console.log(loaderData);

  const {
    id_user = "noId",
    nama = "Pengguna",
    email = "user@email.com",
    no_wa: phoneNumber = "621234567890",
  } = data;
  console.log("User Account Data:", data);

  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };
  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
        setTimeout(() => {}, 2000);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);
  const activeColor = "dark-blue-900";
  const inactiveColor = "black";

  const [visibleAccountForm, setVisibleAccountForm] = useState(true);
  const [visiblePasswordForm, setVisiblePasswordForm] = useState(false);
  const [isOnEdit, setIsOnEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [name, setName] = useState(nama);
  const [currentEmail, setEmail] = useState(email);
  const [phone, setPhone] = useState(phoneNumber);

  const formProfilRef = useRef(null);
  const formPasswordRef = useRef(null);

  const handleChangePassword = () => {
    if (!formPasswordRef.current) return;

    const formData = new FormData(formPasswordRef.current);
    formData.append("feat", "password");
    console.log("formData", formData);
    fetcher.submit(formData, { method: "PUT" });
    setDialogOpen(false);
  };
  const handleChangeProfil = () => {
    if (!formProfilRef.current) return;

    const formData = new FormData(formProfilRef.current);
    formData.append("feat", "profil");
    fetcher.submit(formData, { method: "PUT" });
  };

  return (
    <>
      <div className="mt-8">
        <h2 className="text-center text-3xl font-extrabold">INFORMASI AKUN</h2>
        <p className="text-center text-lg text-gray-500">
          Kelola informasi pribadi Anda dengan mudah melalui halaman ini
        </p>
      </div>

      <div className="flex w-full flex-col justify-between gap-4 p-4 min-md:flex-row min-md:px-20">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-gray-300 p-8 shadow-sm">
          <UserCircleIcon className="h-auto w-full text-gray-600" />
          <p className="text-2xl font-extrabold uppercase">{nama}</p>
        </div>
        <div className="flex-2 rounded-xl border border-gray-300 px-8 py-4 shadow-sm">
          <div className="flex gap-8">
            <button
              className={`${visibleAccountForm ? `border-${activeColor} text-${activeColor}` : `border-${inactiveColor} text-${inactiveColor}`} w-full border-b-2 p-2`}
              onClick={() => {
                setIsOnEdit(false);
                setVisiblePasswordForm(false);
                setVisibleAccountForm(true);
              }}
            >
              Edit Akun
            </button>
            <button
              className={`${visiblePasswordForm ? `border-${activeColor} text-${activeColor}` : `border-${inactiveColor} text-${inactiveColor}`} w-full border-b-2 p-2`}
              onClick={() => {
                setIsOnEdit(false);
                setVisibleAccountForm(false);
                setVisiblePasswordForm(true);
              }}
            >
              Edit Password
            </button>
          </div>
          {visibleAccountForm && (
            <>
              <fetcher.Form
                ref={formProfilRef}
                className="flex flex-col gap-4 pt-4"
                method="put"
              >
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    className="text-lg font-semibold capitalize"
                  >
                    email
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={email}
                    className={`rounded-lg border border-gray-400 px-4 py-2 ${!isOnEdit && "text-gray-500"}`}
                    name="email"
                    id="email"
                    disabled={!isOnEdit}
                    value={currentEmail}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="nama" className="text-lg font-semibold">
                    Username
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={name}
                    className={`rounded-lg border border-gray-400 px-4 py-2 ${!isOnEdit && "text-gray-500"}`}
                    name="nama"
                    id="nama"
                    disabled={!isOnEdit}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="no_wa" className="text-lg font-semibold">
                    Nomor Whatsapp
                  </label>
                  <input
                    required
                    pattern="[1-9]\d*|0" // for HTML5 validation
                    onInput={(e) => {
                      const input = e.currentTarget;
                      // Prevent leading zeros
                      if (input.value === "0") {
                        // Disallow "0" as the only input
                        input.value = "";
                      }

                      // Replace leading zeros with 62
                      input.value = input.value.replace(/^0+(?!$)/, "62");

                      // Remove non-digit characters
                      input.value = input.value.replace(/[^\d]/g, "");
                    }}
                    type="text"
                    inputMode="numeric"
                    placeholder={phone}
                    className={`rounded-lg border border-gray-400 px-4 py-2 ${!isOnEdit && "text-gray-500"}`}
                    name="no_wa"
                    id="no_wa"
                    disabled={!isOnEdit}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                {isOnEdit ? (
                  <div className="mt-4 flex gap-2">
                    <button
                      // type="submit"
                      type="button"
                      onClick={handleChangeProfil}
                      className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOnEdit(false)}
                      className="w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="mt-4 w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    onClick={() => setIsOnEdit(true)}
                  >
                    Edit
                  </button>
                )}
              </fetcher.Form>
            </>
          )}
          {visiblePasswordForm && (
            <>
              {isOnEdit ? (
                <fetcher.Form
                  ref={formPasswordRef}
                  className="mt-4 flex w-full flex-col items-center gap-4"
                  method="PUT"
                >
                  <div className="flex w-full flex-col">
                    <label className="text-lg font-semibold capitalize">
                      Password Lama
                    </label>
                    <div className="relative">
                      <input
                        // onInput={(e) => {
                        //   const input = e.currentTarget;
                        //   if (input.value === " " || input.value === "0") {
                        //     input.value = "";
                        //   }
                        // }}
                        id="oldPassword"
                        name="oldPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        className={`block w-full rounded-md bg-white px-4 py-2 text-base text-gray-900 outline-1 -outline-offset-1 ${
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
                          fetcherData.success
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {fetcherData.message}
                      </p>
                    )}
                  </div>
                  <div className="flex w-full flex-col">
                    <label className="text-lg font-semibold capitalize">
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        onInput={(e) => {
                          const input = e.currentTarget;
                          if (input.value === " " || input.value === "0") {
                            input.value = "";
                          }
                        }}
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        className={`block w-full rounded-md bg-white px-4 py-2 text-base text-gray-900 outline-1 -outline-offset-1 ${
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
                          fetcherData.success
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {fetcherData.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="min-w-30 rounded-lg border bg-green-700 px-6 py-3 text-white shadow"
                      onClick={() => setDialogOpen(true)}
                      type="button"
                    >
                      Simpan
                    </button>
                    <button
                      className="min-w-30 rounded-lg border bg-red-700 px-6 py-3 text-white shadow"
                      onClick={() => setIsOnEdit(false)}
                      type="button"
                    >
                      Batal
                    </button>
                  </div>
                </fetcher.Form>
              ) : (
                <div>
                  <div className="mt-4 flex flex-col gap-1">
                    <label
                      htmlFor="password"
                      className="text-lg font-semibold capitalize"
                    >
                      password
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        placeholder="xxxxxxxxxx"
                        className={`w-full rounded-lg border border-gray-400 px-4 py-2 ${!isOnEdit && "text-gray-500"}`}
                        name="password"
                        id="password"
                        disabled={!isOnEdit}
                        // onChange={(e) => setUnggulanTitle(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center text-sm text-gray-600">
                        <EyeSlashIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-4 w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    onClick={() => setIsOnEdit(true)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </>
          )}
          <div></div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        cancelOnClick={() => setDialogOpen(false)}
        confirmOnClick={handleChangePassword}
        // title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin mengubah password?"
        cancelLabel="Tidak"
        confirmLabel="Iya"
        cancelBtnStyle="bg-red-500 hover:bg-red-600 text-white"
        confirmBtnStyle="bg-green-600 hover:bg-green-700 text-white"
      />
    </>
  );
}
