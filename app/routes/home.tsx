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
import TextWithRect from "~/components/TextWithRect";
import ImageGradientCard from "~/components/ImageGradientCard";
import whatsAppIcon from "~/assets/whatsapp.svg";
import Slider from "~/components/Slider";
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
  ].map((title) => ({
    title: `Judul Berita ${title} Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.`,
    description: `Description ${title} lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.`,
    image: banner,
    date: new Date().toLocaleDateString(),
  }));
  useEffect(() => {
    console.log("Home");
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get("http://localhost:3001/app/");
    //     console.log(response);
    //     setMessage(response.data.message);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //     setMessage("Error fetching data");
    //     setLoading(false);
    //   }
    // };
  }, []);

  return (
    <>
      <Banner />

      <section className="mt-8 flex flex-col items-center">
        <TextWithRect>KAMI BERKOMITMEN</TextWithRect>
        <div className="grid grid-cols-1 gap-6 p-8 lg:max-w-2/3 lg:grid-cols-2 lg:grid-rows-2">
          {[
            {
              title: "Pelayanan Nyaman",
              description:
                "Didukung dengan fasilitas lengkap dan ruang perwatan yang bersih, memberikan kenyamanan maksimal bagi pasien.",
            },
            {
              title: "Tenaga Medis Profesional",
              description:
                "Tenaga medis kami terdiri dari dokter dan perawat berpengalaman yang siap memberikan pelayanan terbaik.",
            },
            {
              title: "Fasilitas Modern",
              description:
                "Kami menyediakan fasilitas modern untuk mendukung proses diagnosa dan pengobatan yang akurat.",
            },
            {
              title: "Pelayanan Cepat",
              description:
                "Proses administrasi dan pelayanan yang cepat untuk kenyamanan pasien.",
            },
          ].map((item, index) => (
            <article key={index} className="flex gap-4">
              <img
                src={whatsAppIcon}
                className="flex-inital aspect-square h-min rounded-full bg-yellow-400 p-2"
              />
              <div>
                <h2 className="text-xl font-bold text-persian-blue-950">
                  {item.title}
                </h2>
                <p className="text-justify text-gray-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center p-4 max-sm:gap-y-2 lg:flex-row lg:gap-x-4 lg:p-10">
        <div className="lg:flex-1">
          <TextWithRect>POLI MATA</TextWithRect>
          <h2 className="text-2xl font-black text-persian-blue-950 lg:text-4xl">
            Layanan Unggulan Kami
          </h2>

          <p className="text-justify text-sm text-gray-600 lg:text-lg">
            Poli Mata di RSD Balung merupakan layanan unggulan yang menghadirkan
            pelayanan kesehatan mata berkualitas dengan tenaga medis
            berpengalaman dan peralatan modern.
          </p>
        </div>

        <div className="bg-sky-0 w-full overflow-hidden lg:flex-2">
          <Slider>
            <ImageGradientCard />
            <ImageGradientCard />
            <ImageGradientCard />
            <ImageGradientCard />
          </Slider>
        </div>
      </section>

      <section className="flex flex-col items-center p-4 max-sm:gap-y-2 lg:flex-row lg:gap-x-4 lg:p-10">
        <div className="lg:flex-1">
          <TextWithRect>INSTAGRAM</TextWithRect>
          <h2 className="text-2xl font-black text-persian-blue-950 lg:text-4xl">
            Informasi Seputar Kesehatan dan Momen Lainnya
          </h2>

          <p className="text-justify text-sm text-gray-600 lg:text-lg">
            Ikuti kami di Instagram untuk mendapatkan informasi seputar
            kesehatan, layanan terbaru, dan momen menarik lainnya.
          </p>
        </div>

        {/* Slider cannot move the embed */}
        <div className="bg-sky-0 flex w-full overflow-x-auto lg:flex-2">
          {/* <InstagramEmbed url="https://www.instagram.com/p/id/" /> */}
        </div>
      </section>

      <section className="p-5 lg:p-10">
        <TextWithRect>BERITA</TextWithRect>
        <p className="text-justify text-sm text-gray-600 lg:text-lg">
          Dapatkan informasi seputar kesehatan, layanan terbaru, dan informasi
          menarik lainnya.
        </p>
        <div className="w-full">
          <Slider>
            {cards.map((card) => (
              <NewsCard
                title={card.title}
                description={card.description}
                image={card.image}
                date={card.date}
              />
            ))}
          </Slider>
        </div>
      </section>

      <h2 className="mt-4 mb-2 text-center text-2xl font-extrabold text-persian-blue-950 uppercase lg:text-3xl">
        Maps
      </h2>
      <div className="px-3 lg:px-10">
        <MapsEmbed />
      </div>

      <section className="mt-2 flex flex-col gap-2 p-1 text-center text-sm text-persian-blue-950 lg:font-semibold">
        <p>
          Jl. Rambipuji, Kebonsari, Balung Lor, Kec. Balung, Jember, Jawa Timur
          68161
        </p>

        <p>rsd.balung@jemberkab.go.id</p>
      </section>

      {/* <DoctorCard name="Dr. John Doe" specialty="Bedah" image={banner} /> */}
      {/* <YoutubeEmbed videoId="_IBj20ojJnU" /> */}

      <Footer />
    </>
  );
}
