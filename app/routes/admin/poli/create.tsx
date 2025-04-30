import { Form, useActionData } from "react-router";
import axios from "axios";
import type { Route } from "./+types/create";
import { getSession } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/poli`);

  let formData = await request.formData();
  let namaPoli = formData.get("nama_poli");
  const token = session.get("token");

  if (!namaPoli || typeof namaPoli !== "string") {
    return { error: "Nama Poli is required" };
  }

  try {
    const response = await axios.post(
      urlRequest.href,
      { nama_poli: namaPoli },
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // },
    );

    return { success: true, nama_poli: response.data.nama_poli };
  } catch (error: any) {
    // console.error("Error creating Poli:", error.response);
    return { error: error.response?.data?.message || "Failed to create Poli" };
  }
}

export default function CreatePoli({ actionData }: Route.ComponentProps) {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-md bg-white p-6 shadow-md">
      <h1 className="mb-6 text-center text-2xl font-bold">Create Poli</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label
            htmlFor="nama_poli"
            className="block text-sm font-medium text-gray-700"
          >
            Nama Poli
          </label>
          <input
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
      {actionData?.error && (
        <p className="mt-4 text-sm text-red-600">{actionData.error}</p>
      )}
      {actionData?.success && (
        <p className="mt-4 text-sm text-green-600">
          Poli "{actionData.nama_poli}" created successfully!
        </p>
      )}
    </div>
  );
}
