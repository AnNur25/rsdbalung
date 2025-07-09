import axios from "axios";
import { useFetcher } from "react-router";
import NewsBanner from "~/components/NewsBanner";
import type { News } from "~/models/News";
import "~/lists.css";
import HtmlParse from "~/components/HtmlParse";
import {
  GoogleReCaptchaCheckbox,
  GoogleReCaptchaProvider,
} from "@google-recaptcha/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Route } from "./+types/news-detail";
import { handleAction } from "~/utils/handleAction";
import { handleLoader } from "~/utils/handleLoader";
import type { Comment } from "~/models/Comment";
import { createAuthenticatedClient } from "~/utils/auth-client";
import MessageCard from "~/components/MessageCard";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;

  const response = await handleLoader(() =>
    axios.get(`${import.meta.env.VITE_API_URL}/berita/${id}`),
  );

  const responseAll = await handleLoader(() =>
    axios.get(`${import.meta.env.VITE_API_URL}/berita?page=1`),
  );

  const commentsResponse = await handleLoader(() =>
    axios.get(`${import.meta.env.VITE_API_URL}/berita/${id}/komentar/visible`),
  );

  return {
    success: commentsResponse.data.success && response.data.success,
    message:
      commentsResponse.data.message || response.data.message || "Berhasil",
    data: {
      ...(response.data as News),
      comments: commentsResponse.data as Comment[],
      news: responseAll.data.berita as News[],
    },
  };
}

export async function action({ request, params }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);
  // const { id } = params;
  // console.log(params);
  const method = request.method;

  const formData = await request.formData();
  const feature = formData.get("feat");
  // const id = formData.get("id");

  const urlRequest = new URL(
    `${import.meta.env.VITE_API_URL}/berita/${params.id}/komentar/`,
  );

  if (feature === "comment") {
    const captcha = formData.get("g-recaptcha-response");
    formData.delete("g-recaptcha-response");
    if (captcha) {
      formData.delete("g-recaptcha-response");
      formData.append("recaptcha_token", captcha);
      // console.log(formData);
      return handleAction(() => client.post(urlRequest.href, formData));
    } else {
      return {
        success: false,
        message: "Captcha diperlukan untuk mengirim aduan",
      };
    }
  }

  if (feature === "reply") {
    // console.log(feature);
    const comment_id = formData.get("id");
    const replyRequest = new URL(
      `${import.meta.env.VITE_API_URL}/berita/${params.id}/komentar/${comment_id}/reply`,
    );
    // console.log(formData);

    return handleAction(() => client.post(replyRequest.href, formData));
  }
  if (method === "PATCH") {
    const id = formData.get("id");
    urlRequest.pathname = `/api/v1/berita/${params.id}/komentar/${id}`;
    return handleAction(() => client.patch(urlRequest.href));
  }
}

