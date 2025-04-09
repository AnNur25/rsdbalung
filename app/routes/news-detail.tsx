import NewsCard from "~/components/NewsCard";
import type { Route } from "./+types/news";
import banner from "~/assets/rsdbalung.jpeg";

// export async function loader({ params }: Route.LoaderArgs) {
//   return { id: params.id };
// }

// export async function action({ params }: Route.ActionArgs) {
//   return { id: params.id };
// }

// export default function News({ loaderData }: Route.ComponentProps) {
//   return <h1>News {loaderData?.id ?? "not found"}</h1>;
// }

export default function NewsDetail() {
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
    title: `Judul Berita ${title} Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.`,
    description: `Description ${title} lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.`,
    image: banner,
    date: new Date().toLocaleDateString(),
  }));

  return (
    <section>
      <h1>BERITA</h1>
      <div>
        <input
          type="search"
          placeholder="Cari Berita"
          name="news"
          id="news-search"
        />
        <button type="button">Cari</button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:gap-8">
        {cards.map((card) => (
          <NewsCard
            title={card.title}
            description={card.description}
            image={card.image}
            date={card.date}
          />
        ))}
      </div>
    </section>
  );
}
