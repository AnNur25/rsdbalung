import { useState } from "react";
import { useSearchParams } from "react-router";
import axios from "axios";

import { handleLoader, type LoaderResult } from "~/utils/handleLoader";
import type { Route } from "./+types/news";
import type { News } from "~/models/News";
import { paginationDefault, type Pagination } from "~/models/Pagination";

import NewsCard from "~/components/NewsCard";
import SearchBar from "~/components/SearchBar";
import PaginationControls from "~/components/PaginationControl";
import PageBanner from "~/components/PageBanner";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<LoaderResult> {
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/berita`);

  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const keyword = url.searchParams.get("keyword");

  if (keyword) {
    urlRequest.pathname = "/api/v1/berita/search";
    urlRequest.searchParams.set("keyword", keyword);
  }
  urlRequest.searchParams.set("page", page);

  return handleLoader(() => axios.get(urlRequest.href));
}

export default function News({ loaderData }: Route.ComponentProps) {
  const data = loaderData.data;
  const { berita: news = [], pagination = paginationDefault } = data as {
    berita: News[];
    pagination: Pagination;
  };

  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);

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
    <>
      <PageBanner title="Berita" />
      <main className="mt-4 flex flex-col items-center">
        {/* <h1 className="mt-2 text-2xl font-extrabold uppercase">Berita</h1> */}
        <div className="items-centers mt-4 flex gap-2">
          <SearchBar
            handleSearch={handleSearch}
            onSearchChange={setSearchKeyword}
          />
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
            <p className="text-gray-500">{loaderData.message}</p>
          )}
        </section>

        <PaginationControls
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </>
  );
}
