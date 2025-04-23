import axios from "axios";
import type { Route } from "./+types/edit";
import { Form } from "react-router";

export async function loader({ params }: { params: { id: string } }) {
  return params.id;
}
export async function action({ request }: Route.ActionArgs) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/poli/`);
  console.log("urlRequest", urlRequest.href);

  let formData = await request.formData();
  const idPoli = formData.get("id_poli") as string;
  if (idPoli === null) {
    return { error: "ID Poli is required" };
  }
  urlRequest.pathname = `/poli/${idPoli}`;

  const token = formData.get("token") as string;
  try {
    const response = await axios.put(
      urlRequest.href,
      {
        nama_poli: formData.get("nama_poli"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { success: true, nama_poli: response.data.nama_poli };
  } catch (error: any) {
    console.error("Error creating Poli:", error.response);
    return { error: error.response?.data?.message || "Failed to create Poli" };
  }
}

export default function AdminEditPoli({ loaderData }: Route.ComponentProps) {
  const idPoli = loaderData as string;
  return (
    <>
      <div className="mx-auto mt-10 max-w-md rounded-md bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Edit Poli</h1>
        <Form method="post" className="space-y-4">
          <div>
            <label
              htmlFor="nama_poli"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Poli
            </label>
            <input
              hidden
              type="text"
              name="id_poli"
              id="id_poli"
              value={idPoli}
            />
            <input
              type="text"
              name="nama_poli"
              id="nama_poli"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
            />
            <input
              placeholder="Token"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
              type="text"
              name="token"
              id="token"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
          >
            Submit
          </button>
        </Form>
      </div>
    </>
  );
}
