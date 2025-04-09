interface DoctorInterface {
  name: string;
  specialty: string;
  image: string;
}

export default function DoctorCard({
  name,
  specialty,
  image,
}: DoctorInterface) {
  return (
    <div className="m-4 mx-auto w-xs rounded-2xl">
      <img loading="lazy" className="aspect-[35/37] rounded-t-md object-cover" src={image} />
      <p className="bg-green-500 py-1 text-center uppercase">
        Spesialis {specialty}
      </p>
      <p className="rounded-b-md bg-sky-600 px-2 py-6 text-center text-lg font-bold text-white">
        {name}
      </p>
    </div>
  );
}
