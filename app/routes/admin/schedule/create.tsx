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

import { Form } from "react-router";
import type { Route } from "./+types/create";
import { useState } from "react";
import axios from "axios";
import type { Poli, PoliApiResponse } from "~/routes/schedule";
import type { Doctor } from "~/routes/doctors";
import type { Pelayanan } from "../services";

export async function loader({ params }: Route.LoaderArgs) {
  const poliRequest = new URL(`https://rs-balung-cp.vercel.app/poli/`);
  const doctorRequest = new URL(
    `https://rs-balung-cp.vercel.app/dokter?pageSize=999`,
  );
  const pelayananRequest = new URL(
    `https://rs-balung-cp.vercel.app/pelayanan/`,
  );

  try {
    const [poliResponse, doctorResponse, pelayananResponse] = await Promise.all(
      [
        axios.get(poliRequest.href),
        axios.get(doctorRequest.href),
        axios.get(pelayananRequest.href),
      ],
    );

    if (!poliResponse.data.success) {
      poliResponse.data.data = [];
    }

    return {
      poli: poliResponse.data.data,
      doctors: doctorResponse.data.data.Dokter,
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

export default function CreateSchedule({ loaderData }: Route.ComponentProps) {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const [selectedPoli, setSelectedPoli] = useState<string>("");

  const { poli, doctors, layananList } = loaderData as {
    poli: Poli[];
    doctors: Doctor[];
    layananList: Pelayanan[];
  };

  const doctorsByPoli = doctors.filter(
    (doctor) => doctor.poli.id_poli === selectedPoli,
  );

  return (
    <>
      {!selectedPoli ? (
        // Select Poli

        <div className="flex flex-wrap gap-2">
          {poli.map((poli, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedPoli(poli.id_poli)}
              className="w-1/5 truncate bg-persian-blue-950 p-6 text-white"
            >
              {poli.nama_poli}
            </button>
          ))}
        </div>
      ) : (
        // Form Create

        <Form method="post">
          {/* Select Dokter */}
          <select required name="id_dokter">
            {doctorsByPoli.map((doctor, index) => (
              <option key={index} value={doctor.id_dokter}>
                {doctor.nama}
              </option>
            ))}
          </select>

          <select required name="hari" id="hari">
            {days.map((day, index) => (
              <option key={index} value={day}>
                {day}
              </option>
            ))}
          </select>

          <input type="time" name="jam_mulai" id="jam_mulai" />
          <input type="time" name="jam_selesai" id="jam_mulai" />

          <select required name="id_pelayanan">
            {layananList.map((layanan, index) => (
              <option key={index} value={layanan.id_pelayanan}>
                {layanan.nama_pelayanan}
              </option>
            ))}
          </select>

          <button>Simpan</button>
        </Form>
      )}
    </>
  );
}
