export default function ImageGradientCard() {
  return (
    <div className="relative m-2 aspect-[2/3] w-3xs rounded-xl shadow-lg">
      <img
        src="https://images.unsplash.com/photo-1417325384643-aac51acc9e5d"
        alt="Background"
        className="h-full w-full rounded-xl object-cover"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent from-60% to-white to-80%"></div>
      <div className="absolute inset-0 flex items-end justify-center p-4 text-xl font-bold text-persian-blue-950">
        Rumah Sakit Daerah Balung
      </div>
    </div>
  );
}
