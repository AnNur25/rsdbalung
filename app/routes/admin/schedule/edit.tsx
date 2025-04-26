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

import { Form } from "react-router";
import type { Route } from "./+types/create";
import { useState } from "react";
import axios from "axios";
import type { Poli, PoliApiResponse } from "~/routes/schedule";
import type { Doctor } from "~/routes/doctors";
import type { Pelayanan } from "../services";

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

    console.log(doctorScheduleRes.data.data);

    return {
      response: doctorScheduleRes.data.data.dokter,
      layananList: pelayananResponse.data.data,
    };
  } catch (error: any) {
    return error;
  }
}

export async function action({ request }: Route.ActionArgs) {
  const urlRequest = new URL("https://rs-balung-cp.vercel.app/jadwal-dokter/");
  const formData = await request.formData();
  console.log("action form", formData);
  let data = {
    id_dokter: formData.get("id_dokter"),
    layananList: [
      {
        id_pelayanan: formData.get("id_pelayanan"),
        hariList: [
          {
            hari: formData.get("hari"),
            jam_mulai: formData.get("jam_mulai"),
            jam_selesai: formData.get("jam_selesai"),
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(urlRequest.href, data);
    console.log("action res", response);
  } catch (error: any) {
    console.error("action err", error);
  }
}

export default function EditSchedule({ loaderData }: Route.ComponentProps) {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

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

  const schedules = response.layananList.flatMap((layanan) =>
    layanan.jadwal.map((hari) => ({
      id_pelayanan: layanan.id_pelayanan,
      layanan: layanan.nama_pelayanan,
      hari: hari.hari,
      jam_mulai: hari.jam_mulai,
      jam_selesai: hari.jam_selesai,
    })),
  );

  console.log(schedules);

  return (
    <>
      <Form method="post">
        <select required name="id_dokter">
          <option value={response.id_dokter}>{response.nama_dokter}</option>
        </select>
        {schedules.map((schedule, index) => (
          <div key={index} className="flex">
            <select value={schedule.hari} required name="hari" id="hari">
              {days.map((day, index) => (
                <option key={index} value={day}>
                  {day}
                </option>
              ))}
            </select>

            <input type="time" name="jam_mulai" value={schedule.jam_mulai} />
            <input
              type="time"
              name="jam_selesai"
              value={schedule.jam_selesai}
            />

            <select value={schedule.id_pelayanan} required name="id_pelayanan">
              {layananList.map((layanan, index) => (
                <option key={index} value={layanan.id_pelayanan}>
                  {layanan.nama_pelayanan}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button>Simpan</button>
      </Form>
    </>
  );
}
