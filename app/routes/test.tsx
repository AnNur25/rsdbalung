"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useFetcher } from "react-router";
import toast from "react-hot-toast";
import type { Route } from "./+types/test";
import { handleAction } from "~/utils/handleAction";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "@google-recaptcha/react";
// import { GoogleReCaptchaProvider } from "@google-recaptcha/react";

// export async function action({ request }: Route.ActionArgs) {
//   const formData = await request.formData();

//   console.log(formData);
//   const captchaValue = formData.get("captchaValue");
//   const response = await axios.post("http://localhost:3000/verify", {
//     captchaValue,
//   });
//   console.log(response.data);
//   return response.data;
//   // return handleAction(() =>
//   //   axios.post("http://localhost:3000/verify", formData),
//   // );
// }

export default function Test() {
  const recaptchaRef = useRef(null);
  const { executeV2Invisible } = useGoogleReCaptcha();
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeV2Invisible) {
      console.log("Execute recaptcha not available");
      return;
    }

    const token = await executeV2Invisible();
    console.log("tokenV2", token);
  }, [executeV2Invisible]);

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

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!executeV2Invisible) {
      console.log("reCAPTCHA is not loaded yet!");
      return;
    } else {
      const token = await executeV2Invisible();
      console.log("token", token);
      if (typeof token === "string") {
        console.log("token", token);
        const formData = new FormData(event.target as HTMLFormElement);
        formData.append("captchaValue", token);
        console.log("form captcha", formData);
      } else {
        console.error("Failed to retrieve a valid token from reCAPTCHA.");
        return;
      }
    }
  }
  // async function submitForm(event: React.FormEvent<HTMLFormElement>) {
  //   // event.preventDefault();
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
      {/* <GoogleReCaptchaProvider
        // explicit={{ badge: "inline" }}
        type="v2-invisible"
        siteKey={import.meta.env.VITE_SITE_KEY}
      > */}
      <fetcher.Form
        onSubmit={submitForm}
        method="post"
        className="mx-auto flex max-w-md flex-col space-y-4 p-6"
      >
        <div
          className="g-recaptcha"
          data-sitekey={import.meta.env.VITE_SITE_KEY}
          // data-callback={submitForm}
          data-size="invisible"
        ></div>
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
        {/* {ReCAPTCHA && (
          <ReCAPTCHA
            ref={recaptcha}
            size="invisible"
            sitekey="YOUR_SITE_KEY"
          />
        )} */}
        <button
          type="submit"
          // onClick={() => handleReCaptchaVerify()}
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Submit
        </button>
      </fetcher.Form>
      <button
        // type="submit"
        onClick={() => handleReCaptchaVerify()}
        className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        Submit
      </button>
      {/* </GoogleReCaptchaProvider> */}
    </>
  );
}
