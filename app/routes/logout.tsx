import type { Route } from "./+types/logout";

export async function loader({ request }: Route.LoaderArgs) {
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
