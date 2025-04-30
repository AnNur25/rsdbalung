import { Form } from "react-router";
import type { Route } from "./+types/complaint";
import axios from "axios";
import { handleLoader } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";
import type { ComplaintModel } from "~/models/Complaint";
import { formatDate } from "~/utils/formatDate";
import MessageCard from "~/components/MessageCard";
import { mapAdminResponseToCard } from "~/utils/mapTypes";

export async function loader({ request }: Route.LoaderArgs) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/aduan/`);

  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/aduan/`);
  console.log(formData);
  return;
  return handleAction(() => axios.post(urlRequest.href, formData));
}

export default function Complaint({ loaderData }: Route.ComponentProps) {
  const dummy: ComplaintModel = {
    dibuat_pada: formatDate(Date().toString()),
    id: "1",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    nama: "Pasien X",
    no_wa: "1234",
    is_visible: true,
    responAdmin: [
      {
        id: "a",
        message: "Balasan Admin A",
        dibuat_pada: formatDate(Date().toString()),
      },
      {
        id: "a",
        message: "Balasan Admin A",
        dibuat_pada: formatDate(Date().toString()),
      },
    ],
  };
  const complaints = Array.isArray(loaderData?.data?.data_aduan)
    ? (loaderData.data.data_aduan as ComplaintModel[])
    : [];

  if (complaints.length <= 0) {
    complaints.push(dummy);
    complaints.push(dummy);
  }

  console.log("complaints", complaints);
  return (
    <>
      <Form method="post" className="flex flex-col gap-4 p-12">
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
          <input
            type="text"
            placeholder="Tulis aduan Anda"
            className="rounded-lg border border-gray-400 px-4 py-2"
            name="message"
            id="message"
          />
        </div>
        <button className="rounded bg-green-600 px-8 py-2 text-white min-md:w-min">
          Simpan
        </button>
      </Form>

      {complaints?.map((complaint) => (
        <MessageCard
          isAdmin={true}
          date={complaint.dibuat_pada}
          message={complaint.message}
          name={complaint.nama}
          replies={complaint.responAdmin?.map((res) =>
            mapAdminResponseToCard(res),
          )}
        />
      ))}
    </>
  );
}
