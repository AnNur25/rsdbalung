import type { Route } from "./+types/home";
// import { getSession } from "~/sessions.server";
import {
  data,
  Form,
  isRouteErrorResponse,
  redirect,
  useFetcher,
  useRouteError,
  useSubmit,
} from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";
import type { error } from "console";
import { useToastFromAction, useToastFromLoader } from "~/hooks/useToast";

export async function loader({ request }: Route.LoaderArgs) {
  return { success: "Home" };
}

//   const session = await getSession(request.headers.get("Cookie"));
//   const token = session.get("token");

//   // if (!session.has("token")) {
//   //   return redirect("/admin/login");
//   // }
//   const urlRequest = new URL(`https://rs-balung-cp.vercel.app/profil`);
//   try {
//     const response = await axios.get(urlRequest.href, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     const data = response.data;
//     // if (!data.success) {
//     //   return redirect("/admin/login");
//     // }
//     return data;
//   } catch (error: any) {
//     console.error("Error fetching data:", error.response);
//     // return redirect("/admin/login");
//   }
// }
export async function action({ request }: Route.ActionArgs) {
  console.log("action");
  return { success: "test" };
}

export default function AdminHome({ loaderData }: Route.ComponentProps) {
  // const { data } = loaderData || { data: { id_user: "", nama: "", email: "" } };
  // const { id_user, nama, email } = data;
  console.log("home");
  const fetcher = useFetcher();
  const title = "Hai";
  // useToastFromLoader();
  // useToastFromAction();
  const data = loaderData as { success: string; error: string };
  useEffect(() => {
    if (data.success) toast.success(data.success);
    if (data.error) toast.error(data.error);
  }, [data]);

  const showToast = (message?: string) => {
    toast.success(message || "Default");
  };
  return (
    <>
      <h1>
        {title} {data.error}
      </h1>
      <Form method="post">
        <input type="text" name="title" />
        <button>Test</button>
      </Form>
      <button onClick={() => showToast(data.error)}>Toast</button>
    </>
  );
}
