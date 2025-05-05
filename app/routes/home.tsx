import type { Route } from "./+types/home";
import axios from "axios";

import pelayananNyamanIcon from "~/assets/pelayanan-nyaman.svg";
import kualitasTerbaikIcon from "~/assets/kualitas-terbaik.svg";
import penangananCepatIcon from "~/assets/penanganan-cepat.svg";
import layananRamahIcon from "~/assets/layanan-ramah.svg";

import shortcutDokterIcon from "~/assets/shortcut-dokter.svg";
import shortcutJadwalIcon from "~/assets/shortcut-jadwal-dokter.svg";
import shortcutAduanIcon from "~/assets/shortcut-aduan.svg";

import Banner from "~/components/Banner";
import MapsEmbed from "~/components/MapsEmbed";
import InstagramEmbed from "~/components/InstagramEmbed";
import NewsCard from "~/components/NewsCard";
import TextWithRect from "~/components/TextWithRect";
import LayananUnggulanCard from "~/components/LayananUnggulanCard";
import Slider from "~/components/Slider";

import type { News } from "~/models/News";
import type { BannerModel } from "~/models/Banner";

import { handleLoader, type LoaderResult } from "~/utils/handleLoader";
import type { Unggulan } from "~/models/Unggulan";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rumah Sakit Daerah Balung" },
    {
      name: "description",
      content: "Selamat Datang Di Website Rumah Sakit Daerah Balung!",
    },
  ];
}

export async function loader(): Promise<LoaderResult> {
  const bannerRequest = new URL("https://rs-balung-cp.vercel.app/banner/");
  const unggulanRequest = new URL(
    "https://rs-balung-cp.vercel.app/layanan-unggulan/",
  );
  const newsRequest = new URL("https://rs-balung-cp.vercel.app/berita?page=1");

  const bannerResponse = await handleLoader(() =>
    axios.get(bannerRequest.href),
  );
  const unggulanResponse = await handleLoader(() =>
    axios.get(unggulanRequest.href),
  );
  const newsResponse = await handleLoader(() => axios.get(newsRequest.href));

  // return handleLoader(() =>
  //   Promise.all([axios.get(newsRequest.href), axios.get(bannerRequest.href)]),
  // );
  const data = {
    banners: bannerResponse.data,
    unggulan: unggulanResponse.data,
    news: newsResponse.data,
  };

  return {
    success: true,
    message: "Selesai mendapatkan data",
    data,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const data = loaderData.data;
  const banners: BannerModel[] = data.banners || [];
  const unggulanData: Unggulan = loaderData?.data?.unggulan ?? {};
  const news = (data.news?.berita as News[]) || []; //{ berita: News[]; pagination: Pagination };
  console.log(data.unggulan);

  const bannerList = Array.isArray(banners) ? banners.map((b) => b.gambar) : [];

  return (
    <>
      <Banner bannersSrc={bannerList} />
      <section className="mt-8 flex flex-col items-center">
        <p className="text-xl text-blue-400">Selamat Datang di</p>
        <h1 className="text-4xl font-black text-persian-blue-950 uppercase">
          RSD Balung
        </h1>

        <div className="flex h-auto flex-wrap gap-2 p-6">
          <a
            href="/dokter"
            className="flex flex-1 flex-col items-center gap-2 rounded-lg bg-blue-900 p-4 text-sm"
          >
            <img src={shortcutDokterIcon} alt="" className="h-8 w-8" />
            <p className="w-max text-center font-bold text-white uppercase min-md:w-max">
              Daftar Dokter
            </p>
          </a>
          <a
            href="/jadwal-dokter"
            className="flex flex-1 flex-col items-center gap-2 rounded-lg bg-blue-900 p-4 text-sm"
          >
            <img src={shortcutJadwalIcon} alt="" className="h-8 w-8" />
            <p className="w-max text-center font-bold text-white uppercase min-md:w-max">
              Jadwal Dokter
            </p>
          </a>
          <a
            href="/dokter"
            className="flex flex-1 flex-col items-center gap-2 rounded-lg bg-blue-900 p-4 text-sm"
          >
            <img src={shortcutAduanIcon} alt="" className="h-8 w-8" />
            <p className="w-max text-center font-bold text-white uppercase min-md:w-max">
              Aduan
            </p>
          </a>
        </div>
      </section>
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
          <TextWithRect>{unggulanData.judul}</TextWithRect>
          <h2 className="text-2xl font-black text-persian-blue-950 lg:text-4xl">
            Layanan Unggulan Kami
          </h2>

          <p className="text-justify text-sm text-gray-600 lg:text-lg">
            {unggulanData.deskripsi}
          </p>
        </div>

        <div className="bg-sky-0 w-full overflow-hidden lg:flex-1">
          <Slider>
            {/* [
               Slide 1
               [
               "Menggunakan Media Tes Mata Terbaik",
               "Menggunakan Alat-Alat yang Canggih",
               ],
               Slide 2
               [
               "Ditangani Dokter Spesialis Berpengalaman",
               "Pelayanan Cepat, Tepat, dan Nyaman",
               ],
               Slide 3
               [
               "Konsultasi Sesuai Standar Medis Terkini",
               "Fasilitas Lengkap untuk Semua Kebutuhan Mata",
               ],
             ]
                 .map((description, index) => (
                 <div className="flex gap-2">
                   <LayananUnggulanCard
                     description={description[0]}
                     image={`/images/layanan-unggulan/layanan-unggulan${index + 1}.jpg`}
                   />
                   <LayananUnggulanCard
                     description={description[1]}
                     image={`/images/layanan-unggulan/layanan-unggulan${index + 2}.jpg`}
                   />
                 </div>
               )) */}
            {unggulanData.gambarCaptions.map((item, index) => (
              <LayananUnggulanCard
                key={index}
                description={item.caption}
                image={item.gambar}
                // image={`/images/layanan-unggulan/layanan-unggulan${index + 1}.jpg`}
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
          {news?.length > 0 ? (
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
            <p className="text-gray-500">{data.message}</p>
          )}
        </div>
      </section>
      <div className="flex flex-col items-center justify-center gap-3 p-4 min-md:flex-row">
        <section className="mt-2 flex flex-col gap-2 p-1 text-sm lg:font-semibold">
          <div className="rounded-lg bg-gradient-to-r from-blue-900 to-blue-300 px-8 py-4 text-white">
            <div className="text-white">
              <TextWithRect textColor="white">ALAMAT KAMI</TextWithRect>
            </div>
            <p>
              Jl. Rambipuji, Kebonsari, Balung Lor, Kec. Balung, Jember, Jawa
              Timur 68161
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-blue-900 to-blue-300 px-8 py-4 text-white">
            <TextWithRect textColor="white">EMAIL KAMI</TextWithRect>
            <p>rsd.balung@jemberkab.go.id</p>
          </div>
        </section>
        <div className="w-fit overflow-hidden rounded-lg border border-gray-300/80 shadow min-md:w-2/5">
          <MapsEmbed />
        </div>
      </div>
      {/* 
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
      </section> */}
    </>
  );
}
