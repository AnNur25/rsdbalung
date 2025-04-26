import axios from "axios";
import type { Route } from "./+types";
import { Form } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const doctorId = params.id;
  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/dokter/${doctorId}`,
  );

  //

  try {
    const response = await axios.get(urlRequest.href);
    const data = response.data;

    return data;
  } catch (error: any) {
    console.error("Error fetching doctor data:", error);
    return {
      success: false,
      statusCode: error.response?.status ?? 500,
      message: error.response?.data?.message ?? "Internal Server Error",
      data: null,
    };
  }
}

export async function action({ request, params }: Route.ActionArgs) {}

export default function EditDoctor({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData;
  const doctor = data.dokter;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Edit Doctor</h1>
      <Form method="post" className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          value={doctor.nama}
        />
        <button type="submit">Save</button>
      </Form>
    </div>
  );
}
