interface CardProps {
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function Card({ title, description, image, date }: CardProps) {
  return (
    <div className="m-2 w-72 overflow-hidden rounded-lg bg-white shadow-md">
      <img className="h-48 w-full object-cover" src={image} alt={title} />
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{date}</p>
        <p className="mt-2 text-gray-700">{description}</p>
      </div>
    </div>
  );
}
