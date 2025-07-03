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
import { alternatingRowColor } from "~/utils/styles";
import Slider from "~/components/Slider";
import PageBanner from "~/components/PageBanner";

export async function loader({ params }: Route.LoaderArgs) {
  const doctorRequest = new URL(
    `${import.meta.env.VITE_API_URL}/dokter/${params.id}`,
  );
  const doctorResponse = await handleLoader(() =>
    axios.get(doctorRequest.href),
  );
  const allDoctorRequest = new URL(
    `${import.meta.env.VITE_API_URL}/dokter?pageSize=8`,
  );
  const allDoctorResponse = await handleLoader(() =>
    axios.get(allDoctorRequest.href),
  );
  const doctorScheduleRequest = new URL(
    `${import.meta.env.VITE_API_URL}/jadwal-dokter/${params.id}`,
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
  const schedule: Doctor = loaderData.data.doctor;
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
      <PageBanner title="Detail Dokter" />
      <div className="flex flex-col">
        <div className="flex flex-col justify-center gap-8 p-8 min-md:flex-row">
          <div className="flex w-fit flex-col items-center">
            <img
              onError={imageErrorHandler}
              className="aspect-[9/12] h-auto w-full rounded-lg border-1 border-gray-300 object-cover min-md:w-64"
              src={schedule.gambar || "https://example.com"}
              alt={`Foto ${schedule.nama}`}
            />
            <div className="flex w-fit flex-col items-center">
              <p className="font-semibold text-gray-700">Profil Dokter</p>
              <div className="flex">
                <LinkedinIcon
                  iconSize={42}
                  className={"text-gray-500 hover:text-blue-900"}
                />
                <FacebookIcon
                  iconSize={42}
                  className={"text-gray-500 hover:text-blue-900"}
                />
                <InstagramIcon
                  iconSize={42}
                  className={"text-gray-500 hover:text-blue-900"}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="bg-gradient-to-l from-blue-300 to-blue-950 bg-clip-text text-justify text-2xl font-bold text-transparent">
              {schedule.nama}
            </h1>
            <p className="bg-gradient-to-l from-blue-300 to-blue-950 bg-clip-text text-lg font-semibold text-transparent uppercase">
              {schedule.poli.nama_poli}
            </p>
            <hr className="my-4 w-full border border-dashed border-gray-700" />
            <p>Biodata Singkat</p>
            <p className="text-justify text-gray-700">
              {schedule.biodata_singkat}
            </p>
            <hr className="my-4 w-full border border-dashed border-gray-700" />
            <p>Jadwal Praktek</p>
            <p className="text-sm text-red-600">
              *Jadwal dapat berubah sewaktu-waktu
            </p>
            <section className="max-w-[90vw] overflow-auto">
              <Table headers={headers}>
                {flattenedSchedules.map((schedule, index) =>
                  schedule.jadwal.map((j, jIndex) => (
                    <tr key={index} className={alternatingRowColor}>
                      {jIndex === 0 && (
                        <>
                          <td
                            rowSpan={schedule.jadwal.length}
                            className="w-min border border-gray-300 px-4 py-2 text-center"
                          >
                            {index + 1}
                          </td>
                          <td
                            rowSpan={schedule.jadwal.length}
                            className="border border-gray-300 px-4 py-2"
                          >
                            {schedule.nama_dokter}
                          </td>
                          <td
                            rowSpan={schedule.jadwal.length}
                            className="border border-gray-300 px-4 py-2"
                          >
                            {schedule.poli}
                          </td>
                        </>
                      )}
                      <td className="border border-gray-300 px-4 py-2">
                        {j.hari}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {j.jam_mulai} - {j.jam_selesai}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 capitalize">
                        {j.sesi}
                      </td>
                    </tr>
                  )),
                )}
              </Table>
            </section>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center p-4 px-8">
          <hr className="my-4 w-full border-1 border-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 uppercase">
            Dokter Spesialis Lainnya
          </h2>
        </div>
        {doctors.length > 0 && (
          <section className="px-8 py-4">
            <Slider>
              {doctors.map((doctor, index) => (
                <div className="relative mx-2 h-full w-min" key={index}>
                  <DoctorCard
                    id={doctor.id_dokter}
                    name={doctor.nama}
                    specialty={doctor.poli.nama_poli}
                    image={doctor.gambar}
                  />
                </div>
              ))}
            </Slider>
          </section>
        )}
      </div>
    </>
  );
}
