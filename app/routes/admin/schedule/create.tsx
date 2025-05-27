// {
//   "id_dokter": 101,
//   "layananList": [
//     {
//       "id_pelayanan": 201,
//       "hariList": [
//         {
//           "hari": "Senin",
//           "jam_mulai": "08:00",
//           "jam_selesai": "12:00"
//         }
//       ]
//     }
//   ]
// }

// get poli
// get dokter
// filter dokter by poli id
// get layanan

import { Form, useFetcher, useNavigate } from "react-router";
import type { Route } from "./+types/create";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import type { Poli } from "~/models/Poli";
import type { Doctor } from "~/models/Doctor";
import type { Pelayanan } from "~/models/Pelayanan";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { handleAction } from "~/utils/handleAction";
import { handleLoader } from "~/utils/handleLoader";
import { isSuccess } from "~/utils/extractResponses";

export async function loader({ params }: Route.LoaderArgs) {
  const poliRequest = new URL(`${import.meta.env.VITE_API_URL}/poli/`);
  const doctorRequest = new URL(
    `${import.meta.env.VITE_API_URL}/dokter?pageSize=999`,
  );
  const pelayananRequest = new URL(
    `${import.meta.env.VITE_API_URL}/pelayanan/`,
  );

  const poliResponse = await handleLoader(() => axios.get(poliRequest.href));
  const doctorResponse = await handleLoader(() =>
    axios.get(doctorRequest.href),
  );
  const pelayananResponse = await handleLoader(() =>
    axios.get(pelayananRequest.href),
  );

  const responseSuccess = isSuccess([
    poliResponse,
    doctorResponse,
    pelayananResponse,
  ]);

  const data = {
    poli: poliResponse.data,
    doctors: doctorResponse.data.Dokter,
    layananList: pelayananResponse.data,
  };

  return {
    success: responseSuccess ?? false,
    message: "Selesai mendapatkan data",
    data,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/jadwal-dokter/`);
  const formData = await request.formData();
  console.log("action form", formData);

  const idDokter = formData.get("id_dokter") as string;
  const hariList = formData.getAll("hari") as string[];
  const jamMulaiList = formData.getAll("jam_mulai") as string[];
  const jamSelesaiList = formData.getAll("jam_selesai") as string[];
  const idPelayananList = formData.getAll("id_pelayanan") as string[];

  const layananMap = new Map<
    string,
    {
      id_pelayanan: string;
      hariList: { hari: string; jam_mulai: string; jam_selesai: string }[];
    }
  >();

  for (let i = 0; i < idPelayananList.length; i++) {
    const idPelayanan = idPelayananList[i];
    const hari = hariList[i];
    const jamMulai = jamMulaiList[i];
    const jamSelesai = jamSelesaiList[i];

    if (!layananMap.has(idPelayanan)) {
      layananMap.set(idPelayanan, {
        id_pelayanan: idPelayanan,
        hariList: [],
      });
    }

    layananMap.get(idPelayanan)!.hariList.push({
      hari,
      jam_mulai: jamMulai,
      jam_selesai: jamSelesai,
    });
  }

  const data = {
    id_dokter: idDokter,
    layananList: Array.from(layananMap.values()),
  };
  return handleAction(() => axios.post(urlRequest.href, data));
}

type ScheduleItem = {
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  id_pelayanan: string;
  layanan: string;
};

export default function CreateSchedule({ loaderData }: Route.ComponentProps) {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const [selectedPoli, setSelectedPoli] = useState<string>("");
  const { poli, doctors, layananList } = loaderData.data as {
    poli: Poli[];
    doctors: Doctor[];
    layananList: Pelayanan[];
  };

  // console.log(loaderData);

  const doctorsByPoli = doctors.filter(
    (doctor) => doctor.poli.id_poli === selectedPoli,
  );

  const [schedules, setSchedules] = useState([
    {
      hari: "",
      jam_mulai: "07:00",
      jam_selesai: "07:00",
      id_pelayanan: "",
      layanan: "",
    },
  ]);

  const handleAddSchedule = () => {
    setSchedules([
      ...schedules,
      {
        hari: "",
        jam_mulai: "07:00",
        jam_selesai: "07:00",
        id_pelayanan: "",
        layanan: "",
      },
    ]);
  };
  const handleRemoveSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof ScheduleItem,
    value: string,
  ) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const navigate = useNavigate();
  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };
  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
        setTimeout(() => {
          navigate("/admin/jadwal-dokter");
        }, 2000);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);
  return (
    <>
      {!selectedPoli ? (
        // Select Poli
        <>
          <h1 className="w-max text-2xl font-bold uppercase">
            Poli Jadwal Praktek
          </h1>

          <p className="mt-1 text-gray-600">
            Silakan pilih poli/klinik untuk melihat atau mengelola jadwal
            praktek
          </p>
          <div className="mt-4 w-full rounded-xl border-1 border-gray-300 p-8 shadow-xl">
            <div className="grid w-full grid-cols-1 gap-8 min-md:grid-cols-3">
              {poli.map((poli, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedPoli(poli.id_poli)}
                  className="min-h-36 rounded-2xl bg-sky-800 p-6 text-white"
                >
                  {poli.nama_poli}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        // Form Create
        <>
          <h1 className="mb-6 text-2xl font-bold uppercase">
            Form Pengisian Jadwal Praktek
          </h1>
          <div className="mb-4 rounded-xl border border-gray-300 p-4 text-sm shadow-lg">
            <fetcher.Form method="post" encType="multipart/form-data">
              <div className="mb-4 flex flex-col">
                <label htmlFor="id_dokter" className="text-lg font-bold">
                  Nama Dokter <span className="text-red-600">*</span>
                </label>
                <select
                  required
                  name="id_dokter"
                  id="id_dokter"
                  className={`${
                    fetcherData.message && !fetcherData.success
                      ? "border-red-500 focus:outline-red-500"
                      : "border-gray-300 focus:outline-blue-500"
                  } w-full rounded border border-gray-300 p-2`}
                >
                  {doctorsByPoli.map((doctor, index) => (
                    <option key={index} value={doctor.id_dokter}>
                      {doctor.nama}
                    </option>
                  ))}
                </select>
              </div>
              {/* Jadwal Row */}
              <div className="mb-4">
                {schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex h-min w-full flex-col items-start gap-2 max-md:mb-3 min-md:flex-row"
                  >
                    <div className="mb-4 flex w-full flex-col min-md:flex-3">
                      <label htmlFor="hari" className="text-lg font-bold">
                        Hari <span className="text-red-600">*</span>
                      </label>
                      <select
                        className={`${
                          fetcherData.message && !fetcherData.success
                            ? "border-red-500 focus:outline-red-500"
                            : "border-gray-300 focus:outline-blue-500"
                        } w-full rounded border border-gray-300 p-2`}
                        value={schedule.hari}
                        required
                        id="hari"
                        name="hari"
                        onChange={(e) =>
                          handleChange(index, "hari", e.target.value)
                        }
                      >
                        {days.map((day, index) => (
                          <option key={index} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4 flex w-full flex-col min-md:flex-2">
                      <label htmlFor="jam_mulai" className="text-lg font-bold">
                        Jam <span className="text-red-600">*</span>
                      </label>
                      <div className="flex items-center">
                        <input
                          className={`${
                            fetcherData.message && !fetcherData.success
                              ? "border-red-500 focus:outline-red-500"
                              : "border-gray-300 focus:outline-blue-500"
                          } w-full rounded border border-gray-300 p-2`}
                          type="time"
                          id="jam_mulai"
                          name="jam_mulai"
                          onChange={(e) =>
                            handleChange(index, "jam_mulai", e.target.value)
                          }
                          value={schedule.jam_mulai}
                        />
                        <span className="mx-1 p-1 font-semibold">s.d.</span>
                        <input
                          className={`${
                            fetcherData.message && !fetcherData.success
                              ? "border-red-500 focus:outline-red-500"
                              : "border-gray-300 focus:outline-blue-500"
                          } w-full rounded border border-gray-300 p-2`}
                          type="time"
                          id="jam_selesai"
                          name="jam_selesai"
                          onChange={(e) =>
                            handleChange(index, "jam_selesai", e.target.value)
                          }
                          value={schedule.jam_selesai}
                        />
                      </div>
                    </div>
                    <div className="mb-4 flex w-full flex-col min-md:flex-3">
                      <label
                        htmlFor="id_pelayanan"
                        className="text-lg font-bold"
                      >
                        Layanan <span className="text-red-600">*</span>
                      </label>
                      <select
                        className={`${
                          fetcherData.message && !fetcherData.success
                            ? "border-red-500 focus:outline-red-500"
                            : "border-gray-300 focus:outline-blue-500"
                        } w-full rounded border border-gray-300 p-2`}
                        value={schedule.id_pelayanan}
                        required
                        id="id_pelayanan"
                        name="id_pelayanan"
                        onChange={(e) =>
                          handleChange(index, "id_pelayanan", e.target.value)
                        }
                      >
                        {layananList.map((layanan, index) => (
                          <option key={index} value={layanan.id_pelayanan}>
                            {layanan.nama_pelayanan}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Add / Remove Buttons */}
                    <div className="flex w-full gap-2 self-center min-md:mt-2 min-md:w-fit">
                      {index == 0 ? (
                        <button
                          type="button"
                          onClick={handleAddSchedule}
                          className="h-fit w-full rounded-md bg-green-500 p-2 text-white hover:bg-green-600 min-md:w-fit"
                        >
                          <PlusIcon className="h-4 w-full min-md:w-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemoveSchedule(index)}
                          className="h-fit w-full rounded-md bg-red-500 p-2 text-white hover:bg-red-600 min-md:w-fit"
                        >
                          <MinusIcon className="h-4 w-full min-md:w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {fetcherData.message && (
                  <p
                    className={`text-sm ${
                      fetcherData.success ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {fetcherData.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/jadwal-dokter")}
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Batal
                </button>
              </div>
            </fetcher.Form>
          </div>
        </>
      )}
    </>
  );
}
