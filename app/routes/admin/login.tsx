import type { Route } from "./+types/login";
import loginImage from "~/assets/loginimage.jpg";

import { getSession, commitSession } from "../../sessions.server";
import { data, Form, redirect } from "react-router";
import axios from "axios";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  console.log("session", session);
  // session.get("token");
  console.log("token", session.data.token);
  if (session.has("token")) {
    // Redirect to the home page if they are already signed in.
    // return redirect("/admin/");
  }

  return data(
    { error: session.get("error") },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  console.log("session", session.get("token"));
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("login", {
    email,
    password,
  });

  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/auth/login`);
  console.log("urlRequest", urlRequest);
  try {
    const response = await axios.post(urlRequest.href, {
      email,
      password,
    }
    );

    // Extract cookies from the response headers
    const setCookieHeader = response.headers["set-cookie"];
    console.log("setCookieHeader", setCookieHeader);
    if (setCookieHeader) {
      const refreshTokenCookie = setCookieHeader.find((cookie: string) =>
        cookie.startsWith("refreshToken="),
      );
      if (refreshTokenCookie) {
        const refreshToken = refreshTokenCookie.split(";")[0].split("=")[1];
        console.log("refreshToken", refreshToken);
        session.set("refreshToken", refreshToken);
      }
    }

    const data = response.data;
    console.log("data", data);

    if (data.success) {
      session.set("token", data.data.accessToken);
      const getToken = session.get("token");
      console.log("getToken", getToken);
      return redirect("/admin/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
      // return redirect("/admin/");
    } else {
      session.flash("error", data.message);
    }
  } catch (error: any) {
    console.log("error", error);
    if (axios.isAxiosError(error)) {
      session.flash("error", error.response?.data.message);
    } else {
      session.flash("error", "Terjadi kesalahan pada server");
    }
  }
  return null;
}

export default function LoginAdmin({ loaderData }: Route.ComponentProps) {
  // const { error } = loaderData;
  // console.log("error", error);
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
            <Form method="POST" className="space-y-6">
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
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                  />
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
                      href="#"
                      className="font-semibold text-blue-600 hover:text-blue-500"
                    >
                      Lupa password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div></div>
              {/* <a href="/admin/"> */}
              <button className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Masuk
              </button>
              {/* </a> */}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
