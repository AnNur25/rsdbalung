import axios from "axios";
import PageBanner from "~/components/PageBanner";
import type { PelayananDetail } from "~/models/Pelayanan";
import formatDigits from "~/utils/formatDigits";
import type { Route } from "./+types/layanan-detail";
import { handleLoader } from "~/utils/handleLoader";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  const pelayananRequest = new URL(
    `${import.meta.env.VITE_API_URL}/pelayanan/${id}`,
  );
  return handleLoader(() => axios.get(pelayananRequest.href));
}

export default function LayananDetail({ loaderData }: Route.ComponentProps) {
  console.log(loaderData);
  const {
    id_pelayanan = "",
    nama_pelayanan = "",
    Persyaratan = "",
    Prosedur = "",
    JangkaWaktu = "",
    Biaya = "",
  } = (loaderData?.data as PelayananDetail) || {};
  if (loaderData?.success === false) {
    throw new Response("Not Found", { status: 404 });
  }
  return (
    <>
      <PageBanner title={nama_pelayanan} />
      <main className="mx-auto my-6 mt-4 lg:max-w-3/4">
        {/* <h1 className="text-center text-3xl font-bold uppercase">
          {nama_pelayanan}
        </h1> */}

        {/* Jangka Waktu & Biaya  */}
        <div className="m-4 mx-auto flex flex-col gap-4 px-4 min-md:flex-row">
          <section className="flex-1 rounded-md text-center shadow-md">
            <h2 className="rounded-t-md bg-dark-blue-900 p-1 text-lg font-bold text-white">
              Jangka Waktu
            </h2>
            <p className="h-min p-2 px-8 text-justify">{JangkaWaktu}</p>
          </section>
          <section className="flex-1 rounded-md text-center shadow-md">
            <h2 className="rounded-t-md bg-dark-blue-900 p-1 text-lg font-bold text-white">
              Biaya
            </h2>
            <p className="mx-auto h-min p-2 px-8 text-justify">
              {/* Rp{formatDigits(Biaya.toString())} */}
              {Biaya}
            </p>
          </section>
        </div>

        {/* Persyaratan */}
        <section className="mx-auto mt-4 max-w-9/10">
          <h2 className="text-xl font-bold text-persian-blue-950">
            Persyaratan
          </h2>
          <ol className="ms-8 list-decimal text-justify">
            {Persyaratan.split(",")
              .map((item) => item.trim())
              .map((item, index) => (
                <li key={index}>{item}</li>
              ))}
          </ol>
        </section>

        {/* Prosedur */}
        <section className="mx-auto mt-4 max-w-9/10">
          <h2 className="text-xl font-bold text-persian-blue-950">Prosedur</h2>
          <ol className="ms-8 list-decimal text-justify">
            {Prosedur.split(",")
              .map((item) => item.trim())
              .map((item, index) => (
                <li key={index}>{item}</li>
              ))}
          </ol>
        </section>
      </main>
    </>
  );
}
