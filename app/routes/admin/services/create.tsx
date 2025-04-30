import axios from "axios";
import { Form } from "react-router";
import type { Route } from "./+types";
import { getSession } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const nama_pelayanan = formData.get("nama_pelayanan");
  const Persyaratan = formData.get("Persyaratan");
  const Prosedur = formData.get("Prosedur");
  const JangkaWaktu = formData.get("JangkaWaktu");
  const Biaya = formData.get("Biaya");
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/pelayanan`);

  try {
    const response = await axios.post(
      urlRequest.href,
      {
        nama_pelayanan,
        Persyaratan,
        Prosedur,
        JangkaWaktu,
        Biaya: parseInt(Biaya as string, 10),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    // console.error("Error creating service:", error);
    return { error: "Failed to create service" };
  }
}

export default function CreateService() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Create Service</h1>
      <Form method="post" action="/admin/pelayanan/create">
        <div className="flex flex-col gap-2">
          <label htmlFor="nama_pelayanan">Nama Pelayanan</label>
          <input
            type="text"
            name="nama_pelayanan"
            id="nama_pelayanan"
            className="rounded border border-gray-300 p-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="Persyaratan">Persyaratan</label>
          <textarea
            name="Persyaratan"
            id="Persyaratan"
            className="rounded border border-gray-300 p-2"
          ></textarea>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="Prosedur">Prosedur</label>
          <textarea
            name="Prosedur"
            id="Prosedur"
            className="rounded border border-gray-300 p-2"
          ></textarea>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="JangkaWaktu">Jangka Waktu</label>
          <input
            type="text"
            name="JangkaWaktu"
            id="JangkaWaktu"
            className="rounded border border-gray-300 p-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="Biaya">Biaya</label>
          <input
            type="number"
            name="Biaya"
            id="Biaya"
            className="rounded border border-gray-300 p-2"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}
