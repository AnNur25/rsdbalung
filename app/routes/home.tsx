import type { Route } from "./+types/home";
import MapsEmbed from "~/components/MapsEmbed";
import axios from "axios";
import { useEffect, useState } from "react";
import Footer from "~/components/Footer";
import Dropdown from "~/components/Dropdown";
import Banner from "~/components/Banner";
import InstagramEmbed from "~/components/InstagramEmbed";
import SelectExample from "~/components/SelectExample";
import Card from "~/components/Card";
import banner from "~/assets/rsdbalung.jpeg";
import YoutubeEmbed from "~/components/YoutubeEmbed";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rumah Sakit Daerah Balung" },
    {
      name: "description",
      content: "Selamat Datang Di Website Rumah Sakit Daerah Balung!",
    },
  ];
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const cards = [
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
    "duabelas",
  ].map((title) => ({
    title,
    description: `description ${title}`,
    image: banner,
    date: new Date().toLocaleDateString(),
  }));
  useEffect(() => {
    console.log("Home");
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/app/");
        console.log(response);
        setMessage(response.data.message);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Error fetching data");
        setLoading(false);
      }
    };
  }, []);

  return (
    <>
      <Banner />

      <Dropdown name="Dropdown" />
      <SelectExample />

      <div className="overflow-x-scroll">
        <div className="flex w-max">
          {cards.map((card) => (
            <Card
              title={card.title}
              description={card.description}
              image={card.image}
              date={card.date}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-scroll p-2">
        <InstagramEmbed url="https://www.instagram.com/p/DGufjWWzR46/" />
        <InstagramEmbed url="https://www.instagram.com/p/DGufjWWzR46/" />
      </div>

      <MapsEmbed />

      <YoutubeEmbed videoId="_IBj20ojJnU" />

      <Footer />
    </>
  );
}
