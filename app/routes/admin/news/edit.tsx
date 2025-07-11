import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { Form, redirect, useFetcher, useNavigate } from "react-router";
import type { Route } from "./+types";
import axios from "axios";
import { handleAction } from "~/utils/handleAction";
import { handleLoader, type LoaderResult } from "~/utils/handleLoader";
import type { News } from "~/models/News";
import toast from "react-hot-toast";
import { createAuthenticatedClient } from "~/utils/auth-client";
import { convertToDate } from "~/utils/formatDate";

export async function loader({
  request,
  params,
}: Route.LoaderArgs): Promise<LoaderResult> {
  const newsId = params.id;

  const urlRequest = new URL(
    `${import.meta.env.VITE_API_URL}/berita/${newsId}`,
  );
  return handleLoader(() => axios.get(urlRequest.href));
}
export async function action({ request, params }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);

  const formData = await request.formData();
  const newsId = formData.get("id") as string;

  const urlRequest = new URL(
    `${import.meta.env.VITE_API_URL}/berita/${newsId}`,
  );

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  const config = {
    headers: headers,
  };

  return handleAction(() => client.put(urlRequest.href, formData, config));
}

export default function EditNews({ loaderData }: Route.ComponentProps) {
  const news: News = loaderData.data;
  const [newsDate, setNewsDate] = useState<string>(
    convertToDate(news.tanggal_default) ||
      new Date().toISOString().split("T")[0],
  );
  // console.log(loaderData);
  // console.log(convertToDate(news.tanggal_default));
  const [title, setTitle] = useState<string>(news.judul || "");
  const [summary, setSummary] = useState<string>(news.ringkasan || "");
  const [content, setContent] = useState<string>(news.isi || "");
  const [imageCover, setimageCover] = useState<string>(
    news.gambar_sampul || "",
  );

  const navigate = useNavigate();
  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };
  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
        setTimeout(() => {
          navigate("/humasbalung/berita");
        }, 2000);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const handleEditorChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.getContent());
    }
  };

  const log = () => {
    if (editorRef.current) {
    }
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold uppercase">
        Form Pengisian Berita
      </h1>
      <div className="mb-4 rounded-xl border border-gray-300 p-4 text-sm shadow-lg">
        <fetcher.Form method="post" encType="multipart/form-data">
          <input hidden type="text" name="id" value={news.id} />
          <div className="mb-4">
            <label htmlFor="gambar_sampul" className="text-lg font-bold">
              Gambar Sampul <span className="text-red-600">*</span>
            </label>
            <img
              src={imageCover}
              className="my-2 aspect-video h-48 w-auto rounded-sm object-cover"
            />
            <input
              name="gambar_sampul"
              id="gambar_sampul"
              type="file"
              accept="image/*"
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tanggal_berita" className="text-lg font-bold">
              Tanggal Berita <span className="text-red-600">*</span>
            </label>
            <input
              className="w-full rounded-md border-1 border-gray-300 px-4 py-2 focus:border-green-600 focus:outline-none"
              type="date"
              lang="id-ID"
              placeholder="Pilih Tanggal"
              name="tanggal_berita"
              id="tanggal_berita"
              value={newsDate}
              onChange={(e) => setNewsDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="judul" className="text-lg font-bold">
              Judul Berita <span className="text-red-600">*</span>
            </label>
            <input
              value={title}
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              onChange={(e) => setTitle(e.target.value)}
              name="judul"
              id="judul"
              type="text"
              required
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="ringkasan" className="text-lg font-bold">
              Ringkasan Berita <span className="text-red-600">*</span>
            </label>
            <input
              value={summary}
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              onChange={(e) => setSummary(e.target.value)}
              name="ringkasan"
              id="ringkasan"
              type="text"
              required
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
            />
          </div>

          <input hidden type="textarea" readOnly name="isi" value={content} />

          <label className="text-lg font-bold">
            Isi Berita <span className="text-red-600">*</span>
          </label>
          <div
            className={`${
              fetcherData.message && !fetcherData.success
                ? "border-red-500 focus:outline-red-500"
                : "border-gray-300 focus:outline-blue-500"
            } w-full rounded-lg border border-gray-300`}
          >
            <Editor
              onFocusOut={handleEditorChange}
              tinymceScriptSrc="/tinymce/tinymce.min.js"
              licenseKey="gpl"
              onInit={(_evt, editor) => (editorRef.current = editor)}
              initialValue={content}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "charmap",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "fullscreen",
                  "insertdatetime",
                  "table",
                  "preview",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>
          {/* <button onClick={log}>Log editor content</button> */}

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => navigate("/humasbalung/berita")}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Batal
            </button>
          </div>
        </fetcher.Form>
      </div>
    </>
  );
}
