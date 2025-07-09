import axios from "axios";
import type { Route } from "./+types/edit";
import { useFetcher, useNavigate } from "react-router";
import { handleLoader } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";
import type { PelayananDetail } from "~/models/Pelayanan";
import { useEffect, useRef, useState } from "react";
import formatDigits from "~/utils/formatDigits";
import toast from "react-hot-toast";
import { createAuthenticatedClient } from "~/utils/auth-client";

import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";

export async function loader({ params }: Route.LoaderArgs) {
  const urlRequest = new URL(
    `${import.meta.env.VITE_API_URL}/pelayanan/${params.id}`,
  );
  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request, params }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);
  const formData = await request.formData();
  const id = formData.get("id");

  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/pelayanan/${id}`);

  return handleAction(() =>
    client.put(urlRequest.href, {
      ...Object.fromEntries(formData.entries()),
      // Biaya: parseInt(formData.get("Biaya") as string, 10),
    }),
  );
}

export default function EditService({ loaderData }: Route.ComponentProps) {
  // console.log(loaderData);
  const pelayanan: PelayananDetail = loaderData.data;

  const [name, setName] = useState<string>(pelayanan.nama_pelayanan || "");
  const [duration, setDuration] = useState<string>(pelayanan.JangkaWaktu || "");
  const [cost, setCost] = useState<string>(pelayanan.Biaya || "");
  const [displayValue, setDisplayValue] = useState(
    formatDigits(cost.toString()) || "",
  );
  const [requirement, setRequirement] = useState<string>(
    pelayanan.Persyaratan || "",
  );
  const [procedure, setProcedure] = useState<string>(pelayanan.Prosedur || "");

  

  const durationRef = useRef<TinyMCEEditor | null>(null);
  const handleDurationChange = () => {
    if (durationRef.current) {
      setDuration(durationRef.current.getContent());
    }
  };

  const costRef = useRef<TinyMCEEditor | null>(null);
  const handleCostChange = () => {
    if (costRef.current) {
      setCost(costRef.current.getContent());
    }
  };

  const requirementRef = useRef<TinyMCEEditor | null>(null);
  const handleRequirementChange = () => {
    if (requirementRef.current) {
      setRequirement(requirementRef.current.getContent());
    }
  };

  const procedureRef = useRef<TinyMCEEditor | null>(null);
  const handleProcedureChange = () => {
    if (procedureRef.current) {
      setProcedure(procedureRef.current.getContent());
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
          navigate("/humasbalung/pelayanan");
        }, 2000);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold uppercase">
        Form Pengisian Layanan RS
      </h1>
      <div className="mb-4 rounded-xl border border-gray-300 p-4 text-sm shadow-lg">
        <fetcher.Form method="put">
          <input hidden type="text" name="id" value={pelayanan.id_pelayanan} />
          <div className="mb-4">
            <label htmlFor="nama_pelayanan" className="text-lg font-bold">
              Nama Pelayanan <span className="text-red-600">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Isi nama layanan di sini"
              name="nama_pelayanan"
              id="nama_pelayanan"
              onInput={(e) => {
                const input = e.currentTarget;
                if (input.value === " " || input.value === "0") {
                  input.value = "";
                }
              }}
              required
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded border border-gray-300 p-2`}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="JangkaWaktu" className="text-lg font-bold">
              Jangka Waktu <span className="text-red-600">*</span>
            </label>
            <div
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded-lg border border-gray-300`}
            >
              <Editor
                onFocusOut={handleDurationChange}
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                licenseKey="gpl"
                onInit={(_evt, editor) => (durationRef.current = editor)}
                initialValue={duration}
                init={{
                  height: 200,
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
              <input
                hidden
                type="textarea"
                readOnly
                name="JangkaWaktu"
                value={duration}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="Biaya" className="text-lg font-bold">
              Biaya <span className="text-red-600">*</span>
            </label>
            <div
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded-lg border border-gray-300`}
            >
              <Editor
                onFocusOut={handleCostChange}
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                licenseKey="gpl"
                onInit={(_evt, editor) => (costRef.current = editor)}
                initialValue={cost}
                init={{
                  height: 200,
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
              <input
                hidden
                type="textarea"
                readOnly
                name="Biaya"
                value={cost}
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="Persyaratan" className="text-lg font-bold">
              Persyaratan <span className="text-red-600">*</span>
            </label>
            <div
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded-lg border border-gray-300`}
            >
              <Editor
                
                onFocusOut={handleRequirementChange}
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                licenseKey="gpl"
                onInit={(_evt, editor) => (requirementRef.current = editor)}
                initialValue={requirement}
                init={{
                  height: 200,
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
              <input
                hidden
                type="textarea"
                readOnly
                name="Persyaratan"
                value={requirement}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="Prosedur" className="text-lg font-bold">
              Prosedur <span className="text-red-600">*</span>
            </label>
            <div
              className={`${
                fetcherData.message && !fetcherData.success
                  ? "border-red-500 focus:outline-red-500"
                  : "border-gray-300 focus:outline-blue-500"
              } w-full rounded-lg border border-gray-300`}
            >
              <Editor
                onFocusOut={handleProcedureChange}
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                licenseKey="gpl"
                onInit={(_evt, editor) => (procedureRef.current = editor)}
                initialValue={procedure}
                init={{
                  height: 200,
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
              <input
                hidden
                type="textarea"
                readOnly
                name="Prosedur"
                value={procedure}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => navigate("/humasbalung/pelayanan")}
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
