interface PageBannerProps {
  banner: string;
  title: string;
}
export default function PageBanner({
  banner,
  title,
}: PageBannerProps) {
  return (
    <div
      className="bg-cover bg-center py-10 text-white shadow-md lg:h-96"
      style={{
        backgroundImage: `url(${banner})`,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlendMode: "darken",
      }}
    >
      <div className="flex h-full flex-col items-start justify-center gap-4 p-8">
        <h1 className="text-2xl font-bold lg:text-5xl">{title}</h1>
      </div>
    </div>
  );
}
