import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message || error.message || "Unknown Axios error"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error occurred";
}
