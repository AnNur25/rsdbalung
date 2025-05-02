import axios from "axios";
import { handleLoader } from "~/utils/handleLoader";
import type { Route } from "./+types/doctor-detail";
import type { DokterSchedule } from "~/models/Schedule";
import type { Doctor } from "~/models/Doctor";
import LinkedinIcon from "~/components/LinkedinIcon";
import FacebookIcon from "~/components/FacebookIcon";
import InstagramIcon from "~/components/InstagramIcon";
import imageErrorHandler from "~/utils/imageErrorHandler";
import Table from "~/components/Table";
import DoctorCard from "~/components/DoctorCard";

export async function loader({ params }: Route.LoaderArgs) {
  const doctorRequest = new URL(
    `https://rs-balung-cp.vercel.app/dokter/${params.id}`,
  );
  const doctorResponse = await handleLoader(() =>
    axios.get(doctorRequest.href),
  );
  const allDoctorRequest = new URL(`https://rs-balung-cp.vercel.app/dokter/`);
  const allDoctorResponse = await handleLoader(() =>
    axios.get(allDoctorRequest.href),
  );
  const doctorScheduleRequest = new URL(
    `https://rs-balung-cp.vercel.app/jadwal-dokter/${params.id}`,
  );
  const doctorScheduleResponse = await handleLoader(() =>
    axios.get(doctorScheduleRequest.href),
  );

  const data = {
    doctor: doctorResponse.data.dokter,
    doctors: allDoctorResponse.data.Dokter,
    schedules: doctorScheduleResponse.data.dokter,
  };

  return {
    success: doctorResponse.success && doctorScheduleResponse.success,
    message: "Selesai mendapatkan data",
    data,
  };
}

export default function DoctorDetail({ loaderData }: Route.ComponentProps) {
  const headers = ["No", "Dokter", "Layanan", "Hari", "Jam", "Sesi"];
  const doctor: Doctor = loaderData.data.doctor;
  const doctors: Doctor[] = loaderData.data.doctors || [];
  const schedules: DokterSchedule = loaderData.data.schedules || {};

  const flattenedSchedules =
    schedules.layananList?.map((layanan) => ({
      id_dokter: schedules.id_dokter,
      nama_dokter: schedules.nama_dokter,
      gambar_dokter: schedules.gambar_dokter,
      poli: schedules.poli.nama_poli,
      layanan: layanan.nama_pelayanan,
      jadwal: layanan.jadwal,
    })) || [];
  console.log(flattenedSchedules);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center gap-8 p-8 min-md:flex-row">
          <div className="flex w-fit flex-col items-center">
            <img
              onError={imageErrorHandler}
              className="aspect-[9/12] h-auto w-full rounded-sm object-cover min-md:w-64"
              src={doctor.gambar}
              alt={`Foto ${doctor.nama}`}
            />
            <div className="flex w-fit flex-col items-center">
              <p className="font-semibold text-gray-700">Profil Dokter</p>
              <div className="flex">
                <LinkedinIcon iconSize={42} className={"text-gray-500 hover:text-blue-900"} />
                <FacebookIcon iconSize={42} className={"text-gray-500 hover:text-blue-900"} />
                <InstagramIcon iconSize={42}
                  className={"text-gray-500 hover:text-blue-900"}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="bg-gradient-to-l from-blue-300 to-blue-950 bg-clip-text text-justify text-2xl font-bold text-transparent">
              {doctor.nama}
            </h1>
            <p className="bg-gradient-to-l from-blue-300 to-blue-950 bg-clip-text text-lg font-semibold text-transparent uppercase">
              {doctor.poli.nama_poli}
            </p>
            <hr className="border- my-4 w-full border-dashed border-gray-700" />
            <p>Biodata Singkat</p>
            <p className="text-justify text-gray-700">
              {doctor.biodata_singkat}
            </p>
            <hr className="border- my-4 w-full border-dashed border-gray-700" />
            <p>Jadwal Praktek</p>
            <p className="text-sm text-red-600">
              *Jadwal dapat berubah sewaktu-waktu
            </p>
            <section className="max-w-[90vw] overflow-auto">
              <Table headers={headers}>
                {/* {flattenedSchedules.jadwal.map((jadwal, jIndex) => (
            <tr key={index} className={alternatingRowColor}>
            {jIndex === 0 && (
                <>
                <td
                rowSpan={doctor.jadwal.length}
                className="w-min border border-gray-300 px-4 py-2 text-center"
                >
                {index + 1}
                </td>
                <td
                rowSpan={doctor.jadwal.length}
                className="border border-gray-300 px-4 py-2"
                >
                {doctor.dokter}
                </td>
                <td
                rowSpan={doctor.jadwal.length}
                className="border border-gray-300 px-4 py-2"
                >
                {doctor.poli}
                </td>
                </>
                )}
                <td className="border border-gray-300 px-4 py-2">
                {jadwal.hari}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                {jadwal.jam_mulai} - {jadwal.jam_selesai}
                </td>
                <td className="border border-gray-300 px-4 py-2 capitalize">
                {jadwal.sesi}
                </td>
                </tr>
                ))} */}
              </Table>
            </section>
          </div>
        </div>
        <section className="flex flex-col flex-wrap items-center justify-center gap-10 p-6 min-md:flex-row">
          {doctors.length > 0 ? (
            doctors.map((doctor, index) => (
              <div className="relative w-min">
                <DoctorCard
                  id={doctor.id_dokter}
                  key={index}
                  name={doctor.nama}
                  specialty={doctor.poli.nama_poli}
                  image={doctor.gambar}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">Tidak ada data</p>
          )}
        </section>
      </div>
    </>
  );
}
