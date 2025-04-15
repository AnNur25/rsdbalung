import { formatDate } from "~/utils/formatDate";
import imageErrorHandler from "~/utils/imageErrorHandler";

interface NewsCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function NewsCard({
  id,
  title,
  description,
  image,
  date,
}: NewsCardProps) {
  return (
    <div className="relative m-2 w-72 overflow-hidden rounded-sm bg-white shadow-md lg:w-[30vw]">
      <p className="absolute top-0 right-0 rounded-bl-3xl bg-green-600 px-4 py-2 text-sm text-white">
        {formatDate(date)}
      </p>
      <img
        onError={imageErrorHandler}
        loading="lazy"
        className="h-48 w-full object-cover"
        src={image}
        alt={title}
      />
      <div className="p-4">
        <a
          href={`/berita/${id}`}
          className="hover:cursor-pointer hover:underline"
        >
          <span className="absolute inset-0"></span>

          <h2 className="text-md line-clamp-2 font-bold text-gray-900 lg:text-xl">
            {title}
          </h2>
        </a>
        {/* <p className="mt-1 text-sm text-gray-500">{date}</p> */}
        <p className="mt-2 line-clamp-3 text-justify text-sm text-gray-500">
          {description}
        </p>
      </div>
      {/* <button className="block w-full bg-green-600 py-3 text-center text-white hover:cursor-pointer hover:bg-green-700">
        Selengkapnya
      </button> */}
    </div>
  );
}
