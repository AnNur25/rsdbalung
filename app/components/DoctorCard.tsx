import imageErrorHandler from "~/utils/imageErrorHandler";

interface DoctorInterface {
  id: string;
  name: string;
  specialty: string;
  image: string;
  isAdmin?: boolean;
}

export default function DoctorCard({
  id,
  name,
  specialty,
  image,
  isAdmin = false,
}: DoctorInterface) {
  return (
    <div className="relative flex h-full w-[15rem] flex-col rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <img
        className="aspect-[35/37] rounded-t-md object-cover"
        loading="lazy"
        onError={imageErrorHandler}
        src={image || "https://example.com/"}
      />
      <p className="flex-1 content-center bg-green-600 p-1 text-center text-xs text-white uppercase">
        {specialty}
      </p>
      {!isAdmin && (
        <a
          href={`/dokter/${id}`}
          target="__blank"
          className="hover:cursor-pointer"
        >
          <span className="absolute inset-0"></span>
        </a>
      )}
      <p className="flex-1 content-center rounded-b-md bg-sky-600 px-2 py-4 text-center text-base font-bold text-white">
        {name}
      </p>
    </div>
  );
}
