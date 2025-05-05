import axios from "axios";
import { useLoaderData } from "react-router";
import type { PelayananDetail } from "~/models/Pelayanan";
import formatDigits from "~/utils/formatDigits";

interface LayananDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PelayananDetail;
}

export async function loader({
  params,
}: {
  params: { id: string };
}): Promise<LayananDetailResponse> {
  const { id } = params;
  const pelayananRequest = new URL(
    `https://rs-balung-cp.vercel.app/pelayanan/${id}`,
  );
  try {
    const response = await axios.get<LayananDetailResponse>(
      pelayananRequest.href,
    );
    if (!response.data.success) {
      response.data.data = {} as PelayananDetail;
    }
    return response.data;
  } catch (error: any) {
    // console.error("Error fetching data:", error.response);
    return {
      success: false,
      statusCode: error.response?.status ?? 500,
      message: "Failed to fetch data",
      data: {} as PelayananDetail,
    };
  }
}

export default function LayananDetail() {
  const data = useLoaderData() as LayananDetailResponse;
  const {
    id_pelayanan,
    nama_pelayanan,
    Persyaratan,
    Prosedur,
    JangkaWaktu,
    Biaya,
  } = data.data;
  return (
    <main className="mx-auto my-6 mt-4 lg:max-w-3/4">
      <h1 className="text-center text-3xl font-bold uppercase">
        {nama_pelayanan}
      </h1>

      {/* Jangka Waktu & Biaya  */}
      <div className="m-4 mx-auto flex flex-col gap-4 px-4 min-md:flex-row">
        <section className="h-fit flex-1 rounded-md text-center shadow-md">
          <h2 className="rounded-t-md bg-sky-700 p-1 text-lg font-bold text-white">
            Jangka Waktu
          </h2>
          <p className="h-min w-max p-2 px-8 text-center">{JangkaWaktu}</p>
        </section>
        <section className="h-fit flex-1 rounded-md text-center shadow-md">
          <h2 className="rounded-t-md bg-sky-700 p-1 text-lg font-bold text-white">
            Biaya
          </h2>
          <p className="mx-auto h-min w-max p-2 px-8 text-center">
            Rp{formatDigits(Biaya.toString())}
          </p>
        </section>
      </div>

      {/* Persyaratan */}
      <section className="mx-auto mt-4 max-w-9/10">
        <h2 className="text-xl font-bold text-persian-blue-950">Persyaratan</h2>
        <ol className="ms-8 list-decimal text-justify">
          {Persyaratan.split(",")
            .map((item) => item.trim())
            .map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          {/* <li>
            Kartu Identitas - KTP/SIM/Kartu Pelajar sebagai bukti identitas
            pasien.
          </li>
          <li>
            Kartu Pasien - Jika sudah pernah berobat di rumah sakit tersebut.
            Jika belum, perlu mendaftar terlebih dahulu.
          </li>
          <li>
            Kartu BPJS/KIS atau Asuransi Kesehatan - Jika menggunakan layanan
            BPJS atau asuransi swasta.
          </li>
          <li>
            Surat Rujukan - Jika pasien berasal dari fasilitas kesehatan tingkat
            pertama (puskesmas/klinik) atau dokter yang merujuk ke rawat inap
            (khusus BPJS).
          </li>
          <li>
            Hasil Pemeriksaan Dokter - Surat atau catatan medis dari dokter yang
            menyatakan perlunya rawat inap.
          </li>
          <li>
            Bukti Pembayaran Awal - Jika pasien menggunakan jalur umum atau
            asuransi dengan sistem deposit.
          </li>
          <li>
            Rekam Medis Sebelumnya - Jika pasien memiliki riwayat penyakit yang
            perlu diperhatikan selama perawatan.
          </li>
          <li>
            Surat Pernyataan atau Persetujuan Rawat Inap - Ditandatangani oleh
            pasien atau keluarga sebagai persetujuan tindakan medis.
          </li>
          <li>
            Surat Kuasa/Keterangan dari Keluarga - Jika pasien dalam kondisi
            tidak sadar atau tidak bisa memberikan persetujuan sendiri.
          </li> */}
        </ol>
      </section>

      {/* Prosedur */}
      <section className="mx-auto mt-4 max-w-9/10">
        <h2 className="text-xl font-bold text-persian-blue-950">Prosedur</h2>
        <ol className="ms-8 list-decimal text-justify">
          {Prosedur.split(",")
            .map((item) => item.trim())
            .map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          {/* <li>Pasien atau keluarga datang ke loket pendaftaran rawat inap.</li>
          <li>Menyerahkan kartu identitas dan kartu pasien (jika ada).</li>
          <li>
            Jika menggunakan BPJS/asuransi, menyerahkan kartu dan surat rujukan.
          </li>
          <li>
            Membayar biaya administrasi awal jika menggunakan jalur
            umum/asuransi tertentu.
          </li>
          <li>Menandatangani surat persetujuan rawat inap.</li>
          <li>
            Petugas menentukan ruang perawatan dan mengantar pasien ke kamar.
          </li>
          <li>
            Dokter dan perawat melakukan pemeriksaan awal serta memberikan
            perawatan sesuai kebutuhan.
          </li>
          <li>
            Jika diperlukan tindakan medis tambahan, pasien akan diarahkan
            sesuai instruksi dokter.
          </li>
          <li>
            Setelah kondisi membaik dan diizinkan pulang, keluarga menyelesaikan
            administrasi akhir.
          </li>
          <li>
            Pasien menerima ringkasan medis, resep obat (jika ada), dan jadwal
            kontrol (jika diperlukan).
          </li> */}
        </ol>
      </section>
    </main>
  );
}
