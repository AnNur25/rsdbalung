import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useFetcher } from "react-router";
import toast from "react-hot-toast";
import type { Route } from "./+types/test";
import { handleAction } from "~/utils/handleAction";
// import { ReCAPTCHA } from "react-google-recaptcha";
// import ReCAPTCHA from "react-google-recaptcha";
// import { default as ReCAPTCHA } from "react-google-recaptcha";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  console.log(formData);
  const captchaValue = formData.get("captchaValue");
  const response = await axios.post("http://localhost:3000/verify", {
    captchaValue,
  });
  console.log(response.data);
  return response.data;
  // return handleAction(() =>
  //   axios.post("http://localhost:3000/verify", formData),
  // );
}

export default function Test() {
  //  useEffect(() => {
  //    import("react-google-recaptcha").then((mod) => {
  //      setReCAPTCHA(mod.default);
  //    });
  //  }, []);
  const recaptcha = useRef(null);
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
  // console.log("All env variables:", import.meta.env);
  console.log("sitekey", import.meta.env.VITE_SITE_KEY);

  function onChangeHandler(value: any) {
    console.log("Captcha value:", value);
  }
  async function loadCaptcha() {
    setRecaptchaLoaded(true);
    console.log("load", recaptcha);
  }
  async function submitForm(event: React.FormEvent<HTMLFormElement>) {}
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
      <fetcher.Form
        onSubmit={submitForm}
        method="post"
        className="mx-auto flex max-w-md flex-col space-y-4 p-6"
      >
        <div
          className="g-recaptcha"
          data-sitekey={import.meta.env.VITE_SITE_KEY}
          data-callback={submitForm}
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
        {/* <ReCAPTCHA
          badge="inline"
          // asyncScriptOnLoad={loadCaptcha}
          ref={recaptcha}
          // onChange={onChangeHandler}
          size="invisible"
          sitekey={import.meta.env.VITE_SITE_KEY}
          className="mt-4"
        /> */}
        <button
          onClick={() => {
            // recaptcha.current?.execute();
          }}
          type="submit"
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Submit
        </button>
      </fetcher.Form>
    </>
  );
}
