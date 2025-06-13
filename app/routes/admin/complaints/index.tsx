import { useFetcher } from "react-router";
import axios from "axios";

import type { Route } from "./+types/index";
import { handleLoader } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";

import { mapAdminResponseToCard } from "~/utils/mapTypes";
import type { ComplaintModel } from "~/models/Complaint";

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

export async function loader({ request }: Route.LoaderArgs) {
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/aduan/all`);
  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request }: Route.ActionArgs) {
  const client = await createAuthenticatedClient(request);

  const method = request.method;
  const formData = await request.formData();

  const urlRequest = new URL(
    `${import.meta.env.VITE_API_URL}/aduan/${formData.get("id")}`,
  );

  if (method === "POST") {
    const id = formData.get("id");
    urlRequest.pathname = `/api/v1/aduan/reply/${id}`;
    return handleAction(() => client.post(urlRequest.href, formData));
  }

  if (method === "DELETE") {
    const id = formData.get("id");
    urlRequest.pathname = `/api/v1/aduan/${id}`;
    return handleAction(() => client.delete(urlRequest.href));
  }

  if (method === "PATCH") {
    const id = formData.get("id");
    urlRequest.pathname = `/api/v1/aduan/visible/${id}`;
    return handleAction(() => client.patch(urlRequest.href));
  }
}

export default function AdminComplaints({ loaderData }: Route.ComponentProps) {
  const complaints = Array.isArray(loaderData?.data?.data_aduan)
    ? (loaderData.data.data_aduan as ComplaintModel[])
    : [];
  useEffect(() => {
    const nComplaint = localStorage.getItem("nComplaint") ?? "0";
    const nComplaintInt = parseInt(nComplaint, 10);
    localStorage.setItem("nComplaint", complaints.length.toString());
  }, []);
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteComplaintId, setDeleteComplaintId] = useState("");

  const deleteOnClick = (id: string) => {
    setDeleteComplaintId(id);
    console.log(deleteComplaintId);
    setDeleteDialogOpen(true);
  };
  const handleDelete = () => {
    fetcher.submit(
      { id: deleteComplaintId },
      {
        method: "delete",
      },
    );
    setDeleteDialogOpen(false);
  };

  const handleVisibleComplaint = (id: string) => {
    fetcher.submit(
      { id },
      {
        method: "patch",
      },
    );
  };

  const handleReplyComplaint = (id: string, message: string) => {
    fetcher.submit(
      { id, message },
      {
        method: "post",
      },
    );
  };

  return (
    <>
      <h1 className="mb-4 w-max text-2xl font-bold uppercase">Aduan</h1>
      <div className="w-full overflow-x-auto rounded-lg border-1 border-gray-300 p-1 shadow-xl">
        <section className="mb-4 w-full overflow-x-auto">
          {complaints?.map((complaint) => (
            <MessageCard
              phoneNumber={complaint.no_wa}
              id={complaint.id}
              isAdmin={true}
              sendOnClick={handleReplyComplaint}
              isVisible={complaint.is_visible}
              switchOnClick={() => handleVisibleComplaint(complaint.id)}
              deleteOnClick={() => deleteOnClick(complaint.id)}
              date={complaint.dibuat_pada}
              message={complaint.message}
              name={complaint.nama}
              replies={complaint.responAdmin?.map((res) =>
                mapAdminResponseToCard(res),
              )}
            />
          ))}
        </section>
      </div>
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        cancelOnClick={() => setDeleteDialogOpen(false)}
        confirmOnClick={handleDelete}
        // title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus data ini?"
        cancelLabel="Batal"
        confirmLabel="Hapus"
      />
      {/* <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-gray-600/90" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <DialogTitle className="text-lg font-bold text-gray-900">
              Konfirmasi Hapus
            </DialogTitle>
            <Description className="mt-2 text-sm text-gray-600">
              Apakah Anda yakin ingin menghapus?
            </Description>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog> */}
    </>
  );
}
