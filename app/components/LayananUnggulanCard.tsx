interface LayananUnggulanCardProps {
  image: string;
  description: string;
}
import imageErrorHandler from "~/utils/imageErrorHandler";
export default function LayananUnggulanCard({
  image,
  description,
}: LayananUnggulanCardProps) {
  return (
    <div className="relative aspect-[2/3] w-xs shadow-lg">
      <img
        onError={imageErrorHandler}
        loading="lazy"
        src={image}
        alt="Background"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-10% to-[#366B9F] to-100%"></div>
      <div className="absolute inset-0 flex items-end justify-center p-4 text-xl font-bold text-white text-center">
        <p>{description}</p>
      </div>
    </div>
  );
}
