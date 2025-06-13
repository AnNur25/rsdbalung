import { handleAction } from "~/utils/handleAction";
import type { Route } from "./+types/logout";
import { createAuthenticatedClient } from "~/utils/auth-client";

export async function loader({ request }: Route.LoaderArgs) {
  const client = await createAuthenticatedClient(request);
  const urlRequest = new URL(`${import.meta.env.VITE_API_URL}/auth/logout`);
  await handleAction(() => client.post(urlRequest.href));

  const headers = new Headers({
    Location: "/",
  });
  headers.append(
    "Set-Cookie",
    "aksesToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly",
  );
  headers.append(
    "Set-Cookie",
    "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly",
  );
  return new Response(null, {
    status: 302,
    headers,
  });
}
