import axios from "axios";
import { Outlet } from "react-router";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import type { Pelayanan } from "~/models/Pelayanan";
import { useEffect, useState } from "react";
import type { Route } from "./+types/layout";
import redirectWithCookie from "~/utils/redirectWithCookie";
import { createAuthenticatedClient } from "~/utils/auth-client";
import { handleLoader } from "~/utils/handleLoader";

export async function loader({ request, params }: Route.LoaderArgs) {
  return handleLoader(()=> axios.get(`${import.meta.env.VITE_API_URL}/pelayanan/`))
  // const client = await createAuthenticatedClient(request);

  // const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/profil`);

  // try {
  //   const profilResponse = await client.get(urlRequest.href);
  //   return {
  //     isLogin: profilResponse.data.success,
  //     profil: profilResponse.data,
  //   };
  // } catch (error: any) {
  //   try {
  //     const refreshRes = await client.post(
  //       `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
  //       {},
  //       {
  //         headers: { Cookie: request.headers.get("cookie") ?? "" },
  //       },
  //     );
  //     console.log("Unauthorized, refreshing token", refreshRes);
  //     const refreshCookieHeader = refreshRes.headers["set-cookie"];
  //     console.log("refresh header", refreshCookieHeader);
  //     return redirectWithCookie(request.url, refreshCookieHeader ?? "");
  //   } catch (error: any) {
  //     console.error("Error fetching data:", error.response);
  //     // return {
  //     //   success: false,
  //     //   statusCode: error.response?.status ?? 500,
  //     //   message: "Failed to fetch data",
  //     //   data: [],
  //     //   isLogin: false,
  //     // };
  //   }
  // }
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  // const [pelayanan, setPelayanan] = useState<Pelayanan[]>([]);
  // useEffect(() => {
  //   axios.get(`${import.meta.env.VITE_API_URL}/pelayanan/`).then((res) => {
  //     setPelayanan(res.data.data);
  //   });
  // }, []);
  const pelayanan: Pelayanan[] = loaderData?.data || [];
  // console.log(loaderData)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    const nVisits = localStorage.getItem("nVisits") ?? "0";
    const nVisitsInt = parseInt(nVisits, 10);
    if (!hasVisited) {
      sessionStorage.setItem("hasVisited", "true");
      localStorage.setItem("nVisits", (nVisitsInt + 1).toString());
    }
  }, []);
  // const profil = loaderData?.profil ?? {};
  // const isLogin = loaderData?.isLogin ?? false;
  // console.log("isLogin", isLogin);
  // console.log("profil", profil);

  return (
    <>
      <Header pelayanan={pelayanan} />
      <Outlet />
      <Footer />
    </>
  );
}
