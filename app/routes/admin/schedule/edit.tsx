// {
//   id_dokter: "d5c02314-f01d-424c-9cd2-4c6152f0e758",
//   nama_dokter: "test",
//   gambar_dokter: "https://ik.imagekit.io/ena3eh2k0/Cat_Illust_CSpvlVvJA.jpg",
//   poli: {
//     id_poli: "95d1f57c-01cf-49f3-bb6c-32a5dba8f300",
//     nama_poli: "Poli Spesialis Penyakit Dalam",
//   },
//   layananList: [[Object]],
// }
// get poli
// get dokter
// filter dokter by poli id
// get layanan

import { Form, useNavigate } from "react-router";
import type { Route } from "./+types/create";
import { useState } from "react";
import axios from "axios";
import type { Poli } from "~/models/Poli";
import type { Doctor } from "~/models/Doctor";
import type { Pelayanan } from "~/models/Pelayanan";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

export async function loader({ params }: Route.LoaderArgs) {
  const doctorId = params.id;
  const doctorScheduleReq = new URL(
    `https://rs-balung-cp.vercel.app/jadwal-dokter/${doctorId}`,
  );
  const pelayananRequest = new URL(
    "https://rs-balung-cp.vercel.app/pelayanan/",
  );

  try {
    const [doctorScheduleRes, pelayananResponse] = await Promise.all([
      axios.get(doctorScheduleReq.href),
      axios.get(pelayananRequest.href),
    ]);

    // console.log(doctorScheduleRes.data.data);

    return {
      response: doctorScheduleRes.data.data.dokter,
      layananList: pelayananResponse.data.data,
    };
  } catch (error: any) {
    return error;
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  // console.log("action form", formData);

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

  // console.log("values", layananMap.values());
  // console.log("layananMap", Array.from(layananMap.values()));
  const data = {
    id_dokter: idDokter,
    layananList: Array.from(layananMap.values()),
  };

  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/jadwal-dokter/${idDokter}`,
  );
  try {
    const response = await axios.put(urlRequest.href, data);
    // console.log("action res", response);
    // console.log("action res data", response.data);
  } catch (error: any) {
    // console.error("action err", error);
  }
  // let data = {
  //   id_dokter: formData.get("id_dokter"),
  //   layananList: [
  //     {
  //       id_pelayanan: formData.get("id_pelayanan"),
  //       hariList: [
  //         {
  //           hari: formData.get("hari"),
  //           jam_mulai: formData.get("jam_mulai"),
  //           jam_selesai: formData.get("jam_selesai"),
  //         },
  //       ],
  //     },
  //   ],
  // };
  // {
  //   id_dokter: "d5c02314-f01d-424c-9cd2-4c6152f0e758",
  //   hari: ["Senin", "Selasa", "Rabu"],
  //   jam_mulai: ["07:00", "07:00", "09:00"],
  //   jam_selesai: ["08:00", "08:00", "10:00"],
  //   id_pelayanan: [
  //     "427d9b56-e652-4f57-b700-235de5d24f2b",
  //     "fa732262-87a1-43ac-8c4b-5f37be6ee19c",
  //     "83332a3c-452a-4a3c-b89f-8602a72ea278",
  //   ],
  // }
}

type ScheduleItem = {
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  id_pelayanan: string;
  layanan: string;
};

export default function EditSchedule({ loaderData }: Route.ComponentProps) {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const navigate = useNavigate();
  const { response, layananList } = loaderData as {
    response: {
      id_dokter: string;
      nama_dokter: string;
      gambar_dokter: string;
      poli: {
        id_poli: string;
        nama_poli: string;
      };
      layananList: {
        id_pelayanan: string;
        nama_pelayanan: string;
        jadwal: {
          hari: string;
          sesi: string;
          jam_mulai: string;
          jam_selesai: string;
        }[];
      }[];
    };
    layananList: Pelayanan[];
  };

  const flattendSchedules = response.layananList.flatMap((layanan) =>
    layanan.jadwal.map((hari) => ({
      id_pelayanan: layanan.id_pelayanan,
      layanan: layanan.nama_pelayanan,
      hari: hari.hari,
      jam_mulai: hari.jam_mulai,
      jam_selesai: hari.jam_selesai,
    })),
  );
  const [schedules, setSchedules] = useState(flattendSchedules);

  // console.log(schedules);

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
    // setSchedules(schedules.splice(index));
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
  return (
    // Form Create
    <>
      <h1 className="mb-6 text-2xl font-bold uppercase">
        Form Pengisian Jadwal Praktek
      </h1>
      <div className="mb-4 rounded-xl border border-gray-300 p-4 text-sm shadow-lg">
        <Form method="post" encType="multipart/form-data">
          <div className="mb-4 flex flex-col">
            <label htmlFor="id_dokter" className="text-lg font-bold">
              Nama Dokter <span className="text-red-600">*</span>
            </label>
            <select
              required
              name="id_dokter"
              id="id_dokter"
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
            >
                <option  value={response.id_dokter}>
                  {response.nama_dokter}
                </option>
            </select>
          </div>
          {/* Jadwal Row */}
          {schedules.map((schedule, index) => (
            <div
              key={index}
              className="flex h-min w-full flex-col items-start gap-2 max-md:mb-6 min-md:flex-row"
            >
              <div className="mb-4 flex w-full flex-col min-md:flex-3">
                <label htmlFor="hari" className="text-lg font-bold">
                  Hari <span className="text-red-600">*</span>
                </label>
                <select
                  className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                  value={schedule.hari}
                  required
                  id="hari"
                  name="hari"
                  onChange={(e) => handleChange(index, "hari", e.target.value)}
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
                    className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
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
                    className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
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
                <label htmlFor="id_pelayanan" className="text-lg font-bold">
                  Layanan <span className="text-red-600">*</span>
                </label>
                <select
                  className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
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
        </Form>
      </div>
    </>
  );
  return (
    <>
      <Form method="put">
        <select required name="id_dokter">
          <option value={response.id_dokter}>{response.nama_dokter}</option>
        </select>
        {schedules.map((schedule, index) => (
          <div key={index} className="flex">
            <select
              required
              name="hari"
              value={schedule.hari}
              onChange={(e) => handleChange(index, "hari", e.target.value)}
            >
              {days.map((day, index) => (
                <option key={index} value={day}>
                  {day}
                </option>
              ))}
            </select>

            <input
              type="time"
              name="jam_mulai"
              onChange={(e) => handleChange(index, "jam_mulai", e.target.value)}
              value={schedule.jam_mulai}
            />
            <input
              type="time"
              name="jam_selesai"
              onChange={(e) =>
                handleChange(index, "jam_selesai", e.target.value)
              }
              value={schedule.jam_selesai}
            />

            <select
              value={schedule.id_pelayanan}
              required
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

            {/* Add / Remove Buttons */}
            <div className="col-span-2 flex gap-2">
              {index == 0 ? (
                <button
                  type="button"
                  onClick={handleAddSchedule}
                  className="h-fit w-fit rounded-md bg-green-500 p-2 text-white hover:bg-green-600"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRemoveSchedule(index)}
                  className="h-fit w-fit rounded-md bg-red-500 p-2 text-white hover:bg-red-600"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        <button>Simpan</button>
      </Form>
    </>
  );
}
