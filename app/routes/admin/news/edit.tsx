import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { Form, redirect, useNavigate } from "react-router";
import type { Route } from "./+types";
import axios from "axios";
import { handleAction } from "~/utils/handleAction";
import { handleLoader, type LoaderResult } from "~/utils/handleLoader";
import type { News } from "~/models/News";

export async function loader({
  request,
  params,
}: Route.LoaderArgs): Promise<LoaderResult> {
  const newsId = params.id;

  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/berita/${newsId}`,
  );
  return handleLoader(() => axios.get(urlRequest.href));
}
export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const newsId = params.id;

  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/berita/${newsId}`,
  );

  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const config = {
    headers: headers,
  };

  return handleAction(() => axios.put(urlRequest.href, formData, config));
}

export default function EditNews({ loaderData }: Route.ComponentProps) {
  const news: News = loaderData.data;

  const [title, setTitle] = useState<string>(news.judul || "");
  const [summary, setSummary] = useState<string>(news.ringkasan || "");
  const [content, setContent] = useState<string>(news.isi || "");
  const [imageCover, setimageCover] = useState<string>(
    news.gambar_sampul || "",
  );

  const navigate = useNavigate();

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
      <h1 className="mb-6 text-2xl font-bold uppercase">Form Pengisian Berita</h1>
      <div className="mb-4 rounded-xl border border-gray-300 p-4 text-sm shadow-lg">
        <Form method="post" encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="gambar_sampul" className="text-lg font-bold">
              Gambar Sampul <span className="text-red-600">*</span>
            </label>
            <img
              src={imageCover}
              className="my-2 aspect-video h-48 object-cover rounded-sm w-auto"
            />
            <input
              name="gambar_sampul"
              id="gambar_sampul"
              type="file"
              accept="image/*"
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="judul" className="text-lg font-bold">
              Judul Berita <span className="text-red-600">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="judul"
              id="judul"
              type="text"
              required
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="ringkasan" className="text-lg font-bold">
              Ringkasan Berita <span className="text-red-600">*</span>
            </label>
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              name="ringkasan"
              id="ringkasan"
              type="text"
              required
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <input hidden type="textarea" readOnly name="isi" value={content} />

          <label className="text-lg font-bold">
            Isi Berita <span className="text-red-600">*</span>
          </label>
          <Editor
            onChange={handleEditorChange}
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            licenseKey=""
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
              onClick={() => navigate("/admin/berita")}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Batal
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
