import { createAuthenticatedClient } from "~/utils/auth-client";
import type { Route } from "./+types/socmed";
import { handleAction } from "~/utils/handleAction";
import { handleLoader } from "~/utils/handleLoader";
import axios from "axios";
import { useFetcher, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

export async function loader() {
  const igRequest = new URL(`${import.meta.env.VITE_API_URL}/media-sosial`);

  return handleLoader(() => axios.get(igRequest.href));
}

export async function action({ request }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);

  const formData = await request.formData();
  const igRequest = new URL(`${import.meta.env.VITE_API_URL}/media-sosial/`);
  const igs = formData.getAll("links");
  console.log("formData", formData);

  const data = {
    links: igs
      .map((link) =>
        typeof link === "string" &&
        link.startsWith("https://www.instagram.com/")
          ? link
          : "",
      )
      .filter((link) => link !== ""),
  };

  return handleAction(() => client.put(igRequest.href, data));
}

export default function AdminSocmed({ loaderData }: Route.ComponentProps) {
  const instagrams = (loaderData?.data as { link_embed: string }[]) || [
    { link_embed: "" },
    { link_embed: "" },
    { link_embed: "" },
    { link_embed: "" },
  ];

  const instagramsLinks = Array.isArray(instagrams)
    ? instagrams.map((ig) => ig.link_embed)
    : ["", "", "", ""];
  while (instagramsLinks.length < 4) {
    instagramsLinks.push("");
  }
  console.log(loaderData);
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [instagram, setInstagram] = useState(
    instagramsLinks || ["", "", "", ""],
  );
  const fetcherData = fetcher.data || { message: "", success: false };
  console.log("fetcherData", fetcherData);
  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);
  const [disableForm, setDisableForm] = useState<boolean>(true);

  const handleChange = (index: number, value: string) => {
    const editedInstagrams = [...instagram];
    editedInstagrams[index] = value;
    setInstagram(editedInstagrams);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="w-min text-2xl font-bold uppercase min-md:w-max">
          Media Sosial
        </h2>
        <button
          onClick={() => setDisableForm(false)}
          className={`h-min rounded p-2 text-white ${disableForm ? "bg-green-600" : "bg-gray-500"}`}
          title="Ubah"
        >
          <PencilSquareIcon className="h-4 w-4" />
        </button>
      </div>
      {/* <h1 className="mb-6 text-4xl font-bold uppercase">Media Sosial</h1> */}
      <div className="mb-4 rounded-xl border border-gray-300 p-4 text-sm shadow-lg">
        <fetcher.Form method="put" className="flex flex-col gap-2">
          {instagram.map((ig, index) => (
            <div className="mb-4">
              <label
                className={`text-lg font-bold ${disableForm && "text-gray-500"}`}
              >
                Link Instagram
              </label>

              <input
                onInput={(e) => {
                  const input = e.currentTarget;
                  if (input.value === " " || input.value === "0") {
                    input.value = "";
                  }
                }}
                value={ig}
                pattern="https://www\.instagram\.com/.*"
                title="Masukkan link Instagram yang valid"
                onChange={(e) => handleChange(index, e.target.value)}
                type="text"
                name="links"
                disabled={disableForm}
                className={`w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${disableForm && "text-gray-500"}`}
                placeholder="Isi link instagram di sini"
              />
            </div>
          ))}

          <div className="flex gap-2">
            <button
              onClick={() => {
                setDisableForm(true);
              }}
              type="submit"
              className={`rounded px-4 py-2 text-white ${disableForm ? "bg-gray-500" : "bg-green-600"}`}
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setDisableForm(true)}
              className={`rounded px-4 py-2 text-white ${disableForm ? "bg-gray-500" : "bg-red-600"}`}
            >
              Batal
            </button>
          </div>
        </fetcher.Form>
      </div>
    </>
  );
}
