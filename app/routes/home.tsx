import type { Route } from "./+types/home";
import axios from "axios";
import * as motion from "motion/react-client";

import pelayananNyamanIcon from "~/assets/pelayanan-nyaman.svg";
import kualitasTerbaikIcon from "~/assets/kualitas-terbaik.svg";
import penangananCepatIcon from "~/assets/penanganan-cepat.svg";
import layananRamahIcon from "~/assets/layanan-ramah.svg";

import shortcutDokterIcon from "~/assets/shortcut-dokter.svg";
import shortcutJadwalIcon from "~/assets/shortcut-jadwal-dokter.svg";
import shortcutAduanIcon from "~/assets/shortcut-aduan.svg";

import waveImage from "~/assets/waves.svg";

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
import HomeShortcut from "~/components/HomeShortcut";
import SliderSection from "~/components/SliderSection";
import type { Variants } from "motion/react";
import {
  ChatBubbleLeftRightIcon,
  EyeIcon,
  FaceSmileIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

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
  const igRequest = new URL(`${import.meta.env.VITE_API_URL}/media-sosial`);
  const bannerResponse = await handleLoader(() =>
    axios.get(bannerRequest.href),
  );
  const unggulanResponse = await handleLoader(() =>
    axios.get(unggulanRequest.href),
  );
  const newsResponse = await handleLoader(() => axios.get(newsRequest.href));
  const igResponse = await handleLoader(() => axios.get(igRequest.href));
  console.log("ig", igResponse.data);
  const data = {
    banners: bannerResponse.data,
    unggulan: unggulanResponse.data,
    news: newsResponse.data,
    instagrams: igResponse.data,
  };
  return {
    success: true,
    message: "Selesai mendapatkan data",
    data,
  };
  return { success: false, message: "test", data: {} };
}
const animationTransition = {
  type: "spring",
  bounce: 0.4,
  duration: 0.8,
};
const animationVariants = {
  horizontal: {
    left: {
      offscreen: {
        x: -400,
      },
      onscreen: {
        x: 0,
        transition: animationTransition,
      },
    },
    right: {
      offscreen: {
        x: 400,
      },
      onscreen: {
        x: 0,
        transition: animationTransition,
      },
    },
  },
  vertical: {
    offscreen: {
      y: 300,
    },
    onscreen: {
      y: 0,
      transition: animationTransition,
    },
  },
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const data = loaderData?.data ?? {};
  const banners: BannerModel[] = data.banners || [];
  const dummyUnggulan = [
    {
      gambar: "gambar",
      caption: "caption",
    },
    {
      gambar: "gambar",
      caption: "caption",
    },
    {
      gambar: "gambar",
      caption: "caption",
    },
    {
      gambar: "gambar",
      caption: "caption",
    },
  ];
  const mottoList = [
    {
      title: "ATENSI",
      description:
        "Memberikan perhatian penuh kepada setiap pasien dengan memahami keluhan dan memastikan mereka diprioritaskan",
      icon: <EyeIcon className="h-10 w-10 text-white" />,
      bgColor: "bg-blue-600",
      borderColor: "border-blue-600",
    },
    {
      title: "SENYUM",
      description:
        "Memberikan senyum terbaik dalam setiap pelayanan sebagai wujud keramahan dan kenyamanan bagi pasien",
      icon: <FaceSmileIcon className="h-10 w-10 text-white" />,
      bgColor: "bg-yellow-400",
      borderColor: "border-yellow-400",
    },
    {
      title: "RAMAH",
      description:
        "Menyambut setiap pasien dengan ramah, tanpa membedakan siapa pun, karena semua layak mendapat pelayanan terbaik",
      icon: <UsersIcon className="h-10 w-10 text-white" />,
      bgColor: "bg-yellow-400",
      borderColor: "border-yellow-400",
    },
    {
      title: "INFORMATIF",
      description:
        "Memberikan informasi yang jelas dan lengkap kepada pasien tentang kondisi, perawatan, dan prosedur yang dijalani",
      icon: <ChatBubbleLeftRightIcon className="h-10 w-10 text-white" />,
      bgColor: "bg-blue-600",
      borderColor: "border-blue-600",
    },
  ];
  const unggulanData: Unggulan = loaderData?.data?.unggulan ?? {};
  console.log("unggulanData", unggulanData);
  const news = (data.news?.berita as News[]) || []; //{ berita: News[]; pagination: Pagination };
  const instagrams = (data.instagrams as { link_embed: string }[]) || []; //{ berita: News[]; pagination: Pagination };
  const bannerList = Array.isArray(banners) ? banners.map((b) => b.gambar) : [];

  return (
    <>
      <Banner bannersSrc={bannerList} />
      {/* <img
        src={waveImage}
        className="absolute bottom-0 z-10 h-full w-full object-cover"
        alt="Waves"
      /> */}
      <section className="mx-4 mt-8 flex flex-col items-center justify-center gap-4 min-md:mx-16 min-md:flex-row">
        <div className="absolute -top-60 -left-20 z-10">
          <img src={waveImage} className="w-100 object-cover" alt="Waves" />
        </div>
        {/* <img src="/direktur.png" className="w-60 min-md:w-80" /> */}
        <div className="relative mx-auto w-fit">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            variants={animationVariants.vertical}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-grd absolute bottom-0 left-1/2 z-0 h-40 w-72 -translate-x-1/2 rounded-xl"
          ></motion.div>

          <motion.img
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            variants={animationVariants.vertical}
            src="/direkturtrnsprnt.png"
            alt="Person"
            className="relative z-10 max-w-[250px]"
          />
        </div>

        <div className="flex shrink flex-col items-center justify-center min-md:max-w-3/5">
          <div className="flex w-fit flex-col items-center">
            <motion.p
              initial="offscreen"
              whileInView="onscreen"
              variants={animationVariants.vertical}
              className="text-xl text-dark-blue-950 min-md:text-2xl"
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Selamat Datang di
            </motion.p>
            <motion.h1
              initial="offscreen"
              whileInView="onscreen"
              variants={animationVariants.vertical}
              className="text-4xl font-black text-dark-blue-900 uppercase min-md:text-5xl"
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              RSD Balung
            </motion.h1>
          </div>
          <motion.p
            initial="offscreen"
            whileInView="onscreen"
            variants={animationVariants.vertical}
            viewport={{ once: true }}
            className="mx-4 mt-4 text-justify text-base lg:text-lg"
          >
            Rumah Sakit Daerah (RSD) Balung merupakan rumah sakit milik
            Pemerintah Kabupaten Jember yang terletak di Jalan Rambipuji No. 19,
            Kecamatan Balung, Jawa Timur. Rumah sakit ini berstatus sebagai
            Rumah Sakit Umum Kelas C dan berdiri di atas lahan seluas 2,19
            hektar. RSD Balung melayani lebih dari satu juta penduduk yang
            tersebar di 15 kecamatan wilayah selatan Jember. Dengan kapasitas
            126 tempat tidur, rumah sakit ini menyediakan berbagai layanan
            medis, mulai dari rawat jalan, rawat inap, instalasi gawat darurat
            (IGD) 24 jam, laboratorium, radiologi, farmasi, hingga instalasi
            bedah sentral.
          </motion.p>
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            variants={animationVariants.vertical}
            viewport={{ once: true }}
            className="flex h-auto w-full flex-col gap-2 p-6 min-md:flex-row"
          >
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
          </motion.div>
        </div>
      </section>

      <motion.section
        className="mt-8 flex flex-col items-center"
        initial="offscreen"
        whileInView="onscreen"
        variants={animationVariants.vertical}
        viewport={{ once: true }}
      >
        <TextWithRect>MOTTO PELAYANAN KAMI</TextWithRect>
        <div className="w-full px-8 pt-4 lg:max-w-2/3">
          <p className="w-full rounded-lg border-2 border-dark-blue-900 p-2 text-center text-2xl font-extrabold">
            ASRI
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 p-8 lg:max-w-2/3 lg:grid-cols-2 lg:grid-rows-2">
          {mottoList.map((item, index) => {
            const color = index % 3 === 0 ? "dark-blue-900" : "yellow-400";
            return (
              <article
                key={index}
                className={`flex flex-col items-center gap-4 rounded-lg border-2 p-6 border-${color}`}
              >
                <div className={`aspect-square rounded-full bg-${color} p-2`}>
                  {/* <img src={item.icon} className="h-full w-full" /> */}
                  {item.icon}
                </div>
                <h2 className="text-2xl font-extrabold text-dark-blue-950">
                  {item.title}
                </h2>
                <p className="text-justify text-gray-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </motion.section>
      {/* 
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
      </section> */}
      <section id="layanan-unggulan"></section>
      <SliderSection  
        title={unggulanData.judul}
        subtitle="Layanan Unggulan Kami"
        description={unggulanData.deskripsi}
      >
        {Array.isArray(unggulanData?.gambar_captions) &&
        unggulanData.gambar_captions.length > 0
          ? unggulanData.gambar_captions.map((item, index) => (
              <LayananUnggulanCard
                key={index}
                description={item.caption}
                image={item.gambar}
              />
            ))
          : []}
      </SliderSection>

      <section className="p-5 lg:p-16">
        <div className="flex flex-col items-center gap-4">
          <TextWithRect>BERITA</TextWithRect>
          <p className="text-center text-lg font-black lg:text-2xl">
            <span className="text-dark-blue-950">Warta RSD Balung:</span>{" "}
            <span className="text-dark-blue-900">
              Mengabari, Melayani, Menginspirasi
            </span>
          </p>
        </div>

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

      <section className="flex flex-col items-center bg-gradient-to-b from-dark-blue-900 to-dark-blue-950 max-sm:gap-y-2 lg:flex-row lg:gap-x-8 lg:ps-8">
        <div className="flex flex-1 flex-col gap-6 px-6 py-8 text-white">
          <TextWithRect leftShifted={false} textColor="text-white">
            INSTAGRAM
          </TextWithRect>
          <h2 className="text-2xl font-black text-white lg:text-4xl">
            Informasi Seputar Kesehatan dan Momen Lainnya
          </h2>

          <p className="text-justify text-white lg:text-lg">
            Ikuti kami di Instagram untuk mendapatkan informasi seputar
            kesehatan, layanan terbaru, dan momen menarik lainnya.
          </p>

          <a
            className="w-fit rounded-full bg-white px-8 py-4 font-bold text-dark-blue-950"
            href="https://www.instagram.com/rsdbalungjember/"
          >
            Instagram Kami
          </a>
        </div>

        {/* Slider cannot move the embed */}
        <div
          // className="flex w-full items-center gap-2 overflow-x-auto bg-sky-50 p-2 lg:flex-1"
          className="relative flex h-full max-w-full flex-1 overflow-x-auto bg-white"
        >
          {instagrams?.length > 0 ? (
            instagrams.map((ig, index) => (
              <InstagramEmbed key={index} url={ig.link_embed} />
            ))
          ) : (
            <p className="text-gray-500">{data.message}</p>
          )}
          {/* <InstagramEmbed url="https://www.instagram.com/p/DILIx7czwOo/" />
          <InstagramEmbed url="https://www.instagram.com/p/DILIx7czwOo/" /> */}
        </div>
      </section>

      <div className="flex w-full flex-col justify-between gap-4 p-4 min-md:flex-row min-md:px-20">
        <div className="flex flex-1 flex-col justify-between gap-4">
          <img src="images/rsd.png" />

          <div className="text-center">
            <div className="border-b bg-dark-blue-900 px-8 py-4 text-white">
              <div className="text-white">
                <p className="text-lg font-extrabold min-md:text-2xl">
                  ALAMAT KAMI
                </p>
              </div>
              <p className="font-light">
                Jl. Rambipuji, Kebonsari, Balung Lor, Kec. Balung, Jember, Jawa
                Timur 68161
              </p>
            </div>

            <div className="bg-dark-blue-900 px-8 py-4 text-white">
              <p className="text-lg font-extrabold min-md:text-2xl">
                EMAIL KAMI
              </p>
              <p className="font-light">rsd.balung@jemberkab.go.id</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <MapsEmbed />
        </div>
      </div>
    </>
  );
}
