import axios from "axios";
import { getAuthCookies } from "./auth-cookie";

const API_URL = import.meta.env.VITE_API_URL;

export async function createAuthenticatedClient(request: Request) {
  const client = axios.create({
    baseURL: API_URL,
    headers: { Cookie: request.headers.get("cookie") ?? "" },
    withCredentials: true,
  });

  return client;
}
