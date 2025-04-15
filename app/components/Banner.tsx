import imageErrorHandler from "~/utils/imageErrorHandler";

export default function Banner() {
  const bannerUrl: string =
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d";
  return (
    <div className="relative h-48 w-full lg:h-96">
      <img
        onError={imageErrorHandler}
        loading="lazy"
        src={bannerUrl}
        className="h-full w-full bg-center object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-white to-90%"></div>
      <div className="absolute bottom-0 flex flex-col justify-start p-5 lg:p-10">
        <p className="text-sky text-base/tight font-semibold text-white lg:text-2xl/loose">
          Selamat Datang di
        </p>
        <h1 className="text-2xl font-black text-persian-blue-950 uppercase lg:text-5xl">
          RSD Balung
        </h1>

        {/* <div className="mt-2 flex gap-2 lg:mt-6">
          <div className="relative flex w-max flex-1 flex-col items-center rounded bg-sky-700 p-2 text-center text-white shadow-md">
            <p>asdf</p>
            <a href="#">
              <span className="absolute inset-0"></span>
              Daftar Dokter
            </a>
          </div>
          <div className="relative flex w-max flex-1 flex-col items-center rounded bg-sky-700 p-2 text-center text-white">
            <p>asdf</p>
            <a href="#" className="text-xs">
              <span className="absolute inset-0"></span>
              Jadwal Dokter
            </a>
          </div>
          <div className="relative flex w-max flex-1 flex-col items-center rounded bg-sky-700 p-2 text-center text-white">
            <p>asdf</p>
            <a href="#">
              <span className="absolute inset-0"></span>
              Aduan
            </a>
          </div>
        </div> */}
        <div className="pb-10 lg:pb-16"></div>
      </div>
    </div>
  );
}
