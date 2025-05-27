import type { Route } from "./+types/home";
import { Star, Eye, Smile, Users, MessageSquare } from "lucide-react";
import axios from "axios";

import pelayananNyamanIcon from "~/assets/pelayanan-nyaman.svg";
import kualitasTerbaikIcon from "~/assets/kualitas-terbaik.svg";
import penangananCepatIcon from "~/assets/penanganan-cepat.svg";
import layananRamahIcon from "~/assets/layanan-ramah.svg";

import shortcutDokterIcon from "~/assets/shortcut-dokter.svg";
import shortcutJadwalIcon from "~/assets/shortcut-jadwal-dokter.svg";
import shortcutAduanIcon from "~/assets/shortcut-aduan.svg";

import waveImage from "~/assets/waves.svg";

import Banner from "~/components/Banner";
import MottoCard from "~/components/MottoCard";
import TextWithRect from "~/components/TextWithRect";
import MapsEmbed from "~/components/MapsEmbed";
import InstagramEmbed from "~/components/InstagramEmbed";
import NewsCard from "~/components/NewsCard";
import LayananUnggulanCard from "~/components/LayananUnggulanCard";
import Slider from "~/components/Slider";

import type { News } from "~/models/News";
import type { BannerModel } from "~/models/Banner";

import { handleLoader, type LoaderResult } from "~/utils/handleLoader";
import type { Unggulan } from "~/models/Unggulan";
import HomeShortcut from "~/components/HomeShortcut";

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
  const bannerRequest = new URL(`${import.meta.env.VITE_API_URL}/banner/`);
  const unggulanRequest = new URL(
    `${import.meta.env.VITE_API_URL}/layanan-unggulan/`,
  );
  const newsRequest = new URL(`${import.meta.env.VITE_API_URL}/berita?page=1`);

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

  const bannerList = Array.isArray(banners) ? banners.map((b) => b.gambar) : [];
  const mottoItems = [
    {
      title: "ASRI",
      description:
        "Lingkungan yang bersih, nyaman, dan tertata dengan baik untuk menciptakan suasana yang menyenangkan bagi pasien",
      Icon: Star,
      bgColor: "bg-blue-600",
      borderColor: "border-blue-600",
      isMain: true,
    },
    {
      title: "ATENSI",
      description:
        "Memberikan perhatian penuh kepada setiap pasien dengan memahami keluhan dan memastikan mereka diprioritaskan",
      Icon: Eye,
      bgColor: "bg-blue-600",
      borderColor: "border-blue-600",
    },
    {
      title: "SENYUM",
      description:
        "Memberikan senyum terbaik dalam setiap pelayanan sebagai wujud keramahan dan kenyamanan bagi pasien",
      Icon: Smile,
      bgColor: "bg-yellow-400",
      borderColor: "border-yellow-400",
    },
    {
      title: "RAMAH",
      description:
        "Menyambut setiap pasien dengan ramah, tanpa membedakan siapa pun, karena semua layak mendapat pelayanan terbaik",
      Icon: Users,
      bgColor: "bg-yellow-400",
      borderColor: "border-yellow-400",
    },
    {
      title: "INFORMATIF",
      description:
        "Memberikan informasi yang jelas dan lengkap kepada pasien tentang kondisi, perawatan, dan prosedur yang dijalani",
      Icon: MessageSquare,
      bgColor: "bg-blue-600",
      borderColor: "border-blue-600",
    },
  ];

  return (
    <>
      <Banner bannersSrc={bannerList} />
      {/* <img
        src={waveImage}
        className="absolute bottom-0 z-10 h-full w-full object-cover"
        alt="Waves"
      /> */}
      <section className="relative mx-auto mt-24 flex max-w-screen-xl flex-col items-center overflow-hidden px-4 py-8 md:flex-row md:gap-1 md:px-24 md:py-12">
        {/* Background decoration */}
        <div className="absolute -top-20 -left-20 z-0 h-1/2 rotate-[15deg] overflow-hidden opacity-10">
          <img
            src="../assets/wave-pattern.svg"
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
        </div>

        {/* Staff image */}
        <div className="z-10 flex w-full justify-center md:w-1/2">
          <div className="max-w-md overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80"
              alt="Staff RSD Balung"
              className="max-h-[450px] w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Text content */}
        <div className="z-10 flex w-full flex-col justify-center gap-4 px-4 text-center md:w-1/2 md:items-start md:text-left">
          <div>
            <p className="text-xl text-blue-400 md:text-2xl">
              Selamat Datang di
            </p>
            <h1 className="text-4xl font-black text-persian-blue-950 uppercase md:text-5xl">
              RSD Balung
            </h1>
          </div>
          <p className="text-sm leading-relaxed text-gray-700 md:text-base">
            Rumah Sakit Daerah (RSD) Balung merupakan fasilitas pelayanan
            kesehatan milik Pemerintah Kabupaten Jember yang berlokasi di Jalan
            Rambipuji No. 19, Balung, Kabupaten Jember, Jawa Timur. Rumah sakit
            ini berperan penting dalam memberikan pelayanan kesehatan kepada
            masyarakat di wilayah selatan Jember, dengan berbagai layanan medis,
            penunjang diagnostik, serta tenaga medis yang profesional dan
            berkompeten
          </p>

          {/* icon */}
          <div className="flex flex-wrap gap-2 p-4">
            {[
              { icon: shortcutDokterIcon, name: "Dokter", url: "/dokter" },
              {
                icon: shortcutJadwalIcon,
                name: "Jadwal Dokter",
                url: "/jadwal-dokter",
              },
              { icon: shortcutAduanIcon, name: "Aduan", url: "/aduan" },
            ].map((item, index) => (
              <HomeShortcut
                key={index}
                icon={item.icon}
                name={item.name}
                url={item.url}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="my-16 flex flex-col items-center px-4">
        <div className="mb-17 flex flex-col items-center">
          <div className="mb-1 text-yellow-400">!</div>
          <TextWithRect fontSize="text-2xl" fontWeight="font-bold">
            MOTTO PELAYANAN KAMI
          </TextWithRect>
        </div>
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4">
          <div className="mb-8 flex w-full justify-center">
            <MottoCard {...mottoItems[0]} />
          </div>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            {mottoItems.slice(1).map((item, index) => (
              <MottoCard
                key={index}
                title={item.title}
                description={item.description}
                Icon={item.Icon}
                bgColor={item.bgColor}
                borderColor={item.borderColor}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex w-full flex-col md:flex-row">
          {/* Blue Panel */}
          <div className="relative bg-blue-600 p-8 text-white md:w-1/3 md:p-12">
            <div className="max-w-md">
              <TextWithRect
                fontSize="text-xl"
                fontWeight="font-bold"
                textColor="text-yellow-300"
              >
                POLI MATA
              </TextWithRect>

              <h2 className="mt-4 mb-6 text-3xl font-bold">
                Layanan Unggulan Kami
              </h2>

              <p className="mb-12">
                Poli Mata di RSD Balung merupakan layanan unggulan yang
                menghadirkan pelayanan kesehatan mata berkualitas dengan tenaga
                medis berpengalaman dan peralatan modern.
              </p>

              {/* Navigation Dots and Arrow */}
              <div className="absolute bottom-8 left-8 flex items-center md:left-12">
                <div className="mr-4 flex space-x-2">
                  <div className="h-1.5 w-6 rounded-full bg-white"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60"></div>
                </div>

                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 5L16 12L9 19"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Image Panels */}
          <div className="flex flex-col md:w-2/3 md:flex-row">
            <div className="relative h-64 md:h-auto md:w-1/2">
              <img
                src="https://images.pexels.com/photos/5752287/pexels-photo-5752287.jpeg"
                alt="Eye examination with an ophthalmologist"
                className="h-full w-full object-cover"
              />
              <div className="absolute right-0 bottom-0 left-0 bg-black/30 p-4 text-center text-white">
                <p>
                  Menggunakan Media
                  <br />
                  Tes Mata Terbaik
                </p>
              </div>
            </div>

            <div className="relative h-64 md:h-auto md:w-1/2">
              <img
                src="https://images.pexels.com/photos/5752281/pexels-photo-5752281.jpeg"
                alt="Patient using trial lens frame for vision test"
                className="h-full w-full object-cover"
              />
              <div className="absolute right-0 bottom-0 left-0 bg-black/30 p-4 text-center text-white">
                <p>
                  Menggunakan Media
                  <br />
                  Tes Mata Terbaik
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="p-5 lg:p-16">
        <TextWithRect>BERITA</TextWithRect>
        <p className="text-justify text-sm text-gray-600 lg:text-lg">
          Warta RSD Balung: Mengabari, Melayani, Menginspirasi
        </p>
        <div className="w-full">
          {news?.length > 0 ? (
            <Slider overlapSize={16}>
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
      

      {/* embed */}
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
          {Array.isArray(unggulanData?.gambarCaptions) &&
          unggulanData.gambarCaptions.length > 0 ? (
            <Slider>
              {unggulanData.gambarCaptions.map((item, index) => (
                <LayananUnggulanCard
                  key={index}
                  description={item.caption}
                  image={item.gambar}
                />
              ))}
            </Slider>
          ) : (
            <p className="text-gray-500">
              Belum ada layanan unggulan tersedia.
            </p>
          )}
        </div>
      </section>

      {/* alamat */}
      <section className="flex flex-col items-center bg-gradient-to-b from-dark-blue-900 to-dark-blue-950 p-4 max-sm:gap-y-2 lg:flex-row lg:gap-x-26 lg:p-16">
        <div className="h-full lg:flex-1">
          <TextWithRect textColor="text-white">INSTAGRAM</TextWithRect>
          <h2 className="text-2xl font-black text-white lg:text-4xl">
            Informasi Seputar Kesehatan dan Momen Lainnya
          </h2>

          <p className="text-justify text-sm text-white lg:text-lg">
            Ikuti kami di Instagram untuk mendapatkan informasi seputar
            kesehatan, layanan terbaru, dan momen menarik lainnya.
          </p>
        </div>

        {/* Slider cannot move the embed */}
        <div className="bg-sky-0 flex w-full items-center gap-2 overflow-x-auto lg:flex-1">
          <InstagramEmbed url="https://www.instagram.com/p/DILIx7czwOo/" />
          <InstagramEmbed url="https://www.instagram.com/p/DILIx7czwOo/" />
        </div>
      </section>

      <div className="flex w-full flex-col justify-between gap-4 p-4 min-md:flex-row min-md:px-20">
        <div className="flex flex-1 flex-col justify-between gap-4">
          <div className="rounded-lg bg-gradient-to-r from-blue-900 to-blue-300 px-8 py-4 text-white">
            <div className="text-white">
              <TextWithRect
                textColor="white"
                fontSize="min-md:text-2xl text-xl"
              >
                ALAMAT KAMI
              </TextWithRect>
            </div>
            <p className="font-light min-md:text-lg">
              Jl. Rambipuji, Kebonsari, Balung Lor, Kec. Balung, Jember, Jawa
              Timur 68161
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-blue-900 to-blue-300 px-8 py-4 text-white">
            <TextWithRect textColor="white" fontSize="min-md:text-2xl text-xl">
              EMAIL KAMI
            </TextWithRect>
            <p className="font-light min-md:text-lg">
              rsd.balung@jemberkab.go.id
            </p>
          </div>
        </div>
        <div className="flex-1">
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
