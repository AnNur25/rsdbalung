import { Outlet, redirect } from "react-router";
import AdminSidebar from "~/components/AdminSidebar";
import type { Route } from "./+types/layout";
// import { getSession } from "~/sessions.server";
import axios from "axios";
import { clearAuthCookies, hasAuthCookies } from "~/utils/auth-cookie";
import { createAuthenticatedClient } from "~/utils/auth-client";

export async function loader({ request }: Route.LoaderArgs) {
  // const session = await getSession(request.headers.get("Cookie"));
  // const token = session.get("token");
  // if (!token) {
  //   return redirect("/admin/login");
  // }
  // const isAuthenticated = await hasAuthCookies(request);

  // if (!isAuthenticated) {
  //   return redirect("/admin/login");
  // }

  const client = await createAuthenticatedClient(request);
  const cookie = request.headers.get("cookie");
  console.log("cookie", cookie);
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/profil`);
  try {
    const response = await client.get(
      urlRequest.href,
      // const response = await axios.get(urlRequest.href, {
      // withCredentials: true,
      // headers: { Cookie: request.headers.get("cookie") ?? "" },

      // headers: { "Set-Cookie": cookie },
      // headers: { "Set-Cookie": cookie },
    );
    console.log("response", response.data);
    const data = response.data;
    // if (!data.success) {
    //   await clearAuthCookies();
    //   return redirect("/admin/login");
    // }
  } catch (error: any) {
    // await clearAuthCookies();

    console.error("Error fetching data:", error.response);
    // return redirect("/admin/login");
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
