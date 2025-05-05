import imageErrorHandler from "~/utils/imageErrorHandler";
import Slider from "./Slider";

interface BannerProps {
  bannersSrc: string[] | [];
}

export default function Banner({ bannersSrc }: BannerProps) {
  const bannerUrl: string =
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d";
  return (
    <div className="h-48 w-full lg:h-96">
      {bannersSrc.length > 0 ? (
        <Slider navInside>
          {bannersSrc.map((url) => (
            <div className="h-48 w-screen lg:h-96">
              <img src={url} className="h-full w-full object-cover" />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="h-48 w-full lg:h-96">
          <img src={bannerUrl} className="h-full w-full object-cover" />
        </div>
      )}
    </div>
    // <div className="relative h-48 w-full lg:h-96">
    //   <img
    //     onError={imageErrorHandler}
    //     loading="lazy"
    //     src={bannerUrl}
    //     className="h-full w-full bg-center object-cover"
    //   />
    //   <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-white to-90%"></div>
    //   <div className="absolute bottom-0 flex flex-col justify-start p-5 lg:p-10">
    //     <p className="text-sky text-base/tight font-semibold text-white lg:text-2xl/loose">
    //       Selamat Datang di
    //     </p>
    //     <h1 className="text-2xl font-black text-persian-blue-950 uppercase lg:text-5xl">
    //       RSD Balung
    //     </h1>
    //     <div className="pb-10 lg:pb-16"></div>
    //   </div>
    // </div>
  );
}
