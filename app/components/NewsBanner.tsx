interface NewsBannerProps {
  banner: string;
  date: string;
  title: string;
  description: string;
}
export default function NewsBanner({
  banner,
  date,
  title,
  description,
}: NewsBannerProps) {
  return (
    <div
      className="bg-cover bg-center py-10 text-white shadow-md lg:h-96"
      style={{
        backgroundImage: `url(${banner})`,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlendMode: "darken",
      }}
    >
      <div className="flex h-full flex-col items-start justify-center gap-4 p-8 ps-20">
        <p className="rounded-md bg-dark-blue-900 p-2 text-sm font-semibold">
          Tanggal: {date}
        </p>
        <h1 className="text-2xl font-bold lg:text-5xl">{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
