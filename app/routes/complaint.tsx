import { Form, useFetcher } from "react-router";
import axios from "axios";

import type { Route } from "./+types/complaint";
import { handleLoader } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";

import { mapAdminResponseToCard } from "~/utils/mapTypes";
import type { ComplaintModel } from "~/models/Complaint";

import MessageCard from "~/components/MessageCard";
import TextWithRect from "~/components/TextWithRect";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  GoogleReCaptchaCheckbox,
  GoogleReCaptchaProvider,
} from "@google-recaptcha/react";
import { createAuthenticatedClient } from "~/utils/auth-client";

export async function loader() {
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/aduan/`);
  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);

  const formData = await request.formData();
  const method = request.method;
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/aduan/`);
  console.log("formData", formData);
  const captcha = formData.get("g-recaptcha-response");
  if (method === "POST")
    if (captcha) {
      formData.delete("g-recaptcha-response");
      formData.append("recaptcha_token", captcha as string);
      console.log("formDatarecaptcha", formData)

      return handleAction(() => client.post(urlRequest.href, formData));
    } else {
      return {
        success: false,
        message: "Captcha diperlukan untuk mengirim aduan",
      };
    }
}

export default function Complaint({ loaderData }: Route.ComponentProps) {
  const complaints = Array.isArray(loaderData?.data?.data_aduan)
    ? (loaderData.data.data_aduan as ComplaintModel[])
    : [];

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

  return (
    <>
      <div className="mt-8 flex flex-col items-center">
        <h1 className="text-2xl font-extrabold text-persian-blue-950 uppercase">
          Aduan
        </h1>
        <p className="text-center text-gray-500">
          Kritik dan saran Anda sangat berarti untuk kemajuan rumah sakit kami.
          Terima kasih!
        </p>
      </div>
      <div className="flex flex-col p-8">
        <div className="ms-8">
          <TextWithRect>
            Silahkan tulis saran atau keluhan Anda di sini
          </TextWithRect>
        </div>
        <div className="flex items-center max-md:flex-col">
          <fetcher.Form
            method="post"
            className="m-4 flex flex-1 flex-col gap-4 rounded-xl border border-gray-300 p-8 shadow-lg"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="nama" className="text-md font-semibold">
                Nama <span className="text-red-600">*</span>
              </label>
              <input
                onInput={(e) => {
                  const input = e.currentTarget;
                  // Prevent leading zeros
                  if (input.value === " " || input.value === "0") {
                    // Disallow "0" as the only input
                    input.value = "";
                  }
                }}
                type="text"
                placeholder="Masukkan nama Anda"
                className={`${
                  fetcherData.message && !fetcherData.success
                    ? "border-red-500 focus:outline-red-500"
                    : "outline-gray-300 focus:outline-green-600"
                } rounded-lg border border-gray-400 px-4 py-2`}
                name="nama"
                id="nama"
              />
              {fetcherData.message && (
                <p
                  className={`text-sm ${
                    fetcherData.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {fetcherData.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="no_wa" className="text-md font-semibold">
                No. Whatsapp <span className="text-red-600">*</span>
              </label>
              <input
                pattern="[1-9]\d*|0" // for HTML5 validation
                onInput={(e) => {
                  const input = e.currentTarget;
                  // Prevent leading zeros
                  if (input.value === "0") {
                    // Disallow "0" as the only input
                    input.value = "";
                  }

                  // Replace leading zeros with 62
                  input.value = input.value.replace(/^0+(?!$)/, "62");

                  // Remove non-digit characters
                  input.value = input.value.replace(/[^\d]/g, "");
                }}
                type="text"
                inputMode="numeric"
                placeholder="cth. 628xxxxxxxxxx"
                className={`${
                  fetcherData.message && !fetcherData.success
                    ? "border-red-500 focus:outline-red-500"
                    : "outline-gray-300 focus:outline-green-600"
                } rounded-lg border border-gray-400 px-4 py-2`}
                name="no_wa"
                id="no_wa"
              />
              {fetcherData.message && (
                <p
                  className={`text-sm ${
                    fetcherData.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {fetcherData.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-md font-semibold">
                Aduan <span className="text-red-600">*</span>
              </label>
              <textarea
                onInput={(e) => {
                  const input = e.currentTarget;
                  if (input.value === " " || input.value === "0") {
                    input.value = "";
                  }
                }}
                required
                placeholder="Tulis aduan Anda"
                className={`${
                  fetcherData.message && !fetcherData.success
                    ? "border-red-500 focus:outline-red-500"
                    : "outline-gray-300 focus:outline-green-600"
                } min-h-56 rounded-lg border border-gray-400 px-4 py-2`}
                name="message"
                id="message"
              />
              {fetcherData.message && (
                <p
                  className={`text-sm ${
                    fetcherData.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {fetcherData.message}
                </p>
              )}
            </div>
            <div className="overflow-x-auto">
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
            </div>
            <button className="rounded bg-green-600 px-8 py-2 text-white min-md:w-min">
              Kirim
            </button>
          </fetcher.Form>

          <div className="me-4 flex-1">
            <img
              src="/images/pengaduan.jpg"
              alt="Poster Aduan"
              className="m-2 h-auto w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col p-8">
        <div className="ms-8">
          <TextWithRect>Aduan</TextWithRect>
        </div>
        <div className="px-2">
          {complaints?.length > 0 ? (
            complaints?.map((complaint, index) => (
              <MessageCard
                key={index}
                date={complaint.dibuat_pada}
                message={complaint.message}
                name={complaint.nama}
                replies={complaint.responAdmin?.map((res) =>
                  mapAdminResponseToCard(res),
                )}
              />
            ))
          ) : (
            <p className="ms-6 mt-2 text-gray-600">Tidak ada data</p>
          )}
        </div>
      </div>
    </>
  );
}
