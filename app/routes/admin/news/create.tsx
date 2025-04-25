import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { Form } from "react-router";
import type { Route } from "./+types";
import axios from "axios";
import { getSession } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  const formData = await request.formData();
  console.log("formData", formData);
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/berita`);

  const headers = {
    "Content-Type": "multipart/form-data",
    "Authorization": `Bearer ${token}`,
  };
  const config = {
    headers: headers,
  };
  try {
    const response = await axios.post(urlRequest.href, formData, config);
    console.log("response", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating news:", error.response);
    return {
      success: false,
      statusCode: error.response?.status ?? 500,
      message: error.response?.data?.message ?? "Internal Server Error",
      data: null,
    };
  }
}

export default function CreateNews() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [content, setContent] = React.useState<string>("");
  const handleEditorChange = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      setContent(editorRef.current.getContent());
    }
  };

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Form Pengisian Berita</h1>
      <div className="mb-4 text-sm text-gray-500">
        <Form method="post" encType="multipart/form-data">
          <div className="mb-4">
            <label className="mb-1 block font-medium">Gambar Sampul</label>
            <input
              name="gambar_sampul"
              type="file"
              accept="image/*"
              required
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block font-medium">Title</label>
            <input
              name="judul"
              type="text"
              required
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block font-medium">Ringkasan Berita</label>
            <input
              name="ringkasan"
              type="text"
              required
              className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <input hidden type="textarea" name="isi" value={content} />

          <p>Isi Berita</p>
          <Editor
            onChange={handleEditorChange}
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            licenseKey=""
            onInit={(_evt, editor) => (editorRef.current = editor)}
            initialValue="<p>This is the initial content of the editor.</p>"
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
          <button onClick={log}>Log editor content</button>

          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </Form>
      </div>
    </>
  );
}
