import type { Route } from "./+types/reset";
import loginImage from "~/assets/loginimage.jpg";
import { useFetcher, useSearchParams } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { handleAction } from "~/utils/handleAction";

// export async function loader({ request, params }: Route.LoaderArgs) {}

export async function action({ request }: Route.ActionArgs) {
  console.log("action");

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/`);
  const formData = await request.formData();
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  console.log("token", token);
  if (token) {
    const resetRequest = `${import.meta.env.VITE_API_URL}/reset-password?token=${token}`;
    const newPassw = formData.get("newPassw");
    const confirmPassw = formData.get("confirmPassw");
    console.log(formData);
    console.log("token", token);

    return handleAction(() =>
      axios.post(
        resetRequest,
        { newPassw, confirmPassw },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );
  } else {
    const email = formData.get("email");

    urlRequest.pathname = "/api/v1/profil";
    console.log("urlRequest", urlRequest.href);
    return handleAction(() => axios.post("/profil", { email }));
  }
}

export default function LoginAdmin({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };
  const [showPassword, setShowPassword] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token"); //urlParams.has("token");

  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="hidden h-screen w-max bg-cover text-center text-white shadow-md lg:block lg:flex-1"
          // className="hidden h-full bg-top text-center text-white shadow-md lg:block lg:w-full lg:flex-1"
          // className="hidden h-screen bg-cover bg-center py-10 text-center text-white shadow-md lg:block lg:w-max"
          style={{
            backgroundImage: `url(/images/loginadmin.png)`,
          }}
        ></div>
        <div className="mt-12 flex w-fit flex-1 flex-col items-center justify-center px-6 pt-8 pb-12 lg:px-8">
          {token ? (
            <div className="w-fit rounded-lg border border-gray-300 p-10 shadow-lg">
              <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
                Reset Password
              </h2>
              <p className="text-center text-sm text-gray-600">
                Silakan masukkan password baru Anda.
              </p>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <fetcher.Form method="post" className="space-y-6">
                  <div>
                    <label
                      htmlFor="oldPassw"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Password Baru
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="oldPassw"
                        name="newPassw"
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
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
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
                  <div>
                    <label
                      htmlFor="confirmPassw"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="confirmPassw"
                        name="confirmPassw"
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
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
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

                  <button className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:cursor-pointer hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    Reset Password
                  </button>
                </fetcher.Form>
              </div>
            </div>
          ) : (
            <div className="w-fit rounded-lg border border-gray-300 p-10 shadow-lg">
              <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
                Reset Password
              </h2>
              <p className="text-center text-sm text-gray-600">
                Apakah Anda yakin ingin ubah password?
              </p>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <fetcher.Form method="post" className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        onInput={(e) => {
                          const input = e.currentTarget;
                          if (input.value === " " || input.value === "0") {
                            input.value = "";
                          }
                        }}
                        required
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

                  <button className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:cursor-pointer hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    Kirim
                  </button>
                </fetcher.Form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
