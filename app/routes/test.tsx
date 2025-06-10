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
import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import YoutubeEmbed from "~/components/YoutubeEmbed";
import { createAuthenticatedClient } from "~/utils/auth-client";
import redirectWithCookie from "~/utils/redirectWithCookie";

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

  const channelId = "UChVGsibHFT03DpOhvBp36kQ";
  const res = await axios.get(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    { responseType: "text" },
  );
  const str = res.data;

  const matches = Array.from(
    str.matchAll(/<yt:videoId>([^<]+)<\/yt:videoId>/g),
  ) as RegExpMatchArray[];
  const videoIds = matches.map((m) => m[1]);

  return videoIds;
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

  // const recaptcha = useRef<ReCAPTCHA>(null);
  // const { executeV2Invisible } = useGoogleReCaptcha();
  // const handleReCaptchaVerify = useCallback(async () => {
  //   if (!executeV2Invisible) {
  //     console.log("Execute recaptcha not available");
  //     return;
  //   }

  //   const token = await executeV2Invisible();
  //   console.log("tokenV2", token);
  // }, [executeV2Invisible]);

  // // You can use useEffect to trigger the verification as soon as the component being loaded
  // useEffect(() => {
  //   handleReCaptchaVerify();
  // }, [handleReCaptchaVerify]);

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
  // console.log("sitekey", import.meta.env.VITE_SITE_KEY);

  // async function submitForm(event: React.FormEvent<HTMLFormElement>) {
  //   event.preventDefault();

  //   if (!executeV2Invisible) {
  //     console.log("reCAPTCHA is not loaded yet!");
  //     return;
  //   } else {
  //     const token = await executeV2Invisible();
  //     console.log("token", token);
  //     if (typeof token === "string") {
  //       console.log("token", token);
  //       const formData = new FormData(event.target as HTMLFormElement);
  //       formData.append("captchaValue", token);
  //       console.log("form captcha", formData);
  //     } else {
  //       console.error("Failed to retrieve a valid token from reCAPTCHA.");
  //       return;
  //     }
  //   }
  // }
  // async function submitForm(event: React.FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //   const captchaValueGet = recaptcha.current?.getValue();
  //   console.log("cget", captchaValueGet);
  //   const captchaValue = await recaptcha.current
  //     ?.executeAsync()
  //     .then((value) => {
  //       console.log("executeAsync promise - Captcha value:", value);
  //     });
  //   console.log("captcha", captchaValue);
  //   const formData = new FormData(event.target as HTMLFormElement);
  //   if (!captchaValue) {
  //     alert("Please verify the reCAPTCHA!");
  //   } else {
  //     // fetcher.submit(
  //     //     { captchaValue },
  //     //     {
  //     //       method: "post",
  //     //     },
  //     //   );
  //     // const res = await axios.post("http://localhost:3000/verify", {
  //     //   captchaValue,
  //     // });

  //     // const data = res.data;
  //     console.log("c data", captchaValue);
  //     // if (data.success) {
  //     fetcher.submit(
  //       { captchaValue },
  //       {
  //         method: "post",
  //       },
  //     );
  //     //   toast.success("Form submission successful!");
  //     // } else {
  //     //   toast.error("reCAPTCHA validation failed!");
  //     // }
  //   }
  // }

  return (
    <>
      {loaderData.map((videoId: string) => (
        <YoutubeEmbed videoId={videoId} key={videoId} />
      ))}
      <Charts />
      {/* <GoogleReCaptchaProvider
        // explicit={{ badge: "inline" }}
        type="v2-invisible"
        siteKey={import.meta.env.VITE_SITE_KEY}
      > */}
      <fetcher.Form
        // onSubmit={submitForm}
        method="post"
        className="mx-auto flex max-w-md flex-col space-y-4 p-6"
      >
        {/* <div
          className="g-recaptcha"
          data-sitekey={import.meta.env.VITE_SITE_KEY}
          // data-callback={submitForm}
          data-size="invisible"
        ></div> */}
        {/* <input
          type="text"
          name="name"
          className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Name"
        /> */}
        {/* <input
          type="text"
          name="name"
          className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Name"
        />
        <input
          type="text"
          name="email"
          className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Password"
        /> */}
        {/* {ReCAPTCHA && ( */}
        {/* <ReCAPTCHA
          sitekey={import.meta.env.VITE_SITE_KEY}
          ref={recaptcha}
          size="normal"
          badge="inline"
          onLoad={() => {
            console.log("reCAPTCHA script loaded!");
            // setRecaptchaLoaded(true);
          }}
          onChange={(value) => {
            console.log("Captcha value:", value);
          }}
          // sitekey="YOUR_SITE_KEY"
        /> */}
        {/* )} */}
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
          // onClick={() => handleReCaptchaVerify()}
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Submit
        </button>
      </fetcher.Form>
      {/* <button
        // type="submit"
        onClick={() => handleReCaptchaVerify()}
        className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        Submit
      </button> */}
      {/* </GoogleReCaptchaProvider> */}
    </>
  );
}
