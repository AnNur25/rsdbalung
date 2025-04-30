import axios from "axios";
import type { Route } from "./+types/edit";
import { Form } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/pelayanan/${params.id}`,
  );
  try {
    const response = await axios.get(urlRequest.href);
    // console.log(response);
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data);
  }
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/pelayanan/${params.id}`,
  );

  try {
    const response = await axios.put(urlRequest.href, {
      ...Object.fromEntries(formData.entries()),
      Biaya: parseInt(formData.get("Biaya") as string, 10),
    });
    // console.log(response.data);
    return response.data;
  } catch (error: any) {
    // console.error(error.response.data.data);
  }
}

export default function EditService({ loaderData }: Route.ComponentProps) {
  console.log(loaderData);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Edit Pelayanan</h1>
      <Form method="put">
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
