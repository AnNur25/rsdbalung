import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { Form, useNavigate } from "react-router";
import type { Route } from "./+types";
import axios from "axios";
import { handleAction } from "~/utils/handleAction";

export async function action({ request }: Route.ActionArgs) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/berita`);
  const formData = await request.formData();

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  const config = {
    headers: headers,
  };

  return handleAction(() => axios.post(urlRequest.href, formData, config));
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
        <Form method="post" encType="multipart/form-data">
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
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="judul" className="text-lg font-bold">
              Judul Berita <span className="text-red-600">*</span>
            </label>
            <input
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
              name="ringkasan"
              id="ringkasan"
              type="text"
              required
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <input hidden readOnly type="textarea" name="isi" value={content} />

          <label className="text-lg font-bold">
            Isi Berita <span className="text-red-600">*</span>
          </label>
          <Editor
            onChange={handleEditorChange}
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            licenseKey=""
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
