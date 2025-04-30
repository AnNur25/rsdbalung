import axios from "axios";
import { getErrorMessage } from "./handleError";

type ActionResult = { success: string } | { error: string };

export async function handleAction(
  fn: () => Promise<any>,
  successMessage?: string,
): Promise<ActionResult> {
  try {
    const response = await fn();
    console.log("Handle Action Success", response.data);

    return { success: response.data?.message || successMessage || "Berhasil." };
  } catch (error: any) {
    console.error("Action Error:", error.response?.data || error.message);

    const message = getErrorMessage(error);

    return { error: message };
  }
}
