import axios from "axios";
import Table from "~/components/Table";
import type { Route } from "./+types/index";
import { formatDate } from "~/utils/formatDate";
import { Form } from "react-router";
import { alternatingRowColor } from "~/utils/styles";
import { handleLoader } from "~/utils/handleLoader";
import type { ComplaintModel } from "~/models/Complaint";
import { handleAction } from "~/utils/handleAction";
import { mapAdminResponseToCard } from "~/utils/mapTypes";
import MessageCard from "~/components/MessageCard";

export async function loader({ request }: Route.LoaderArgs) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/aduan/`);

  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request }: Route.ActionArgs) {
  const method = request.method;
  const formData = await request.formData();
  console.log(formData);
  console.log(method);
  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/aduan/${formData.get("id")}`,
  );

  return handleAction(() => axios.post(urlRequest.href, formData));
}

export default function AdminComplaints({ loaderData }: Route.ComponentProps) {
  const headers = ["No", "Nama", "Aduan", "Tanggal", "Status", "Aksi"];
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
      <section className="w-full overflow-x-auto">
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
        {complaints?.map((item, index) => (
          <div key={index}>
            <p>{item.nama}</p>
            <p>{formatDate(item.dibuat_pada)}</p>
            <p>{item.message}</p>
            <p>
              <a
                target="__blank"
                href={`https://api.whatsapp.com/send/?phone=${item.no_wa}`}
              >
                WA
              </a>
            </p>
            {item.responAdmin.map((respon) => (
              <p className="border">{respon.message}</p>
            ))}
            <Form method="post" action="/admin/aduan">
              <input
                hidden
                readOnly
                type="text"
                name="id_aduan"
                value={item.id}
              />
              <input className="rounded border" type="text" name="message" />
              <button>Balas</button>
            </Form>
          </div>
        ))}
      </section>
    </>
  );
}
