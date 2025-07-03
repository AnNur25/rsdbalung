import axios from "axios";
import type { Route } from "./+types/login";
import redirectWithCookie from "~/utils/redirectWithCookie";
import { useFetcher, useNavigate } from "react-router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import googleIcon from "~/assets/google.svg";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/auth/login`);

  try {
    const response = await axios.post(urlRequest.href, { email, password });
    console.log("response", response.headers);
    const data = response.data;

    if (data.success) {
      const setCookieHeader = response.headers["set-cookie"];

      const refreshRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
        {},
        {
          headers: { Cookie: setCookieHeader ?? "" },
        },
      );

      const refreshCookieHeader = refreshRes.headers["set-cookie"];

      console.log("refresh token", refreshRes.headers);

      return redirectWithCookie("/", refreshCookieHeader ?? "");
    } else {
      console.error("Login failed:", data.message);
      return {
        success: false,
        message: data.message || "Login gagal, silakan coba lagi.",
      };
    }
  } catch (error: any) {
    console.error("Error during login:", error);
  }
}

export default function LoginUser({ loaderData }: Route.ComponentProps) {
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
              Masuk
            </h2>
            <p className="w-fit text-center text-sm text-gray-600">
              Silakan masukkan email dan password Anda
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
                </div>
                <button className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:cursor-pointer hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                  Masuk
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
                  Login dengan Google
                </button>
                <p className="mt-4 text-center text-sm text-gray-600">
                  Belum memiliki akun?{" "}
                  <a
                    href="/register"
                    className="font-semibold text-blue-600 underline hover:text-blue-500"
                  >
                    Daftar
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
