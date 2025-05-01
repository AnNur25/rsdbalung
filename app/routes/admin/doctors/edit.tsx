import axios from "axios";
import type { Route } from "./+types";
import { Form } from "react-router";
import { useState } from "react";
import type { Doctor } from "~/models/Doctor";

export async function loader({ params }: Route.LoaderArgs) {
  const doctorId = params.id;
  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/dokter/${doctorId}`,
  );

  try {
    const response = await axios.get(urlRequest.href);
    const data = response.data;
    console.log(data.data.dokter.poli);
    return data;
  } catch (error: any) {
    console.error("Error fetching doctor data:", error);
    return {
      success: false,
      statusCode: error.response?.status ?? 500,
      message: error.response?.data?.message ?? "Internal Server Error",
      data: null,
    };
  }
}

export async function action({ request, params }: Route.ActionArgs) {
  console.log(params.id);
  const formData = await request.formData();
  const defaultImageUrl = formData.get("gambar") as string;
  console.log("formData", formData);
  const file = formData.get("file") as File;
  console.log(file);
  // Check if no file uploaded
  // if (!file || file.size === 0) {
  //   // Create a default image file
  //   const defaultImageResponse = await fetch(defaultImageUrl);
  //   const blob = await defaultImageResponse.blob();
  //   const defaultFile = new File([blob], "nochange.jpg", { type: blob.type });
  //   formData.delete("file");
  //   formData.append("file", defaultFile);
  // }
  console.log("formData", formData);

  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/dokter/${params.id}`,
  );
  try {
    const response = await axios.put(urlRequest.href, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response);
    // return redirect("/admin/doctors");
  } catch (error: any) {
    console.error("Failed to create doctor", error.response);
    // throw new Response("Submission failed", { status: 500 });
  }
}

export default function EditDoctor({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData;
  const dokter = data.dokter as Doctor;
  console.log(dokter);
  const [doctorName, setDoctorName] = useState(dokter.nama);
  const [doctorImage, setDoctorImage] = useState(dokter.gambar);
  const [doctorBiodata, setDoctorBiodata] = useState(dokter.biodata_singkat);
  const [doctorLinkedIn, setDoctorLinkedIn] = useState(dokter.link_linkedin);
  const [doctorInstagram, setDoctorInstagram] = useState(dokter.link_instagram);
  const [doctorFacebook, setDoctorFacebook] = useState(dokter.link_facebook);
  const [poli, setPoli] = useState(dokter.poli);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Edit Doctor</h1>
      <Form
        method="post"
        className="flex flex-col gap-4"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="nama"
          placeholder="Name"
          required
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
        />
        <input name="id_poli" value={poli.id_poli} type="text" />
        <input type="text" name="gambar" value={doctorImage} />
        <input
          type="text"
          name="biodata_singkat"
          value={doctorBiodata}
          onChange={(e) => setDoctorBiodata(e.target.value)}
        />
        <input
          onChange={(e) => setDoctorFacebook(e.target.value)}
          type="text"
          value={doctorFacebook}
          name="link_facebook"
        />
        <input
          onChange={(e) => setDoctorInstagram(e.target.value)}
          type="text"
          value={doctorInstagram}
          name="link_instagram"
        />
        <input
          onChange={(e) => setDoctorLinkedIn(e.target.value)}
          type="text"
          value={doctorLinkedIn}
          name="link_linkedin"
        />
        <input type="file" accept="image/*" name="file" />
        <button type="submit">Save</button>
      </Form>
    </div>
  );
}
