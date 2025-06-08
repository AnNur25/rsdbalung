// export async function loader({ params }: Route.LoaderArgs) {
//   return { id: params.id };
// }
// export async function action({ params }: Route.ActionArgs) {
//   return { id: params.id };
// }
// export default function News({ loaderData }: Route.ComponentProps) {
//   return <h1>News {loaderData?.id ?? "not found"}</h1>;
// }

export interface News {
  id: string;
  tanggal_berita: string;
  tanggal_default: string;
  judul: string;
  ringkasan: string;
  isi: string;
  gambar_sampul: string;
  tanggal_dibuat: string;
  gambar_tambahan: [];
}
