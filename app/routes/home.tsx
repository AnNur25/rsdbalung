import type { Route } from "./+types/home";
import MapsEmbed from "~/components/MapsEmbed";
import axios from "axios";
import { useEffect, useState } from "react";
import Footer from "~/components/Footer";
import Dropdown from "~/components/Dropdown";
import Banner from "~/components/Banner";
import InstagramEmbed from "~/components/InstagramEmbed";
import SelectExample from "~/components/SelectExample";
import NewsCard from "~/components/NewsCard";
import banner from "~/assets/rsdbalung.jpeg";
import YoutubeEmbed from "~/components/YoutubeEmbed";
import DoctorCard from "~/components/DoctorCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rumah Sakit Daerah Balung" },
    {
      name: "description",
      content: "Selamat Datang Di Website Rumah Sakit Daerah Balung!",
    },
  ];
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const cards = [
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
    "duabelas",
  ].map((title) => ({
    title: `Judul Berita ${title} Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.`,
    description: `Description ${title} lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.`,
    image: banner,
    date: new Date().toLocaleDateString(),
  }));
  useEffect(() => {
    console.log("Home");
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/app/");
        console.log(response);
        setMessage(response.data.message);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Error fetching data");
        setLoading(false);
      }
    };
  }, []);

  return (
    <>
      <Banner />

      <section className="p-5 lg:p-10">
        <h2 className="text-2xl font-extrabold uppercase lg:text-3xl">
          Berita
        </h2>
        <p className="text-justify text-sm text-gray-600 lg:text-lg">
          Dapatkan informasi seputar kesehatan, layanan terbaru, dan informasi
          menarik lainnya.
        </p>
        <div className="overflow-x-scroll">
          <div className="flex w-max">
            {cards.map((card) => (
              <NewsCard
                title={card.title}
                description={card.description}
                image={card.image}
                date={card.date}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sky-200">
        <div className="p-5 lg:p-10">
          <h2 className="text-2xl font-extrabold uppercase lg:text-3xl">
            Instagram
          </h2>
          <p className="text-justify text-sm text-gray-700 lg:text-lg">
            Selalu dapatkan berita terbaru seputar kesehatan, event, dan edukasi
            medis langsung dari Instagram resmi kami. Dapatkan informasi
            bermanfaat, tips kesehatan, serta update layanan terbaru yang bisa
            membantu Anda dan keluarga menjalani hidup lebih sehat. Follow
            sekarang dan tetap update!
          </p>
        </div>
        <div className="flex gap-2 overflow-x-scroll bg-sky-800 p-4">
          <InstagramEmbed url="https://www.instagram.com/p/DGufjWWzR46/" />
          <InstagramEmbed url="https://www.instagram.com/p/DGufjWWzR46/" />
        </div>
      </section>
      <h2 className="mt-4 mb-2 text-center text-2xl font-extrabold uppercase lg:text-3xl">
        Maps
      </h2>
      <MapsEmbed />

      <p className="m-4 rounded-md bg-sky-200 p-4 text-center text-xs lg:text-sm">
        Jl. Rambipuji, Kebonsari, Balung Lor, Kec. Balung, Jember, Jawa Timur
        68161
      </p>

      <p className="m-4 rounded-md bg-sky-200 p-4 text-center text-sm">
        rsd.balung@jemberkab.go.id
      </p>

      <DoctorCard name="Dr. John Doe" specialty="Bedah" image={banner} />
      {/* <YoutubeEmbed videoId="_IBj20ojJnU" /> */}

      <Footer />
    </>
  );
}
