import axios from "axios";
import { Outlet, useLoaderData } from "react-router";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
// import type { PelayananResponse } from "./admin/services";
import type { Pelayanan } from "~/models/Pelayanan";
import { useEffect } from "react";
import { GoogleReCaptchaProvider } from "@google-recaptcha/react";
import type { Route } from "./+types/layout";

export async function loader({ request }: Route.LoaderArgs) {
  const setCookieHeader = request.headers.get("cookie");

  console.log("user cookie", setCookieHeader);
  const pelayananRequest = new URL(
    `${import.meta.env.VITE_API_URL}/pelayanan/`,
  );

  try {
    const response = await axios.get(pelayananRequest.href, {
      withCredentials: true,
    });

    if (!response.data.success || !response.data.data.length) {
      // response.data.data = [];
      return {
        success: false,
        statusCode: response.status,
        message: "No data found",
        data: [],
      };
    }

    return response.data;
  } catch (error: any) {
    // console.error("Error fetching data:", error.response);
    return {
      success: false,
      statusCode: error.response?.status ?? 500,
      message: "Failed to fetch data",
      data: [],
    };
  }
}

export default function Layout() {
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    const nVisits = localStorage.getItem("nVisits") ?? "0";
    const nVisitsInt = parseInt(nVisits, 10);
    if (!hasVisited) {
      sessionStorage.setItem("hasVisited", "true");
      localStorage.setItem("nVisits", (nVisitsInt + 1).toString());
    }
  }, []);
  const data = useLoaderData();
  const pelayanan = data.data ?? [];

  return (
    <>
      <Header pelayanan={pelayanan} />
      {/* <GoogleReCaptchaProvider
        explicit={{ badge: "bottomright" }}
        type="v2-invisible"
        siteKey={import.meta.env.VITE_SITE_KEY}
        scriptProps={{
          async: true,
          defer: true,
          appendTo: "body",
        }}
      > */}
      <Outlet />
      {/* </GoogleReCaptchaProvider> */}
      <Footer />
    </>
  );
}
