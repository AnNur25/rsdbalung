import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useLoaderData } from "react-router";
import DoctorCard from "~/components/DoctorCard";
import type { Doctor } from "~/routes/doctors";

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

  try {
    const response = await axios.get(urlRequest.href);

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

export default function AdminDoctors() {
  const response = useLoaderData() as ApiResponse;
  const { Dokter: doctors } = response.data;
  return (
    <>
      <section className="flex flex-col flex-wrap justify-center gap-6 p-4 min-md:flex-row">
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
                  href={`/admin/news/edit/${doctor.id_dokter}`}
                  className="block w-min rounded bg-green-600 p-2 text-white hover:underline"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </a>
                <a className="block w-min rounded bg-red-600 p-2 text-white hover:underline">
                  <TrashIcon className="h-5 w-5" />
                </a>
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
