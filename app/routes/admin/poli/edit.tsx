import axios from "axios";
import type { Route } from "./+types/edit";
import { Form } from "react-router";
import { getSession } from "~/sessions.server";
import { useState } from "react";

export async function loader({ params }: Route.LoaderArgs ) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/poli/${params.id}`);
  try {
    const response = await axios.get(urlRequest.href);
    const data = response.data;
    console.log("data", data);
    return data.data;
  } catch (error: any) {
    console.error("Error fetching Poli data:", error);
    return {
      success: false,
      statusCode: error.response?.status ?? 500,
      message: error.response?.data?.message ?? "Internal Server Error",
      data: null,
    };
  }
}
export async function action({ params, request }: Route.ActionArgs) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/poli/`);
  console.log("urlRequest", urlRequest.href);

  let formData = await request.formData();
  const idPoli = params.id;
  if (idPoli === null) {
    return { error: "ID Poli is required" };
  }
  urlRequest.pathname = `/poli/${idPoli}`;
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
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
  const poli = loaderData;
  const extractedPoliName = poli.nama_poli.split(" ").slice(2).join(" ") || "";
  const [poliName, setPoliName] = useState(extractedPoliName || "");
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
              value={poliName}
              onChange={(e) => setPoliName(e.target.value)}
              type="text"
              name="nama_poli"
              id="nama_poli"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
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
