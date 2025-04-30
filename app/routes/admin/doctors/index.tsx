import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { Form, useLoaderData } from "react-router";
import DoctorCard from "~/components/DoctorCard";
import type { Doctor } from "~/routes/doctors";
import { getSession } from "~/sessions.server";
import type { Route } from "./+types";
import { handleAction } from "~/utils/handleAction";

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    Dokter: Doctor[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  };
}
export async function loader() {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/dokter`);
  handleAction(() => axios.get(urlRequest.href));

  try {
    const response = await axios.get(urlRequest.href);
    console.log(response.data);

    if (!response.data.success) {
      return {
        success: false,
        statusCode: response.status,
        message: "No data found",
        data: {
          Dokter: [],
          pagination: {
            currentPage: 1,
            pageSize: 15,
            totalItems: 0,
            totalPages: 1,
          },
        },
      };
    }
    return response.data;
  } catch (error: any) {
    console.log(error.response?.data);

    return {
      success: false,
      statusCode: error.response?.status ?? 500,
      message: error.response?.data?.message ?? "Internal Server Error",
      data: {
        Dokter: [],
        pagination: {
          currentPage: 1,
          pageSize: 15,
          totalItems: 0,
          totalPages: 1,
        },
      },
    };
  }
}

export async function action({ request }: Route.ActionArgs) {
  const method = request.method;
  // console.log(request.url)
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/dokter`);
  let formData;

  if (method === "POST" || method === "PUT" || method === "DELETE") {
    formData = await request.formData();
  } else {
    return { error: "Invalid method" };
  }
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  try {
    let response;
    if (!token) {
      return { error: "Token is required" };
    }
    if (method === "DELETE") {
      const idDokter = formData.get("id_dokter") as string;
      response = await axios.delete(
        `https://rs-balung-cp.vercel.app/dokter/${idDokter}`,
      );
    }
    if (!response) {
      return { error: "Error response" };
    }

    return { success: true, message: response.data.message };
  } catch (error: any) {
    return {
      success: false,
      statusCode: error.response?.status ?? 500,
      message: error.response?.data?.message ?? "Internal Server Error",
    };
  }
}

export default function AdminDoctors() {
  const response = useLoaderData() as ApiResponse;
  const { Dokter: doctors } = response.data;
  return (
    <>
      <a
        href="/admin/dokter/create"
        className="ms-auto mb-6 flex w-fit items-center gap-2 rounded-lg bg-green-600 py-2 ps-2 pe-4 text-white"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Tambah</span>
      </a>
      <section className="flex flex-col flex-wrap justify-center gap-5 py-4 min-md:flex-row">
        {doctors.length > 0 ? (
          doctors.map((doctor, index) => (
            <div
              className="flex flex-col items-center justify-between gap-4"
              key={index}
            >
              <div className="flex-1">
                <DoctorCard
                  name={doctor.nama}
                  specialty={doctor.poli.nama_poli}
                  image={doctor.gambar}
                />
              </div>
              <div className="flex flex-none justify-center gap-0.5">
                <a
                  href={`/admin/dokter/edit/${doctor.id_dokter}`}
                  className="block w-min rounded bg-green-600 p-2 text-white hover:underline"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </a>
                <Form
                  method="delete"
                  className="block h-min rounded bg-red-600 p-2 text-white hover:underline"
                >
                  <input
                    type="hidden"
                    name="id_dokter"
                    value={doctor.id_dokter}
                  />
                  <button className="cursor-pointer">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </Form>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">{response.message}</p>
        )}
      </section>
    </>
  );
}
