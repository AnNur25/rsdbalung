import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { getSession } from "~/sessions.server";
import type { Route } from "./+types";
import axios from "axios";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) {
    return redirect("/admin/login");
  }

  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/profil`);
  try {
    const response = await axios.get(urlRequest.href, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data;
    // if (!data.success) {
    //   return redirect("/admin/login");
    // }
    return data;
  } catch (error: any) {
    console.error("Error fetching data:", error.response);
    // return redirect("/admin/login");
  }
}
export default function AdminAccount({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData || { data: { id_user: "", nama: "", email: "" } };
  const { id_user, nama, email } = data;
  return (
    <>
      <h1>
        {nama} {email}
      </h1>
    </>
  );
}
