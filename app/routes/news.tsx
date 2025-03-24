import type { Route } from "./+types/news";

export async function loader({ params }: Route.LoaderArgs) {
  return { id: params.id };
}

// export async function action({ params }: Route.ActionArgs) {
//   return { id: params.id };
// }

export default function News({ loaderData }: Route.ComponentProps) {
  return <h1>News {loaderData?.id ?? "not found"}</h1>;
}
