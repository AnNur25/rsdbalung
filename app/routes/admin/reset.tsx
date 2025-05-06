import type { Route } from "./+types/reset";
import loginImage from "~/assets/loginimage.jpg";

// import {
//   getSession,
//   commitSession,
//   type SessionFlashData,
// } from "../../sessions.server";
import { data, Form, redirect, useActionData, useFetcher } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { ActionToast, LoaderToast } from "~/hooks/toastHandler";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { handleAction } from "~/utils/handleAction";

export async function loader({ request }: Route.LoaderArgs) {
  // const session = await getSession(request.headers.get("Cookie"));
  // const flashMessage: SessionFlashData = await getFlashMessage(request);
  // session.get("token");
  // const message = session.get("message");
  // const success = session.get("success");
  // if (session.has("token")) {
  // Redirect to the home page if they are already signed in.
  // return redirect("/admin/");
  // }
  // return data(
  //   { message, success },
  //   {
  //     headers: {
  //       "Set-Cookie": await commitSession(session),
  //     },
  //   },
  // );
}

export async function action({ request }: Route.ActionArgs) {
  console.log("action");
  // const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const email = formData.get("email");

  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/profil`);
  return handleAction(() => axios.post(urlRequest.href, { email }));
  // try {
  //   const response = await axios.post(urlRequest.href, { email });

  // Extract cookies from the response headers
  // const setCookieHeader = response.headers["set-cookie"];

  // if (setCookieHeader) {
  //   const refreshTokenCookie = setCookieHeader.find((cookie: string) =>
  //     cookie.startsWith("refreshToken="),
  //   );
  //   if (refreshTokenCookie) {
  //     const refreshToken = refreshTokenCookie.split(";")[0].split("=")[1];
  //
  //     session.set("refreshToken", refreshToken);
  //   }
  // }

  //   const data = response.data;

  //   if (data.success) {
  //     session.set("token", data.data.token);
  //     const getToken = session.get("token");
  //     axios.defaults.headers.common["Authorization"] = `Bearer ${getToken}`;
  //     session.flash("message", "Login berhasil!");
  //     session.flash("success", data.success);
  //     return redirect("/admin/", {
  //       headers: {
  //         "Set-Cookie": await commitSession(session),
  //       },
  //     });
  //     // return redirect("/admin/");
  //   } else {
  //     session.flash("message", data.message);
  //     session.flash("success", data.success);
  //     console.log("fail success");
  //     console.error(data.message);
  //   }
  // } catch (error: any) {
  //   console.log("action err");
  //   if (axios.isAxiosError(error)) {
  //     const message = error.response?.data.message;
  //     session.flash("success", false);
  //     session.flash("message", error.response?.data.message);
  //     console.log(error.response?.data.message);
  //     return { success: false, message };

  //     // return toast.error(error.response?.data.message);
  //   } else {
  //     session.flash("success", false);
  //     session.flash("message", error.response?.data.message);
  //     console.log("action ue");

  //     // return toast.error("Terjadi kesalahan pada server");
  //   }
  // }
  // return null;
}

export default function LoginAdmin({ loaderData }: Route.ComponentProps) {
  // const { message, success }: SessionFlashData = {
  //   message: loaderData.message || "",
  //   success: loaderData.success || false,
  // };
  // console.log(message);
  // useEffect(() => {
  //   if (actionData?.success) {
  //     toast.success(actionData.success);
  //   }
  //   if (actionToastData?.error) toast.error(actionToastData.error);
  // }, [actionData]);
  // useEffect(() => {
  //   if (success) toast.success(message);
  //   else toast.error(message);
  // }, [message]);
  // LoaderToast();
  // ActionToast();
  // const actionData = useActionData();
  // console.log("fetcher", fetcher.data);
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
        <div className="mt-12 flex w-fit flex-1 flex-col items-center justify-center px-6 pt-8 pb-12 lg:px-8">
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
        </div>
      </div>
    </>
  );
}
