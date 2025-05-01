import { getErrorMessage } from "./handleError";

export type LoaderResult = { message: string; data: any; success: boolean };

export async function handleLoader(
  fn: () => Promise<any>,
  successMessage?: string,
): Promise<LoaderResult> {
  try {
    const response = await fn();
    // console.log("Loader Success", response);

    const isArray = Array.isArray(response);
    const data = isArray
      ? response.map((r: any) => r.data?.data || r.data)
      : response.data?.data || response.data || "No Data";

    const message = isArray
      ? successMessage || "Semua permintaan berhasil."
      : response.data?.message || successMessage || "Berhasil.";

    const result = {
      success: response.data?.success || response.success || true,
      message,
      data,
    };
    console.log(result);
    return result;
    // return {
    //   success: response.data?.success || response.success || true,
    //   message: response.data?.message || successMessage || "Berhasil.",
    //   data: response.data?.data || response.data || "No Data",
    // };
  } catch (error: any) {
    console.error(
      "Loader Error:",
      error.response?.data || error.message || "Unknown error",
    );

    const message = getErrorMessage(error);
    const data = {
      success: error.response?.data?.success || false,
      message: message,
      data: {},
    };
    console.log(data);
    return data;
  }
}
