import axios from "axios";
import Table from "~/components/Table";
import type { Route } from "./+types";
import { formatDate } from "~/utils/formatDate";
import { Form } from "react-router";
import { alternatingRowColor } from "~/utils/styles";
export interface ResponAdmin {
  id_respon_admin: string;
  message: string;
  createdAt: string; // ISO date string
  id_user: string;
  id_aduan: string;
}

export interface Aduan {
  id_aduan: string;
  judul: string;
  deskripsi: string;
  createdAt: string; // ISO date string
  no_wa: string;
  is_read: boolean;
  responAdmin: ResponAdmin[];
}

export async function loader({ request }: Route.LoaderArgs) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/aduan/`);
  try {
    const response = await axios.get(urlRequest.href);
    return response.data.data;
  } catch (error: any) {}
}

export async function action({ request }: Route.ActionArgs) {
  const method = request.method;
  const formData = await request.formData();
  console.log(formData);
  console.log(method);
  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/aduan/${formData.get("id_aduan")}`,
  );
  try {
    const response = await axios.post(urlRequest.href, formData);
    console.log(response.data);
  } catch (error: any) {
    // console.error(error.response.data);
  }
}

export default function AdminComplaints({ loaderData }: Route.ComponentProps) {
  const headers = ["No", "Nama", "Aduan", "Tanggal", "Status", "Aksi"];
  const aduanList = (loaderData as Aduan[]) || [];
  return (
    <>
      <section className="w-full overflow-x-auto">
        <Table headers={headers}>
          {aduanList.map((item, index) => (
            <tr key={index} className={alternatingRowColor}>
              <td className="w-min border border-gray-300 px-4 py-2 text-center">
                {index + 1}
              </td>
              <td className="w-min border border-gray-300 px-4 py-2 text-center">
                {item.judul}
              </td>
              <td className="w-min border border-gray-300 px-4 py-2 text-center">
                {item.judul}
              </td>
              <td className="w-min border border-gray-300 px-4 py-2 text-center">
                {formatDate(item.createdAt)}
              </td>
              <td className="w-min border border-gray-300 px-4 py-2 text-center">
                {item.is_read ? "Sudah dibaca" : "Belum dibaca"}
              </td>
              <td className="w-min border border-gray-300 px-4 py-2 text-center">
                <a href={`/admin/aduan/balas/${item.id_aduan}`}>
                  {item.id_aduan}
                </a>
              </td>
            </tr>
          ))}
        </Table>
        {aduanList.map((item, index) => (
          <div>
            <p>{item.judul}</p>
            <p>{formatDate(item.createdAt)}</p>
            <p>{item.deskripsi}</p>
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
                value={item.id_aduan}
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
