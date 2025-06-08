import axios from "axios";
import type { Route } from "./+types/login";
import redirectWithCookie from "~/utils/redirectWithCookie";
import { redirect, useFetcher } from "react-router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import loginImage from "~/assets/loginuser.png";

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    console.log("url", url);
    console.log("searchParams", searchParams);
    let authSuccess = searchParams.get("authSuccess");
    let refreshToken = searchParams.get("refreshToken") ?? "";
    let aksesToken = authSuccess?.split("?")[1] ?? "";
    aksesToken = aksesToken?.split("=")[1] ?? "";
    if (!authSuccess) {
      return redirect("/test");
    }
    if (refreshToken && aksesToken) {
      console.log("aksesToken", aksesToken);
      const setTokenRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/set-cookie`,
        {
          aksesToken,
          refreshToken,
        },
        { withCredentials: true },
      );
      const setCookieHeader = setTokenRes.headers["set-cookie"];
      console.log(setTokenRes);
      return redirectWithCookie("/", setCookieHeader ?? "");
    }
}
