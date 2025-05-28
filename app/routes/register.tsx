import type { Route } from "./+types/login";

import loginImage from "~/assets/loginimage.jpg";
import { data, Form, redirect, useActionData, useFetcher } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { setAuthCookies } from "~/utils/auth-cookie";
import redirectWithCookie from "~/utils/redirectWithCookie";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams, useNavigate } from "react-router-dom";

export async function loader({ request }: Route.LoaderArgs) {
  console.log("load cookie", request.headers.get("Cookie"));
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const nama = formData.get("nama");
  const email = formData.get("email");
  const password = formData.get("password");
  const no_wa = formData.get("no_wa");

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/auth/register`);

  try {
    const response = await axios.post(urlRequest.href, {
      nama,
      no_wa,
      email,
      password,
    });

    const data = response.data;

    if (data.success) {
      const setCookieHeader = response.headers["set-cookie"];
      let redirectUrl = "/login";
      return redirectWithCookie(redirectUrl, setCookieHeader ?? "");
    }

    // Jika API gagal tapi tidak throw error
    return {
      success: false,
      message: data.message || "Pendaftaran gagal",
    };
  } catch (error: any) {
    console.error("Register error", error?.response?.data || error.message);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Terjadi kesalahan saat mendaftar. Coba lagi.",
    };
  }
}

export default function register({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function setCookieFromToken() {
      const aksesToken = searchParams.get("aksesToken");
      const refreshToken = searchParams.get("refreshToken");

      if (!aksesToken || !refreshToken) return;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/set-cookie`,
          { aksesToken, refreshToken },
          { withCredentials: true },
        );

        // Hapus token dari URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );

        toast.success("Daftar berhasil");

        window.location.replace("/");
      } catch (error) {
        toast.error("Gagal set cookie login");
        console.error(error);
      }
    }

    if (searchParams.get("aksesToken") && searchParams.get("refreshToken")) {
      setCookieFromToken();
    }
  }, [searchParams]);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="hidden h-screen bg-cover bg-center py-10 text-center text-white shadow-md lg:block lg:w-1/4"
          style={{
            backgroundImage: `url(${loginImage})`,
          }}
        ></div>
        <div className="mt-12 flex w-min flex-1 flex-col justify-center px-6 pt-8 pb-12 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Halo
          </h2>
          <p className="text-center text-sm text-gray-600">Selamat datang</p>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <fetcher.Form method="post" className="space-y-6">
              <div>
                <label
                  htmlFor="nama"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Username
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
                    type="nama"
                    required
                    autoComplete="nama"
                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${
                      fetcherData.message && !fetcherData.success
                        ? "outline-red-500 focus:outline-red-500"
                        : "outline-gray-300 focus:outline-blue-600"
                    } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
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
              </div>
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
                        fetcherData.success ? "text-green-600" : "text-red-600"
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
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Nomor WhatsApp
                </label>
                <div className="mt-2">
                  <input
                    onInput={(e) => {
                      const input = e.currentTarget;
                      // Hilangkan spasi di awal dan pastikan hanya angka
                      input.value = input.value
                        .replace(/[^0-9]/g, "")
                        .replace(/^0+/, "");
                    }}
                    id="no_wa"
                    name="no_wa"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="Contoh: 81234567890"
                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${
                      fetcherData.message && !fetcherData.success
                        ? "outline-red-500 focus:outline-red-500"
                        : "outline-gray-300 focus:outline-blue-600"
                    } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
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
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="/reset-password"
                      className="font-semibold text-blue-600 hover:text-blue-500"
                    >
                      Lupa password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
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
                        fetcherData.success ? "text-green-600" : "text-red-600"
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
            </fetcher.Form>
            {/* Tombol login via Google */}
            <button
              type="button"
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
            >
              <FcGoogle className="h-5 w-5" />
              <span>Dafatar dengan Google</span>
            </button>

            {/* Link daftar */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-blue-600 underline hover:text-blue-500"
              >
                Masuk
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
