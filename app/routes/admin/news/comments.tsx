import { useFetcher } from "react-router";
import axios from "axios";

import type { Route } from "./+types/index";
import { handleLoader } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";

import MessageCard from "~/components/MessageCard";
import { useEffect, useRef, useState } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import toast from "react-hot-toast";
import ConfirmDialog from "~/components/ConfirmDialog";
import { createAuthenticatedClient } from "~/utils/auth-client";
import type { Comment } from "~/models/Comment";

export async function loader({ request, params }: Route.LoaderArgs) {
  const client = await createAuthenticatedClient(request);
  const { id } = params;
  const urlRequest = new URL(
    `${import.meta.env.VITE_API_URL}/berita/${id}/komentar/`,
  );
  const commentsResponse = await handleLoader(() =>
    client.get(urlRequest.href),
  );
  const profileRequest = new URL(`${import.meta.env.VITE_API_URL}/profil`);
  const profilResponse = await client.get(profileRequest.href);
  console.log(commentsResponse.data);
  return {
    success: commentsResponse.data.success && profilResponse.data.success,
    message: commentsResponse.data.message || profilResponse.data.message || "Berhasil",
    data: { data: commentsResponse.data, profil: profilResponse.data },
  };
}

export async function action({ request, params }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);
  const { id } = params;

  const method = request.method;
  const formData = await request.formData();
  const feature = formData.get("feat");

  const urlRequest = new URL(
    `${import.meta.env.VITE_API_URL}/aduan/${formData.get("id")}`,
  );

  if (method === "POST") {
    const comment_id = formData.get("id");
    const replyRequest = new URL(
      `${import.meta.env.VITE_API_URL}/berita/${id}/komentar/${comment_id}/reply`,
    );

    return handleAction(() => client.post(replyRequest.href, formData));
  }

  if (method === "PATCH") {
    const id = formData.get("id");
    urlRequest.pathname = `/api/v1/berita/${id}/komentar/${id}`;
    return handleAction(() => client.patch(urlRequest.href));
  }
}

export default function AdminComments({ loaderData }: Route.ComponentProps) {
  const data = loaderData?.data || { data: {} };
  console.log("loader data", data);
  const comments = Array.isArray(data?.data)
    ? (data.data as Comment[])
    : [];
  const profileData = data?.profil?.data || {
    no_wa: "",
    nama: "",
  };
  console.log(profileData);
  const fetcher = useFetcher();
  const fetcherData = fetcher.data || { message: "", success: false };
  useEffect(() => {
    if (fetcherData.message) {
      if (fetcherData.success) {
        toast.success(fetcherData.message);
        setTimeout(() => {}, 2000);
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
        no_wa: profileData.no_wa,
        nama: profileData.nama,
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

  return (
    <>
      <h1 className="mb-4 w-max text-2xl font-bold uppercase">Komentar</h1>
      <div className="w-full overflow-x-auto rounded-lg border-1 border-gray-300 p-1 shadow-xl">
        <section className="mb-4 w-full overflow-x-auto">
          {comments?.map((c) => (
            <MessageCard
              phoneNumber={c.no_wa ?? ""}
              id={c.id_komentar}
              sendOnClick={handleReply}
              message={c.isi_komentar}
              name={c.nama}
              date={c.tanggal_komentar}
              isVisible={c.isVisible}
              switchOnClick={() => handleVisible(c.id_komentar)}
              isLogin={true}
              replies={
                c.replies?.map((reply) => ({
                  id: reply.id_komentar,
                  name: reply.nama,
                  message: reply.isi_komentar,
                  date: reply.tanggal_komentar,
                })) ?? []
              }
              isAdmin={true}
            />
          ))}
        </section>
      </div>
    </>
  );
}
