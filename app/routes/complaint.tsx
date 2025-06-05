import { Form, useFetcher } from "react-router";
import axios from "axios";
import { useEffect, useRef, useState } from "react"; // Tambahkan useState
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

import type { Route } from "./+types/complaint";
import { handleLoader } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";
import { mapAdminResponseToCard } from "~/utils/mapTypes";
import type { ComplaintModel } from "~/models/Complaint";
import MessageCard from "~/components/MessageCard";
import TextWithRect from "~/components/TextWithRect";

const RECAPTCHA_SITE_KEY = "6LcgaUwrAAAAAJwD5ZwcEKVln37VJXMMkdelbVdS";

export async function loader() {
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/aduan/`);
  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const method = request.method;
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/aduan/`);
  if (method === "POST")
    return handleAction(() => axios.post(urlRequest.href, formData));
}

export default function Complaint({ loaderData }: Route.ComponentProps) {
  const complaints = Array.isArray(loaderData?.data?.data_aduan)
    ? (loaderData.data.data_aduan as ComplaintModel[])
    : [];

  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };

  // State untuk reCAPTCHA - TAMBAHAN BARU
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
        // Reset reCAPTCHA setelah berhasil submit - TAMBAHAN BARU
        setRecaptchaToken(null);
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);

  // Handler untuk submit form dengan validasi reCAPTCHA - TAMBAHAN BARU
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!recaptchaToken) {
      e.preventDefault();
      toast.error("Tolong centang reCAPTCHA terlebih dahulu.");
      return;
    }
  };

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
            onSubmit={handleSubmit} // TAMBAHAN BARU
            className="m-4 flex flex-1 flex-col gap-4 rounded-xl border border-gray-300 p-8 shadow-lg"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="nama" className="text-md font-semibold">
                Nama <span className="text-red-600">*</span>
              </label>
              <input
                onInput={(e) => {
                  const input = e.currentTarget;
                  if (input.value === " " || input.value === "0") {
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
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="no_wa" className="text-md font-semibold">
                No. Whatsapp <span className="text-red-600">*</span>
              </label>
              <input
                pattern="[1-9]\d*|0"
                onInput={(e) => {
                  const input = e.currentTarget;
                  if (input.value === "0") {
                    input.value = "";
                  }
                  input.value = input.value.replace(/^0+(?!$)/, "62");
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
                required
              />
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
            </div>

            {/* TAMBAHAN BARU - Komponen reCAPTCHA */}
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(token) => {
                console.log("reCAPTCHA token:", token);
                setRecaptchaToken(token);
              }}
              onExpired={() => {
                console.warn("reCAPTCHA expired");
                setRecaptchaToken(null);
              }}
              onErrored={() => {
                console.error("reCAPTCHA failed to load or verify");
                setRecaptchaToken(null);
              }}
            />

            {/* Hidden input untuk mengirim recaptcha token */}
            <input
              type="hidden"
              name="recaptcha_token"
              value={recaptchaToken || ""}
            />

            <button
              type="submit"
              disabled={fetcher.state === "submitting"} // TAMBAHAN BARU
              className="rounded bg-green-600 px-8 py-2 text-white disabled:opacity-50 min-md:w-min"
            >
              {fetcher.state === "submitting" ? "Mengirim..." : "Kirim"}
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
