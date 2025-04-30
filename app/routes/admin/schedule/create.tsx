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

  try {
    const response = await axios.post(urlRequest.href, data);
    console.log("action res", response);
  } catch (error: any) {
    // console.error("action err", error);
  }
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

  const { poli, doctors, layananList } = loaderData as {
    poli: Poli[];
    doctors: Doctor[];
    layananList: Pelayanan[];
  };

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

          {schedules.map((schedule, index) => (
            <div key={index} className="flex">
              <select
                value={schedule.hari}
                required
                name="hari"
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
                onChange={(e) =>
                  handleChange(index, "jam_mulai", e.target.value)
                }
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
                    className="w-full rounded-md bg-green-500 p-2 text-white hover:bg-green-600"
                  >
                    +
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRemoveSchedule(index)}
                    className="w-full rounded-md bg-red-500 p-2 text-white hover:bg-red-600"
                  >
                    -
                  </button>
                )}
              </div>
            </div>
          ))}

          <button>Simpan</button>
        </Form>
      )}
    </>
  );
}
