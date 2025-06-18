import axios from "axios";
import type { Route } from "./+types/register";
import { useFetcher, useNavigate } from "react-router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import googleIcon from "~/assets/google.svg";
import { getErrorMessage } from "~/utils/handleError";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  formData.append("role", "USER");

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/auth/register`);

  try {
    const response = await axios.post(urlRequest.href, formData);
    console.log("response", response);
    const data = response.data;

    if (data.success) {
      return {
        success: true,
        message: data.message || "Registrasi berhasil, silakan masuk.",
      };
    } else {
      console.error("Login failed:", data.message);
      return {
        success: false,
        message: data.message || "Registrasi gagal, silakan coba lagi.",
      };
    }
  } catch (error: any) {
    console.error("Error during login:", error);
    return {
      success: false,
      message:
        getErrorMessage(error) || "Terjadi kesalahan, silakan coba lagi.",
    };
  }
}
export default function RegisterUser({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };
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
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="hidden h-screen w-max bg-cover bg-center py-10 text-center text-white shadow-md lg:block lg:flex-1"
          style={{
            backgroundImage: `url(/images/login.png)`,
          }}
        ></div>
        {/* <img src={loginImage} className="h-screen" alt="" /> */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-fit flex-col items-center justify-center rounded-xl border border-gray-400 px-6 pt-8 pb-12 shadow-lg min-md:w-2/3 lg:px-8">
            <h2 className="w-fit text-center text-2xl font-bold tracking-tight text-gray-900">
              Daftar
            </h2>
            <p className="w-fit text-center text-sm text-gray-600">
              Silakan isi data di bawah ini untuk membuat akun
            </p>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
              <fetcher.Form method="post" className="space-y-3">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      onInput={(e) => {
                        const input = e.currentTarget;
                        if (input.value === " " || input.value === "0") {
                          input.value = "";
                        }
                      }}
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Masukkan email di sini"
                      autoComplete="email"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${
                        fetcherData.message && !fetcherData.success
                          ? "outline-red-500 focus:outline-red-500"
                          : "outline-gray-300 focus:outline-blue-600"
                      } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
                    />
                    {fetcherData.message && (
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
                </div>
                <div>
                  <label
                    htmlFor="nama"
                    className="block text-sm/6 font-medium text-gray-900 capitalize"
                  >
                    username
                  </label>
                  <div className="mt-2">
                    <input
                      onInput={(e) => {
                        const input = e.currentTarget;
                        if (input.value === " " || input.value === "0") {
                          input.value = "";
                        }
                      }}
                      id="nama"
                      name="nama"
                      type="text"
                      required
                      placeholder="Masukkan username di sini"
                      autoComplete="name"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${
                        fetcherData.message && !fetcherData.success
                          ? "outline-red-500 focus:outline-red-500"
                          : "outline-gray-300 focus:outline-blue-600"
                      } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
                    />
                    {fetcherData.message && (
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
                </div>

                <div>
                  <label
                    htmlFor="no_wa"
                    className="block text-sm/6 font-medium text-gray-900 capitalize"
                  >
                    Nomor Whatsapp
                  </label>
                  <div className="mt-2">
                    <input
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
                      placeholder="cth. 628xxxxxxxxxx"
                      id="no_wa"
                      name="no_wa"
                      required
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${
                        fetcherData.message && !fetcherData.success
                          ? "outline-red-500 focus:outline-red-500"
                          : "outline-gray-300 focus:outline-blue-600"
                      } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
                    />
                    {fetcherData.message && (
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
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    {/* <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${
                        fetcherData.message && !fetcherData.success
                          ? "outline-red-500 focus:outline-red-500"
                          : "outline-gray-300 focus:outline-blue-600"
                      } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
                    /> */}
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Masukkan password di sini"
                        autoComplete="current-password"
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
                          fetcherData.success
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {fetcherData.message}
                      </p>
                    )}
                  </div>
                </div>

                <button className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:cursor-pointer hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                  Daftar
                </button>

                <div className="flex items-center gap-4">
                  <hr className="flex-1 border-gray-300" />
                  <p className="text-sm text-gray-500">atau</p>
                  <hr className="flex-1 border-gray-300" />
                </div>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-400 p-2 text-sm shadow-md"
                  onClick={() => {
                    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google?redirect=${window.location.origin}/google`;
                  }}
                >
                  <img src={googleIcon} alt="Google" className="h-5 w-5" />
                  Daftar dengan Google
                </button>
                <p className="mt-4 text-center text-sm text-gray-600">
                  Sudah memiliki akun?{" "}
                  <a
                    href="/login"
                    className="font-semibold text-blue-600 underline hover:text-blue-500"
                  >
                    Masuk
                  </a>
                </p>
              </fetcher.Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
