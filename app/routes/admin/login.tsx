import type { Route } from "./+types/login";
import loginImage from "~/assets/loginimage.jpg";
import { data, Form, redirect, useActionData, useFetcher } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { setAuthCookies } from "~/utils/auth-cookie";
import redirectWithCookie from "~/utils/redirectWithCookie";

export async function loader({ request }: Route.LoaderArgs) {
  console.log("load cookie", request.headers.get("Cookie"));
}

export async function action({ request }: Route.ActionArgs) {
  console.log("action");

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
      const cookie = Array.isArray(setCookieHeader)
        ? setCookieHeader.join("; ")
        : setCookieHeader || "";
      console.log("cookie", cookie);
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${data.data.aksesToken}`;

      return redirectWithCookie("/admin", cookie);
      // return redirect(
      //   "/admin",
      //   cookie
      //     ? {
      //         headers: {
      //           "Set-Cookie": cookie,
      //         },
      //       }
      //     : {},
      // );
      // return redirect("/admin/", {
      //   headers: {
      //     Authorization: `Bearer ${data.data.aksesToken}`,
      //     "Set-Cookie": Array.isArray(setCookieHeaders)
      //       ? setCookieHeaders.join("; ")
      //       : setCookieHeaders,
      //   },
      // });
    }
  } catch (error: any) {}
}

export default function LoginAdmin({ loaderData }: Route.ComponentProps) {
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
                Masuk
              </button>
            </fetcher.Form>
          </div>
        </div>
      </div>
    </>
  );
}
