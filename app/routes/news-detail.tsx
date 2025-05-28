import axios from "axios";
import { useLoaderData } from "react-router";
import NewsBanner from "~/components/NewsBanner";
import type { News } from "~/models/News";
import "~/lists.css";
import HtmlParse from "~/components/HtmlParse";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TextWithRect from "~/components/TextWithRect";
import ReCAPTCHA from "react-google-recaptcha";
const RECAPTCHA_SITE_KEY = "6LcgaUwrAAAAAJwD5ZwcEKVln37VJXMMkdelbVdS";
interface NewsDetail {
  id: string;
  judul: string;
  ringkasan: string;
  isi: string;
  gambar_sampul: string;
  tanggal_dibuat: string;
  gambar_tambahan: [];
}
interface NewsDetailAndAll {
  id: string;
  judul: string;
  ringkasan: string;
  isi: string;
  gambar_sampul: string;
  tanggal_dibuat: string;
  gambar_tambahan: [];
  berita: News[];
}

interface NewsDetailApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: NewsDetail;
}

//komentar
interface Komentar {
  id: string;
  nama: string;
  no_wa: string;
  isi_komentar: string;
  tanggal_komentar: string;
  replies: Komentar[];
}

interface KomentarApiResponse {
  success: boolean;
  data: Komentar[];
}

export async function loader({
  params,
}: {
  params: { id: string };
}): Promise<NewsDetailAndAll> {
  const { id } = params;

  try {
    const response = await axios.get<NewsDetailApiResponse>(
      `${import.meta.env.VITE_API_URL}/berita/${id}`,
    );

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch news detail");
    }

    const responseAll = await axios.get(
      `${import.meta.env.VITE_API_URL}/berita?page=1`,
    );

    const dataAll = responseAll.data;
    if (!dataAll.success || !dataAll.data.berita.length) {
      return {
        ...data.data,
        berita: [],
      };
    }

    return { ...data.data, berita: dataAll.data.berita };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch news detail",
    );
  }
}

