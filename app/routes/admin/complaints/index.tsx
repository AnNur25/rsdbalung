import { useFetcher } from "react-router";
import axios from "axios";

import type { Route } from "./+types/index";
import { handleLoader } from "~/utils/handleLoader";
import { handleAction } from "~/utils/handleAction";

import { mapAdminResponseToCard } from "~/utils/mapTypes";
import type { ComplaintModel } from "~/models/Complaint";

import MessageCard from "~/components/MessageCard";

export async function loader({ request }: Route.LoaderArgs) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/aduan/all`);
  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request }: Route.ActionArgs) {
  const method = request.method;
  const formData = await request.formData();

  const urlRequest = new URL(
    `https://rs-balung-cp.vercel.app/aduan/${formData.get("id")}`,
  );

  if (method === "POST") {
    const id = formData.get("id");
    urlRequest.pathname = `/aduan/reply/${id}`;
    return handleAction(() => axios.post(urlRequest.href, formData));
  }

  if (method === "DELETE") {
    const id = formData.get("id");
    urlRequest.pathname = `/aduan/${id}`;
    return handleAction(() => axios.delete(urlRequest.href));
  }

  if (method === "PATCH") {
    const id = formData.get("id");
    urlRequest.pathname = `/aduan/visible/${id}`;
    return handleAction(() => axios.patch(urlRequest.href));
  }
}

export default function AdminComplaints({ loaderData }: Route.ComponentProps) {
  const complaints = Array.isArray(loaderData?.data?.data_aduan)
    ? (loaderData.data.data_aduan as ComplaintModel[])
    : [];

  const fetcher = useFetcher();

  const handleDeleteComplaint = (id: string) => {
    fetcher.submit(
      { id },
      {
        method: "delete",
      },
    );
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
      <section className="mb-4 w-full overflow-x-auto">
        {complaints?.map((complaint) => (
          <MessageCard
            id={complaint.id}
            isAdmin={true}
            sendOnClick={handleReplyComplaint}
            isVisible={complaint.is_visible}
            switchOnClick={() => handleVisibleComplaint(complaint.id)}
            deleteOnClick={() => handleDeleteComplaint(complaint.id)}
            date={complaint.dibuat_pada}
            message={complaint.message}
            name={complaint.nama}
            replies={complaint.responAdmin?.map((res) =>
              mapAdminResponseToCard(res),
            )}
          />
        ))}
      </section>
    </>
  );
}
