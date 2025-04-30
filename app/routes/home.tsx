import type { Route } from "./+types/home";
import axios from "axios";
import type { NewsApiResponse } from "./news";
import { useLoaderData } from "react-router";

import Banner from "~/components/Banner";
import Footer from "~/components/Footer";
import MapsEmbed from "~/components/MapsEmbed";
import InstagramEmbed from "~/components/InstagramEmbed";
import NewsCard from "~/components/NewsCard";
import TextWithRect from "~/components/TextWithRect";
import LayananUnggulanCard from "~/components/LayananUnggulanCard";
import Slider from "~/components/Slider";
import whatsAppIcon from "~/assets/whatsapp.svg";
import pelayananNyamanIcon from "~/assets/pelayanan-nyaman.svg";
import kualitasTerbaikIcon from "~/assets/kualitas-terbaik.svg";
import penangananCepatIcon from "~/assets/penanganan-cepat.svg";
import layananRamahIcon from "~/assets/layanan-ramah.svg";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rumah Sakit Daerah Balung" },
    {
      name: "description",
      content: "Selamat Datang Di Website Rumah Sakit Daerah Balung!",
    },
  ];
}

export async function loader(): Promise<NewsApiResponse> {
  try {
    const response = await axios.get<NewsApiResponse>(
      `https://rs-balung-cp.vercel.app/berita?page=1`,
    );
    const data = response.data;

    if (!data.success || !data.data.berita.length) {
      // Return empty data if no doctors are found
      return {
        ...data,
        data: {
          berita: [],
          pagination: {
            currentPage: 1,
            pageSize: 15,
            totalItems: 0,
            totalPages: 1,
          },
        },
      };
    }

    return data; // Return the full API response
  } catch (error: any) {
    const errorResponse = error.response?.data || {};
    const data = {
      success: errorResponse.success || false,
      statusCode: errorResponse.statusCode || 400,
      message: errorResponse.message || "Error",
      data: {
        berita: [],
        pagination: {
          currentPage: 1,
          pageSize: 9,
          totalItems: 0,
          totalPages: 1,
        },
      },
    };
    return data;
  }
}

export default function Home() {
  const response = useLoaderData() as NewsApiResponse;
  const news = response.data.berita;

  return (
    <>
      <Banner />

      <section className="mt-8 flex flex-col items-center">
        <TextWithRect>KAMI BERKOMITMEN</TextWithRect>
        <div className="grid grid-cols-1 gap-6 p-8 lg:max-w-2/3 lg:grid-cols-2 lg:grid-rows-2">
          {[
            {
              icon: pelayananNyamanIcon,
              title: "Pelayanan Nyaman",
              description:
                "Didukung dengan fasilitas lengkap dan ruang perwatan yang bersih, memberikan kenyamanan maksimal bagi pasien.",
            },
            {
              icon: kualitasTerbaikIcon,
              title: "Kualitas Terbaik",
              description:
                "Pemeriksaan menyeluruh dan penanganan tepat oleh tenaga medis berpengalaman, membantu pemulihan lebih cepat.",
            },
            {
              icon: penangananCepatIcon,
              title: "Penanganan Cepat",
              description:
                "Dengan sistem pelayanan yang efisien, pasien mendapatkan perawatan tanpa harus menunggu lama.",
            },
            {
              icon: layananRamahIcon,
              title: "Layanan Ramah",
              description:
                "Keramahan dan kepedulian tim medis RSD Balung menjadikan pengalaman berobat lebih tenang dan menyenangkan.",
            },
          ].map((item, index) => (
            <article key={index} className="flex gap-4">
              <div className="aspect-square h-12 w-12 rounded-full bg-yellow-400 p-2">
                <img src={item.icon} className="h-full w-full" />
              </div>
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

      <section className="flex flex-col items-center p-4 max-sm:gap-y-2 lg:flex-row lg:gap-x-26 lg:p-16">
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

        <div className="bg-sky-0 w-full overflow-hidden lg:flex-1">
          <Slider>
            {[
              // Slide 1
              // [
              "Menggunakan Media Tes Mata Terbaik",
              "Menggunakan Alat-Alat yang Canggih",
              // ],
              // Slide 2
              // [
              "Ditangani Dokter Spesialis Berpengalaman",
              "Pelayanan Cepat, Tepat, dan Nyaman",
              // ],
              // Slide 3
              // [
              "Konsultasi Sesuai Standar Medis Terkini",
              "Fasilitas Lengkap untuk Semua Kebutuhan Mata",
              // ],
            ]
              //   .map((description, index) => (
              //   <div className="flex gap-2">
              //     <LayananUnggulanCard
              //       description={description[0]}
              //       image={`/images/layanan-unggulan/layanan-unggulan${index + 1}.jpg`}
              //     />
              //     <LayananUnggulanCard
              //       description={description[1]}
              //       image={`/images/layanan-unggulan/layanan-unggulan${index + 2}.jpg`}
              //     />
              //   </div>
              // ))
              .map((item, index) => (
                <LayananUnggulanCard
                  key={index}
                  description={item}
                  image={`/images/layanan-unggulan/layanan-unggulan${index + 1}.jpg`}
                />
              ))}
          </Slider>
        </div>
      </section>

      <section className="flex flex-col items-center p-4 max-sm:gap-y-2 lg:flex-row lg:gap-x-26 lg:p-16">
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
        <div className="bg-sky-0 flex w-full items-center gap-2 overflow-x-auto lg:flex-1">
          <InstagramEmbed url="https://www.instagram.com/p/DILIx7czwOo/" />
          <InstagramEmbed url="https://www.instagram.com/p/DILNKUKTwV2/" />
        </div>
      </section>

      <section className="p-5 lg:p-16">
        <TextWithRect>BERITA</TextWithRect>
        <p className="text-justify text-sm text-gray-600 lg:text-lg">
          Dapatkan informasi seputar kesehatan, layanan terbaru, dan informasi
          menarik lainnya.
        </p>
        <div className="w-full">
          {news.length > 0 ? (
            <Slider>
              {news.map((berita, index) => (
                <NewsCard
                  key={index}
                  id={berita.id}
                  title={berita.judul}
                  description={berita.ringkasan}
                  image={berita.gambar_sampul}
                  date={berita.tanggal_dibuat}
                />
              ))}
            </Slider>
          ) : (
            <p className="text-gray-500">{response.message}</p>
          )}
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
    </>
  );
}
