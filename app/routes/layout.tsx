import axios from "axios";
import { Outlet, useLoaderData } from "react-router";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import type { Pelayanan } from "~/models/Pelayanan";
import { useEffect, useState } from "react";
// import { GoogleReCaptchaProvider } from "@google-recaptcha/react";
import type { Route } from "./+types/layout";
import redirectWithCookie from "~/utils/redirectWithCookie";
import { createAuthenticatedClient } from "~/utils/auth-client";

export async function loader({ request, params }: Route.LoaderArgs) {
  const client = await createAuthenticatedClient(request);

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/profil`);

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  console.log("searchParams", searchParams);

  const pelayananRequest = new URL(
    `${import.meta.env.VITE_API_URL}/pelayanan/`,
  );

  try {
    const response = await client.get(pelayananRequest.href);
    const profilResponse = await client.get(urlRequest.href);
    // console.log(profilResponse);

    if (!response.data.success || !response.data.data.length) {
      // response.data.data = [];
      return {
        success: false,
        statusCode: response.status,
        message: "No data found",
        data: [],
      };
    }
    return {
      data: response.data,
      isLogin: profilResponse.data.success,
      profil: profilResponse.data,
    };
    // return response.data;
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
      console.error("Error fetching data:", error.response);
      // return {
      //   success: false,
      //   statusCode: error.response?.status ?? 500,
      //   message: "Failed to fetch data",
      //   data: [],
      //   isLogin: false,
      // };
    }
  }
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const [pelayanan, setPelayanan] = useState<Pelayanan[]>([]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/pelayanan/`).then((res) => {
      setPelayanan(res.data.data);
    });
  }, []);
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    const nVisits = localStorage.getItem("nVisits") ?? "0";
    const nVisitsInt = parseInt(nVisits, 10);
    if (!hasVisited) {
      sessionStorage.setItem("hasVisited", "true");
      localStorage.setItem("nVisits", (nVisitsInt + 1).toString());
    }
  }, []);
  const data = loaderData?.data || [];
  const profil = loaderData?.profil ?? {};
  const isLogin = loaderData?.isLogin ?? false;
  console.log("isLogin", isLogin);
  console.log("profil", profil);

  return (
    <>
      <Header pelayanan={pelayanan} isLogin={isLogin} />
      <Outlet context={{ profil }} />
      <Footer />
    </>
  );
}