export default function NewsDetail({ loaderData }: Route.ComponentProps) {
  // const dataProfil = useOutletContext();
  // const { profil } = dataProfil as any;
  // const isLogin = profil.success;
  // const profileData = profil.data;
  // const isAdmin =
  //   profileData && profileData.role
  //     ? profileData.role.toLowerCase() === "admin"
  //     : false;
  // console.log(isLogin, isAdmin, profileData);
  // const [name, setName] = useState<string>(profileData?.nama || "");
  // const [phoneNumber, setPhoneNumber] = useState<string>(
  //   profileData?.no_wa || "",
  // );

  // const data = loaderData?.data ?? {};
  const {
    id = "",
    judul = "",
    ringkasan = "",
    isi = "",
    gambar_sampul = "",
    tanggal_dibuat = "",
    gambar_tambahan = [],
    news = [],
    comments = [],
  } = loaderData?.data || {};
  // const cleanHtml = DOMPurify.sanitize(isi);

  const komentarList: Comment[] =
    Array.isArray(comments) && comments.length > 0 ? comments : [];
  // console.log(komentarList);

  const tanggal = tanggal_dibuat.split(" pukul")[0];

  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };
  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
      } else {
        toast.error(fetcherData.message);
      }
    }
  }, [fetcherData]);

  const handleReply = (id: string, message: string) => {
    fetcher.submit(
      {
        id,
        isi_komentar: message,
        // no_wa: profileData.no_wa,
        // nama: profileData.nama,
        feat: "reply",
      },
      {
        method: "post",
      },
    );
  };

  const handleVisible = (id: string) => {
    fetcher.submit(
      { id },
      {
        method: "patch",
      },
    );
  };

  async function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("feat", "comment");
    fetcher.submit(formData, { method: "post" });
  }

  return (
    <main>
      <NewsBanner
        banner={gambar_sampul}
        title={judul}
        description={ringkasan}
        date={tanggal}
      />
      <section className="flex flex-col min-md:p-4 lg:flex-row lg:gap-8">
        {/* <section> */}
        <article className="flex-6 px-8 text-justify">
          <img
            src={gambar_sampul}
            alt={judul}
            className="mx-auto my-8 aspect-video h-auto w-full rounded-sm object-cover"
          />
          <h1 className="text-2xl font-bold lg:text-3xl">{judul}</h1>
          <p className="my-4 italic">{ringkasan}</p>

          <HtmlParse htmlString={isi} />

          <div className="grid grid-cols-1 gap-4 py-8 lg:max-w-3/4 lg:grid-cols-2 lg:grid-rows-2 lg:p-8">
            {gambar_tambahan?.map((image, index) => (
              <img
                key={index}
                src={gambar_tambahan[index]}
                alt={`Gambar ${index + 1}`}
                className="aspect-video h-auto w-full object-cover"
              />
            ))}
          </div>

          <h3 className="py-2 text-2xl font-bold">Form Komentar</h3>
          <fetcher.Form
            onSubmit={submitComment}
            method="post"
            className="flex flex-1 flex-col gap-4 rounded-xl border border-gray-300 p-8 shadow-lg"
          >
            <input hidden type="text" name="id" value={id} />
            <div className="flex flex-col gap-2">
              <label htmlFor="nama" className="text-md font-semibold">
                Nama <span className="text-red-600">*</span>
              </label>
              <input
                onInput={(e) => {
                  const input = e.currentTarget;
                  // Prevent leading zeros
                  if (input.value === " " || input.value === "0") {
                    // Disallow "0" as the only input
                    input.value = "";
                  }
                }}
                type="text"
                placeholder="Masukkan nama Anda"
                className={`${
                  fetcherData.message && !fetcherData.success
                    ? "border-red-500 focus:outline-red-500"
                    : "outline-gray-300 focus:outline-green-600"
                } rounded-lg border border-gray-400 px-4 py-2`}
                name="nama"
                // value={name}
                // onChange={(e) => setName(e.target.value)}
                id="nama"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="no_wa" className="text-md font-semibold">
                No. Whatsapp <span className="text-red-600">*</span>
              </label>
              <input
                pattern="[1-9]\d*|0" // for HTML5 validation
                onInput={(e) => {
                  const input = e.currentTarget;
                  // Prevent leading zeros
                  if (input.value === "0") {
                    // Disallow "0" as the only input
                    input.value = "";
                  }

                  // Replace leading zeros with 62
                  input.value = input.value.replace(/^0+(?!$)/, "62");

                  // Remove non-digit characters
                  input.value = input.value.replace(/[^\d]/g, "");
                }}
                type="text"
                inputMode="numeric"
                placeholder="cth. 628xxxxxxxxxx"
                className={`${
                  fetcherData.message && !fetcherData.success
                    ? "border-red-500 focus:outline-red-500"
                    : "outline-gray-300 focus:outline-green-600"
                } rounded-lg border border-gray-400 px-4 py-2`}
                name="no_wa"
                // value={phoneNumber}
                // onChange={(e) => setPhoneNumber(e.target.value)}
                id="no_wa"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-md font-semibold">
                Komentar <span className="text-red-600">*</span>
              </label>
              <textarea
                onInput={(e) => {
                  const input = e.currentTarget;
                  if (input.value === " " || input.value === "0") {
                    input.value = "";
                  }
                }}
                required
                placeholder="Tulis komentar Anda"
                className={`${
                  fetcherData.message && !fetcherData.success
                    ? "border-red-500 focus:outline-red-500"
                    : "outline-gray-300 focus:outline-green-600"
                } min-h-56 rounded-lg border border-gray-400 px-4 py-2`}
                name="isi_komentar"
              />
            </div>
            <div className="overflow-x-auto">
              <GoogleReCaptchaProvider
                type="v2-checkbox"
                siteKey={import.meta.env.VITE_SITE_KEY}
              >
                <GoogleReCaptchaCheckbox
                  onChange={(token) => {
                    // console.log(token);
                  }}
                />
              </GoogleReCaptchaProvider>
            </div>

            <button className="rounded bg-green-600 px-8 py-2 text-white min-md:w-min">
              Kirim
            </button>
          </fetcher.Form>

          {komentarList?.map((c, index) => (
            <MessageCard
              id={c.id_komentar}
              sendOnClick={handleReply}
              message={c.isi_komentar}
              name={c.nama}
              date={c.tanggal_komentar}
              isVisible={c.isVisible}
              switchOnClick={() => handleVisible(c.id_komentar)}
              // isLogin={isLogin}
              phoneNumber={c.no_wa ?? ""}
              replies={
                c.replies?.map((reply) => ({
                  id: reply.id_komentar,
                  name: reply.nama,
                  message: reply.isi_komentar,
                  date: reply.tanggal_komentar,
                })) ?? []
              }
              // isAdmin={isAdmin}
            />
          ))}
        </article>
        {/* </section> */}

        <aside className="flex flex-2 flex-col items-center gap-4 p-8 min-md:pr-8 min-md:pl-4">
          <h2 className="text-2xl font-bold">Berita Lainnya</h2>
          <div className="flex flex-col gap-4">
            {/* Berita lainnya */}
            {news.length > 0 ? (
              news.slice(0, 5).map((berita, index) => (
                <article className="relative flex items-center gap-2">
                  <img
                    src={berita.gambar_sampul}
                    alt={berita.judul}
                    className="aspect-video h-24 rounded object-cover"
                  />
                  <div>
                    <p className="w-fit rounded-lg bg-green-600 px-3 py-1 text-xs text-white">
                      {berita.tanggal_dibuat.split(" pukul")[0]}
                    </p>
                    <a href={`/berita/${berita.id}`}>
                      <span className="absolute inset-0"></span>

                      <h3 className="line-clamp-3 text-base font-bold">
                        {berita.judul}
                      </h3>
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-gray-500">No data</p>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
