import NewsCard from "~/components/NewsCard";
import type { Route } from "./+types/news";
import { useLoaderData, useSearchParams } from "react-router";
import { useState } from "react";
import axios from "axios";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import type { News } from "~/models/News";

export interface NewsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    berita: News[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  };
}

// Loader function to fetch data using axios
export async function loader({
  request,
}: {
  request: Request;
}): Promise<NewsApiResponse> {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const keyword = url.searchParams.get("keyword");

  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/berita`);
  if (keyword) {
    urlRequest.pathname = "/berita/search";
    urlRequest.searchParams.set("keyword", keyword);
  }
  urlRequest.searchParams.set("page", page);

  try {
    const response = await axios.get<NewsApiResponse>(urlRequest.href);
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

    return data;
  } catch (error: any) {
    const data = {
      ...error.response.data,
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

export default function News() {
  const response = useLoaderData() as NewsApiResponse;
  const { berita: news, pagination } = response.data;
  //  // Log the data and pagination for debugging
  // Access the data and pagination from the loader
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = () => {
    if (searchKeyword.trim() === "") {
      setSearchParams({});
      setIsSearching(false);
    } else {
      setSearchParams({ keyword: searchKeyword });
      setIsSearching(true);
    }
  };

  const handlePageChange = (page: number) => {
    if (searchKeyword.trim() !== "") {
      setSearchParams({ keyword: searchKeyword, page: page.toString() });
    } else {
      setSearchParams({ page: page.toString() });
    }
    setCurrentPage(page);
  };

  return (
    <main className="mt-4 flex flex-col items-center">
      <h1 className="mt-2 text-2xl font-extrabold uppercase">Berita</h1>
      <div className="items-centers mt-4 flex gap-2">
        <div className="relative flex items-center">
          <MagnifyingGlassIcon className="absolute left-3 h-4 w-4 text-gray-400" />

          <input
            className="max-w-[60vw] rounded-md border-1 border-gray-300 py-2 ps-10 pe-2 focus:border-green-600 focus:outline-none lg:w-2xl"
            type="search"
            placeholder="Cari Berita"
            name="news"
            id="news-search"
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <button
          className="rounded-lg bg-green-600 px-6 py-2 text-white"
          type="button"
          onClick={handleSearch}
        >
          Cari
        </button>
      </div>

      <section className="flex flex-col flex-wrap justify-center gap-5 p-4 min-md:flex-row">
        {news.length > 0 ? (
          news.map((berita, index) => (
            <NewsCard
              key={index}
              id={berita.id}
              title={berita.judul}
              description={berita.ringkasan}
              image={berita.gambar_sampul}
              date={berita.tanggal_dibuat}
            />
          ))
        ) : (
          <p className="text-gray-500">{response.message}</p>
        )}
      </section>

      {/* Pagination Controls */}
      {/* {!isSearching && !searchParams.get("keyword") && ( */}
      <div className="mt-4 flex w-fit max-w-full justify-center gap-2">
        <button
          className="flex-none px-4 py-2 text-black disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-6" />
        </button>
        <div className="flex w-fit flex-auto gap-2 overflow-auto p-2">
          {[...Array(pagination.totalPages).keys()].map((index) => (
            <button
              key={index}
              className={`aspect-square h-12 rounded-full text-center text-white ${
                index + 1 === currentPage
                  ? "bg-persian-blue-950 shadow-md"
                  : "bg-gray-400"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          className="flex-none px-4 py-2 text-black disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pagination.totalPages}
        >
          <ChevronRightIcon className="h-6" />
        </button>
      </div>
      {/* )} */}
    </main>
  );
}
