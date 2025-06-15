import PageBanner from "~/components/PageBanner";
import type { Route } from "./+types/search";
import { handleLoader } from "~/utils/handleLoader";
import axios from "axios";
import type { News } from "~/models/News";
import type { Doctor } from "~/models/Doctor";

type SearchResult = {
  success: boolean;
  message: string;
  data: { berita: News[]; Dokter: Doctor[] };
};

export async function loader({
  request,
}: Route.LoaderArgs): Promise<SearchResult> {
  console.log(request);
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query) {
    return {
      success: true,
      message: "No query",
      data: { berita: [], Dokter: [] },
    };
  }

  const doctors = await handleLoader(() =>
    axios.get(`${import.meta.env.VITE_API_URL}/dokter/search`, {
      params: { keyword: query },
    }),
  );
  console.log("doctors", doctors);
  const news = await handleLoader(() =>
    axios.get(`${import.meta.env.VITE_API_URL}/berita/search`, {
      params: { keyword: query },
    }),
  );
  console.log("news", news);
  return {
    success: news.success && doctors.success,
    message:
      news.success && doctors.success
        ? "Selesai mendapatkan data."
        : "Data tidak ditemukan.",
    data: {
      berita: news.data.berita || [],
      Dokter: doctors.data.Dokter || [],
    },
  };
}

interface DeveloperPageProps {
  loaderData: SearchResult;
}

export default function DeveloperPage({ loaderData }: DeveloperPageProps) {
  console.log("loaderData search", loaderData);
  const berita = Array.isArray(loaderData?.data?.berita)
    ? (loaderData.data.berita as News[])
    : [];
  const dokter = Array.isArray(loaderData?.data?.Dokter)
    ? (loaderData.data.Dokter as Doctor[])
    : [];
  return (
    <>
      <PageBanner title="Cari" />
      <section className="mt-8 flex w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-4xl flex-col items-center justify-center">
          {berita.length > 0 && (
            <div className="mb-6 w-full rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 border-b pb-2 text-2xl font-bold text-gray-800">
                Berita
              </h2>
              <ul className="space-y-3">
                {berita.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`/berita/${item.id}`}
                      className="font-medium text-blue-700 transition-colors hover:text-blue-900 hover:underline"
                    >
                      {item.judul}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {dokter.length > 0 && (
            <div className="mt-8 w-full rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 border-b pb-2 text-2xl font-bold text-gray-800">
                Dokter
              </h2>
              <ul className="space-y-3">
                {dokter.map((item) => (
                  <li key={item.id_dokter}>
                    <a
                      href={`/dokter/${item.id_dokter}`}
                      className="font-medium text-blue-700 transition-colors hover:text-blue-900 hover:underline"
                    >
                      {item.nama}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {berita.length === 0 && dokter.length === 0 && (
            <div className="w-full rounded-lg p-6 text-center text-gray-700">
              <p className="text-lg">Tidak ada hasil yang ditemukan.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
