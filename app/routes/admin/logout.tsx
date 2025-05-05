import { Form, Link, redirect } from "react-router";
import { getSession, destroySession } from "~/sessions.server";
import type { Route } from "./+types/logout";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/admin/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}