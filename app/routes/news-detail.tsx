import NewsCard from "~/components/NewsCard";
import banner from "~/assets/rsdbalung.jpeg";
import axios from "axios";
import { useLoaderData } from "react-router";
import NewsBanner from "~/components/NewsBanner";
import type { NewsApiResponse } from "./news";
import type { News } from "~/models/News";
import "~/lists.css";
import HtmlParse from "~/components/HtmlParse";
// export async function loader({ params }: Route.LoaderArgs) {
//   return { id: params.id };
// }

// export async function action({ params }: Route.ActionArgs) {
//   return { id: params.id };
// }

// export default function News({ loaderData }: Route.ComponentProps) {
//   return <h1>News {loaderData?.id ?? "not found"}</h1>;
// }
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

export async function loader({
  params,
}: {
  params: { id: string };
}): Promise<NewsDetailAndAll> {
  const { id } = params;

  try {
    const response = await axios.get<NewsDetailApiResponse>(
      `https://rs-balung-cp.vercel.app/berita/${id}`,
    );
    ``;
    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch news detail");
    }

    const responseAll = await axios.get<NewsApiResponse>(
      `https://rs-balung-cp.vercel.app/berita?page=1`,
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

  const tanggal = tanggal_dibuat.split(" pukul")[0];

  return (
    <main>
      <NewsBanner
        banner={gambar_sampul}
        title={judul}
        description={ringkasan}
        date={tanggal}
      />
      <section className="flex flex-col lg:flex-row lg:gap-8">
        <article className="flex-6 px-8 text-justify">
          <img
            src={gambar_sampul}
            alt={judul}
            className="mx-auto my-8 h-auto w-full object-cover"
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

        <aside className="flex flex-2 flex-col items-center gap-4 p-4">
          <h2 className="text-2xl font-bold">Berita Lainnya</h2>
          <div className="flex flex-col gap-4">
            {/* Berita lainnya */}
            {news.length > 0 ? (
              news.slice(0, 5).map((berita, index) => (
                // <NewsCard
                //   key={index}
                //   id={berita.id}
                //   title={berita.judul}
                //   description={berita.isi}
                //   image={berita.gambar_sampul}
                //   date={berita.tanggal_dibuat}
                // />
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
    </main>
  );
}