export default function NewsDetail() {
  const response = useLoaderData() as NewsDetailAndAll;
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const {
    judul,
    ringkasan,
    isi,
    gambar_sampul,
    tanggal_dibuat,
    gambar_tambahan,
    berita: news,
  } = response;
  // const cleanHtml = DOMPurify.sanitize(isi);
  console.log("Response detail:", response);

  const tanggal = tanggal_dibuat
    ? tanggal_dibuat.split(" pukul")[0]
    : "Tanggal tidak tersedia";

  // State komentar
  const [komentar, setKomentar] = useState<Komentar[]>([]);
  const [loadingKomentar, setLoadingKomentar] = useState(false);

  // State form komentar
  const [nama, setNama] = useState("");
  const [noWa, setNoWa] = useState("");
  const [isiKomentar, setIsiKomentar] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fungsi fetch komentar
  async function fetchKomentar() {
    setLoadingKomentar(true);
    try {
      const res = await axios.get<KomentarApiResponse>(
        `${import.meta.env.VITE_API_URL}/berita/${id}/komentar/visible`,
      );
      if (res.data.success) {
        setKomentar(res.data.data);
      }
    } catch (error) {
      console.error("Gagal fetch komentar:", error);
    } finally {
      setLoadingKomentar(false);
    }
  }

  useEffect(() => {
    fetchKomentar();
  }, [id]);

  function RenderKomentarList({ komentarList }: { komentarList: Komentar[] }) {
    return (
      <ul>
        {komentarList.map((item) => (
          <li
            key={item.id}
            className="mb-4 rounded-xl border border-gray-300 bg-white p-6 shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-green-700">{item.nama}</p>
              <p className="text-sm text-gray-500">
                {item.tanggal_komentar?.split(" pukul")[0] ||
                  "Tanggal tidak tersedia"}
              </p>
            </div>
            <p className="mt-2 text-gray-800">{item.isi_komentar}</p>

            {/* Render replies jika ada */}
            {item.replies && item.replies.length > 0 && (
              <div className="mt-4 ml-6 border-l-2 border-gray-300 pl-4">
                <RenderKomentarList komentarList={item.replies} />
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }

  // Fungsi submit komentar
  async function handleSubmitKomentar(e: React.FormEvent) {
    e.preventDefault();

    if (!recaptchaToken) {
      alert("Tolong centang reCAPTCHA terlebih dahulu.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/berita/${id}/komentar`,
        {
          nama,
          no_wa: noWa,
          isi_komentar: isiKomentar,
          recaptcha_token: recaptchaToken, // kirim token ke backend
        },
      );

      if (res.data.success) {
        setNama("");
        setNoWa("");
        setIsiKomentar("");
        setRecaptchaToken(null);
        fetchKomentar();
      } else {
        alert("Gagal mengirim komentar");
      }
    } catch (error) {
      alert("Gagal mengirim komentar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <NewsBanner
        banner={gambar_sampul}
        title={judul}
        description={ringkasan}
        date={tanggal}
      />
      <section className="flex flex-col min-md:p-4 lg:flex-row lg:gap-8">
        <article className="flex-6 px-8 text-justify">
          <img
            src={gambar_sampul}
            alt={judul}
            className="mx-auto my-8 aspect-video h-auto w-full rounded-sm object-cover"
          />
          <h1 className="text-2xl font-bold lg:text-3xl">{judul}</h1>
          <p className="my-4">{ringkasan}</p>

          <HtmlParse htmlString={isi} />

          <div className="grid grid-cols-1 gap-4 py-8 lg:max-w-3/4 lg:grid-cols-2 lg:grid-rows-2 lg:p-8">
            {gambar_tambahan?.map((image, index) => (
              <img
                key={index}
                src={gambar_tambahan[index]}
                alt={`Gambar ${index + 1}`}
                className="aspect-video h-auto w-full object-cover"
              />
            ))}
          </div>
        </article>

        <aside className="flex flex-2 flex-col items-center gap-4 p-8 min-md:pr-8 min-md:pl-4">
          <h2 className="text-2xl font-bold">Berita Lainnya</h2>
          <div className="flex flex-col gap-4">
            {/* Berita lainnya */}
            {news.length > 0 ? (
              news.slice(0, 5).map((berita, index) => (
                <article className="relative flex items-center gap-2">
                  <img
                    src={berita.gambar_sampul}
                    alt={berita.judul}
                    className="aspect-video h-24 rounded object-cover"
                  />
                  <div>
                    <p className="w-fit rounded-lg bg-green-600 px-3 py-1 text-xs text-white">
                      {berita.tanggal_dibuat.split(" pukul")[0]}
                    </p>
                    <a href={`/berita/${berita.id}`}>
                      <span className="absolute inset-0"></span>

                      <h3 className="line-clamp-3 text-base font-bold">
                        {berita.judul}
                      </h3>
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-gray-500">No data</p>
            )}
          </div>
        </aside>
      </section>

      {/* form komentar */}
      <section className="px-8 py-6 lg:max-w-3/4">
        <div className="ms-8">
          <TextWithRect>Silahkan tulis Komentar Anda di bawah ini</TextWithRect>
        </div>

        <form
          onSubmit={handleSubmitKomentar}
          className="m-4 flex max-w-2xl flex-col gap-6 rounded-xl border border-gray-300 p-8 shadow-lg"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="nama" className="text-md font-semibold">
              Nama <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan nama Anda"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="rounded-lg border border-gray-400 px-4 py-2 outline-gray-300 focus:outline-green-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="no_wa" className="text-md font-semibold">
              No. Whatsapp <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              placeholder="cth. 628xxxxxxxxxx"
              value={noWa}
              onChange={(e) => setNoWa(e.target.value)}
              required
              className="rounded-lg border border-gray-400 px-4 py-2 outline-gray-300 focus:outline-green-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="isi_komentar" className="text-md font-semibold">
              Komentar <span className="text-red-600">*</span>
            </label>
            <textarea
              placeholder="Tulis komentar Anda"
              value={isiKomentar}
              onChange={(e) => setIsiKomentar(e.target.value)}
              required
              rows={4}
              className="min-h-40 rounded-lg border border-gray-400 px-4 py-2 outline-gray-300 focus:outline-green-600"
            />
          </div>

          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token) => {
              console.log("reCAPTCHA token:", token);
              setRecaptchaToken(token);
            }}
            onExpired={() => {
              console.warn("reCAPTCHA expired");
              setRecaptchaToken(null);
            }}
            onErrored={() => {
              console.error("reCAPTCHA failed to load or verify");
            }}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-fit rounded bg-green-600 px-8 py-2 text-white disabled:opacity-50"
          >
            {submitting ? "Mengirim..." : "Kirim Komentar"}
          </button>
        </form>

        {/* List komentar */}
        {loadingKomentar ? (
          <p className="text-gray-500">Memuat komentar...</p>
        ) : komentar.length === 0 ? (
          <p className="text-gray-600">Belum ada komentar.</p>
        ) : (
          <RenderKomentarList komentarList={komentar} />
        )}
      </section>
    </main>
  );
}
