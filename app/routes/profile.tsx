import type { Route } from "./+types/profile";
import logo from "~/assets/logoonly.png";
import strukturImg from "~/assets/struktur-organisasi.png";
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
      <div className="mx-auto my-4 w-fit rounded-full border-2 bg-white p-8">
        <img className="w-20" src={logo} alt="Logo Rumah Sakit Daerah Balung" />
      </div>

      <section className="my-8 ">
        <h2 className="text-center text-2xl font-bold">Struktur Organisasi</h2>
        <img
          className="mx-auto p-4 lg:max-w-3/4"
          src={strukturImg}
          alt="Struktur Organisasi"
        />
      </section>

      <section className="my-8 ">
        <h2 className="text-center text-2xl font-bold">Sejarah</h2>
        <p className="mx-auto p-4 lg:max-w-3/4">
          Rumah Sakit Daerah Balung adalah rumah sakit yang berada di Jember,
          Jawa Timur. Berdiri pada tahun 1984, rumah sakit ini memiliki
          fasilitas dan pelayanan kesehatan yang lengkap untuk masyarakat Jember
          dan sekitarnya.
        </p>
      </section>

      <section className="my-8 ">
        <h2 className="text-center text-2xl font-bold">Visi</h2>
        <p className="mx-auto p-4 lg:max-w-3/4">
          Menjadi rumah sakit yang unggul dalam pelayanan kesehatan dan
          pelayanan publik.
        </p>
      </section>

      <section className="my-8 ">
        <h2 className="text-center text-2xl font-bold">Misi</h2>
        <ol className="mx-auto list-decimal p-4 lg:max-w-3/4">
          <li>Memberikan pelayanan kesehatan yang bermutu.</li>
          <li>Menyelenggarakan pelayanan kesehatan yang berkesinambungan.</li>
          <li>Menyelenggarakan pelayanan kesehatan yang berkeadilan.</li>
          <li>
            Menyelenggarakan pelayanan kesehatan yang berwawasan lingkungan.
          </li>
        </ol>
      </section>
    </>
  );
}
