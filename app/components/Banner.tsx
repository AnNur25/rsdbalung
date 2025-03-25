import banner from "../assets/rsdbalung.jpeg";
export default function Banner() {
  return (
    <div
      className="bg-cover bg-center py-10 text-center text-white shadow-md lg:h-96"
      style={{
        backgroundImage: `url(${banner})`,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlendMode: "darken",
      }}
    >
      <div className="flex h-full items-center justify-center">
        <h1 className="m-4 text-2xl font-extrabold lg:text-5xl">
          Selamat Datang di Rumah Sakit Daerah Balung
        </h1>
      </div>
    </div>
  );
}
