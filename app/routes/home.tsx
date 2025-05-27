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
      <section className="mt-8 flex flex-col items-center justify-center gap-4 min-md:flex-row">
        {/* <img
          src={waveImage}
          className="absolute z-10 h-full w-full object-cover"
          alt="Waves"
        /> */}
        <div className="flex flex-col items-center ps-6 min-md:items-start">
          <p className="text-xl text-blue-400 min-md:text-2xl">
            Selamat Datang di
          </p>
          <h1 className="text-4xl font-black text-persian-blue-950 uppercase min-md:text-5xl">
            RSD Balung
          </h1>
        </div>

        <div className="flex h-auto flex-wrap gap-2 p-6">
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
