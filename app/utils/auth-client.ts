import axios from "axios";
import { getAuthCookies } from "./auth-cookie";

const API_URL = import.meta.env.VITE_API_URL;

export async function createAuthenticatedClient(request: Request) {
  const { aksesToken, refreshToken } = await getAuthCookies(request);

  const client = axios.create({
    baseURL: API_URL,
    headers: {
      'Set-Cookie': `aksesToken=${aksesToken ?? ""}; refreshToken=${refreshToken ?? ""}`,
    },
    withCredentials: true,
  });

  return client;
}
