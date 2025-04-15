import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";
import banner from "~/assets/rsdbalung.jpeg";
import Header from "~/components/Header";
import LayananUnggulanCard from "~/components/LayananUnggulanCard";
import { type News } from "./news";
import axios from "axios";

export default function Test() {
  //   const editorRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
    // new Quill("#editor", {
    //   theme: "snow",
    // });
  // }, []);
  // const response = {
  //   success: true,
  //   statusCode: 200,
  //   message: "Berhasil",
  //   data: {
  //     berita: [
  //       {
  //         id: "1",
  //         judul: "Berita 1",
  //         isi: "Isi berita 1",
  //         gambar_sampul: banner,
  //         tanggal_dibuat: "2023-10-01",
  //       },
  //       {
  //         id: "2",
  //         judul: "Berita 2",
  //         isi: "Isi berita 2",
  //         gambar_sampul: banner,
  //         tanggal_dibuat: "2023-10-02",
  //       },
  //     ],
  //     pagination: {
  //       currentPage: 1,
  //       pageSize: 10,
  //       totalItems: 20,
  //       totalPages: 2,
  //     },
  //   },
  // };

  // const news: News[] = response.data.berita;
  // const nCols = Object.keys({
  //   id: "",
  //   judul: "Berita 1",
  //   isi: "Isi berita 1",
  //   gambar_sampul: "",
  //   tanggal_dibuat: "2023-10-01",
  // }).length;

  return (
    <>
      {/* <Header /> */}
      {/* <ChevronLeftIcon className="h-6" />
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Image</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {news.length > 0 ? (
            news.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.judul}
                </td>
                <td className="border border-gray-300 px-4 py-2">{item.isi}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.gambar_sampul}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.tanggal_dibuat}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={nCols}
                className="border border-gray-300 px-4 py-2 text-center"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table> */}
      {/* <div ref={editorRef}></div> */}
      {/* <div id="editor">
        <p>Core build with no theme, formatting, non-essential modules</p>
      </div> */}
      {/* <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script> */}
      {/* <link
        href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css"
        rel="stylesheet"
      /> */}

      {/* <div id="editor">
        <h2>Demo Content</h2>
        <p>
          Preset build with <code>snow</code> theme, and some common formats.
        </p>
      </div> */}

      {/* <ImageGradientCard /> */}

      {/* <ImageSlider /> */}
    </>
  );
}
