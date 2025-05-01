import axios from "axios";
import Table from "~/components/Table";
import type { Route } from "./+types/index";
import { formatDate } from "~/utils/formatDate";
import { Form, useFetcher } from "react-router";
import { alternatingRowColor } from "~/utils/styles";
import { handleLoader } from "~/utils/handleLoader";
import type { ComplaintModel } from "~/models/Complaint";
import { handleAction } from "~/utils/handleAction";
import { mapAdminResponseToCard } from "~/utils/mapTypes";
import MessageCard from "~/components/MessageCard";

export async function loader({ request }: Route.LoaderArgs) {
  const urlRequest = new URL(`https://rs-balung-cp.vercel.app/aduan/all`);

  return handleLoader(() => axios.get(urlRequest.href));
}

export async function action({ request }: Route.ActionArgs) {
  const method = request.method;
  const formData = await request.formData();
  console.log(formData);
  console.log(method);
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
  // return handleAction(() => axios.post(urlRequest.href, formData));
}

export default function AdminComplaints({ loaderData }: Route.ComponentProps) {
  const dummy: ComplaintModel = {
    dibuat_pada: "30 April 2025",
    id: "1",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    nama: "Pasien X",
    no_wa: "1234",
    is_visible: true,
    responAdmin: [
      {
        id: "a",
        message: "Balasan Admin A",
        dibuat_pada: "30 April 2025",
      },
      {
        id: "a",
        message: "Balasan Admin A",
        dibuat_pada: "30 April 2025",
      },
    ],
  };

  const complaints = Array.isArray(loaderData?.data?.data_aduan)
    ? (loaderData.data.data_aduan as ComplaintModel[])
    : [];

  if (complaints.length <= 0) {
    complaints.push(dummy);
    complaints.push(dummy);
  }

  console.log("complaints", complaints);

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
      <div className="p-0.5"></div>
    </>
  );
}
