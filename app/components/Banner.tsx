import imageErrorHandler from "~/utils/imageErrorHandler";
import Slider from "./Slider";

interface BannerProps {
  bannersSrc: string[] | [];
}

export default function Banner({ bannersSrc }: BannerProps) {
  const bannerUrl: string =
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d";
  // 2172/857
  return (
    <div className="aspect-[2172/857] bg-white shadow">
      {bannersSrc.length > 0 ? (
        <Slider navInside filledButton>
          {bannersSrc.map((url) => (
            <div className="aspect-[2172/857] w-screen">
              <img src={url} className="h-full w-full object-cover" />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="aspect-[2172/857] w-screen">
          <img src={bannerUrl} className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}
