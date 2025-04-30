import { Form, useLoaderData, useNavigation, redirect } from "react-router";
import { useState } from "react";
import axios from "axios";

import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import type { Poli, PoliApiResponse } from "~/routes/schedule";
import type { Route } from "./+types";

export async function loader() {
  const poliRequest = new URL(`https://rs-balung-cp.vercel.app/poli/`);

  try {
    const poliResponse = await axios.get<PoliApiResponse>(poliRequest.href);
    if (!poliResponse.data.success) {
      poliResponse.data.data = [];
    }
    return poliResponse.data;
  } catch (error: any) {
    // console.error("Error fetching data:", error.response);
    // return [];
    return {
      success: false,
      statusCode: error.response?.status ?? 500,
      message: "Failed to fetch data",
      data: [],
    };
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const defaultImageUrl = `http://localhost:5173/logosquare.jpg`;
  console.log("formData", formData);
  const file = formData.get("file") as File;

  // Check if no file uploaded
  if (!file || file.size === 0) {
    // Create a default image file
    const defaultImageResponse = await fetch(defaultImageUrl); // you must have this image in your public folder
    const blob = await defaultImageResponse.blob();
    const defaultFile = new File([blob], "logosquare.jpg", { type: blob.type });
    formData.delete("file");
    formData.append("file", defaultFile);
  }
  console.log("formData", formData);

  const urlRequest = new URL("https://rs-balung-cp.vercel.app/dokter/");
  try {
    const response = await axios.post(urlRequest.href, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response);
    // return redirect("/admin/doctors");
  } catch (error: any) {
    // console.error("Failed to create doctor", error.response.data.message);
    // throw new Response("Submission failed", { status: 500 });
  }
}

export default function CreateDoctor({ loaderData }: Route.ComponentProps) {
  const { data: poli } = loaderData as PoliApiResponse;
  const poliList = poli || [];

  const [selectedPoli, setSelectedPoli] = useState<Poli>(poliList[0]);
  const navigation = useNavigation();
  const [preview, setPreview] = useState<string | null>(null);

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
    console.log(file);
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Add New Doctor</h1>
      <Form method="post" encType="multipart/form-data" className="space-y-6">
        <div>
          <label className="mb-1 block font-medium">Name</label>
          <input
            name="nama"
            type="text"
            required
            className="w-full rounded border p-2"
          />
        </div>

        {/* Hidden input to pass selected poliId */}
        <input type="hidden" name="id_poli" value={selectedPoli.id_poli} />
        <div>
          <label className="mb-1 block font-medium">Poli</label>
          <Listbox value={selectedPoli} onChange={setSelectedPoli}>
            <div className="relative">
              <ListboxButton className="flex w-full items-center justify-between rounded border p-2">
                <span>{selectedPoli.nama_poli}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </ListboxButton>
              <ListboxOptions
                anchor="bottom"
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border bg-white shadow-lg"
              >
                {poliList.map((poli) => (
                  <ListboxOption
                    key={poli.id_poli}
                    value={poli}
                    className="cursor-pointer px-4 py-2 data-[focus]:bg-blue-100 data-[selected]:bg-blue-50"
                  >
                    {({ selected }) => (
                      <div className="flex items-center justify-between">
                        <span>{poli.nama_poli}</span>
                        {selected && (
                          <CheckIcon className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        </div>

        <div>
          <label className="mb-1 block font-medium">Profile Picture</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={handleImagePreview}
            className="block"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-24 rounded object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={navigation.state === "submitting"}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {navigation.state === "submitting"
            ? "Submitting..."
            : "Create Doctor"}
        </button>
      </Form>
    </div>
  );
}
