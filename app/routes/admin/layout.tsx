import { Outlet, redirect } from "react-router";
import AdminSidebar from "~/components/AdminSidebar";
import type { Route } from "./+types/layout";
import { createAuthenticatedClient } from "~/utils/auth-client";
import redirectWithCookie from "~/utils/redirectWithCookie";

export async function loader({ request }: Route.LoaderArgs) {
  const client = await createAuthenticatedClient(request);
  const cookie = request.headers.get("cookie");
  console.log("cookie", cookie);
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/profil`);
  try {
    console.log("fail cookie", request.headers.get("cookie"));

    const response = await client.get(urlRequest.href).then((res) => {
      console.log("response", res.status);
      return res;
    });
    console.log("response", response.data.statusCode);
    const data = response.data;
    if (data.statusCode == 401) {
      const refreshRes = await client.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
        {},
        {
          headers: { Cookie: request.headers.get("cookie") ?? "" },
        },
      );
      console.log("Unauthorized, refreshing token", refreshRes);
      const refreshCookieHeader = refreshRes.headers["set-cookie"];
      console.log("refresh header", refreshCookieHeader);
      return redirectWithCookie(request.url, refreshCookieHeader ?? "");
    }
  } catch (error: any) {
    try {
      const refreshRes = await client.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
        {},
        {
          headers: { Cookie: request.headers.get("cookie") ?? "" },
        },
      );
      console.log("Unauthorized, refreshing token", refreshRes);
      const refreshCookieHeader = refreshRes.headers["set-cookie"];
      console.log("refresh header", refreshCookieHeader);
      return redirectWithCookie(request.url, refreshCookieHeader ?? "");
    } catch (error: any) {
      return redirect("/humasbalung/login");
    }
  }
}

export default function AdminLayout() {
  return (
    <div className="flex h-screen max-w-screen flex-col lg:flex-row">
      <AdminSidebar />
      <main className="grow p-5 lg:px-7">
        <Outlet />
        <div className="mt-8 p-0.5"></div>
      </main>
    </div>
  );
}
