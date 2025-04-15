import axios from "axios";
import { Outlet, useLoaderData } from "react-router";
import Footer from "~/components/Footer";
import Header from "~/components/Header";


interface PelayananResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Pelayanan[];
}

interface Pelayanan {
  id_pelayanan: string;
  nama_pelayanan: string;
}

export async function loader(): Promise<PelayananResponse> {
  const pelayananRequest = new URL(
    `https://rs-balung-cp.vercel.app/pelayanan/`,
  );
  try {
    console.log("response");
    const response = await axios.get<PelayananResponse>(pelayananRequest.href);
    console.log("response", response);

    if (!response.data.success || !response.data.data.length) {
      // response.data.data = [];
      return {
        success: false,
        statusCode: response.status,
        message: "No data found",
        data: [],
      };
    }

    return response.data;
  } catch (error: any) {
    console.error("Error fetching data:", error.response);
    return {
      success: false,
      statusCode: error.response?.status ?? 500,
      message: "Failed to fetch data",
      data: [],
    };
  }
}

export default function Layout() {
  const data = useLoaderData() as PelayananResponse;
  const pelayanan = data.data ?? [];
  console.log("pelayanan", pelayanan);
  return (
    <>
      <Header pelayanan={pelayanan}/>
      <div className="pb-30"></div>
      <Outlet />
      <Footer />
    </>
  );
}
