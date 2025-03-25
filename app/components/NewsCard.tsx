import { formatDate } from "~/utils/formatDate";

interface NewsCardProps {
  title: string;
  // description: string;
  image: string;
  date: string;
}

export default function NewsCard({ title, image, date }: NewsCardProps) {
  return (
    <div className="relative m-2 w-72 overflow-hidden rounded-sm bg-white shadow-md">
      <p className="absolute top-0 right-0 rounded-bl-3xl bg-gray-500 py-2 ps-4 pe-2 text-sm text-white">
        {formatDate(date)}
      </p>
      <img className="h-48 w-full object-cover" src={image} alt={title} />
      <div className="p-4">
        <h2 className="text-md line-clamp-2 text-center font-bold text-gray-900">
          {title}
        </h2>
        {/* <p className="mt-1 text-sm text-gray-500">{date}</p> */}
        {/* <p className="mt-2 text-gray-700">{description}</p> */}
      </div>
      <button className="block w-full bg-green-600 py-3 text-center text-white hover:cursor-pointer hover:bg-green-700">
        Selengkapnya
      </button>
    </div>
  );
}
