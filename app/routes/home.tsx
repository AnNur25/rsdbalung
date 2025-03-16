import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rumah Sakit Daerah Balung" },
    { name: "description", content: "Selamat Datang Di Website Rumah Sakit Daerah Balung!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
