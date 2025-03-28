import banner from "../assets/rsdbalung.jpeg";
export default function Banner() {
  const bannerUrl: string =
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9zcGl0YWx8ZW58MHwwfDB8fHww";
  return (
    <div className="relative h-40 w-full lg:h-96">
      <img src={bannerUrl} className="h-full w-full bg-center object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-white to-100%"></div>
      <div className="absolute bottom-0 flex flex-col justify-start p-5 lg:p-10">
        <p className="text-base/tight font-semibold text-sky text-white lg:text-2xl/loose">Selamat Datang di</p>
        <h1 className="text-2xl font-black text-persian-blue-950 uppercase lg:text-5xl">
          RSD Balung
        </h1>
      </div>
    </div>
  );
}
