"use client";
import { use, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useFetcher } from "react-router";
import toast from "react-hot-toast";
import type { Route } from "./+types/test";
import { handleAction } from "~/utils/handleAction";
import {
  GoogleReCaptchaProvider,
  // useGoogleReCaptcha,
  GoogleReCaptchaCheckbox,
} from "@google-recaptcha/react";
import Charts from "~/components/Charts";
// import ReCAPTCHA from "react-google-recaptcha";
// import { GoogleReCaptchaProvider } from "@google-recaptcha/react";
import YoutubeEmbed from "~/components/YoutubeEmbed";
import { createAuthenticatedClient } from "~/utils/auth-client";

export async function loader({ request }: Route.LoaderArgs) {
  const client = await createAuthenticatedClient(request);
  // try {
  //   const response = await client.get(`${import.meta.env.VITE_API_URL}/profil`);
  //   console.log("response", response.data);
  // } catch (error) {
  //   const refreshRes = await client.post(
  //     `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
  //     {},
  //     {
  //       headers: { Cookie: request.headers.get("cookie") ?? "" },
  //     },
  //   );
  //   console.log("Unauthorized, refreshing token", refreshRes);
  //   const refreshCookieHeader = refreshRes.headers["set-cookie"];
  //   console.log("refresh header", refreshCookieHeader);
  //   return redirectWithCookie(request.url, refreshCookieHeader ?? "");
  // }

  // const channelId = "UChVGsibHFT03DpOhvBp36kQ";
  // const res = await axios.get(
  //   `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
  //   { responseType: "text" },
  // );
  // const str = res.data;

  // const matches = Array.from(
  //   str.matchAll(/<yt:videoId>([^<]+)<\/yt:videoId>/g),
  // ) as RegExpMatchArray[];
  // const videoIds = matches.map((m) => m[1]);

  // return videoIds;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  console.log(formData);
  const localVerify = await handleAction(() =>
    axios.post("http://localhost:3000/api/verify", formData),
  );
  console.log("localVerify", localVerify);
}

export default function Test({ loaderData }: Route.ComponentProps) {
  console.log("loaderData", loaderData);

  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
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

  console.log(fetcher.data);

  return (
    <>
      {/* <div className="relative flex h-[300px] w-[250px] flex-col justify-end overflow-hidden rounded-xl border bg-white shadow-lg">
        <img
          src="{member.image}"
          alt="{member.name}"
          className="absolute top-0 left-0 h-full w-full object-cover opacity-90"
        />
        <div className="relative z-10 bg-blue-900/80 p-4 text-white">
          <h3 className="font-semibold">"sadf"</h3>
          <span
            className={`mt-1 inline-block rounded-full bg-yellow-300 px-3 py-1 text-sm font-medium text-black`}
          >
            saf
          </span>
        </div>
      </div>
      {loaderData.map((videoId: string) => (
        <YoutubeEmbed videoId={videoId} key={videoId} />
      ))}
      <Charts />
      <fetcher.Form
        method="post"
        className="mx-auto flex max-w-md flex-col space-y-4 p-6"
      >
        <GoogleReCaptchaProvider
          type="v2-checkbox"
          siteKey={import.meta.env.VITE_SITE_KEY}
        >
          <GoogleReCaptchaCheckbox
            onChange={(token) => {
              console.log(token);
            }}
          />
        </GoogleReCaptchaProvider>
        <button
          type="submit"
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Submit
        </button>
      </fetcher.Form> */}
    </>
  );
}
