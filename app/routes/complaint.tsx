import { Form } from "react-router";
import type { Route } from "./+types/complaint";
import axios from "axios";

export async function loader({ request }: Route.LoaderArgs) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/aduan/`);
  try {
    const response = await axios.get(urlRequest.href);
    return response.data.data;
  } catch (error: any) {}
}
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/aduan/`);
  try {
    const response = await axios.post(urlRequest.href, formData, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
    });
    console.log(response.data.data);
  } catch (error: any) {
    // console.error(error.response.data);
  }
}

export default function Complaint({ loaderData }: Route.ComponentProps) {
  const aduanList = loaderData as [];
  return (
    <>
      <Form method="post">
        <input className="border" type="text" name="judul" />
        <input className="border" type="text" name="deskripsi" />
        <input className="border" type="text" name="no_wa" />
        <button>Simpan</button>
      </Form>

      {aduanList.map((aduan) => (
        <p>{aduan.judul}</p>
      ))}
    </>
  );
}
