import React, { useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { Form, useFetcher, useNavigate } from "react-router";
import type { Route } from "./+types";
import axios from "axios";
import { handleAction } from "~/utils/handleAction";
import toast from "react-hot-toast";
import redirectDelay from "~/utils/redirectDelay";
import { createAuthenticatedClient } from "~/utils/auth-client";

export async function action({ request }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/berita`);
  const formData = await request.formData();

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  const config = {
    headers: headers,
  };

  return handleAction(() => client.post(urlRequest.href, formData, config));
}

export default function CreateNews() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [content, setContent] = React.useState<string>("");
  const handleEditorChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.getContent());
    }
  };

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

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold uppercase">
        Form Pengisian Berita
      </h1>
      <div className="mb-4 rounded-xl border border-gray-300 p-4 text-sm shadow-lg">
        <fetcher.Form method="post" encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="gambar_sampul" className="text-lg font-bold">
              Gambar Sampul <span className="text-red-600">*</span>
            </label>
            <input
              name="gambar_sampul"
              id="gambar_sampul"
              type="file"
              accept="image/*"
              required
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
              // className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            />
          </div>
          <div className="mb-4">
            <label htmlFor="judul" className="text-lg font-bold">
              Judul Berita <span className="text-red-600">*</span>
            </label>
            <input
              name="judul"
              id="judul"
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              type="text"
              required
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
              // className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="ringkasan" className="text-lg font-bold">
              Ringkasan Berita <span className="text-red-600">*</span>
            </label>
            <input
              name="ringkasan"
              id="ringkasan"
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              type="text"
              required
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
            />
          </div>

          <input hidden readOnly type="textarea" name="isi" value={content} />

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
              onChange={handleEditorChange}
              tinymceScriptSrc="/tinymce/tinymce.min.js"
              licenseKey="gpl"
              onInit={(_evt, editor) => (editorRef.current = editor)}
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
