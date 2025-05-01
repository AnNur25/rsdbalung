import { Form } from "react-router";
import axios from "axios";

import type { Route } from "./+types/complaint";
import { handleLoader } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";

import { mapAdminResponseToCard } from "~/utils/mapTypes";
import type { ComplaintModel } from "~/models/Complaint";

import MessageCard from "~/components/MessageCard";

export async function loader() {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/aduan/`);
  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const method = request.method;
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/aduan/`);
  if (method === "POST")
    return handleAction(() => axios.post(urlRequest.href, formData));
}

export default function Complaint({ loaderData }: Route.ComponentProps) {
  const complaints = Array.isArray(loaderData?.data?.data_aduan)
    ? (loaderData.data.data_aduan as ComplaintModel[])
    : [];

  return (
    <>
      <div className="flex items-center p-8 max-md:flex-col">
        <Form
          method="post"
          className="m-4 flex flex-1 flex-col gap-4 rounded-xl border border-gray-300 p-8 shadow-lg"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="nama" className="text-md font-semibold">
              Nama <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan nama Anda"
              className="rounded-lg border border-gray-400 px-4 py-2"
              name="nama"
              id="nama"
            />
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
              placeholder="Masukkan No. Whatsapp Anda"
              className="rounded-lg border border-gray-400 px-4 py-2"
              name="no_wa"
              id="no_wa"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-md font-semibold">
              Aduan <span className="text-red-600">*</span>
            </label>
            <textarea
              placeholder="Tulis aduan Anda"
              className="min-h-56 rounded-lg border border-gray-400 px-4 py-2"
              name="message"
              id="message"
            />
          </div>

          <button className="rounded bg-green-600 px-8 py-2 text-white min-md:w-min">
            Simpan
          </button>
        </Form>

        <div className="me-4 flex-1">
          <img
            src="/images/pengaduan.jpg"
            alt="Poster Aduan"
            className="m-2 h-auto w-full"
          />
        </div>
      </div>

      <div className="p-4">
        {complaints?.map((complaint, index) => (
          <MessageCard
            key={index}
            date={complaint.dibuat_pada}
            message={complaint.message}
            name={complaint.nama}
            replies={complaint.responAdmin?.map((res) =>
              mapAdminResponseToCard(res),
            )}
          />
        ))}
      </div>
    </>
  );
}
