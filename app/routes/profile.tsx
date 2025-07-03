import type { Route } from "./+types/profile";
import PageBanner from "~/components/PageBanner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profil Rumah Sakit Daerah Balung" },
    {
      name: "description",
      content: "Selamat Datang Di Website Rumah Sakit Daerah Balung!",
    },
  ];
}

export default function Profile() {
  return (
    <>
      <PageBanner title="PROFIL RSD BALUNG" />
      <main className="mx-auto lg:max-w-3/4">
        <section className="my-8">
          <h2 className="text-center text-2xl font-bold uppercase">
            Struktur Organisasi
          </h2>
          <img
            loading="lazy"
            className="mx-auto p-4"
            src="/images/struktur.png"
            alt="Struktur Organisasi"
          />
        </section>

        {/* Sejarah */}
        <section className="m-6 rounded-md shadow-md">
          <h2 className="rounded-t-md bg-dark-blue-900 p-2 text-2xl font-bold text-white">
            Sejarah
          </h2>
          <article className="flex flex-col gap-2 p-4 text-justify">
            <p>
              Rumah Sakit Daerah (RSD) Balung diresmikan sebagai Rumah Sakit
              Kelas C oleh Bupati Jember pada tanggal 2 Januari 2002. RSD Balung
              berdiri di atas lahan seluas 2,19 Ha, 45% diantaranya berupa
              bangunan, baik medis, penunjang medis ataupun non medis. Saat ini
              melalui Pemerintah Kabupaten Jember sedang diupayakan penambahan
              lahan seluas 1,31 Ha sebagai upaya mengantisipasi Rencana
              Pengembangan sesuai Master Plan (Blok Plan) yang telah disusun.
            </p>
            <p>
              Peresmian Puskesmas Balung menjadi RSD Balung ini melengkapi
              perjalanan sejarah institusi pelayanan kesehatan Balung yang
              didirikan pada jaman kolonial Belanda tahun 1940 dengan nama
              ROEMAH SAKIT BALOENG dengan tenaga kesehatan mantri Mandagi tahun
              1940-1960, kemudian dr. One dan dr. Vigiani tahun 1965-1966.
              Seiring dengan perubahan pemerintahan, yaitu jatuhnya Orde Lama
              yang digantikan dengan pemerintahan Orde Baru, status institusi
              ini kemudian berubah menjadi Puskesmas Pembina sekitar awal tahun
              1970, dengan fungsi untuk melaksanakan pembinaan kesehatan
              masyarakat di desa sekaligus mendampingi berdirinya Puskesmas lain
              di Kabupaten Jember. Dokter yang bertugas pada saat itu dr. Tan
              Fik Tho / Tendean tahun 1966-1977, dr. Raharjo Sudarman tahun 1977
              (selama 3 bulan) dan dr. Djoko Setiyarjo tahun 1977-1979.
            </p>
            <p>
              Dengan berdirinya Puskesmas di kecamatan di seluruh wilayah
              kabupaten dalam kurun waktu 4 tahun, Puskesmas Pembina Balung ini
              berubah status menjadi Puskesmas Perawatan pada tahun 1979 dimana
              tenaga dokternya adalah dr. Gunawan tahun 1979-1986, dr. H. Yuni
              Ermita tahun 1986-1992, dr. H. Bambang Suwartono tahun 1992-1997
              dan dr. H. Moch. Husnan tahun 1997- 2001.
            </p>
            <p>
              Akhirnya Puskesmas Perawatan Balung berubah kembali menjadi Rumah
              Sakit Daerah Balung Kelas C pada awal tahun 2002. Keputusan
              meningkatkan status Puskesmas Balung menjadi Rumah SakitD aerah
              Balung Kelas C tidak lepas dari peluang pengembangan wilayah
              dengan adanya otonomi daerah. Penetapan status Puskesmas Balung
              menjadi Rumah Sakit Umum Daerah Balung Kelas C ditetapkan dalam
              Keputusan Menteri Kesehatan Republik Indonesia Nomor :
              931/Menkes/SK/VI/2003 pada tanggal 24 Juni 2003. Selanjutnya pada
              tanggal 4 Agustus 2003 Direktorat Jenderal Pelayanan Medik
              menetapkan Nomer Kode Rumah Sakit untuk Rumah Sakit Daerah Balung.
              Nomor : IR.01.01.1.1.2941 sebagai berikut :
            </p>
            <ol className="ms-4 list-decimal">
              <li>Nama: RSUD Balung</li>
              <li>Alamat: Kabupaten Jember Jawa Timur</li>
              <li>
                Rumah Sakit Modern: RSD Balung Kabupaten Jember akan menjadi
                rumah sakit yang menciptakan sistem dan fasilitas kesehatan yang
                sesuai dengan kebutuhan medik dalam melayani pasien.
              </li>
              <li>No. Kode: 35 09 1 34</li>
            </ol>
          </article>
        </section>

        {/* Visi dan Misi */}
        <div className="mx-auto flex flex-col gap-8 px-8 min-md:flex-row">
          {/* Visi */}
          <section className="flex flex-2 flex-col gap-4">
            <h2 className="text-2xl font-bold text-persian-blue-950">Visi</h2>
            <blockquote className="text-center">
              ”Terwujudnya Rumah Sakit Balung yang Prima, Profesional, dan
              Modern di Bidang Pelayanan Kesehatan”
            </blockquote>
            <article>
              <p>Visi tersebut dijelaskan sebagai berikut:</p>
              <ol className="ms-4 list-decimal text-justify">
                <li>
                  Rumah Sakit Prima : RSD Balung Kabupaten Jember menjadi rumah
                  sakit yang concern terhadap keselamatan pasien, K3RS
                  (kesehatan dan keselamatan kerja rumah sakit) dan pengendalian
                  lingkungan dalam menjalankan proses pelayanan kesehatan.
                </li>
                <li>
                  Rumah Sakit Profesional : RSD Balung Kabupaten Jember akan
                  menjadi rumah sakit memiliki Sumber Daya Manusia (SDM) yang
                  bekerja berdasarkan standar, etika dan profesi melalui
                  perspektif pembelajaran dan pertumbuhan.
                </li>
                <li>
                  Rumah Sakit Modern : RSD Balung Kabupaten Jember akan menjadi
                  rumah sakit yang menciptakan sistem dan fasilitas kesehatan
                  yang sesuai dengan kebutuhan medik dalam melayani pasien.
                </li>
                <li>
                  Bidang Pelayanan Kesehatan : RSD Balung Kabupaten Jember
                  menjadi layanan kesehatan yang berfokus pada pelayanan
                  kesehatan perorangan.
                </li>
              </ol>
            </article>
          </section>

          {/* Misi */}
          <section className="flex flex-1 flex-col gap-4">
            <h2 className="text-2xl font-bold text-persian-blue-950">Misi</h2>
            <ol className="ms-4 list-decimal text-justify">
              <li>Memberikan pelayanan kesehatan yang bermutu.</li>
              <li>
                Menyelenggarakan pelayanan kesehatan yang berkesinambungan.
              </li>
              <li>Menyelenggarakan pelayanan kesehatan yang berkeadilan.</li>
              <li>
                Menyelenggarakan pelayanan kesehatan yang berwawasan lingkungan.
              </li>
            </ol>
          </section>
        </div>
      </main>
    </>
  );
}
