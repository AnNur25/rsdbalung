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
    <div className="relative m-2 aspect-[2/3] w-3xs rounded-xl shadow-lg">
      <img
        onError={imageErrorHandler}
        loading="lazy"
        src={image}
        alt="Background"
        className="h-full w-full rounded-xl object-cover"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent from-60% to-white to-80%"></div>
      <div className="absolute inset-0 flex items-end justify-center p-4 text-xl font-bold text-persian-blue-950">
        <p>{description}</p>
      </div>
    </div>
  );
}
