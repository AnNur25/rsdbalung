import { Outlet, redirect } from "react-router";
import AdminSidebar from "~/components/AdminSidebar";
import type { Route } from "./+types/layout";
import { getSession } from "~/sessions.server";
import axios from "axios";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  if (!token) {
    return redirect("/admin/login");
  }
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/profil`);
  try {
    const response = await axios.get(urlRequest.href);
    const data = response.data;
    if (!data.success) {
      return redirect("/admin/login");
    }
  } catch (error: any) {
    console.error("Error fetching data:", error.response);
    return redirect("/admin/login");
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
